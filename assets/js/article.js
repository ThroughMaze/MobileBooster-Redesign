import "bootstrap/dist/js/bootstrap.min.js";
import "./booster-quiz";
import "./article-progress-bar";
import "./share-article";
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
document.querySelectorAll('.country-item').forEach((country) => {
    country.addEventListener('click', (e) => {
        if (e.currentTarget.querySelector('input[type=radio]').checked) {
            document.querySelector('#openPopup img').src = e.currentTarget.querySelector('img').src;
        } else {
            document.querySelector('#openPopup img').src = 'https://flagcdn.com/gb.svg';
        }
    })
})

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