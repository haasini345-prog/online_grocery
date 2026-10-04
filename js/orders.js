/**
 * Online Grocery Store - Customer Order Tracking Module
 * SDC Project Review-1
 * 
 * Handles:
 * - Rendering user-specific order history
 * - Interactive step progress tracker for order status
 */

const ORDER_STAGES = [
  { key: 'Order Placed', label: 'Placed' },
  { key: 'Confirmed', label: 'Confirmed' },
  { key: 'Packed', label: 'Packed' },
  { key: 'Out for Delivery', label: 'Out for Delivery' },
  { key: 'Delivered', label: 'Delivered' }
];

function getStageIndex(status) {
  return ORDER_STAGES.findIndex(s => s.key === status);
}

// Render User Orders
function renderUserOrders(containerId = 'orders-list-container') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const allOrders = getStorage(KEYS.ORDERS, []);
  // Filter orders for current user (or show all for demo user if matched)
  const userOrders = allOrders.filter(o => o.userId === currentUser.id || o.customerName === currentUser.name);

  if (userOrders.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem; background: var(--white); border-radius: var(--radius-md);">
        <span style="font-size: 3rem;">📦</span>
        <h3 style="color: var(--muted-text); margin-top: 1rem;">No orders found</h3>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">You haven't placed any grocery orders yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = userOrders.map(order => {
    const isCancelled = order.status === 'Cancelled';
    const currentStageIdx = getStageIndex(order.status);

    return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <span class="order-id">${order.id}</span>
            <div class="order-date">Placed on ${formatDate(order.createdAt)}</div>
          </div>
          <div>
            <span class="status-badge status-${getStatusCssClass(order.status)}">${order.status}</span>
          </div>
        </div>

        <div class="order-items-list">
          <h4 style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--muted-text);">Ordered Items:</h4>
          ${order.items.map(item => `
            <div class="order-item-row">
              <span>${item.name} <strong>x ${item.qty}</strong></span>
              <span>${formatCurrency(item.price * item.qty)}</span>
            </div>
          `).join('')}
        </div>

        <div style="background-color: var(--light-bg); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 1rem;">
          <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
            <span><strong>Delivery Address:</strong> ${order.deliveryAddress}</span>
            <span><strong>Slot:</strong> ${order.deliveryDate} (${order.deliverySlot})</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span><strong>Payment Method:</strong> ${order.paymentMethod}</span>
            <span style="font-size: 1.1rem; font-weight: 800; color: var(--primary-color);">Total: ${formatCurrency(order.total)}</span>
          </div>
        </div>

        <!-- Order Tracking Stepper -->
        ${!isCancelled ? `
          <div style="margin-top: 1.5rem;">
            <h4 style="font-size: 0.85rem; color: var(--muted-text); text-align: center; margin-bottom: 0.5rem;">ORDER TRACKING PROGRESS</h4>
            <div class="tracking-stepper">
              ${ORDER_STAGES.map((stage, idx) => {
                let statusClass = '';
                if (idx < currentStageIdx) statusClass = 'completed';
                else if (idx === currentStageIdx) statusClass = 'active';

                return `
                  <div class="step-node ${statusClass}">
                    <div class="step-circle">${idx < currentStageIdx ? '✓' : (idx + 1)}</div>
                    <span class="step-label">${stage.label}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : `
          <div style="background-color: #ffebee; color: var(--danger-color); padding: 0.8rem; border-radius: var(--radius-sm); text-align: center; font-weight: 600;">
            This order has been cancelled.
          </div>
        `}
      </div>
    `;
  }).join('');
}

// Utility CSS Helper for status badges
function getStatusCssClass(status) {
  switch(status) {
    case 'Order Placed': return 'placed';
    case 'Confirmed': return 'confirmed';
    case 'Packed': return 'packed';
    case 'Out for Delivery': return 'out';
    case 'Delivered': return 'delivered';
    case 'Cancelled': return 'cancelled';
    default: return 'placed';
  }
}
