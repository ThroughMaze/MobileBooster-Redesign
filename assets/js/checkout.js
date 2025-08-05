import "bootstrap/dist/js/bootstrap.min.js";

// Checkout functionality
class Checkout {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateOrderSummary();
        this.initFormValidation();
        this.initPaymentMethods();
    }

    bindEvents() {
        // Shipping address toggle
        const shipToDifferent = document.getElementById('ship_to_different_address');
        if (shipToDifferent) {
            shipToDifferent.addEventListener('change', (e) => this.toggleShippingAddress(e));
        }

        // Payment method changes
        document.querySelectorAll('input[name="payment_method"]').forEach(radio => {
            radio.addEventListener('change', (e) => this.togglePaymentFields(e));
        });

        // Form submission
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Card number formatting
        const cardNumber = document.getElementById('card_number');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => this.formatCardNumber(e));
        }

        // Expiry date formatting
        const cardExpiry = document.getElementById('card_expiry');
        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => this.formatExpiryDate(e));
        }

        // CVC formatting
        const cardCvc = document.getElementById('card_cvc');
        if (cardCvc) {
            cardCvc.addEventListener('input', (e) => this.formatCvc(e));
        }

        // Auto-fill shipping from billing
        this.setupAddressAutofill();
    }

    toggleShippingAddress(e) {
        const shippingFields = document.getElementById('shipping-fields');
        const shippingInputs = shippingFields.querySelectorAll('input, select');
        
        if (e.target.checked) {
            shippingFields.classList.remove('d-none');
            // Make shipping fields required
            shippingInputs.forEach(input => {
                if (input.name.includes('first_name') || 
                    input.name.includes('last_name') || 
                    input.name.includes('address_1') || 
                    input.name.includes('city') || 
                    input.name.includes('postcode') || 
                    input.name.includes('country')) {
                    input.required = true;
                }
            });
        } else {
            shippingFields.classList.add('d-none');
            // Remove required attribute
            shippingInputs.forEach(input => {
                input.required = false;
            });
        }
    }

    updateOrderTotal() {
        const subtotalElement = document.querySelector('.subtotal');
        const vatElement = document.querySelector('.vat');
        const shippingElement = document.querySelector('.shipping-cost');
        const totalElement = document.querySelector('.total');

        if (!subtotalElement || !vatElement || !shippingElement || !totalElement) return;

        const subtotal = parseFloat(subtotalElement.textContent.replace('£', ''));
        const shippingCost = 0; // Free shipping
        
        const vat = subtotal * 0.2;
        const total = subtotal + shippingCost + vat;

        vatElement.textContent = `£${vat.toFixed(2)}`;
        totalElement.textContent = `£${total.toFixed(2)}`;
    }

    togglePaymentFields(e) {
        const cardDetails = document.getElementById('card-details');
        const cardInputs = cardDetails.querySelectorAll('input');
        
        if (e.target.value === 'stripe') {
            cardDetails.style.display = 'block';
            cardInputs.forEach(input => input.required = true);
        } else {
            cardDetails.style.display = 'none';
            cardInputs.forEach(input => input.required = false);
        }
    }

    formatCardNumber(e) {
        let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        
        if (formattedValue.length > 19) {
            formattedValue = formattedValue.substring(0, 19);
        }
        
        e.target.value = formattedValue;
    }

    formatExpiryDate(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        
        e.target.value = value;
    }

    formatCvc(e) {
        let value = e.target.value.replace(/\D/g, '');
        e.target.value = value.substring(0, 4);
    }

    setupAddressAutofill() {
        const billingInputs = [
            'billing_first_name', 'billing_last_name', 'billing_company',
            'billing_address_1', 'billing_address_2', 'billing_city',
            'billing_state', 'billing_postcode', 'billing_country'
        ];

        billingInputs.forEach(fieldName => {
            const billingField = document.getElementById(fieldName);
            if (billingField) {
                billingField.addEventListener('blur', () => this.autofillShipping());
            }
        });
    }

    autofillShipping() {
        const shipToDifferent = document.getElementById('ship_to_different_address');
        if (shipToDifferent && shipToDifferent.checked) return;

        const fieldMappings = {
            'billing_first_name': 'shipping_first_name',
            'billing_last_name': 'shipping_last_name',
            'billing_company': 'shipping_company',
            'billing_address_1': 'shipping_address_1',
            'billing_address_2': 'shipping_address_2',
            'billing_city': 'shipping_city',
            'billing_state': 'shipping_state',
            'billing_postcode': 'shipping_postcode',
            'billing_country': 'shipping_country'
        };

        Object.entries(fieldMappings).forEach(([billingField, shippingField]) => {
            const billing = document.getElementById(billingField);
            const shipping = document.getElementById(shippingField);
            
            if (billing && shipping) {
                shipping.value = billing.value;
            }
        });
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('place-order-btn');
        const spinner = submitBtn.querySelector('.spinner-border');
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';

        try {
            // Simulate API call
            await this.processOrder(new FormData(form));
            
            // Success - redirect to thank you page
            this.showSuccessMessage();
            setTimeout(() => {
                window.location.href = '/order-confirmation.html';
            }, 2000);
            
        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            spinner.classList.add('d-none');
            submitBtn.innerHTML = 'Place Order';
        }
    }

    async processOrder(formData) {
        // Simulate API processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
            return { success: true, orderId: 'ORD-' + Date.now() };
        } else {
            throw new Error('Payment processing failed. Please try again.');
        }
    }

    showSuccessMessage() {
        this.showMessage('Order placed successfully! Redirecting...', 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    updateOrderSummary() {
        // Load cart data and update order summary
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            const items = JSON.parse(cartData);
            // Update order items display based on cart data
            this.displayOrderItems(items);
        }
        
        this.updateOrderTotal();
    }

    displayOrderItems(items) {
        // This would typically populate the order items from cart data
        // For now, we'll use the static items in the HTML
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

        // Custom validation for card fields
        this.initCardValidation();
    }

    initCardValidation() {
        const cardNumber = document.getElementById('card_number');
        const cardExpiry = document.getElementById('card_expiry');
        const cardCvc = document.getElementById('card_cvc');

        if (cardNumber) {
            cardNumber.addEventListener('blur', () => this.validateCardNumber(cardNumber));
        }

        if (cardExpiry) {
            cardExpiry.addEventListener('blur', () => this.validateExpiryDate(cardExpiry));
        }

        if (cardCvc) {
            cardCvc.addEventListener('blur', () => this.validateCvc(cardCvc));
        }
    }

    validateCardNumber(input) {
        const value = input.value.replace(/\s/g, '');
        const isValid = /^[0-9]{13,19}$/.test(value) && this.luhnCheck(value);
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
        
        return isValid;
    }

    validateExpiryDate(input) {
        const value = input.value;
        const [month, year] = value.split('/');
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;
        
        const isValid = /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value) &&
                       (parseInt(year) > currentYear || 
                        (parseInt(year) === currentYear && parseInt(month) >= currentMonth));
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
        
        return isValid;
    }

    validateCvc(input) {
        const value = input.value;
        const isValid = /^[0-9]{3,4}$/.test(value);
        
        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
        }
        
        return isValid;
    }

    luhnCheck(cardNumber) {
        let sum = 0;
        let isEven = false;
        
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i));
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    initPaymentMethods() {
        // Initialize payment method display
        const stripeRadio = document.getElementById('stripe');
        if (stripeRadio && stripeRadio.checked) {
            this.togglePaymentFields({ target: stripeRadio });
        }
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Checkout();
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

