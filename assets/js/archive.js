import "bootstrap/dist/js/bootstrap.min.js";

// Archive functionality
class BlogArchive {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.articlesPerPage = 9;
        this.currentPage = 1;
        this.init();
    }

    init() {
        this.loadArticles();
        this.bindEvents();
        this.initFormValidation();
    }

    loadArticles() {
        // Get all article elements
        const articleElements = document.querySelectorAll('.article-card');
        this.articles = Array.from(articleElements).map((element, index) => ({
            id: index + 1,
            element: element,
            category: element.closest('[data-category]')?.dataset.category || 'all',
            title: element.querySelector('.article-title a')?.textContent || '',
            excerpt: element.querySelector('.article-excerpt')?.textContent || '',
            date: element.querySelector('.article-meta span')?.textContent || '',
            readTime: element.querySelector('.article-meta span:last-child')?.textContent || ''
        }));
        
        this.filteredArticles = [...this.articles];
        this.updateDisplay();
    }

    bindEvents() {
        // Category filter buttons
        document.querySelectorAll('.category-tabs button').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByCategory(e));
        });

        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
        }

        // Category dropdown
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.handleCategoryFilter(e));
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreArticles());
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmission(e));
        }
    }

    filterByCategory(e) {
        const category = e.target.dataset.category;
        this.currentCategory = category;
        this.currentPage = 1;

        // Update active button
        document.querySelectorAll('.category-tabs button').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');

        this.applyFilters();
    }

    handleSearch(e) {
        this.searchTerm = e.target.value.toLowerCase();
        this.currentPage = 1;
        this.applyFilters();
    }

    handleCategoryFilter(e) {
        this.currentCategory = e.target.value || 'all';
        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredArticles = this.articles.filter(article => {
            const matchesCategory = this.currentCategory === 'all' || article.category === this.currentCategory;
            const matchesSearch = this.searchTerm === '' || 
                                article.title.toLowerCase().includes(this.searchTerm) ||
                                article.excerpt.toLowerCase().includes(this.searchTerm);
            
            return matchesCategory && matchesSearch;
        });

        this.updateDisplay();
    }

    updateDisplay() {
        const container = document.getElementById('articles-container');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        // Hide all articles first
        this.articles.forEach(article => {
            article.element.closest('.col-lg-4').style.display = 'none';
        });

        // Show filtered articles for current page
        const startIndex = 0;
        const endIndex = this.currentPage * this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);

        articlesToShow.forEach(article => {
            article.element.closest('.col-lg-4').style.display = 'block';
        });

        // Update load more button
        if (loadMoreBtn) {
            if (endIndex >= this.filteredArticles.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.textContent = `Load More Articles (${this.filteredArticles.length - endIndex} remaining)`;
            }
        }

        // Show no results message if needed
        this.showNoResultsMessage(articlesToShow.length === 0);
    }

    loadMoreArticles() {
        this.currentPage++;
        this.updateDisplay();
    }

    showNoResultsMessage(show) {
        let noResultsMsg = document.getElementById('no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-message';
            noResultsMsg.className = 'col-12 text-center py-5';
            noResultsMsg.innerHTML = `
                <div class="no-results">
                    <h3 class="text-muted mb-3">No articles found</h3>
                    <p class="text-muted">Try adjusting your search terms or browse all categories.</p>
                    <button class="btn btn-primary" onclick="this.clearFilters()">Clear Filters</button>
                </div>
            `;
            document.getElementById('articles-container').appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    clearFilters() {
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.currentPage = 1;
        
        // Reset UI
        document.getElementById('search-input').value = '';
        document.getElementById('category-filter').value = '';
        document.querySelectorAll('.category-tabs button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.category-tabs button[data-category="all"]').classList.add('active');
        
        this.applyFilters();
    }

    async handleNewsletterSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showSuccessMessage('Successfully subscribed to our newsletter!');
            form.reset();
            form.classList.remove('was-validated');
            
        } catch (error) {
            this.showErrorMessage('Failed to subscribe. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
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

// Initialize archive when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const archive = new BlogArchive();
    
    // Make clearFilters available globally
    window.clearFilters = () => archive.clearFilters();
});

// Handle mobile menu
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('[data-bs-toggle="collapse"]');
    const fullscreenNav = document.querySelector(".fullscreen-nav");

    if (menuToggle && fullscreenNav) {
        menuToggle.addEventListener("click", () => {
            menuToggle.classList.toggle("active");
            fullscreenNav.classList.toggle("active");
        });
    }
});

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

// Newsletter subscription
document.querySelector('.subscribe-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) {
        e.currentTarget.classList.add('subscribed');
    }
});