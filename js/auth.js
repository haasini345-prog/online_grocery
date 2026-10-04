/**
 * Online Grocery Store - Authentication & Security Module (RBAC)
 * SDC Project Review-1
 * 
 * Handles:
 * - User Signup & Registration validation
 * - User & Admin Login authentication
 * - Session state handling in LocalStorage
 * - Role-Based Access Control (RBAC) page guards
 */

// Get currently authenticated user from session
function getCurrentUser() {
  return getStorage(KEYS.CURRENT_USER, null);
}

// User Registration Handler
function registerUser(name, email, phone, password, confirmPassword) {
  if (!name || !email || !phone || !password) {
    showToast('Please fill in all required fields.', 'error');
    return false;
  }

  if (password !== confirmPassword) {
    showToast('Passwords do not match.', 'error');
    return false;
  }

  const users = getStorage(KEYS.USERS, []);
  
  // Check for duplicate email
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    showToast('An account with this email already exists.', 'error');
    return false;
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    password: password, // Note: In production use hashed passwords; stored as plain text for SDC demo simplicity
    role: 'user',
    registeredAt: new Date().toISOString()
  };

  users.push(newUser);
  setStorage(KEYS.USERS, users);
  
  showToast('Account registered successfully! Redirecting to login...', 'success');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 1500);
  return true;
}

// Login Handler
function loginUser(email, password) {
  if (!email || !password) {
    showToast('Please enter both email and password.', 'error');
    return false;
  }

  const users = getStorage(KEYS.USERS, []);
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);

  if (!user) {
    showToast('Invalid email or password.', 'error');
    return false;
  }

  // Set current user session
  setStorage(KEYS.CURRENT_USER, user);
  showToast(`Welcome back, ${user.name}!`, 'success');

  // Role-based redirection
  setTimeout(() => {
    if (user.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'user-dashboard.html';
    }
  }, 1000);
  return true;
}

// Logout Handler
function logoutUser() {
  localStorage.removeItem(KEYS.CURRENT_USER);
  showToast('Logged out successfully.', 'info');
  setTimeout(() => {
    window.location.href = 'login.html';
  }, 800);
}

// RBAC Page Guard: Require logged-in status
function requireAuth() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    showToast('Access denied. Please log in first.', 'warning');
    window.location.href = 'login.html';
  }
  return currentUser;
}

// RBAC Page Guard: Require Admin Role
function requireAdmin() {
  const currentUser = requireAuth();
  if (currentUser && currentUser.role !== 'admin') {
    showToast('Access denied. Admin privileges required.', 'error');
    window.location.href = 'user-dashboard.html';
  }
  return currentUser;
}

// Guard for login/signup pages: Redirect if already logged in
function redirectIfLoggedIn() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    if (currentUser.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'user-dashboard.html';
    }
  }
}
