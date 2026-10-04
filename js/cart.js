/**
 * Online Grocery Store - Shopping Cart & Checkout Engine
 * SDC Project Review-1
 * 
 * Handles:
 * - Cart state management in LocalStorage
 * - Item addition, quantity update, item removal
 * - Discount coupon application
 * - Order placement & inventory stock deduction
 */

let activeCoupon = null;

// Get Cart
function getCart() {
  return getStorage(KEYS.CART, []);
}

// Save Cart
function saveCart(cart) {
  setStorage(KEYS.CART, cart);
  updateCartBadge();
}

// Update Header Cart Badge
function updateCartBadge() {
  const cart = getCart();
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const badgeEls = document.querySelectorAll('.cart-count');
  badgeEls.forEach(el => {
    el.textContent = totalCount;
  });
}

// Add Product to Cart
function addToCart(productId) {
  const products = getStorage(KEYS.PRODUCTS, []);
  const product = products.find(p => p.id === productId);

  if (!product) {
    showToast('Product not found.', 'error');
    return;
  }

  if (product.stock <= 0) {
    showToast('Sorry, this product is out of stock!', 'error');
    return;
  }

  const cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    if (cart[existingIndex].qty + 1 > product.stock) {
      showToast(`Cannot add more. Only ${product.stock} units available in stock.`, 'warning');
      return;
    }
    cart[existingIndex].qty += 1;
  } else {
    const finalPrice = product.discount ? product.price - (product.price * (product.discount / 100)) : product.price;
    cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: finalPrice,
      originalPrice: product.price,
      image: product.image,
      qty: 1
    });
  }

  saveCart(cart);
  showToast(`Added "${product.name}" to cart!`, 'success');
  renderCartModal();
}

// Change Quantity (+ / -)
function updateCartQty(productId, delta) {
  const cart = getCart();
  const products = getStorage(KEYS.PRODUCTS, []);
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex === -1) return;

  const product = products.find(p => p.id === productId);
  const newQty = cart[itemIndex].qty + delta;

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (product && newQty > product.stock) {
    showToast(`Only ${product.stock} units in stock.`, 'warning');
    return;
  }

  cart[itemIndex].qty = newQty;
  saveCart(cart);
  renderCartModal();
}

// Remove Item from Cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  showToast('Item removed from cart.', 'info');
  renderCartModal();
}

// Apply Coupon Code
function applyCouponCode() {
  const couponInput = document.getElementById('coupon-input');
  if (!couponInput) return;

  const code = couponInput.value.trim().toUpperCase();
  if (!code) {
    showToast('Please enter a coupon code.', 'warning');
    return;
  }

  const coupons = getStorage(KEYS.COUPONS, []);
  const coupon = coupons.find(c => c.code === code);

  if (!coupon) {
    showToast('Invalid coupon code. Try SAVE10 or GROCERY20.', 'error');
    return;
  }

  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (subtotal < coupon.minAmount) {
    showToast(`Minimum cart amount of ${formatCurrency(coupon.minAmount)} required for this coupon.`, 'warning');
    return;
  }

  activeCoupon = coupon;
  showToast(`Coupon "${code}" applied! (${coupon.discountPercent}% OFF)`, 'success');
  renderCartModal();
}

