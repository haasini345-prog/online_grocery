/**
 * Online Grocery Store - Product Browsing & Recommendation Engine
 * SDC Project Review-1
 * 
 * Handles:
 * - Rendering product cards with pricing, discounts, stock tags
 * - Live keyword search filtering
 * - Category filter chips
 * - Simple JS-based personalized recommendation system based on user interaction history
 */

let activeCategory = 'All';
let searchQuery = '';

// Calculate discounted price
function getFinalPrice(product) {
  if (product.discount && product.discount > 0) {
    return product.price - (product.price * (product.discount / 100));
  }
  return product.price;
}

// Render Products Grid
function renderProducts(containerId = 'products-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const products = getStorage(KEYS.PRODUCTS, []);
  
  // Filter products by category & search query
  const filtered = products.filter(p => {
    const matchesCategory = (activeCategory === 'All' || p.category === activeCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && p.available;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: var(--white); border-radius: var(--radius-md);">
        <h3 style="color: var(--muted-text); margin-bottom: 0.5rem;">No products found</h3>
        <p>Try searching for a different item or switching categories.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const finalPrice = getFinalPrice(p);
    const hasDiscount = p.discount > 0;
    
    // Stock Status Badge
    let stockClass = 'in-stock';
    let stockText = `In Stock (${p.stock})`;
    if (p.stock <= 0) {
      stockClass = 'out-of-stock';
      stockText = 'Out of Stock';
    } else if (p.stock <= 5) {
      stockClass = 'low-stock';
      stockText = `Low Stock (${p.stock} left)`;
    }

    return `
      <div class="product-card" onclick="trackProductView('${p.category}')">
        ${hasDiscount ? `<span class="discount-badge">${p.discount}% OFF</span>` : ''}
        <img src="${p.image}" alt="${p.name}" class="product-image" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'">
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-price-row">
            <span class="current-price">${formatCurrency(finalPrice)}</span>
            ${hasDiscount ? `<span class="original-price">${formatCurrency(p.price)}</span>` : ''}
          </div>
          <span class="stock-status ${stockClass}">${stockText}</span>
          <div class="product-actions">
            <button 
              class="btn btn-primary btn-block ${p.stock <= 0 ? 'disabled' : ''}" 
              onclick="event.stopPropagation(); addToCart('${p.id}')"
              ${p.stock <= 0 ? 'disabled style="opacity:0.6; cursor:not-allowed;"' : ''}
            >
              🛒 ${p.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Category Filter Handler
function filterCategory(categoryName) {
  activeCategory = categoryName;
  
  // Update chip active states
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    if (chip.textContent.trim() === categoryName) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  renderProducts();
}

// Search Input Handler
function handleProductSearch(query) {
  searchQuery = query.trim();
  renderProducts();
}

// Track product view for recommendations
function trackProductView(category) {
  const interactions = getStorage(KEYS.INTERACTIONS, { viewedCategories: [], purchasedCategories: [] });
  interactions.viewedCategories.push(category);
  // Keep last 20 views
  if (interactions.viewedCategories.length > 20) {
    interactions.viewedCategories.shift();
  }
  setStorage(KEYS.INTERACTIONS, interactions);
  
  // Refresh recommendations if container exists
  renderRecommendations();
}

// Track product purchase for recommendations
function trackPurchaseCategories(categoriesArray) {
  const interactions = getStorage(KEYS.INTERACTIONS, { viewedCategories: [], purchasedCategories: [] });
  interactions.purchasedCategories.push(...categoriesArray);
  setStorage(KEYS.INTERACTIONS, interactions);
}

// Personalized Recommendation Engine
function renderRecommendations(containerId = 'recommendations-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const products = getStorage(KEYS.PRODUCTS, []);
  const interactions = getStorage(KEYS.INTERACTIONS, { viewedCategories: [], purchasedCategories: [] });

  // Count category interest weights (purchased weight: 3, viewed weight: 1)
  const categoryWeights = {};
  
  interactions.viewedCategories.forEach(cat => {
    categoryWeights[cat] = (categoryWeights[cat] || 0) + 1;
  });
  
  interactions.purchasedCategories.forEach(cat => {
    categoryWeights[cat] = (categoryWeights[cat] || 0) + 3;
  });

  // Sort preferred categories
  const sortedCategories = Object.keys(categoryWeights).sort((a, b) => categoryWeights[b] - categoryWeights[a]);

  let recommendedProducts = [];

  if (sortedCategories.length > 0) {
    // Pick top items matching preferred categories
    recommendedProducts = products.filter(p => sortedCategories.includes(p.category) && p.available).slice(0, 4);
  }

  // Fallback: Pick top discounted items if no user history yet
  if (recommendedProducts.length < 4) {
    const defaultRecommendations = products
      .filter(p => p.available && !recommendedProducts.some(r => r.id === p.id))
      .sort((a, b) => (b.discount || 0) - (a.discount || 0))
      .slice(0, 4 - recommendedProducts.length);
    
    recommendedProducts = [...recommendedProducts, ...defaultRecommendations];
  }

  if (recommendedProducts.length === 0) {
    container.innerHTML = '<p style="color: var(--muted-text);">No recommendations available yet.</p>';
    return;
  }

  container.innerHTML = recommendedProducts.map(p => {
    const finalPrice = getFinalPrice(p);
    return `
      <div class="product-card">
        ${p.discount > 0 ? `<span class="discount-badge">${p.discount}% OFF</span>` : ''}
        <img src="${p.image}" alt="${p.name}" class="product-image" style="height:140px;">
        <div class="product-info" style="padding:0.9rem;">
          <span class="product-category">${p.category}</span>
          <h4 class="product-name" style="font-size:0.95rem;">${p.name}</h4>
          <div class="product-price-row">
            <span class="current-price" style="font-size:1.05rem;">${formatCurrency(finalPrice)}</span>
          </div>
          <button class="btn btn-primary btn-sm btn-block" onclick="addToCart('${p.id}')">Add to Cart</button>
        </div>
      </div>
    `;
  }).join('');
}
