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
