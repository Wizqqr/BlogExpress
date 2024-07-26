document.addEventListener('DOMContentLoaded', function() {
    const comments = document.querySelectorAll('.comment');
    comments.forEach((comment, index) => {
        setTimeout(() => {
            comment.classList.add('show');
        }, index * 100)
    });
});

