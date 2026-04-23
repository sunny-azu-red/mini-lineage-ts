(function () {
    // sidebar animations
    setTimeout(() => {
        document.querySelectorAll('.bar').forEach(bar => {
            if (bar.dataset.width)
                bar.style.width = bar.dataset.width + '%';
        });

        document.querySelectorAll('.animate-val').forEach(el => {
            const start = parseInt(el.dataset.prev);
            const end = parseInt(el.dataset.val);
            if (!isNaN(start) && !isNaN(end) && start !== end)
                animateValue(el, start, end, 600);
        });
    }, 100);
})();
