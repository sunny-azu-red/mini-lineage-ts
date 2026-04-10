(function () {
    const formatNumber = (num) => num.toLocaleString('en-US');

    // sidebar animations
    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            let progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            if (progress < 1) {
                el.innerText = formatNumber(Math.round(easeProgress * (end - start) + start));
                window.requestAnimationFrame(step);
            } else el.innerText = el.dataset.final || formatNumber(end);
        };
        window.requestAnimationFrame(step);
    }

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
