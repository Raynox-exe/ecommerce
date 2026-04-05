const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';
window.API_BASE = isLocal 
    ? 'http://127.0.0.1:5000/api'
    : '/api';
// Immediate Guest Check — runs before DOM to set class early
(function() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token || token === 'null' || !user || user === 'null') {
        document.documentElement.classList.add('user-guest');
    } else {
        document.documentElement.classList.remove('user-guest');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    // Re-verify on DOM ready (body now exists)
    const tokenNow = localStorage.getItem('token');
    const userNow = localStorage.getItem('user');
    const isLoggedIn = tokenNow && tokenNow !== 'null' && userNow && userNow !== 'null';

    if (isLoggedIn) {
        document.body.classList.remove('user-guest');
        document.documentElement.classList.remove('user-guest');
    } else {
        document.body.classList.add('user-guest');
        document.documentElement.classList.add('user-guest');
    }

    // 0. Route Protection
    const isCartPage = window.location.pathname.includes('shopping_cart');
    if (isCartPage && !isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // 1. Initialize UI State
    window.updateCartUI();
    window.updateAuthUI();
    setupGlobalSearch();
    injectMobileCategories();

    // 2. Generic Link Interceptor
    const links = document.querySelectorAll('a[href="#"]');
    links.forEach(link => {
        const text = link.innerText.toLowerCase();
        link.addEventListener('click', (e) => {
            if (text.includes('cart') || link.innerHTML.includes('M3 3h2l.4 2M7')) {
                e.preventDefault();
                window.location.href = 'shopping_cart_v2.html';
            }
            if (text.includes('home') || link.innerHTML.includes('The Digital')) {
                e.preventDefault();
                window.location.href = 'index.html';
            }
            if (text.includes('login') || text.includes('register') || link.innerHTML.includes('M4.318 6.318') || link.innerHTML.includes('person')) {
                e.preventDefault();
                const u = JSON.parse(localStorage.getItem('user') || 'null');
                if (u && u.role === 'admin') {
                    window.location.href = 'admin_dashboard_v2.html';
                } else {
                    window.location.href = 'user_account_dashboard.html';
                }
            }
        }); // ← close addEventListener
    }); // ← close forEach

}); // ← close DOMContentLoaded

// --- Dynamic Mobile Category Injection ---

function injectMobileCategories() {
    if (document.getElementById('mobile-categories')) return;
    const header = document.querySelector('header');
    if (!header) return;

    const catContainer = document.createElement('div');
    catContainer.id = 'mobile-categories';
    catContainer.className = 'lg:hidden bg-white border-t border-gray-100 py-3 overflow-hidden mt-1';
    
    const cats = [
        { name: 'Official Store', icon: 'verified', url: 'shop_by_category.html' },
        { name: 'Appliances', icon: 'kitchen', url: 'home_garden_department.html' },
        { name: 'Phones', icon: 'smartphone', url: 'computing_department.html' },
        { name: 'Health', icon: 'health_and_safety', url: 'beauty_health_department.html' },
        { name: 'Home', icon: 'home', url: 'home_garden_department.html' },
        { name: 'Electronics', icon: 'tv', url: 'computing_department.html' },
        { name: 'Fashion', icon: 'apparel', url: 'fashion_department.html' },
        { name: 'Supermarket', icon: 'shopping_basket', url: 'all_categories_50_items.html' },
        { name: 'Computing', icon: 'laptop_mac', url: 'computing_department.html' },
        { name: 'Baby', icon: 'child_care', url: 'baby_products_department.html' },
        { name: 'Gaming', icon: 'sports_esports', url: 'gaming_department.html' }
    ];

    const currentPath = window.location.pathname;

    catContainer.innerHTML = `
        <style>
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            .mobile-cat-pill { flex: 0 0 auto; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
            .mobile-cat-pill:active { transform: scale(0.95); }
        </style>
        <div class="container mx-auto px-4">
            <div class="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1 px-1">
                ${cats.map(cat => {
                    const isActive = currentPath.includes(cat.url);
                    const activeClass = isActive ? 'bg-accent text-white border-accent' : 'bg-gray-100 text-gray-700 border-gray-100 hover:bg-gray-200';
                    return `
                        <a href="${cat.url}" class="mobile-cat-pill flex items-center gap-2 px-4 py-2 rounded-full border ${activeClass} shadow-sm">
                            <span class="material-symbols-outlined text-[18px]">${cat.icon}</span>
                            <span class="text-[11px] font-bold whitespace-nowrap uppercase tracking-tight">${cat.name}</span>
                        </a>
                    `;
                }).join('')}
                <div class="flex-shrink-0 w-4"></div>
            </div>
        </div>
    `;
    header.appendChild(catContainer);
}

