(function () {
    // home menu navigation
    var sel = document.getElementById('home-select');
    var btn = document.getElementById('home-btn');
    var form = document.getElementById('home-form');
    if (sel && btn) {
        sel.addEventListener('change', function () {
            btn.textContent = sel.value === '/suicide' ? '⚰️ Perish' : 'Travel';
        });
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                window.location.href = sel.value;
            });
        }
    }
})();
