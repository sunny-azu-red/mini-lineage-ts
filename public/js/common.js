const formatNumber = (num) => num.toLocaleString('en-US');

function animateValue(el, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        if (progress < 1) {
            el.innerText = formatNumber(Math.round(easeProgress * (end - start) + start));
            window.requestAnimationFrame(step);
        } else {
            el.innerText = formatNumber(end);
        }
    };
    window.requestAnimationFrame(step);
}

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
