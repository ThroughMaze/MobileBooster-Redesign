document.addEventListener("DOMContentLoaded", () => {
    // Main mobile menu toggle functionality
    const menuToggle = document.querySelector('.navbar-toggler');
    const fullscreenNav = document.querySelector(".fullscreen-nav");
    const menuIcon = document.querySelector("#menu");

    // Disable Bootstrap's default collapse behavior
    if (menuToggle) {
        menuToggle.removeAttribute('data-bs-toggle');
        menuToggle.removeAttribute('data-bs-target');
        menuToggle.removeAttribute('aria-controls');
        menuToggle.removeAttribute('aria-expanded');
    }

    if (menuToggle && fullscreenNav) {
        menuToggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Menu button clicked'); // Debug log
            
            // Toggle classes
            const isActive = menuToggle.classList.contains("active");
            
            if (isActive) {
                // Close menu
                menuToggle.classList.remove("active");
                fullscreenNav.classList.remove("active");
                if (menuIcon) {
                    menuIcon.classList.remove("active");
                }
                document.body.style.overflow = "";
                console.log('Menu closed'); // Debug log
            } else {
                // Open menu
                menuToggle.classList.add("active");
                fullscreenNav.classList.add("active");
                if (menuIcon) {
                    menuIcon.classList.add("active");
                }
                document.body.style.overflow = "hidden";
                console.log('Menu opened'); // Debug log
            }
        });
    } else {
        console.log('Menu elements not found:', { 
            menuToggle: !!menuToggle, 
            fullscreenNav: !!fullscreenNav 
        }); // Debug log
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

    // Close mobile menu when clicking outside or on menu item
    document.addEventListener('click', (e) => {
        if (fullscreenNav && fullscreenNav.classList.contains('active')) {
            // Close menu if clicking outside or on a non-dropdown link
            if (!fullscreenNav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            } else if (e.target.matches('.nav-link:not(.dropdown-toggle)')) {
                // Close menu when clicking on regular nav links
                closeMenu();
            }
        }
    });
    
    // Function to close the mobile menu
    function closeMenu() {
        if (menuToggle && fullscreenNav && menuIcon) {
            menuToggle.classList.remove('active');
            fullscreenNav.classList.remove('active');
            menuIcon.classList.remove('active');
            document.body.style.overflow = "";
        }
    }
    
    // Close menu on window resize to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 992) {
            closeMenu();
        }
    });
}); 