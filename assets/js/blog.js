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
document.querySelector('.subscribe-form').addEventListener('submit', (e) => {
    e.preventDefault()
    if (e.currentTarget.checkValidity()) {
        e.currentTarget.classList.add('subscribed');

    }
})
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('[data-bs-toggle="collapse"]');
    const fullscreenNav = document.querySelector(".fullscreen-nav");

    menuToggle.addEventListener("click", () => {
        menuToggle.classList.toggle("active");
        fullscreenNav.classList.toggle("active");
    });
});

function handleMenuList(e) {
    e.currentTarget.classList.toggle('active');
}

document.querySelectorAll('.navbar-list > li').forEach((el) => {
    el.addEventListener('click', handleMenuList);
});
const paginationContainer = document.querySelector('.pagination');
const totalPages = 10; // Total number of pages
let currentPage = 1; // Current active page

function createButton(label, classes = [], isDisabled = false) {
    const button = document.createElement('button');
    button.textContent = label;
    button.classList.add('page-btn', ...classes);
    button.disabled = isDisabled;
    return button;
}

function createDots() {
    const span = document.createElement('span');
    span.textContent = '...';
    span.classList.add('dots');
    return span;
}

function updatePagination() {
    paginationContainer.innerHTML = ''; // Clear the existing pagination

    // Previous Button
    const prevButton = createButton('<', ['prev'], currentPage === 1);
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    // Page Numbers and Dots Logic
    if (totalPages <= 7) {
        // If total pages are small, show all pages
        for (let i = 1; i <= totalPages; i++) {
            const btn = createButton(i, currentPage === i ? ['active'] : []);
            btn.addEventListener('click', () => {
                currentPage = i;
                updatePagination();
            });
            paginationContainer.appendChild(btn);
        }
    } else {
        // Logic for dynamic dots and pages
        /*    if (currentPage > 3) {
              const firstPage = createButton(1);
              firstPage.addEventListener('click', () => {
                currentPage = 1;
                updatePagination();
              });
              paginationContainer.appendChild(firstPage);
              paginationContainer.appendChild(createDots());
            }*/

        // Pages around the current page
        const pagesToShow = [currentPage - 1, currentPage, currentPage + 1].filter(
            (page) => page >= 1 && page <= totalPages
        );

        pagesToShow.forEach((page) => {
            const btn = createButton(page, currentPage === page ? ['active'] : []);
            btn.addEventListener('click', () => {
                currentPage = page;
                updatePagination();
            });
            paginationContainer.appendChild(btn);
        });

        if (currentPage < totalPages - 2) {
            paginationContainer.appendChild(createDots());
            const lastPage = createButton(totalPages);
            lastPage.addEventListener('click', () => {
                currentPage = totalPages;
                updatePagination();
            });
            paginationContainer.appendChild(lastPage);
        }
    }

    // Next Button
    const nextButton = createButton('>', ['next'], currentPage === totalPages);
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Initialize pagination
updatePagination();
document.querySelectorAll('.country-item').forEach((country) => {
    country.addEventListener('click', (e) => {
        if (e.currentTarget.querySelector('input[type=radio]').checked) {
            document.querySelector('#openPopup img').src = e.currentTarget.querySelector('img').src;
        } else {
            document.querySelector('#openPopup img').src = 'https://flagcdn.com/gb.svg';
        }
    })
})