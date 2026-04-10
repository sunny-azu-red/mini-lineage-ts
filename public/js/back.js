/**
 * Global "Go back" handler to safely navigate history without violating CSP.
 * Attach .js-back-link class to any link to enable this behavior.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.js-back-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/';
            }
        });
    });
});
