// Product management module
const productManager = {
    init() {
        this.renderProducts();
        this.setupEventListeners();
    },

    renderProducts() {
        const grid = document.getElementById('product-grid');
        grid.innerHTML = products.map(p => `
            <div class="product-card bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 cursor-pointer" data-id="${p.id}">
                <div class="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src="${p.image}" alt="${p.title}" loading="lazy" class="w-full h-full object-cover img-zoom">
                </div>
                <div class="p-5">
                    <h4 class="font-display font-semibold text-gray-900 text-lg mb-1">${p.title}</h4>
                    <p class="text-gray-500 text-sm leading-relaxed line-clamp-2">${p.shortDescription}</p>
                    <div class="flex items-center justify-between mt-3">
                        <span class="text-teal-700 font-bold text-lg">$${qtyOptions[0].price}</span>
                        <button class="add-to-cart-btn bg-teal-600 text-white p-2 rounded-full hover:bg-teal-700 transition" data-id="${p.id}" title="Add to Cart">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="9" cy="21" r="1"/>
                                <circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    setupEventListeners() {
        // Product click handlers can be added here if needed
    }
};

// Make it globally available
window.productManager = productManager;