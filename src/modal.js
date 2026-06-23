// Modal management module
const modal = {
    openProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error('Product not found:', productId);
            return;
        }

        // Store current product for form submission
        window._currentProductId = productId;

        const modalBody = document.getElementById('modal-body');
        const modalElement = document.getElementById('modal');

        if (!modalBody || !modalElement) {
            console.error('Modal elements not found in DOM');
            return;
        }

        // Product features list from task.md
        const features = [
            "Personalized with Your Name & Address — A fun way to make your mail stand out!",
            "Whimsical & Unique Designs — Choose from playful themes, cute characters, and creative clipart.",
            "Matte Finish — Vibrant colors with a smooth texture.",
            "Great for Any Occasion — Perfect for birthday invitations, party favors, and happy mail!",
            "Matching 1\" Round Envelope Seals (Optional) — Complete the look with coordinating stickers.",
            "Proof Available Upon Request — Want to see your design before printing? Just ask!",
            "Custom Orders Welcome! — Have a fun idea or a favorite theme? Message me with requests!"
        ];

        // Build quantity rows with dual pricing (Labels Only / w/ Seals)
        const qtyOptionsHTML = qtyOptions.map(option => {
            return `
                <div class="border rounded-lg p-3 cursor-pointer hover:bg-teal-50 transition ${option.label === '30' ? 'bg-teal-50 border-teal-500' : ''}" 
                     onclick="selectQty('${option.label}')" data-qty-option="${option.label}">
                    <div class="font-semibold text-gray-900">${option.label} Labels</div>
                    <div class="mt-2 space-y-1.5">
                        <label data-seal-option="labels" class="flex items-center justify-between cursor-pointer p-1.5 rounded transition border-transparent seal-option">
                            <span class="text-sm text-gray-700">Labels Only</span>
                            <span class="font-bold text-teal-700">$${option.price}</span>
                        </label>
                        <label data-seal-option="seals" class="flex items-center justify-between cursor-pointer p-1.5 rounded transition border-transparent seal-option">
                            <span class="text-sm text-gray-700">w/ Env Seals</span>
                            <span class="font-bold text-teal-700">$${option.withSeals}</span>
                        </label>
                    </div>
                </div>
            `;
        }).join('');

        const htmlContent = `
            <div class="p-6">
                <!-- Product Image and Info -->
                <div class="flex flex-col md:flex-row gap-6 mb-6">
                    <div class="md:w-[40%]">
                        <img src="${product.image}" alt="${product.title}" class="w-full h-auto rounded-xl shadow-md" onerror="this.style.background='#e5e7eb'; this.alt='Image preview'">
                    </div>
                    <div class="md:w-[60%]">
                        <h3 class="font-display text-2xl font-bold text-gray-900">${product.title}</h3>
                        <p class="text-gray-600 mt-2 text-sm leading-relaxed">${product.fullDescription}</p>
                        
                        <div class="mt-4">
                            <h4 class="font-semibold text-gray-900 mb-2">✨ Why You'll Love These Labels:</h4>
                            <ul class="space-y-1.5">
                                ${features.map(f => `
                                    <li class="text-sm text-gray-600 flex items-start gap-1.5">
                                        <span class="text-teal-600 flex-shrink-0 mt-0.5">✔</span>
                                        <span>${f}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Order Form -->
                <form id="order-form" class="border-t border-gray-200 pt-6 space-y-5">
                    
                    <!-- Quantity Selection -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-900 mb-2">Choose Your Quantity</label>
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2" id="qty-options-grid">
                            ${qtyOptionsHTML}
                        </div>
                    </div>

                    <!-- Personalization -->
                    <div>
                        <label for="personalization" class="block text-sm font-semibold text-gray-900 mb-1.5">Personalization</label>
                        <textarea id="personalization" name="personalization" rows="3" 
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-sm"
                            placeholder="Please enter the name/address or custom text (up to four lines) that you'd like on your labels:" required></textarea>
                    </div>
                    
                    <!-- Proof Email -->
                    <div>
                        <label for="proof-email" class="block text-sm font-semibold text-gray-900 mb-1.5">Proof Email</label>
                        <input type="email" id="proof-email" name="proof_email" 
                            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                            placeholder="Email where we can send proof and contact about your order:" required>
                    </div>

                    <!-- Add to Cart Button -->
                    <button type="submit" class="w-full bg-teal-600 text-white py-3.5 px-4 rounded-lg hover:bg-teal-700 transition font-semibold shadow-md active:scale-[0.98]">
                        Add to Cart
                    </button>
                </form>

                <!-- Confirmation Message -->
                <div id="confirmation-message" class="hidden mt-6 text-center"></div>
            </div>
        `;

        // Set modal content and show it
        modalBody.innerHTML = htmlContent;
        
        // Show modal with animation
        modalElement.style.display = 'flex';
        modalElement.classList.remove('modal-hidden');
        modalElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        // Set up form submission handler
        setTimeout(() => {
            const orderForm = document.getElementById('order-form');
            if (orderForm) {
                orderForm.addEventListener('submit', handleOrderSubmit);
                
                // Auto-select first qty option
                selectQty('30');
                
                // Add event listeners for radio buttons to update summary
                setupSealsRadioListeners();
            }
        }, 0);

        // Reset previous state
        window._selectedQty = null;
        window._hasSeals = false;
    },

    closeAllModals() {
        const modalElement = document.getElementById('modal');
        if (modalElement) {
            modalElement.classList.add('modal-hidden');
            setTimeout(() => {
                modalElement.style.display = 'none';
            }, 300);
        }
    },

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        
        toastMsg.textContent = message;
        toast.classList.remove('toast-hide');
        toast.classList.add('toast-show');
        
        setTimeout(() => {
            toast.classList.remove('toast-show');
            toast.classList.add('toast-hide');
        }, 3000);
    }
};

// Quantity selection function (global)
function selectQty(quantity) {
    window._selectedQty = quantity;
    
    // Update visual selection on qty options
    document.querySelectorAll('[data-qty-option]').forEach(el => {
        const elQty = String(el.getAttribute('data-qty-option'));
        if (elQty === String(quantity)) {
            el.classList.add('bg-teal-50', 'border-teal-500');
            window._selectedQtyLabel = quantity;
        } else {
            el.classList.remove('bg-teal-50', 'border-teal-500');
        }
    });

    // Reset all seal highlights in selected qty row
    const selectedEl = document.querySelector(`[data-qty-option="${quantity}"]`);
    if (selectedEl) {
        selectedEl.querySelectorAll('[data-seal-option]').forEach(l => l.classList.remove('selected'));
    }

    // Default to Labels Only with teal highlight
    updateSealsSelection(selectedEl || document.querySelector(`[data-qty-option="${quantity}"]`), false);
}

function updateSealsSelection(quantityEl, hasSeals) {
    if (!quantityEl) return;
    window._hasSeals = hasSeals;
    
    const qty = Number(quantityEl.getAttribute('data-qty-option'));
    
    // Remove previous highlight from all labels in this row
    quantityEl.querySelectorAll('[data-seal-option]').forEach(label => {
        label.classList.remove('selected');
    });
    
    // Highlight the correct option within this row
    const selectedLabel = quantityEl.querySelector(`[data-seal-option="${hasSeals ? 'seals' : 'labels'}"]`);
    if (selectedLabel) {
        selectedLabel.classList.add('selected');
    }
    
    // Find the price option for this quantity and seal selection
    const option = qtyOptions.find(o => String(o.label) === String(qty));
    
    if (option) {
        updateOrderSummary(qty, hasSeals);
    }
}

function updateOrderSummary(quantity, hasSeals) {
    const option = qtyOptions.find(o => String(o.label) === String(quantity));
    if (!option) return;

    const totalPrice = hasSeals ? option.withSeals : option.price;
    const shippingCost = 6;
    const totalWithShipping = totalPrice + shippingCost;

    // Update summary in any element with id="order-summary-preview" or within the confirmation
    const summaryPreviewEl = document.getElementById('summary-content');
    if (summaryPreviewEl) {
        summaryPreviewEl.innerHTML = `
            <div class="flex justify-between text-gray-700">
                <span>${quantity} ${hasSeals ? 'labels (w/ Env Seals)' : 'labels only'}</span>
                <span class="font-medium">$${totalPrice.toFixed(2)}</span>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>US Shipping (flat rate)</span><span>$${shippingCost.toFixed(2)}</span>
            </div>
            <div class="border-t pt-1 mt-1 flex justify-between font-bold text-teal-700 text-sm">
                <span>Total</span><span>$${totalWithShipping.toFixed(2)}</span>
            </div>
        `;
    }
}

function setupSealsRadioListeners() {
    // Add click handlers to quantity option rows to toggle between labels only and w/ seals
    const qtyOptionsGrid = document.getElementById('qty-options-grid');
    if (!qtyOptionsGrid) return;

    qtyOptionsGrid.querySelectorAll('[data-qty-option]').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const currentQty = String(this.getAttribute('data-qty-option'));
            
            if (String(window._selectedQty) !== currentQty) {
                // New qty selected, default to labels only
                selectQty(currentQty);
                return;
            }
            
            // Toggle seals selection within same qty row
            window._hasSeals = !window._hasSeals;
            updateOrderSummary(currentQty, window._hasSeals);
        });
    });
}

function handleOrderSubmit(event) {
    event.preventDefault();
    
    const selectedQty = window._selectedQty;
    const hasSeals = window._hasSeals || false;
    const personalizationText = document.getElementById('personalization')?.value?.trim() || '';
    const emailForProof = document.getElementById('proof-email')?.value?.trim() || '';
    
    // Validation
    if (!selectedQty) {
        alert('Please select a quantity.');
        return;
    }
    
    if (!personalizationText) {
        alert('Please enter personalization text.');
        return;
    }
    
    if (!emailForProof) {
        alert('Please enter your email for the proof.');
        return;
    }

    // Get current product
    const currentProductId = window._currentProductId;
    const currentProduct = products.find(p => p.id === currentProductId);
    
    if (!currentProduct) {
        console.error('Product not found during form submission');
        return;
    }

    // Add to cart using global cart module
    cart.addItem(currentProduct, selectedQty, hasSeals, personalizationText, emailForProof);

    // Show confirmation message instead of hiding the form
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.style.display = 'none';
    }

    const confirmationMessageEl = document.getElementById('confirmation-message');
    if (confirmationMessageEl) {
        confirmationMessageEl.classList.remove('hidden');
        confirmationMessageEl.innerHTML = `
            <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                <svg class="w-10 h-10 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <h3 class="font-semibold text-green-800 mb-1">Added to Cart!</h3>
                <p class="text-sm text-green-600 mb-4">Continue shopping or proceed to checkout when ready.</p>
                <div class="flex flex-col sm:flex-row gap-2">
                    <button onclick="openProduct(window._currentProductId)" class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition items-center gap-1 inline-flex justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 7M7 13L6.707 10.293A1 1 0 007.334 14h3.332a1 1 0 00.866-.35l6.4-12.8a1 1 0 00-.866-1.35L19.666 15M18 7a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
                        View Cart
                    </button>
                    <button onclick="resetFormAndClose()" class="border border-teal-600 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded-lg font-medium transition">
                        Close
                    </button>
                </div>
            </div>
        `;
    }
}

function resetFormAndClose() {
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.style.display = 'block';
        orderForm.reset();
        
        const confirmationMessageEl = document.getElementById('confirmation-message');
        if (confirmationMessageEl) {
            confirmationMessageEl.classList.add('hidden');
        }
    }
}

// Make it globally available
window.modal = modal;
window.selectQty = selectQty;
window.handleOrderSubmit = handleOrderSubmit;
window.resetFormAndClose = resetFormAndClose;
window.updateOrderSummary = updateOrderSummary;
