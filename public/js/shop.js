(function () {
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
