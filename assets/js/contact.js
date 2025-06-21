import "../../node_modules/bootstrap/dist/js/bootstrap.min.js";

// Contact form functionality
class ContactForm {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initFormValidation();
    }

    bindEvents() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Newsletter form
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmission(e));
        }
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = document.getElementById('submit-btn');
        const spinner = submitBtn.querySelector('.spinner-border');
        
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

        try {
            // Simulate API call
            await this.submitContactForm(new FormData(form));
            
            // Success
            this.showSuccessMessage('Thank you for your message! We\'ll get back to you within 2 hours.');
            form.reset();
            form.classList.remove('was-validated');
            
        } catch (error) {
            this.showErrorMessage('Sorry, there was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            spinner.classList.add('d-none');
            submitBtn.innerHTML = 'Send Message';
        }
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

    async submitContactForm(formData) {
        // Simulate API processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
            return { success: true };
        } else {
            throw new Error('Submission failed');
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

// Live chat functionality
function openLiveChat() {
    // In a real implementation, this would open a live chat widget
    alert('Live chat feature would open here. For now, please use our contact form or call us directly.');
}

// Make openLiveChat available globally
window.openLiveChat = openLiveChat;

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
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