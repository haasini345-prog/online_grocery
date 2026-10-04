/**
 * Online Grocery Store - Core Application Engine & Data Initialization
 * SDC Project Review-1
 * 
 * Provides:
 * - LocalStorage state management & auto-seeding
 * - Common utility functions (formatting, toast notifications, modals)
 * - Sample products, users, coupons, and orders dataset
 */

// LocalStorage Keys
const KEYS = {
  USERS: 'grocery_registeredUsers',
  CURRENT_USER: 'grocery_currentUser',
  PRODUCTS: 'grocery_products',
  CART: 'grocery_cart',
  ORDERS: 'grocery_orders',
  COUPONS: 'grocery_coupons',
  INTERACTIONS: 'grocery_userInteractions'
};

// Default Sample Datasets
const SAMPLE_USERS = [
  {
    id: 'usr_admin',
    name: 'Store Admin',
    email: 'admin@grocery.com',
    phone: '9876543210',
    password: 'admin123', // Demo admin
    role: 'admin',
    registeredAt: '2026-01-01T10:00:00.000Z'
  },
  {
    id: 'usr_customer1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9123456789',
    password: 'user123',
    role: 'user',
    registeredAt: '2026-02-15T14:30:00.000Z'
  }
];

const SAMPLE_PRODUCTS = [
  {
    id: 'p1',
    name: 'Fresh Red Apples',
    category: 'Fruits',
    price: 120,
    discount: 10,
    stock: 45,
    available: true,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80',
    description: 'Crisp and sweet organic red apples sourced directly from Himachal orchards.'
  },
  {
    id: 'p2',
    name: 'Organic Bananas',
    category: 'Fruits',
    price: 50,
    discount: 5,
    stock: 60,
    available: true,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=500&q=80',
    description: 'Rich in potassium, fresh robusta bananas ripened naturally.'
  },
  {
    id: 'p3',
    name: 'Farm Fresh Tomatoes',
    category: 'Vegetables',
    price: 40,
    discount: 0,
    stock: 35,
    available: true,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80',
    description: 'Juicy, ripe tomatoes perfect for curries and salads.'
  },
  {
    id: 'p4',
    name: 'Fresh Potatoes',
    category: 'Vegetables',
    price: 30,
    discount: 0,
    stock: 100,
    available: true,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=500&q=80',
    description: 'High-grade cooking potatoes ideal for boiling and frying.'
  },
  {
    id: 'p5',
    name: 'Red Onions',
    category: 'Vegetables',
    price: 35,
    discount: 10,
    stock: 80,
    available: true,
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=500&q=80',
    description: 'Essential kitchen staple, sharp and flavorful red onions.'
  },
  {
    id: 'p6',
    name: 'Full Cream Milk (1L)',
    category: 'Dairy',
    price: 66,
    discount: 0,
    stock: 25,
    available: true,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
    description: 'Pasteurized, homogenized full cream fresh milk.'
  },
  {
    id: 'p7',
    name: 'Fresh Natural Curd (500g)',
    category: 'Dairy',
    price: 45,
    discount: 5,
    stock: 4, // Low stock example
    available: true,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80',
    description: 'Thick and creamy probiotic dahi.'
  },
  {
    id: 'p8',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 40,
    discount: 0,
    stock: 15,
    available: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    description: 'Soft, fiber-rich 100% whole wheat bread loaf.'
  },
  {
    id: 'p9',
    name: 'Farm White Eggs (12 pcs)',
    category: 'Dairy',
    price: 90,
    discount: 10,
    stock: 50,
    available: true,
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=500&q=80',
    description: 'Clean, protein-packed farm fresh white eggs.'
  },
  {
    id: 'p10',
    name: 'Premium Basmati Rice (5kg)',
    category: 'Household',
    price: 550,
    discount: 15,
    stock: 20,
    available: true,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    description: 'Aromatic long-grain aged Basmati rice.'
  },
  {
    id: 'p11',
    name: 'Refined Sunflower Oil (1L)',
    category: 'Household',
    price: 160,
    discount: 8,
    stock: 30,
    available: true,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
    description: 'Healthy cooking oil rich in Vitamin E.'
  },
  {
    id: 'p12',
    name: 'Crunchy Chocolate Biscuits',
    category: 'Snacks',
    price: 30,
    discount: 0,
    stock: 40,
    available: true,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80',
    description: 'Delicious oven-baked chocolate chip cookies.'
  },
  {
    id: 'p13',
    name: 'Instant Roast Coffee (100g)',
    category: 'Beverages',
    price: 220,
    discount: 12,
    stock: 2, // Low stock example
    available: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
    description: 'Rich blend of Arabica and Robusta instant coffee beans.'
  },
  {
    id: 'p14',
    name: 'Fresh Orange Juice (1L)',
    category: 'Beverages',
    price: 110,
    discount: 10,
    stock: 25,
    available: true,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=500&q=80',
    description: '100% pure squeezed citrus orange juice without added sugar.'
  },
  {
    id: 'p15',
    name: 'Fabric Detergent Liquid (1L)',
    category: 'Household',
    price: 240,
    discount: 15,
    stock: 18,
    available: true,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=500&q=80',
    description: 'Tough on stains, gentle on clothes laundry liquid detergent.'
  }
];

const SAMPLE_COUPONS = [
  { code: 'SAVE10', discountPercent: 10, minAmount: 100 },
  { code: 'GROCERY20', discountPercent: 20, minAmount: 300 }
];

const SAMPLE_ORDERS = [
  {
    id: 'ORD-1001',
    userId: 'usr_customer1',
    customerName: 'John Doe',
    customerPhone: '9123456789',
    deliveryAddress: 'Flat 4B, Green Park Apartments, City Center',
    deliveryDate: '2026-10-05',
    deliverySlot: 'Morning (09:00 AM - 12:00 PM)',
    paymentMethod: 'Cash on Delivery',
    items: [
      { id: 'p1', name: 'Fresh Red Apples', price: 108, qty: 2 },
      { id: 'p6', name: 'Full Cream Milk (1L)', price: 66, qty: 1 }
    ],
    subtotal: 282,
    discount: 28.2,
    couponApplied: 'SAVE10',
    total: 253.8,
    status: 'Out for Delivery',
    createdAt: '2026-10-04T08:00:00.000Z'
  }
];

// Seed Local Storage Initialization
function initLocalStorage() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(SAMPLE_USERS));
  }
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
  }
  if (!localStorage.getItem(KEYS.COUPONS)) {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(SAMPLE_COUPONS));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(SAMPLE_ORDERS));
  }
  if (!localStorage.getItem(KEYS.CART)) {
    localStorage.setItem(KEYS.CART, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.INTERACTIONS)) {
    localStorage.setItem(KEYS.INTERACTIONS, JSON.stringify({ viewedCategories: [], purchasedCategories: [] }));
  }
}

// LocalStorage Helper Methods
function getStorage(key, defaultValue = []) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}

function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Currency & Date Formatters
function formatCurrency(amount) {
  return '₹' + Number(amount).toFixed(2);
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Toast Notification Engine
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

// Modal Toggle Helpers
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Execute Auto-Init on script load
initLocalStorage();