// --- API Helpers ---

window.authFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${window.API_BASE}${endpoint}`, {
        ...options,
        headers
    });
    // Handle unauthorized globally
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
    return response;
};

// --- UI Components ---

window.updateCartUI = function() {
    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
    const badges = document.querySelectorAll('span.bg-accent.text-white.text-\\[10px\\], span.bg-accent.rounded-full');
    badges.forEach(badge => {
        if (!isNaN(parseInt(badge.innerText)) || badge.innerText === '0' || badge.innerText === '') {
            badge.innerText = cartCount;
        }
    });
};

window.updateAuthUI = function() {
    const authContainer = document.getElementById('auth-buttons');
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    const isLoggedIn = token && token !== 'null' && userStr && userStr !== 'null';
    
    if (isLoggedIn) {
        // USER IS SIGNED IN
        try {
            const user = JSON.parse(userStr);
            const displayName = user.username || user.name || user.email || 'Account';
            if (authContainer) {
                authContainer.innerHTML = `
                    <div class="flex items-center gap-4 relative group/user">
                        <div class="hidden sm:block text-right">
                            <p class="text-sm font-bold text-gray-800 tracking-tight uppercase">${displayName}</p>
                        </div>
                        
                        <!-- Profile Trigger & Dropdown -->
                        <div class="relative group">
                            <button class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-accent/10 hover:text-accent transition-all">
                                <span class="material-symbols-outlined">person</span>
                            </button>
                            
                            <!-- Dropdown Menu -->
                            <div class="absolute right-0 top-[100%] pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60]">
                                <div class="bg-white rounded-xl shadow-2xl border border-gray-100 py-2 overflow-hidden">
                                    <div class="px-4 py-2 border-b border-gray-50">
                                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Details</p>
                                        <p class="text-xs font-bold text-gray-800 truncate">${user.email}</p>
                                    </div>
                                    <a href="${user.role === 'admin' ? 'admin_dashboard_v2.html' : 'user_account_dashboard.html'}" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent transition-all">
                                        <span class="material-symbols-outlined text-[18px]">dashboard</span>
                                        Dashboard
                                    </a>
                                    <a href="track_your_order.html" class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent transition-all">
                                        <span class="material-symbols-outlined text-[18px]">local_shipping</span>
                                        Track Orders
                                    </a>
                                    <button onclick="window.logout()" class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all text-left">
                                        <span class="material-symbols-outlined text-[18px]">logout</span>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            // Remove guest indicator
            document.body.classList.remove('user-guest');
        } catch (e) { console.error(e); }
    } else {
        // USER IS NOT SIGNED IN
        if (authContainer) {
            authContainer.innerHTML = `
                <a href="login.html" class="px-4 py-2 sm:px-5 sm:py-2 text-sm font-bold text-white bg-accent rounded-lg hover:bg-[#9e3c00] transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    Login
                </a>
                <a href="signup.html" class="px-4 py-2 sm:px-6 sm:py-2.5 text-sm font-bold text-white bg-accent rounded-lg hover:bg-[#9e3c00] transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                    Sign Up
                </a>
            `;
        }

        // USER IS NOT SIGNED IN — mark as guest
        document.body.classList.add('user-guest');
        document.documentElement.classList.add('user-guest');

        // Robust CSS injection to ensure cart remains hidden for guests
        let styleTag = document.getElementById('hide-cart-style');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'hide-cart-style';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = `
            /* ONLY hide if body or html has the class */
            html.user-guest #cart-icon-nav, 
            html.user-guest .cart-btn, 
            html.user-guest [href*="shopping_cart"],
            html.user-guest [onclick*="addDynamicItemToCart"],
            html.user-guest button[onclick*="shopping_cart"],
            body.user-guest #cart-icon-nav, 
            body.user-guest .cart-btn, 
            body.user-guest [href*="shopping_cart"],
            body.user-guest [onclick*="addDynamicItemToCart"],
            body.user-guest button[onclick*="shopping_cart"] { 
                display: none !important; 
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
    }
};

window.logout = function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear cart on logout to ensure a clean slate
    localStorage.removeItem('cartItems');
    localStorage.removeItem('cartCount');
    window.location.href = 'index.html';
};

window.showToast = function(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.classList.add('fixed', 'bottom-5', 'right-5', 'z-[9999]', 'flex', 'flex-col', 'gap-2');
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'bg-accent text-white px-6 py-3 rounded-xl font-bold shadow-2xl animate-bounce-in';
    toast.innerText = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// --- Shopping Logic ---

window.addDynamicItemToCart = function(id, name, price, imageUrl = 'images/default.png') {
    let items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    let count = parseInt(localStorage.getItem('cartCount') || '0');
    
    const existing = items.find(i => i.productId == id);
    if (existing) {
        existing.quantity++;
    } else {
        items.push({ productId: id, id, name, price, quantity: 1, imageUrl });
    }
    
    count++;
    localStorage.setItem('cartItems', JSON.stringify(items));
    localStorage.setItem('cartCount', count.toString());
    
    window.updateCartUI();
    window.showToast('Added to bag!');
};

window.toggleWishlist = function(id, name, event) {
    if (event) event.preventDefault();
    let items = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    const idx = items.findIndex(i => i.id == id);
    let btn = event ? event.currentTarget : null;

    if (idx > -1) {
        items.splice(idx, 1);
        if (btn) {
            btn.classList.remove('text-red-500');
            btn.classList.add('text-gray-400');
        }
        window.showToast('Removed from wishlist');
    } else {
        items.push({ id, name });
        if (btn) {
            btn.classList.remove('text-gray-400');
            btn.classList.add('text-red-500');
        }
        window.showToast('❤️ Saved to wishlist!');
    }
    localStorage.setItem('wishlistItems', JSON.stringify(items));

    // Update wishlist count on page if the stat element exists (e.g. dashboard)
    const wishlistStatEl = document.getElementById('stat-wishlist');
    if (wishlistStatEl) wishlistStatEl.innerText = items.length;

    // Dispatch custom event for any page to react
    document.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { count: items.length, items } }));
};

// Keep wishlist count synced on page load
window.getWishlistCount = function() {
    return JSON.parse(localStorage.getItem('wishlistItems') || '[]').length;
};


// --- Search Logic ---

function setupGlobalSearch() {
    const searchForm = document.querySelector('form.relative.group');
    if (!searchForm) return;

    searchForm.addEventListener('submit', (e) => {
        const input = searchForm.querySelector('input');
        if (input && input.value.trim()) {
            e.preventDefault();
            // Redirect to index.html with search param
            window.location.href = `index.html?search=${encodeURIComponent(input.value.trim())}`;
        }
    });
}

// --- Dynamic Content Loaders ---

window.renderProductHTML = function(product) {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    const isWishlisted = wishlistItems.some(w => w.id == product.id);
    const heartColor = isWishlisted ? 'text-red-500' : 'text-gray-400';
    const price = parseFloat(product.price).toFixed(2);
    const categoryName = product.Category ? product.Category.name : 'Uncategorized';
    
    return `
    <article class="product-card group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div class="relative aspect-square overflow-hidden bg-gray-50">
        <a href="product_details_v2.html?id=${product.id}">
          <img alt="${product.name}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" src="${product.imageUrl || 'https://via.placeholder.com/400x400?text=Product'}">
        </a>
        
        <button onclick="window.toggleWishlist(${product.id}, '${product.name.replace(/'/g, "\\'")}', event)" class="absolute top-4 right-4 p-2.5 bg-white/80 backdrop-blur-sm rounded-full ${heartColor} hover:text-red-500 transition-all shadow-sm z-10">
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path>
          </svg>
        </button>

        <div class="cart-btn absolute inset-x-4 bottom-4">
          <button onclick="window.addDynamicItemToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.imageUrl || ''}')" class="w-full bg-accent text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/30 hover:bg-orange-600">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
      <div class="p-4 space-y-2">
        <span class="text-xs text-gray-400 font-medium uppercase tracking-widest">${categoryName}</span>
        <h3 class="font-bold text-gray-800 line-clamp-1">
          <a href="product_details_v2.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="flex items-center gap-1 text-yellow-400">
          <span class="flex text-[10px]">★★★★★</span>
          <span class="text-gray-400 text-[10px]">(${product.stock} in stock)</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xl font-extrabold text-accent">$${price}</span>
        </div>
      </div>
    </article>
    `;
};

window.loadProductsByCategory = async function(containerId, categoryNames = []) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    try {
        const resp = await fetch(`${window.API_BASE}/products`);
        const allProducts = await resp.json();
        
        let filtered = allProducts;
        if (categoryNames.length > 0) {
            filtered = allProducts.filter(p => p.Category && categoryNames.includes(p.Category.name));
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<p class="col-span-full py-10 text-center text-gray-500">No products found in these categories.</p>`;
            return;
        }

        grid.innerHTML = filtered.map(p => window.renderProductHTML(p)).join('');
    } catch (err) {
        console.error('Error loading products:', err);
    }
};
