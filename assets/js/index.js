import "bootstrap/dist/js/bootstrap.min.js";
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()


// Main mobile menu toggle functionality
function handleMenu(e) {
    console.log('handleMenu called'); // Debug log
    e.preventDefault();
    e.stopPropagation();
    
    const menuButton = e.currentTarget;
    const navbarToggler = menuButton.closest('[data-bs-toggle="collapse"]');
    const fullscreenNav = document.querySelector(".fullscreen-nav");
    
    console.log('menuButton:', menuButton); // Debug log
    console.log('navbarToggler:', navbarToggler); // Debug log
    console.log('fullscreenNav:', fullscreenNav); // Debug log
    
    if (navbarToggler && fullscreenNav) {
        navbarToggler.classList.toggle("active");
        fullscreenNav.classList.toggle("active");
        menuButton.classList.toggle("active");
        
        console.log('Menu toggled. Active classes:', {
            navbarToggler: navbarToggler.classList.contains('active'),
            fullscreenNav: fullscreenNav.classList.contains('active'),
            menuButton: menuButton.classList.contains('active')
        }); // Debug log
    }
}

// Mobile menu dropdown functionality
function handleMenuList(e) {
    e.preventDefault();
    
    const navItem = e.currentTarget.closest('.nav-item');
    const innerList = navItem.querySelector('.inner-list');
    
    if (navItem && innerList) {
        // Close other open dropdowns
        const mobileDropdownToggles = document.querySelectorAll('.fullscreen-nav .dropdown-toggle');
        mobileDropdownToggles.forEach(otherToggle => {
            const otherNavItem = otherToggle.closest('.nav-item');
            if (otherNavItem !== navItem) {
                otherNavItem.classList.remove('active');
            }
        });
        
        // Toggle current dropdown
        navItem.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
function handleOutsideClick(e) {
    const fullscreenNav = document.querySelector(".fullscreen-nav");
    const navbarToggler = document.querySelector('[data-bs-toggle="collapse"]');
    
    if (fullscreenNav && fullscreenNav.classList.contains('active')) {
        if (!fullscreenNav.contains(e.target) && !navbarToggler.contains(e.target)) {
            navbarToggler.classList.remove('active');
            fullscreenNav.classList.remove('active');
            const menuIcon = document.querySelector("#menu");
            if (menuIcon) {
                menuIcon.classList.remove('active');
            }
        }
    }
}

let booster = {
    providers: [],
    signals: [],
    otherSignals: [], //uniquenotwifi
    datefreq: [],
    range: [],
}

function checker(arr, target) {
// Check if all values exist in any list
    const allValuesExist = arr.some(item =>
        target.every(value => item.list.includes(Number(value)))
    );
    return allValuesExist;
}

let currentPage = 1;

async function handleQuizSelection(e) {
    // Select all providers btn
    if (e.currentTarget.getAttribute('data-type') == 'all_networks' && !e.currentTarget.classList.contains('selected')) {
        e.currentTarget.parentNode.querySelectorAll('.booster-quiz-card').forEach((card) => {
            card.classList.add('selected');
            if (card.getAttribute('data-term-id') == 'data') {
                card.classList.remove('selected');
            }
        });
    } else if (e.currentTarget.getAttribute('data-type') == 'all_networks' && e.currentTarget.classList.contains('selected')) {
        e.currentTarget.parentNode.querySelectorAll('.booster-quiz-card').forEach((card) => {
            card.classList.remove('selected');
        });
    }
    // Select only one card in range cards
    else if (e.currentTarget.getAttribute('data-term') == 'range') {
        document.querySelectorAll('[data-term="range"]').forEach((range) => {
            range.classList.remove('selected')
        })
        e.currentTarget.classList.add('selected');
    }
    // Card selection
    else {
        e.currentTarget.classList.toggle('selected');
    }
    let term = e.currentTarget.getAttribute('data-term');
    let id = e.currentTarget.getAttribute('data-term-id');
    if (e.currentTarget.getAttribute('data-type') == 'all_networks') {
        document.querySelectorAll('#slide1 .booster-quiz-card').forEach((el) => {
            let allIds;
            if (el.classList.contains('selected') && el.getAttribute('data-term-id')) {
                allIds = el.getAttribute('data-term-id');
                booster.providers.push(allIds);
            } else {
                booster.providers = [];
            }
        })
    } else {
        if (!booster[term].includes(id)) {
            booster[term].push(id);
        } else {
            let index = booster[term].indexOf(id);
            booster[term].splice(index, 1)
        }
    }
    if (e.currentTarget.getAttribute('data-term') == 'signals') {
        document.querySelectorAll('[data-term="signals"]').forEach((signal) => {
            let signalId = signal.getAttribute('data-term-id');
            if (!booster.otherSignals.includes(signalId)) {
                booster.otherSignals.push(signalId);
            }
        })
    }
    if (currentPage == 3) {
        document.querySelectorAll('#slide3 [data-term="range"]').forEach((el) => {
            let rangeId;
            if (el.classList.contains('selected') && el.getAttribute('data-term-id')) {
                rangeId = el.getAttribute('data-term-id');
                if (!booster.range.includes(rangeId)) {
                    booster.range.push(rangeId);
                }
            }
        });
        let newIds = [...booster.providers?.filter(v => v !== 'data'), ...booster.signals];
        let datefreq = [];
        let freqs_array = php_data.freqs_array;
        freqs_array.forEach((item) => {
            if (newIds.every(val => item.list.includes(val))) {
                datefreq.push(item.termID);
            }
        });
        booster.datefreq = datefreq;
    }
}


const slider = document.getElementById('slider');
const pageIndicator = document.getElementById('page-indicator');
const prevButton = document.querySelectorAll('[id*="prev"]');
const nextButton = document.getElementById('next');

function updateSlider() {
    slider.style.transform = `translateX(-${(currentPage - 1) * 100}%)`;
    pageIndicator.textContent = `(${currentPage}/3)`;
    if (window.matchMedia("(max-width: 1440px)").matches) {
        if (currentPage == 3) {
            document.querySelector('#slide3').style = "display:flex;";
            setTimeout(() => {
                document.querySelector('#slide2').style = "display:none;";
                document.querySelector('#slide1').style = "display:none;";
            }, 300);
        } else if (currentPage == 2) {
            setTimeout(() => {
                document.querySelector('#slide3').style = "display:none;";
                document.querySelector('#slide1').style = "display:none;";
            }, 300);
            document.querySelector('#slide2').style = "display:flex;";
        }
        if (currentPage == 1) {
            setTimeout(() => {
                document.querySelector('#slide3').style = "display:none;";
                document.querySelector('#slide2').style = "display:none;";
            }, 300);
            document.querySelector('#slide1').style = "display:flex;";
        }
    }
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${(currentPage * 33.333)}%`;
}

prevButton.forEach((btn) => {
    btn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateSlider();
        }
        if (currentPage == 1) {
            document.querySelectorAll('[id*="prev"]').forEach((btn) => {
                btn.classList.remove('visible');
            });
        }
    });
})
nextButton.addEventListener('click', () => {
    let selected = false;
    document.querySelectorAll(`#slide${currentPage} .booster-quiz-card`).forEach((el) => {
        if (el.classList.contains('selected')) {
            selected = true;
        }
    });
    if (currentPage < 3 && selected) {
        document.querySelectorAll('[id*="prev"]').forEach((btn) => {
            btn.classList.add('visible');
        });
        currentPage++;
        updateSlider();
    }else if(currentPage == 3 && selected) {
        window.location.href = `/search-result/?prd=${booster?.providers?.join(',')}&rng=${booster?.range}&wifi=${booster?.signals?.join(',')}&fre=${booster?.datefreq?.join(',')}&nwifi=${booster?.otherSignals?.join(',')}`;
    } else {
        document.querySelector('.quiz-error-message').classList.add('visible');
        setTimeout(() => {
            document.querySelector('.quiz-error-message').classList.remove('visible');
        }, 10000)
    }
});

