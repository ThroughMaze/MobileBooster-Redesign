import "bootstrap/dist/js/bootstrap.min.js";

// Lightweight product image lightbox (vanilla JS)
document.addEventListener("DOMContentLoaded", () => {
    const featuredLink = document.querySelector('.featured-img');
    const thumbnailAnchors = Array.from(document.querySelectorAll('.product-images-slider a'));

    if (!featuredLink || thumbnailAnchors.length === 0) return;

    // Build unique gallery by href
    const hrefSet = new Set();
    const gallery = [];
    thumbnailAnchors.forEach(a => {
        if (!hrefSet.has(a.href)) {
            hrefSet.add(a.href);
            gallery.push({ href: a.href, thumb: a.querySelector('img')?.src || a.href });
        }
    });
    if (!hrefSet.has(featuredLink.href)) {
        hrefSet.add(featuredLink.href);
        gallery.unshift({ href: featuredLink.href, thumb: featuredLink.querySelector('img')?.src || featuredLink.href });
    }

    // Create lightbox DOM
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Product image viewer');

    overlay.innerHTML = `
        <div class="lightbox-dialog">
            <div class="lightbox-header">
                <button class="lightbox-close" type="button" aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="lightbox-content">
                <img class="lightbox-image" alt="Product image" />
                <div class="lightbox-nav">
                    <button class="lightbox-arrow lightbox-prev" type="button" aria-label="Previous image">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 6L9 12L15 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="lightbox-arrow lightbox-next" type="button" aria-label="Next image">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6L15 12L9 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const imgEl = overlay.querySelector('.lightbox-image');
    const btnClose = overlay.querySelector('.lightbox-close');
    const btnPrev = overlay.querySelector('.lightbox-prev');
    const btnNext = overlay.querySelector('.lightbox-next');
    const dialog = overlay.querySelector('.lightbox-dialog');

    let currentIndex = 0;
    let keyHandlerBound = null;
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 50;

    function setImage(index) {
        const boundedIndex = (index + gallery.length) % gallery.length;
        currentIndex = boundedIndex;
        imgEl.src = gallery[boundedIndex].href;
    }

    function openAt(index) {
        setImage(index);
        overlay.classList.add('active');
        document.documentElement.style.overflow = 'hidden';
        keyHandlerBound = onKeyDown;
        document.addEventListener('keydown', keyHandlerBound);
    }

    function close() {
        overlay.classList.remove('active');
        document.documentElement.style.overflow = '';
        if (keyHandlerBound) {
            document.removeEventListener('keydown', keyHandlerBound);
            keyHandlerBound = null;
        }
    }

    function next() { setImage(currentIndex + 1); }
    function prev() { setImage(currentIndex - 1); }

    function onKeyDown(e) {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
    }

    // Overlay interactions
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    dialog.addEventListener('click', (e) => e.stopPropagation());
    btnClose.addEventListener('click', close);
    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);

    // Touch swipe support
    imgEl.addEventListener('touchstart', (e) => {
        const t = e.changedTouches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
    }, { passive: true });

    imgEl.addEventListener('touchend', (e) => {
        const t = e.changedTouches[0];
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
            if (dx < 0) next();
            else prev();
        }
    });

    // Wire featured image
    featuredLink.addEventListener('click', (e) => {
        e.preventDefault();
        const idx = gallery.findIndex(g => g.href === featuredLink.href);
        openAt(idx >= 0 ? idx : 0);
    });

    // Wire thumbnails (works alongside existing swap handler)
    thumbnailAnchors.forEach((a, i) => {
        a.addEventListener('click', () => {
            const idx = gallery.findIndex(g => g.href === a.href);
            openAt(idx >= 0 ? idx : i);
        });
    });
});

// Product options click handler
document.addEventListener("DOMContentLoaded", () => {
    const productOptionsRadioHolders = document.querySelectorAll('.product-options-radios-holder li');
    
    productOptionsRadioHolders.forEach(li => {
        li.addEventListener('click', (event) => {
                handlePriceUpdate();
        });
    });
       // Cart state management
       let cartItems = new Map();
       let cartTotal = 0;
       
       // Product Image Gallery Functionality
       const featuredImg = document.querySelector('.featured-img img');
       const featuredLink = document.querySelector('.featured-img');
       const thumbnailImages = document.querySelectorAll('.product-images-slider a');
   
       if (featuredImg && thumbnailImages.length > 0) {
           thumbnailImages.forEach((thumbnail, index) => {
               thumbnail.addEventListener('click', (e) => {
                   e.preventDefault();
                   
                   // Get the thumbnail image source and high-res version
                   const thumbnailImg = thumbnail.querySelector('img');
                   const newSrc = thumbnailImg.src;
                   const newHiResSrc = thumbnail.href;
                   
                   // Update the featured image
                   featuredImg.src = newSrc;
                   featuredLink.href = newHiResSrc;
                   
                   // Remove active class from all thumbnails and add to current
                   thumbnailImages.forEach(thumb => thumb.classList.remove('active'));
                   thumbnail.classList.add('active');
               });
           });
   
           // Set first thumbnail as active by default
           if (thumbnailImages[0]) {
               thumbnailImages[0].classList.add('active');
           }
       }
   
       // Cart functionality for suggested products
       const addToCartButtons = document.querySelectorAll('.suggested-booster-wrapper .btn-add-cart');
       const stickyCart = document.getElementById('sticky-add-to-cart');
       const stickyCartCount = document.querySelector('.sticky-cart-count');
       const stickyCartBtn = document.getElementById('sticky-cart-btn');
   
       addToCartButtons.forEach(button => {
           button.addEventListener('click', (e) => {
               e.preventDefault();
               e.stopPropagation();
               
               const productId = button.dataset.productId;
               const productName = button.dataset.productName;
               const productRadio = button.querySelector('input[type="radio"]');
               const productPrice = parseFloat(button.dataset.productPrice);
               
               if (cartItems.has(productId)) {
                   // Remove from cart
                   cartItems.delete(productId);
                   cartTotal -= productPrice;
                   button.classList.remove('added');
                   button.querySelector('.btn-text').textContent = 'Add to cart';
                   productRadio.checked = false;
               } else {
                   // Add to cart
                   cartItems.set(productId, {
                       name: productName,
                       price: productPrice
                   });
                   cartTotal += productPrice;
                   button.classList.add('added');
                   button.querySelector('.btn-text').textContent = 'Remove';
                   productRadio.checked = true;
               }
               
               handlePriceUpdate();
               updateStickyCart();
           });
       });
   
       // Update sticky cart display
       function updateStickyCart() {
           if (cartItems.size > 0) {
               stickyCartCount.textContent = cartItems.size;
               stickyCart.classList.remove('d-none');
               setTimeout(() => {
                   stickyCart.classList.add('visible');
               }, 100);
           } else {
               stickyCart.classList.remove('visible');
               setTimeout(() => {
                   stickyCart.classList.add('d-none');
               }, 300);
           }
       }
   
       // Product accordion functionality
       const productHighlightBtn = document.querySelector('.product-highlight-btn');
       const productHighlight = document.getElementById('product-highlight');
       const fullContent = document.getElementById('full-content');
       const lessContent = document.getElementById('less-content');
   
       if (productHighlightBtn && productHighlight) {
           let isExpanded = false;
           productHighlightBtn.addEventListener('click', (e) => {
               e.preventDefault();
               if (isExpanded) {
                   // Collapse
                   productHighlight.classList.remove('show');
                   fullContent.style.display = 'inline';
                   lessContent.style.display = 'none';
                   isExpanded = false;
               } else {
                   // Expand
                   productHighlight.classList.add('show');
                   fullContent.style.display = 'none';
                   lessContent.style.display = 'inline';
                   isExpanded = true;
               }
           });
       }
});

// Function to handle price updates (customize as needed)
function handlePriceUpdate() {
    const radioInputs = document.querySelectorAll('input[type="radio"][name*="upgrades_select"]');
    let totalUpgradePrice = 0;
    if (radioInputs) {
        radioInputs.forEach(radio => {
            if (radio.checked) {
                const price = radio.getAttribute('data-price');
                if (price) {
                    totalUpgradePrice += parseFloat(price);
                }
            }
        });
    }
    const boosterUpgrades = document.querySelectorAll('.btn-add-cart.added');
    if (boosterUpgrades) {
        boosterUpgrades.forEach(boosterUpgrade => {
            const price = boosterUpgrade.getAttribute('data-price');
            if (price) {
                totalUpgradePrice += parseFloat(price);
            }
        });
    }
    const price = totalUpgradePrice.toString();
    // Example: Update the main product price display
    const productPriceElement = document.querySelector('#product-price');
    const productPriceStickyElement = document.querySelector('#product-price-sticky');
    const currency = productPriceElement.dataset.currency;
    
    if (productPriceElement && price && currency) {
        // You can customize this logic based on your needs
        // For example, add the option price to base price
        console.log(`Price updated: ${currency}${price}`);
        let newPrice = parseFloat(productPriceElement.dataset.price) + parseFloat(price);
        productPriceElement.textContent = `${currency}${newPrice}`;
        productPriceStickyElement.textContent = `${currency}${newPrice}`;
    }
}
