(function () {
    const socket = io();

    // helpers — shared animation logic with sidebar.js
    // --------
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

    // --------

    // listen for server-pushed HP updates (regen ticks, future buff/debuff ticks)
    socket.on('player_update', (data) => {
        if (!data || data.health == null)
            return;

        const newHp = data.health;
        const maxHp = data.maxHealth;

        // animate the HP value counter
        const hpEl = document.querySelector('#hp-bar ~ .bar-text .animate-val');
        if (hpEl) {
            const prevHp = parseInt(hpEl.innerText.replace(/,/g, '')) || newHp;
            animateValue(hpEl, prevHp, newHp, 600);

            hpEl.dataset.val = newHp;
            hpEl.dataset.prev = prevHp;
        }

        // animate the HP bar width
        if (maxHp) {
            const hpBar = document.getElementById('hp-bar');
            if (hpBar) {
                const pct = Math.min(100, Math.round((newHp / maxHp) * 100));
                hpBar.style.width = pct + '%';
            }

            // remove the danger class if HP is no longer critically low (below 25%)
            const barRow = document.querySelector('.stat-row.bar.danger');
            if (barRow && newHp / maxHp > 0.25)
                barRow.classList.remove('danger');
        }
    });
})();
