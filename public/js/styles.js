document.addEventListener('DOMContentLoaded', function() {
    const comments = document.querySelectorAll('.comment');
    comments.forEach((comment, index) => {
        setTimeout(() => {
            comment.classList.add('show');
        }, index * 100);
    });

    const mainText = document.querySelector('.mainText');
    const buttons = document.querySelectorAll('.mainButtons button');
    const image = document.querySelector('.mainImage img');

    mainText.style.opacity = 0;
    mainText.style.transition = 'opacity 1.5s';

    buttons.forEach(button => {
        button.style.opacity = 0;
        button.style.transform = 'translateY(20px)';
        button.style.transition = 'opacity 1.5s, transform 1.5s';
    });

    image.style.opacity = 0;
    image.style.transition = 'opacity 1.5s';

    setTimeout(() => {
        mainText.style.opacity = 1;
        image.style.opacity = 1;
        buttons.forEach(button => {
            button.style.opacity = 1;
            button.style.transform = 'translateY(0)';
        });
    }, 500);
});