updateSlider(); // Initialize the slider position


// Desktop navbar dropdown functionality
document.querySelectorAll('.fullscreen-nav .navbar-list > li').forEach((el) => {
    el.addEventListener('click', handleMenuList);
});

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded - setting up menu listeners'); // Debug log
    
    const menuButton = document.querySelector('#menu');
    const navbarToggler = document.querySelector('[data-bs-toggle="collapse"]');
    
    console.log('menuButton:', menuButton); // Debug log
    console.log('navbarToggler:', navbarToggler); // Debug log
    
    if (menuButton && navbarToggler) {
        // Attach event listener to the menu button itself
        menuButton.addEventListener('click', (e) => {
            console.log('Menu button clicked'); // Debug log
            e.preventDefault();
            e.stopPropagation();
            handleMenu(e);
        });
        console.log('Event listener attached to menu button'); // Debug log
    } else {
        console.log('Menu elements not found:', { menuButton: !!menuButton, navbarToggler: !!navbarToggler }); // Debug log
    }
});

// Mobile menu dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Setting up mobile dropdown functionality'); // Debug log
    
    const mobileDropdownToggles = document.querySelectorAll('.fullscreen-nav .dropdown-toggle');
    console.log('Found mobile dropdown toggles:', mobileDropdownToggles.length); // Debug log
    
    mobileDropdownToggles.forEach((toggle, index) => {
        console.log(`Setting up toggle ${index}:`, toggle); // Debug log
        
        toggle.addEventListener('click', (e) => {
            console.log('Mobile dropdown toggle clicked:', toggle.textContent); // Debug log
            e.preventDefault();
            
            const navItem = toggle.closest('.nav-item');
            const innerList = navItem.querySelector('.inner-list');
            
            console.log('navItem:', navItem); // Debug log
            console.log('innerList:', innerList); // Debug log
            
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
                console.log('Toggled navItem active class. Active:', navItem.classList.contains('active')); // Debug log
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', handleOutsideClick);
});
document.querySelectorAll('.booster-quiz-card').forEach((card) => {
    card.addEventListener('click', handleQuizSelection);
});

function handleToolTip(e) {
    const el = e.currentTarget.parentNode;
    const quiz = document.querySelector('.booster-quiz');
    const rect = el.getBoundingClientRect();
    const quizRect = quiz.getBoundingClientRect();
    document.querySelector(`[data-tooltip=${e.currentTarget.id}]`).classList.toggle('visible');
    document.querySelector(`.tooltip-arrow`).classList.toggle('visible');
    const tooltip = document.querySelector(`[data-tooltip=${e.currentTarget.id}]`);
    if (window.matchMedia('(min-width: 991px)').matches) {
        document.querySelector(`[data-tooltip=${e.currentTarget.id}]`).style.left = `${rect.left - quizRect.left + rect.width - 30}px`;
        document.querySelector(`.tooltip-arrow`).style.left = `${rect.left - quizRect.left + rect.width - 15}px`;
        document.querySelector(`[data-tooltip=${e.currentTarget.id}]`).style.top = `${rect.top - quizRect.top - tooltip.offsetHeight - 8}px`;
        document.querySelector(`.tooltip-arrow`).style.top = `${rect.top - quizRect.top - 8}px`;
    } else {
        document.querySelector(`[data-tooltip=${e.currentTarget.id}]`).style.right = `${rect.right - quizRect.right + rect.width + 15}px`;
        document.querySelector(`.tooltip-arrow`).style.left = `${rect.left - quizRect.left + rect.width - 15}px`;
        document.querySelector(`[data-tooltip=${e.currentTarget.id}]`).style.top = `${rect.top - quizRect.top - tooltip.offsetHeight - 8}px`;
        document.querySelector(`.tooltip-arrow`).style.top = `${rect.top - quizRect.top - 8}px`;
    }
}

document.querySelectorAll('.tooltip-icon').forEach((icon) => {
    icon.addEventListener('mouseout', handleToolTip);
})
document.querySelectorAll('.tooltip-icon').forEach((icon) => {
    icon.addEventListener('mouseover', handleToolTip);
})

function handleNavBarDropDown(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.querySelector(`.navbar-dropdown`).style.left = `${(e.currentTarget.offsetWidth) - 84}px`;
    e.currentTarget.querySelector(`.navbar-dropdown-arrow`).style.left = `${(e.currentTarget.offsetWidth) - 46}px`;
}

document.querySelectorAll('.navbar .navbar-list > li').forEach((list) => {
    list.addEventListener('mouseover', handleNavBarDropDown)
    list.addEventListener('mouseout', handleNavBarDropDown)
})
var scrollBreakpoint = window.matchMedia("(max-width: 767.99px)");
// Call listener function at run time
handleScroll(scrollBreakpoint);

// Attach listener function on state changes
scrollBreakpoint.addEventListener("change", function () {
    handleScroll(scrollBreakpoint);
});

var lastScrollTop = 0;

function handleScroll(breakpoint, rect) {
    // handle mobile scroll
    if (breakpoint.matches) {
        window.addEventListener("scroll", function () {
            document.querySelector('header').style = "display:block";
            let rect = document.querySelector('#booster-quiz').getBoundingClientRect();
            var st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop && (rect.top < 0 && rect.bottom < 0)) {
                document.querySelector('.header-content').classList.add('secondary-navbar');
            } else if (st < lastScrollTop || st === 0) {
                document.querySelector('.header-content').classList.remove('secondary-navbar');
            } // else was horizontal scroll
            lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        }, false);
        // handle desktop scroll
    } else {
        window.onwheel = e => {
            document.querySelector('header').style = "display:block";
            let rect = document.querySelector('#booster-quiz').getBoundingClientRect();
            if (e.deltaY >= 0 && !document.getElementById('country-modal').classList.contains('show') && (rect.top < 0 && rect.bottom < 0)) {
                // Wheel Down
                document.querySelector('.header-content').classList.add('secondary-navbar');
            } else {
                // Wheel Up
                document.querySelector('.header-content').classList.remove('secondary-navbar');
            }
        }

    }

}

document.querySelectorAll('.country-item').forEach((country) => {
    country.addEventListener('click', (e) => {
        if (e.currentTarget.querySelector('input[type=radio]').checked) {
            document.querySelector('#openPopup img').src = e.currentTarget.querySelector('img').src;
        } else {
            document.querySelector('#openPopup img').src = 'https://flagcdn.com/gb.svg';
        }
    })
})
document.querySelector('#up-btn').addEventListener('click', () => {
    document.querySelector('header').style = "display:none";
})


new Glide('.glide', {
    perView: 2.25,
    startAt: 0,
    bound: true,
    gap: 24,
    breakpoints: {
        576: {
            perView: 1.02
        },
        1024: {
            perView: 1.5
        },
    }
}).mount();
