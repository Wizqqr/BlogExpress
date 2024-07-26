document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('new-post-form');
    form.addEventListener('submit', function(event) {
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();

        if (!title || !content) {
            alert('Both title and content are required to create a post.');
            event.preventDefault();
        }
    });
});
