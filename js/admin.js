/**
 * Online Grocery Store - Admin Management Module
 * SDC Project Review-1
 * 
 * Handles:
 * - KPI Analytics Stat Cards calculation
 * - Product CRUD (Create, Read, Update, Delete)
 * - Fast Inventory Stock & Price Management
 * - Customer Order Status Updates
 * - User Accounts Listing
 */

let editingProductId = null;

// Initialize Admin Dashboard Panel
function initAdminDashboard() {
  requireAdmin();
  renderAdminStats();
  renderAdminProductsTable();
  renderAdminInventoryTable();
  renderAdminOrdersTable();
  renderAdminUsersTable();
}

// 1. KPI Statistics Counter
function renderAdminStats() {
  const products = getStorage(KEYS.PRODUCTS, []);
  const orders = getStorage(KEYS.ORDERS, []);
  const users = getStorage(KEYS.USERS, []);

  // Compute Total Revenue from non-cancelled orders
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // Compute Low Stock Count
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  const totalProductsEl = document.getElementById('stat-total-products');
  const totalOrdersEl = document.getElementById('stat-total-orders');
  const totalUsersEl = document.getElementById('stat-total-users');
  const totalRevenueEl = document.getElementById('stat-total-revenue');
  const lowStockEl = document.getElementById('stat-low-stock');

  if (totalProductsEl) totalProductsEl.textContent = products.length;
  if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
  if (totalUsersEl) totalUsersEl.textContent = users.length;
  if (totalRevenueEl) totalRevenueEl.textContent = formatCurrency(totalRevenue);
  if (lowStockEl) lowStockEl.textContent = lowStockCount;
}

// 2. Product Management (CRUD)
function renderAdminProductsTable() {
  const container = document.getElementById('admin-products-table-body');
  if (!container) return;

  const products = getStorage(KEYS.PRODUCTS, []);

  container.innerHTML = products.map(p => `
    <tr>
      <td>
        <img src="${p.image}" alt="${p.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80'">
      </td>
      <td><strong>${p.name}</strong></td>
      <td><span class="chip" style="font-size:0.75rem; padding: 0.2rem 0.6rem;">${p.category}</span></td>
      <td>${formatCurrency(p.price)}</td>
      <td>${p.discount > 0 ? `<span style="color: var(--secondary-color); font-weight:bold;">${p.discount}% OFF</span>` : '0%'}</td>
      <td>
        <span class="${p.stock <= 5 ? 'low-stock' : 'in-stock'}" style="font-weight:bold;">
          ${p.stock}
        </span>
      </td>
      <td>
        <span class="status-badge ${p.available ? 'status-delivered' : 'status-cancelled'}">
          ${p.available ? 'Available' : 'Unavailable'}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openEditProductModal('${p.id}')">✏️ Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">🗑️ Delete</button>
      </td>
    </tr>
  `).join('');
}

// Open Add Product Modal
function openAddProductModal() {
  editingProductId = null;
  document.getElementById('product-modal-title').textContent = 'Add New Product';
  document.getElementById('product-form').reset();
  openModal('product-modal');
}

// Open Edit Product Modal
function openEditProductModal(productId) {
  editingProductId = productId;
  const products = getStorage(KEYS.PRODUCTS, []);
  const product = products.find(p => p.id === productId);

  if (!product) return;

  document.getElementById('product-modal-title').textContent = 'Edit Product';
  document.getElementById('prod-name').value = product.name;
  document.getElementById('prod-category').value = product.category;
  document.getElementById('prod-price').value = product.price;
  document.getElementById('prod-discount').value = product.discount || 0;
  document.getElementById('prod-stock').value = product.stock;
  document.getElementById('prod-image').value = product.image;
  document.getElementById('prod-description').value = product.description || '';
  document.getElementById('prod-available').checked = product.available;

  openModal('product-modal');
}

// Save Product (Create or Update)
function handleSaveProduct(event) {
  if (event) event.preventDefault();

  const name = document.getElementById('prod-name').value.trim();
  const category = document.getElementById('prod-category').value;
  const price = parseFloat(document.getElementById('prod-price').value);
  const discount = parseFloat(document.getElementById('prod-discount').value) || 0;
  const stock = parseInt(document.getElementById('prod-stock').value);
  const image = document.getElementById('prod-image').value.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80';
  const description = document.getElementById('prod-description').value.trim();
  const available = document.getElementById('prod-available').checked;

  if (!name || isNaN(price) || isNaN(stock)) {
    showToast('Please fill all required fields correctly.', 'error');
    return;
  }

  const products = getStorage(KEYS.PRODUCTS, []);

  if (editingProductId) {
    // Update existing product
    const index = products.findIndex(p => p.id === editingProductId);
    if (index > -1) {
      products[index] = {
        ...products[index],
        name,
        category,
        price,
        discount,
        stock,
        image,
        description,
        available
      };
      showToast('Product updated successfully!', 'success');
    }
  } else {
    // Add new product
    const newProduct = {
      id: 'p_' + Date.now(),
      name,
      category,
      price,
      discount,
      stock,
      image,
      description,
      available
    };
    products.unshift(newProduct);
    showToast('New product added successfully!', 'success');
  }

  setStorage(KEYS.PRODUCTS, products);
  closeModal('product-modal');
  renderAdminStats();
  renderAdminProductsTable();
  renderAdminInventoryTable();
}

