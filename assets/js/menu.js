document.addEventListener("DOMContentLoaded", () => {
    // Main mobile menu toggle functionality
    const menuToggle = document.querySelector('[data-bs-toggle="collapse"]');
    const fullscreenNav = document.querySelector(".fullscreen-nav");

    if (menuToggle && fullscreenNav) {
        menuToggle.addEventListener("click", (e) => {
            e.preventDefault();
            menuToggle.classList.toggle("active");
            fullscreenNav.classList.toggle("active");
            
            // Toggle the hamburger menu animation
            const menuIcon = document.querySelector("#menu");
            if (menuIcon) {
                menuIcon.classList.toggle("active");
            }
        });
    }

    // Mobile menu dropdown functionality
    const mobileDropdownToggles = document.querySelectorAll('.fullscreen-nav .dropdown-toggle');
    
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            const navItem = toggle.closest('.nav-item');
            const innerList = navItem.querySelector('.inner-list');
            
            if (navItem && innerList) {
                // Close other open dropdowns
                mobileDropdownToggles.forEach(otherToggle => {
                    const otherNavItem = otherToggle.closest('.nav-item');
                    if (otherNavItem !== navItem) {
                        otherNavItem.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                navItem.classList.toggle('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (fullscreenNav && fullscreenNav.classList.contains('active')) {
            if (!fullscreenNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                fullscreenNav.classList.remove('active');
                const menuIcon = document.querySelector("#menu");
                if (menuIcon) {
                    menuIcon.classList.remove('active');
                }
            }
        }
    });
}); 