(function () {
    const socket = io();

    // listen for server-pushed HP updates (regen ticks, future buff/debuff ticks)
    socket.on('player_update', (data) => {
        if (!data || data.health == null)
            return;

        const newHp = data.health;
        const maxHp = data.maxHealth;

        // read the currently displayed HP from the DOM
        const hpEl = document.querySelector('#hp-bar ~ .bar-text .animate-val');
        const prevHp = hpEl ? (parseInt(hpEl.innerText.replace(/,/g, '')) || newHp) : newHp;

        // skip if the HP hasn't actually changed (e.g. initial sync matches server-rendered HTML)
        if (newHp === prevHp)
            return;

        // animate the HP value counter
        if (hpEl) {
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

            // remove the danger class and low-HP warning if HP is no longer critically low
            if (maxHp && !isLowHealth(newHp, maxHp)) {
                const barRow = document.querySelector('.stat-row.bar.danger');
                if (barRow)
                    barRow.classList.remove('danger');

                const lowHpAlert = document.getElementById('low-health-alert');
                if (lowHpAlert)
                    lowHpAlert.remove();
            }
        }

        // trigger regen shine animation when HP increases
        if (newHp > prevHp) {
            const hpBar = document.getElementById('hp-bar');
            if (hpBar) {
                hpBar.classList.remove('regen-active');
                void hpBar.offsetWidth; // force reflow to restart the animation
                hpBar.classList.add('regen-active');
                setTimeout(() => hpBar.classList.remove('regen-active'), 500);
            }
        }
    });

    // development test: emit a secure ping event
    socket.emit('ping', { timestamp: Date.now() });
    socket.on('pong', (data) => {
        console.log(`[SOCKET] Secure Pong received:`, data);
    });
})();
