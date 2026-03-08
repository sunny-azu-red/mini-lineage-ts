(function () {
    // sidebar animations
    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            let progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            if (progress < 1) {
                el.innerText = Math.round(easeProgress * (end - start) + start);
                window.requestAnimationFrame(step);
            } else el.innerText = el.dataset.final || end;
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

    // home menu navigation
    var homeSelect = document.getElementById('home-select');
    var homeBtn = document.getElementById('home-btn');
    var homeForm = document.getElementById('home-form');
    if (homeSelect && homeBtn) {
        homeSelect.addEventListener('change', function () {
            homeBtn.textContent = homeSelect.value === '/suicide' ? '🪦 Die' : 'Travel';
        });
        if (homeForm) {
            homeForm.addEventListener('submit', function (e) {
                e.preventDefault();
                window.location.href = homeSelect.value;
            });
        }
    }

    // suicide confirmation
    var suicideSelect = document.getElementById('suicide-select');
    var suicideBtn = document.getElementById('suicide-btn');
    if (suicideSelect && suicideBtn) {
        suicideSelect.addEventListener('change', function () {
            if (suicideSelect.value === 'yes') {
                suicideBtn.textContent = '🪦 Die';
                suicideBtn.className = 'btn btn-danger';
            } else {
                suicideBtn.textContent = 'Return';
                suicideBtn.className = 'btn btn-secondary';
            }
        });
    }

    // shop selection handlers
    function setupShop(selectId, buttonId, activeText) {
        var sel = document.getElementById(selectId);
        var btn = document.getElementById(buttonId);
        if (sel && btn) {
            sel.addEventListener('change', function () {
                btn.textContent = sel.value === '' ? 'Return' : activeText;
                btn.className = sel.value === '' ? 'btn btn-secondary' : 'btn';
            });
        }
    }
    setupShop('weapon-select', 'weapon-btn', '🪙 Purchase');
    setupShop('armor-select', 'armor-btn', '🪙 Purchase');
    setupShop('inn-select', 'inn-btn', '🪙 Order');

})();
