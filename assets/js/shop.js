import "bootstrap/dist/js/bootstrap.min.js";

// Shop functionality
class Shop {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.filters = {
            coverage: '',
            signal: '',
            price: '',
            search: '',
            carrier: ''
        };
        this.sortBy = 'featured';
        this.init();
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);
        this.filters.coverage = urlParams.get('coverage') == 'undefined' ? '' : urlParams.get('coverage');
        this.filters.signal = urlParams.get('signal') == 'undefined' ? '' : urlParams.get('signal');
        this.filters.carrier = urlParams.get('carrier') == 'undefined' ? '' : urlParams.get('carrier');
        //this.loadProducts();
        this.bindEvents();
        //this.initFormValidation();
        //this.initTooltips();
    }

    loadProducts() {
        // Get all product elements
        const productElements = document.querySelectorAll('.product-card');
        this.products = Array.from(productElements).map((element, index) => {
            const parentCol = element.closest('[data-coverage]') || element;
            return {
                id: index + 1,
                element: element,
                coverage: parentCol.dataset.coverage || '',
                signal: parentCol.dataset.signal || '',
                price: parseFloat(parentCol.dataset.price || '0'),
                title: element.querySelector('.product-title a')?.textContent || '',
                description: element.querySelector('.product-description')?.textContent || ''
            };
        });
        
        this.filteredProducts = [...this.products];
        this.updateDisplay();
    }

    bindEvents() {
        // Filter controls
        document.getElementById('coverage-filter')?.addEventListener('change', (e) => {
            this.filters.coverage = e.target.value;
            this.applyFilters();
        });

        document.getElementById('signal-filter')?.addEventListener('change', (e) => {
            this.filters.signal = e.target.value;
            this.applyFilters();
        });

        document.getElementById('carrier-filter')?.addEventListener('change', (e) => {
            this.filters.carrier = e.target.value;
            this.applyFilters();
        });

        document.getElementById('price-filter')?.addEventListener('change', (e) => {
            this.filters.price = e.target.value;
            this.applyFilters();
        });

        document.getElementById('product-search')?.addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        document.getElementById('sort-filter')?.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });

        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => this.addToCart(e));
        });

        // Load more button
        document.getElementById('load-more-products')?.addEventListener('click', () => {
            this.loadMoreProducts();
        });

        // Quick view buttons
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.quickView(e);
            });
        });

        // Category navigation
        document.querySelectorAll('.category-nav ul li a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(e);
            });
        });
    }

    applyFilters() {
        this.filters.coverage = this.filters.coverage == 'null' ? '' : this.filters.coverage;
        this.filters.signal = this.filters.signal == 'null' ? '' : this.filters.signal;
        this.filters.carrier = this.filters.carrier == 'null' ? '' : this.filters.carrier;
        window.location.href = window.location.href.split('?')[0] + '?coverage=' + this.filters.coverage + '&signal=' + this.filters.signal+'&carrier=' + this.filters.carrier;
        return;

        // Filter products
        this.filteredProducts = this.products.filter(product => {
            // Coverage filter
            if (this.filters.coverage && product.coverage !== this.filters.coverage) {
                return false;
            }

            // Signal filter
            if (this.filters.signal && product.signal !== this.filters.signal) {
                return false;
            }

            // Price filter
            if (this.filters.price) {
                const [min, max] = this.getPriceRange(this.filters.price);
                if (product.price < min || (max && product.price > max)) {
                    return false;
                }
            }

            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search;
                if (!product.title.toLowerCase().includes(searchTerm) &&
                    !product.description.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting
        this.sortProducts();
        this.updateDisplay();
    }

    getPriceRange(priceFilter) {
        switch (priceFilter) {
            case '0-200': return [0, 200];
            case '200-400': return [200, 400];
            case '400-600': return [400, 600];
            case '600+': return [600, null];
            default: return [0, null];
        }
    }

    sortProducts() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // For demo purposes, reverse order
                this.filteredProducts.reverse();
                break;
            case 'featured':
            default:
                // Keep original order for featured
                break;
        }
    }

    updateDisplay() {
        const container = document.getElementById('products-container');
        
        // Hide all products first
        this.products.forEach(product => {
            product.element.style.display = 'none';
        });

        // Show filtered products
        this.filteredProducts.forEach(product => {
            product.element.style.display = 'block';
        });

        // Show no results message if needed
        this.showNoResultsMessage(this.filteredProducts.length === 0);
        
        // Update results count
        this.updateResultsCount();
    }

    showNoResultsMessage(show) {
        let noResultsMsg = document.getElementById('no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-message';
            noResultsMsg.className = 'text-center py-5';
            noResultsMsg.innerHTML = `
                <div class="no-results">
                    <h3 class="text-muted mb-3">No products found</h3>
                    <p class="text-muted">Try adjusting your filters or search terms.</p>
                    <button class="btn btn-primary" onclick="window.shop.clearFilters()">Clear All Filters</button>
                </div>
            `;
            document.getElementById('products-container').appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    updateResultsCount() {
        let resultsCount = document.getElementById('results-count');
        if (!resultsCount) {
            resultsCount = document.createElement('div');
            resultsCount.id = 'results-count';
            resultsCount.className = 'text-muted mb-4';
            const productsHeading = document.querySelector('#products h2');
            if (productsHeading) {
                productsHeading.insertAdjacentElement('afterend', resultsCount);
            }
        }
        
        resultsCount.textContent = `Showing ${this.filteredProducts.length} of ${this.products.length} products`;
    }

    clearFilters() {
        this.filters = {
            coverage: '',
            signal: '',
            price: '',
            search: ''
        };
        this.sortBy = 'featured';
        
        // Reset form controls
        document.getElementById('coverage-filter').value = '';
        document.getElementById('signal-filter').value = '';
        document.getElementById('price-filter').value = '';
        document.getElementById('product-search').value = '';
        document.getElementById('sort-filter').value = 'featured';
        
        this.applyFilters();
    }

    filterByCategory(e) {
        const category = e.target.textContent.toLowerCase().split(' ')[0];
        
        // Reset other filters
        this.clearFilters();
        
        // Apply category filter
        if (category === 'all') {
            // Do nothing, all products are already shown
        } else if (category === 'home') {
            this.filters.coverage = 'small';
        } else if (category === 'office') {
            this.filters.coverage = 'medium';
        } else if (category === 'industrial') {
            this.filters.coverage = 'xlarge';
        } else if (category === 'vehicle') {
            // This would need a vehicle category in the data
        } else if (category === 'antennas') {
            // This would need an antennas category in the data
        } else if (category === 'accessories') {
            // This would need an accessories category in the data
        }
        
        this.applyFilters();
        
        // Highlight active category
        document.querySelectorAll('.category-nav ul li a').forEach(link => {
            link.classList.remove('text-primary', 'fw-bold');
        });
        e.target.classList.add('text-primary', 'fw-bold');
    }

    addToCart(e) {
        const productId = e.target.dataset.productId;
        const productCard = e.target.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title a').textContent;
        
        // Add visual feedback
        const originalText = e.target.textContent;
        e.target.textContent = 'Added!';
        e.target.classList.add('btn-success');
        e.target.classList.remove('btn-primary');
        
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.classList.remove('btn-success');
            e.target.classList.add('btn-primary');
        }, 1500);

        // Show success message
        this.showMessage(`${productTitle} added to cart!`, 'success');
        
        // Update cart count (if you have a cart counter)
        this.updateCartCount();
    }

    quickView(e) {
        const productCard = e.target.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title a').textContent;
        
        // In a real implementation, this would open a modal with product details
        // For now, we'll just show a message and redirect to the product page
        this.showMessage(`Quick view for ${productTitle}`, 'info');
        
        // Prevent immediate redirect to allow the message to be seen
        setTimeout(() => {
            window.location.href = 'product.html';
        }, 1000);
    }

    updateCartCount() {
        // This would typically update a cart counter in the header
        // For now, we'll just simulate it
        const cartCount = parseInt(localStorage.getItem('cartCount') || '0') + 1;
        localStorage.setItem('cartCount', cartCount.toString());
    }

    loadMoreProducts() {
        return;
        // This would typically load more products from an API
        this.showMessage('All products are currently displayed.', 'info');
    }

    showMessage(message, type) {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'success' ? 'success' : type === 'info' ? 'info' : 'danger'} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
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

    initTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shop = new Shop();
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

