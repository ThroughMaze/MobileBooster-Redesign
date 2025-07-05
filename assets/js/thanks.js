// Thanks page JavaScript - WooCommerce friendly
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize the thanks page
    initThanksPage();
    
    // Function to initialize the thanks page
    function initThanksPage() {
        // Get order data from URL parameters or localStorage
        const orderData = getOrderData();
        
        // Populate order details
        populateOrderDetails(orderData);
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize tracking functionality
        initTracking();
    }
    
    // Function to get order data from various sources
    function getOrderData() {
        // Try to get order data from URL parameters (WooCommerce style)
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order_id') || urlParams.get('order-received');
        
        // Try to get order data from localStorage (fallback)
        const storedOrderData = localStorage.getItem('orderData');
        
        // Default order data structure
        let orderData = {
            orderNumber: orderId || '#MB-2024-001234',
            orderDate: new Date().toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            paymentMethod: 'Credit Card ending in ****1234',
            orderStatus: 'Processing',
            shippingMethod: 'Standard Delivery (Free)',
            estimatedDelivery: getEstimatedDeliveryDate(),
            trackingNumber: 'Will be provided via email',
            items: [
                {
                    name: 'Mobile Signal Booster Pro',
                    quantity: 1,
                    price: 299.99,
                    image: 'assets/images/landing/Black1%201.png'
                },
                {
                    name: 'External Antenna Kit',
                    quantity: 2,
                    price: 89.99,
                    image: 'assets/images/landing/Black1%201.png'
                }
            ],
            subtotal: 0,
            shipping: 0,
            vat: 0,
            total: 0
        };
        
        // If we have stored order data, use it
        if (storedOrderData) {
            try {
                const parsedData = JSON.parse(storedOrderData);
                orderData = { ...orderData, ...parsedData };
            } catch (e) {
                console.warn('Failed to parse stored order data:', e);
            }
        }
        
        // Calculate totals
        calculateOrderTotals(orderData);
        
        return orderData;
    }
    
    // Function to calculate order totals
    function calculateOrderTotals(orderData) {
        orderData.subtotal = orderData.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        
        orderData.vat = orderData.subtotal * 0.2; // 20% VAT
        orderData.total = orderData.subtotal + orderData.vat;
    }
    
    // Function to get estimated delivery date
    function getEstimatedDeliveryDate() {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3); // 3 days from now
        
        return deliveryDate.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // Function to populate order details
    function populateOrderDetails(orderData) {
        // Populate order information
        document.getElementById('order-number').textContent = orderData.orderNumber;
        document.getElementById('order-date').textContent = orderData.orderDate;
        document.getElementById('payment-method').textContent = orderData.paymentMethod;
        document.getElementById('order-status').textContent = orderData.orderStatus;
        
        // Populate shipping information
        document.getElementById('shipping-method').textContent = orderData.shippingMethod;
        document.getElementById('estimated-delivery').textContent = orderData.estimatedDelivery;
        document.getElementById('tracking-number').textContent = orderData.trackingNumber;
        
        // Populate order items
        populateOrderItems(orderData.items);
        
        // Populate order summary
        document.getElementById('subtotal').textContent = `£${orderData.subtotal.toFixed(2)}`;
        document.getElementById('shipping-cost').textContent = 'Free';
        document.getElementById('vat-amount').textContent = `£${orderData.vat.toFixed(2)}`;
        document.getElementById('total-amount').textContent = `£${orderData.total.toFixed(2)}`;
    }
    
    // Function to populate order items
    function populateOrderItems(items) {
        const orderItemsContainer = document.getElementById('order-items');
        orderItemsContainer.innerHTML = '';
        
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <h4 class="order-item-title">${item.name}</h4>
                    <div class="order-item-meta">Quantity: ${item.quantity}</div>
                </div>
                <div class="order-item-price">£${(item.price * item.quantity).toFixed(2)}</div>
            `;
            orderItemsContainer.appendChild(itemElement);
        });
    }
    
    // Function to set up event listeners
    function setupEventListeners() {
        // Track order button
        const trackOrderBtn = document.getElementById('track-order-btn');
        if (trackOrderBtn) {
            trackOrderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleTrackOrder();
            });
        }
        
        // Continue shopping button
        const continueShoppingBtn = document.querySelector('.action-buttons .btn-primary');
        if (continueShoppingBtn) {
            continueShoppingBtn.addEventListener('click', function(e) {
                // Clear order data from localStorage when continuing shopping
                localStorage.removeItem('orderData');
            });
        }
        
        // Support option buttons
        const supportButtons = document.querySelectorAll('.support-option .btn');
        supportButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                handleSupportClick(this.textContent.trim());
            });
        });
    }
    
    // Function to handle track order click
    function handleTrackOrder() {
        const orderNumber = document.getElementById('order-number').textContent;
        
        // In a real implementation, this would redirect to a tracking page
        // For now, we'll show an alert
        alert(`Tracking information for order ${orderNumber} will be sent to your email address.`);
        
        // Alternative: redirect to tracking page
        // window.location.href = `/track-order?order=${orderNumber}`;
    }
    
    // Function to handle support option clicks
    function handleSupportClick(option) {
        switch(option) {
            case 'Contact Us':
                window.location.href = '/contact';
                break;
            case 'View Guide':
                window.location.href = '/installation-guide';
                break;
            case 'Learn More':
                window.location.href = '/returns-warranty';
                break;
            default:
                console.log('Support option clicked:', option);
        }
    }
    
    // Function to initialize tracking functionality
    function initTracking() {
        // Track page view for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: document.getElementById('order-number').textContent,
                value: parseFloat(document.getElementById('total-amount').textContent.replace('£', ''))
            });
        }
        
        // Track conversion for other analytics platforms
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
                value: parseFloat(document.getElementById('total-amount').textContent.replace('£', '')),
                currency: 'GBP'
            });
        }
    }
    
    // WooCommerce integration functions
    window.woocommerceThanks = {
        // Function to update order data (can be called from WooCommerce)
        updateOrderData: function(data) {
            localStorage.setItem('orderData', JSON.stringify(data));
            location.reload();
        },
        
        // Function to get current order data
        getCurrentOrderData: function() {
            return getOrderData();
        },
        
        // Function to clear order data
        clearOrderData: function() {
            localStorage.removeItem('orderData');
        }
    };
    
    // Handle WooCommerce order received page
    if (window.location.search.includes('order-received')) {
        // This is a WooCommerce order received page
        console.log('WooCommerce order received page detected');
        
        // You can add additional WooCommerce-specific functionality here
        // For example, waiting for WooCommerce to load and then updating the page
        if (typeof wc_order_received_params !== 'undefined') {
            // WooCommerce is available, you can access order data
            console.log('WooCommerce order data available');
        }
    }
    
    // Add success animation
    setTimeout(() => {
        const confirmationIcon = document.querySelector('.order-confirmation-icon');
        if (confirmationIcon) {
            confirmationIcon.style.animation = 'pulse 2s ease-in-out';
        }
    }, 500);
    
    // Add CSS animation for the confirmation icon
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        
        .order-confirmation-icon {
            animation: pulse 2s ease-in-out;
        }
    `;
    document.head.appendChild(style);
    
});

// Export functions for potential use in other modules
export function getOrderData() {
    // This function can be imported and used by other modules
    return JSON.parse(localStorage.getItem('orderData') || '{}');
}

export function updateOrderData(data) {
    localStorage.setItem('orderData', JSON.stringify(data));
} 