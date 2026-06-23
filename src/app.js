// Main application controller  
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    if (typeof productManager !== 'undefined' && typeof productManager.init === 'function') {
        productManager.init();
    }
    
    if (typeof cart !== 'undefined' && typeof cart.init === 'function') {
        cart.init();
    }
    
    // Set up global event listeners
    setupEventListeners();
});

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        // 1. Close modal when clicking the backdrop overlay (not content inside it)
        if (e.target.matches('.modal-overlay') || e.target.id === 'modal') {
            closeModal();
            return;
        }
        
        // 2. Handle add-to-cart button clicks  
        let clickedButton = null;
        if (e.target.classList.contains('add-to-cart-btn')) {
            clickedButton = e.target;
        } else {
            clickedButton = e.target.closest('.add-to-cart-btn');
        }
        
        if (clickedButton) {
            const productId = clickedButton.dataset.id;
            openProduct(productId);
            return;  
        }
        
        // 3. Handle product card clicks (but not the add-to-cart button itself)
        if (!clickedButton && e.target.closest('a')) {
            return; // ignore actual links
        }
        let clickedCard = null;
        if (!clickedButton) {
            clickedCard = e.target.closest('.product-card');
        }
        if (clickedCard) {
            const cardBtn = clickedCard.querySelector('.add-to-cart-btn');
            const productId = cardBtn ? cardBtn.dataset.id : clickedCard.dataset.id;
            openProduct(productId);
            return;
        }
        
        // 4. Handle cart icon clicks
        if (e.target.closest('#cart-icon')) {
            toggleCartSummary();
        }
    });
}

function closeModal() {
    const modalElement = document.getElementById('modal');
    if (modalElement) {
        modalElement.classList.add('modal-hidden');
        setTimeout(() => {
            modalElement.style.display = 'none';
        }, 300);
    }
}

function toggleCartSummary() {
    console.log('Toggle cart summary');
}

function openProduct(productId) {
    if (typeof modal !== 'undefined' && typeof modal.openProduct === 'function') {
        const modalEl = document.getElementById('modal');
        if (modalEl) {
            modalEl.style.display = 'flex';  // Show wrapper when opening
            modalEl.classList.remove('modal-hidden');
        }
        modal.openProduct(productId);
    } else {
        console.error('Modal not properly initialized!');
    }
}
