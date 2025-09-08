import "bootstrap/dist/js/bootstrap.min.js";

// Cart functionality
class Cart {
    constructor() {
        this.items = this.loadCart();
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.checkEmptyCart();
    }

    bindEvents() {
        // Quantity controls
        document.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', (e) => this.increaseQuantity(e));
        });

        document.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => this.decreaseQuantity(e));
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => this.updateQuantity(e));
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => this.removeItem(e));
        });

        // Coupon code
        //document.getElementById('apply-coupon')?.addEventListener('click', () => this.applyCoupon());

        // Add to cart buttons (for recommended products)
        document.querySelectorAll('.product-card .btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e));
        });

        // Form validation
        this.initFormValidation();
    }

    increaseQuantity(e) {
        const cartItem = e.target.closest('.cart-item');
        const input = cartItem.querySelector('.quantity-input');
        const newQuantity = parseInt(input.value) + 1;
        input.value = newQuantity;
        this.updateItemTotal(cartItem, newQuantity);
        this.updateTotals();
        this.saveCart();
    }

    decreaseQuantity(e) {
        const cartItem = e.target.closest('.cart-item');
        const input = cartItem.querySelector('.quantity-input');
        const newQuantity = Math.max(1, parseInt(input.value) - 1);
        input.value = newQuantity;
        this.updateItemTotal(cartItem, newQuantity);
        this.updateTotals();
        this.saveCart();
    }

    updateQuantity(e) {
        const cartItem = e.target.closest('.cart-item');
        const newQuantity = Math.max(1, parseInt(e.target.value) || 1);
        e.target.value = newQuantity;
        this.updateItemTotal(cartItem, newQuantity);
        this.updateTotals();
        this.saveCart();
    }

    updateItemTotal(cartItem, quantity) {
        const priceElement = cartItem.querySelector('.item-price');
        const unitPrice = parseFloat(priceElement.dataset.price);
        const newTotal = (unitPrice * quantity).toFixed(2);
        priceElement.textContent = `£${newTotal}`;
    }

    removeItem(e) {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.dataset.productId;
        
        // Add fade out animation
        cartItem.style.transition = 'opacity 0.3s ease';
        cartItem.style.opacity = '0';
        
        setTimeout(() => {
            cartItem.remove();
            this.removeFromStorage(productId);
            this.updateTotals();
            this.checkEmptyCart();
        }, 300);
    }

    updateTotals() {
        let subtotal = 0;
        
        document.querySelectorAll('.cart-item').forEach(item => {
            const priceText = item.querySelector('.item-price').textContent;
            const price = parseFloat(priceText.replace('£', ''));
            subtotal += price;
        });

        const shipping = this.getShippingCost();
        const discount = this.getDiscount(subtotal);
        const vat = (subtotal - discount) * 0.2;
        const total = subtotal - discount + shipping + vat;

        // Update display
        //document.querySelector('.subtotal').textContent = `£${subtotal.toFixed(2)}`;
        document.querySelector('.shipping').textContent = shipping === 0 ? 'Free' : `£${shipping.toFixed(2)}`;
        document.querySelector('.vat').textContent = `£${vat.toFixed(2)}`;
        document.querySelector('.total').textContent = `£${total.toFixed(2)}`;

        // Show/hide discount row
        const discountRow = document.querySelector('.discount-row');
        if (discount > 0) {
            discountRow.classList.remove('d-none');
            document.querySelector('.discount').textContent = `-£${discount.toFixed(2)}`;
        } else {
            discountRow.classList.add('d-none');
        }
    }

    getShippingCost() {
        // Free shipping for orders over £200
        const subtotal = this.getSubtotal();
        return subtotal >= 200 ? 0 : 0; // Currently free shipping
    }

    getSubtotal() {
        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const priceText = item.querySelector('.item-price').textContent;
            const price = parseFloat(priceText.replace('£', ''));
            subtotal += price;
        });
        return subtotal;
    }

    getDiscount(subtotal) {
        const couponCode = localStorage.getItem('appliedCoupon');
        if (couponCode === 'SAVE10') {
            return subtotal * 0.1; // 10% discount
        } else if (couponCode === 'SAVE20') {
            return subtotal * 0.2; // 20% discount
        }
        return 0;
    }

    applyCoupon() {
        const couponInput = document.getElementById('coupon-code');
        const couponCode = couponInput.value.trim().toUpperCase();
        
        const validCoupons = {
            'SAVE10': '10% discount applied!',
            'SAVE20': '20% discount applied!',
            'WELCOME': '15% discount applied!'
        };

        if (validCoupons[couponCode]) {
            localStorage.setItem('appliedCoupon', couponCode);
            this.showMessage(validCoupons[couponCode], 'success');
            this.updateTotals();
            couponInput.value = '';
        } else {
            this.showMessage('Invalid coupon code', 'error');
        }
    }

    showMessage(message, type) {
        // Create and show toast message
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    checkEmptyCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        const emptyCart = document.querySelector('.empty-cart');
        const cartItemsContainer = document.querySelector('.cart-items');
        
        if (cartItems.length === 0) {
            emptyCart.classList.remove('d-none');
            cartItemsContainer.style.display = 'none';
        } else {
            emptyCart.classList.add('d-none');
            cartItemsContainer.style.display = 'block';
        }
    }

    addToCart(e) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h6').textContent;
        const productPrice = productCard.querySelector('.fw-bold').textContent;
        
        this.showMessage(`${productName} added to cart!`, 'success');
        
        // Here you would typically add the item to the cart
        // For demo purposes, we'll just show the message
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        // Save current cart state to localStorage
        const cartData = [];
        document.querySelectorAll('.cart-item').forEach(item => {
            const productId = item.dataset.productId;
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            const price = parseFloat(item.querySelector('.item-price').dataset.price);
            
            cartData.push({
                id: productId,
                quantity: quantity,
                price: price
            });
        });
        
        localStorage.setItem('cart', JSON.stringify(cartData));
    }

    removeFromStorage(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateDisplay() {
        // Update cart display based on stored data
        this.updateTotals();
    }

    initFormValidation() {
        // Bootstrap form validation
        const forms = document.querySelectorAll('.needs-validation');
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Cart();
});

/* Mobile menu handling moved to menu.js for consistency */

// Handle country selection
document.querySelectorAll('.country-item').forEach((country) => {
    country.addEventListener('click', (e) => {
        const radioInput = e.currentTarget.querySelector('input[type=radio]');
        const flagImg = e.currentTarget.querySelector('img');
        const openPopupImg = document.querySelector('#openPopup img');
        
        if (radioInput && radioInput.checked && flagImg && openPopupImg) {
            openPopupImg.src = flagImg.src;
        } else if (openPopupImg) {
            openPopupImg.src = 'https://flagcdn.com/gb.svg';
        }
    });
});

