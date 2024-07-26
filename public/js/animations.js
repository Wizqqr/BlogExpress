document.addEventListener('DOMContentLoaded', function() {
    const formElements = document.querySelectorAll('.form-input, .form-textarea, .form-button');
    
    formElements.forEach((element, index) => {
        element.style.animation = `fadeIn 0.5s ease-in-out ${index * 0.2}s forwards`;
        element.style.opacity = '0';
    });

    const backLink = document.querySelector('.back-link');
    backLink.addEventListener('mouseover', function() {
        backLink.style.animation = 'shake 0.5s';
    });

    backLink.addEventListener('animationend', function() {
        backLink.style.animation = '';
    });
});