// Render Cart Modal
function renderCartModal() {
  const container = document.getElementById('cart-items-container');
  const summaryContainer = document.getElementById('cart-summary-container');
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem;">
        <span style="font-size: 3rem;">🛒</span>
        <h4 style="margin-top: 1rem; color: var(--muted-text);">Your cart is currently empty</h4>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Explore our fresh groceries and add items to your cart!</p>
      </div>
    `;
    if (summaryContainer) summaryContainer.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <span class="cart-item-price">${formatCurrency(item.price)} each</span>
        </div>
      </div>
      <div class="cart-qty-controls">
        <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
        <span class="qty-amount">${item.qty}</span>
        <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
      </div>
      <span class="cart-item-total">${formatCurrency(item.price * item.qty)}</span>
      <button class="remove-btn" onclick="removeFromCart('${item.id}')" title="Remove item">🗑️</button>
    </div>
  `).join('');

  // Computations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  let discountAmount = 0;
  if (activeCoupon) {
    discountAmount = subtotal * (activeCoupon.discountPercent / 100);
  }
  const grandTotal = subtotal - discountAmount;

  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        ${activeCoupon ? `
          <div class="summary-row" style="color: var(--primary-color);">
            <span>Coupon Discount (${activeCoupon.code} - ${activeCoupon.discountPercent}%)</span>
            <span>-${formatCurrency(discountAmount)}</span>
          </div>
        ` : ''}
        <div class="summary-row total">
          <span>Grand Total</span>
          <span>${formatCurrency(grandTotal)}</span>
        </div>
        
        <div class="coupon-section">
          <input type="text" id="coupon-input" class="form-control" placeholder="Enter Coupon (e.g. SAVE10)" value="${activeCoupon ? activeCoupon.code : ''}">
          <button class="btn btn-outline" onclick="applyCouponCode()">Apply</button>
        </div>

        <button class="btn btn-primary btn-block" style="margin-top: 1rem;" onclick="openCheckoutModal()">
          Proceed to Checkout (${formatCurrency(grandTotal)})
        </button>
      </div>
    `;
  }
}

// Open Checkout Modal & Prefill User Information
function openCheckoutModal() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }

  const currentUser = getCurrentUser();
  if (currentUser) {
    const nameInput = document.getElementById('checkout-name');
    const phoneInput = document.getElementById('checkout-phone');
    if (nameInput) nameInput.value = currentUser.name || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '';
  }

  closeModal('cart-modal');
  openModal('checkout-modal');
}

// Submit Order (Checkout)
function placeOrder(event) {
  if (event) event.preventDefault();

  const cart = getCart();
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }

  const name = document.getElementById('checkout-name').value.trim();
  const phone = document.getElementById('checkout-phone').value.trim();
  const address = document.getElementById('checkout-address').value.trim();
  const deliveryDate = document.getElementById('checkout-date').value;
  const deliverySlot = document.getElementById('checkout-slot').value;
  const paymentMethod = document.getElementById('checkout-payment').value;

  if (!name || !phone || !address || !deliveryDate || !deliverySlot || !paymentMethod) {
    showToast('Please fill out all checkout fields.', 'error');
    return;
  }

  const currentUser = getCurrentUser() || { id: 'usr_guest', name: name };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = activeCoupon ? subtotal * (activeCoupon.discountPercent / 100) : 0;
  const grandTotal = subtotal - discountAmount;

  // Build new order object
  const newOrder = {
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    userId: currentUser.id,
    customerName: name,
    customerPhone: phone,
    deliveryAddress: address,
    deliveryDate: deliveryDate,
    deliverySlot: deliverySlot,
    paymentMethod: paymentMethod,
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty
    })),
    subtotal: subtotal,
    discount: discountAmount,
    couponApplied: activeCoupon ? activeCoupon.code : null,
    total: grandTotal,
    status: 'Order Placed',
    createdAt: new Date().toISOString()
  };

  // Deduct inventory stock
  const products = getStorage(KEYS.PRODUCTS, []);
  cart.forEach(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    if (product) {
      product.stock = Math.max(0, product.stock - cartItem.qty);
    }
  });
  setStorage(KEYS.PRODUCTS, products);

  // Save Order to LocalStorage
  const orders = getStorage(KEYS.ORDERS, []);
  orders.unshift(newOrder); // Newest order first
  setStorage(KEYS.ORDERS, orders);

  // Track purchased categories for recommendation system
  const purchasedCategories = cart.map(i => i.category).filter(Boolean);
  if (typeof trackPurchaseCategories === 'function') {
    trackPurchaseCategories(purchasedCategories);
  }

  // Clear Cart & Coupon
  setStorage(KEYS.CART, []);
  activeCoupon = null;
  updateCartBadge();

  closeModal('checkout-modal');
  showToast('🎉 Order placed successfully!', 'success');

  // Switch to Orders Tab or Refresh Page
  setTimeout(() => {
    if (typeof showTab === 'function') {
      showTab('orders-tab');
      if (typeof renderUserOrders === 'function') {
        renderUserOrders();
      }
    }
  }, 1000);
}
