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

    /**
     * Global debouncing — prevents double-clicks on any actionable element.
     * Targets all <button>, <input[type=submit]>, and <a class="btn"> elements.
     * Disables the element on first click and re-enables after a safety timeout.
     */
    const SAFETY_TIMEOUT_MS = 5000;
    const actionables = document.querySelectorAll('button, input[type="submit"], a.btn');

    actionables.forEach(el => {
        el.addEventListener('click', () => {
            if (el.classList.contains('btn-disabled'))
                return;

            el.classList.add('btn-disabled');
            if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement)
                el.disabled = true;

            // safety re-enable in case the page doesn't navigate (e.g. error, SPA)
            setTimeout(() => {
                el.classList.remove('btn-disabled');
                if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement)
                    el.disabled = false;
            }, SAFETY_TIMEOUT_MS);
        });
    });
});
