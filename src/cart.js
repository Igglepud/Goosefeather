// Shopping cart module
const cart = {
    items: [],
    
    init() {
        this.items = [];
        this.updateCartCount();
    },
    
    addItem(product, quantity, hasSeals, personalizationText, emailForProof) {
        if (!product || !quantity) return;
        
        const option = qtyOptions.find(o => String(o.label) === String(quantity));
        if (!option) return;
        
        const price = hasSeals ? option.withSeals : option.price;
        
        this.items.push({
            cartId: Date.now() + Math.floor(Math.random() * 1000),
            productTitle: product.title,
            productId: product.id,
            image: product.image || '',
            quantity: Number(quantity),
            isLabelsOnly: !hasSeals,
            price: price,
            personalizationText: personalizationText || '',
            emailForProof: emailForProof || ''
        });
        
        this.updateCartCount();
        this.showToast(
            'Added ' + quantity + ' labels to cart!'
        );
    },
    
    removeItem(cartId) {
        this.items = this.items.filter(item => item.cartId !== cartId);
        this.updateCartCount();
    },
    
    getSubtotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    },
    
    getShippingCost() {
        return this.items.length > 0 ? 6 : 0;
    },
    
    getTotal() {
        return this.getSubtotal() + this.getShippingCost();
    },
    
    updateCartCount() {
        var countEl = document.getElementById('cart-count');
        if (!countEl) return;
        
        var totalItems = this.items.length;
        
        if (totalItems > 0) {
            countEl.textContent = totalItems;
            countEl.classList.remove('hidden');
        } else {
            countEl.classList.add('hidden');
        }
    },
    
    showToast(message) {
        var toast = document.getElementById('toast');
        if (!toast) return;
        
        var toastMsg = document.getElementById('toast-msg');
        if (toastMsg) {
            toastMsg.textContent = message;
        }
        
        toast.classList.remove('toast-hide');
        toast.classList.add('toast-show');
        
        setTimeout(function() {
            toast.classList.remove('toast-show');
            toast.classList.add('toast-hide');
        }, 3000);
    }
};

window.cart = cart;