// Delete Product
function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  let products = getStorage(KEYS.PRODUCTS, []);
  products = products.filter(p => p.id !== productId);
  setStorage(KEYS.PRODUCTS, products);

  showToast('Product deleted.', 'info');
  renderAdminStats();
  renderAdminProductsTable();
  renderAdminInventoryTable();
}

// 3. Inventory Management
function renderAdminInventoryTable() {
  const container = document.getElementById('admin-inventory-table-body');
  if (!container) return;

  const products = getStorage(KEYS.PRODUCTS, []);

  container.innerHTML = products.map(p => `
    <tr class="${p.stock <= 5 ? 'low-stock-row' : ''}" style="${p.stock <= 5 ? 'background-color: #fff8e1;' : ''}">
      <td><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td>
        <input type="number" class="form-control" style="width: 90px; padding: 0.3rem;" value="${p.price}" onchange="updateInventoryItem('${p.id}', 'price', this.value)">
      </td>
      <td>
        <input type="number" class="form-control" style="width: 80px; padding: 0.3rem;" value="${p.stock}" onchange="updateInventoryItem('${p.id}', 'stock', this.value)">
      </td>
      <td>
        <select class="form-control" style="width: 120px; padding: 0.3rem;" onchange="updateInventoryItem('${p.id}', 'available', this.value === 'true')">
          <option value="true" ${p.available ? 'selected' : ''}>Available</option>
          <option value="false" ${!p.available ? 'selected' : ''}>Unavailable</option>
        </select>
      </td>
      <td>
        ${p.stock <= 5 ? `<span style="color: var(--danger-color); font-weight:bold;">⚠️ Low Stock Alert</span>` : '<span style="color: var(--accent-color);">OK</span>'}
      </td>
    </tr>
  `).join('');
}

// Update Inventory Item Attributes Directly
function updateInventoryItem(productId, field, value) {
  const products = getStorage(KEYS.PRODUCTS, []);
  const product = products.find(p => p.id === productId);

  if (!product) return;

  if (field === 'price') product.price = parseFloat(value) || product.price;
  if (field === 'stock') product.stock = parseInt(value) || 0;
  if (field === 'available') product.available = Boolean(value);

  setStorage(KEYS.PRODUCTS, products);
  showToast(`Updated ${product.name} inventory!`, 'success');
  renderAdminStats();
  renderAdminProductsTable();
  renderAdminInventoryTable();
}

// 4. Order Management
function renderAdminOrdersTable() {
  const container = document.getElementById('admin-orders-table-body');
  if (!container) return;

  const orders = getStorage(KEYS.ORDERS, []);

  if (orders.length === 0) {
    container.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem;">No orders placed yet.</td></tr>`;
    return;
  }

  const statuses = ['Order Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];

  container.innerHTML = orders.map(order => `
    <tr>
      <td><strong>${order.id}</strong></td>
      <td>${order.customerName}<br><small style="color: var(--muted-text);">${order.customerPhone}</small></td>
      <td>
        <ul style="font-size:0.85rem;">
          ${order.items.map(i => `<li>${i.name} x ${i.qty}</li>`).join('')}
        </ul>
      </td>
      <td><strong>${formatCurrency(order.total)}</strong></td>
      <td>${order.deliveryDate}<br><small style="color: var(--muted-text);">${order.deliverySlot}</small></td>
      <td>
        <span class="status-badge status-${getStatusCssClass(order.status)}">${order.status}</span>
      </td>
      <td>
        <select class="form-control" style="padding:0.3rem; font-size:0.85rem;" onchange="updateOrderStatus('${order.id}', this.value)">
          ${statuses.map(s => `<option value="${s}" ${s === order.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

// Update Order Status
function updateOrderStatus(orderId, newStatus) {
  const orders = getStorage(KEYS.ORDERS, []);
  const order = orders.find(o => o.id === orderId);

  if (!order) return;

  order.status = newStatus;
  setStorage(KEYS.ORDERS, orders);

  showToast(`Order ${orderId} status updated to "${newStatus}"`, 'success');
  renderAdminStats();
  renderAdminOrdersTable();
}

// 5. User Management
function renderAdminUsersTable() {
  const container = document.getElementById('admin-users-table-body');
  if (!container) return;

  const users = getStorage(KEYS.USERS, []);

  container.innerHTML = users.map(u => `
    <tr>
      <td><strong>${u.name}</strong></td>
      <td>${u.email}</td>
      <td>${u.phone || 'N/A'}</td>
      <td>
        <span class="chip" style="font-size:0.75rem; background: ${u.role === 'admin' ? '#fff3e0' : 'var(--light-bg)'}; color: ${u.role === 'admin' ? 'var(--secondary-color)' : 'var(--dark-text)'}">
          ${u.role.toUpperCase()}
        </span>
      </td>
      <td>${formatDate(u.registeredAt)}</td>
      <td><span class="status-badge status-delivered">Active</span></td>
    </tr>
  `).join('');
}

// Admin Tab Switching System
function showAdminTab(tabId) {
  const tabs = ['admin-dashboard-tab', 'admin-products-tab', 'admin-inventory-tab', 'admin-orders-tab', 'admin-users-tab'];
  const menuItems = document.querySelectorAll('.sidebar-menu-item');

  tabs.forEach(t => {
    const el = document.getElementById(t);
    if (el) el.style.display = (t === tabId) ? 'block' : 'none';
  });

  menuItems.forEach(item => {
    if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(tabId)) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}
