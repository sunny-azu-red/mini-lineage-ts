(function () {
    // home menu navigation
    var select = document.getElementById('home-select');
    var btn = document.getElementById('home-btn');
    var form = document.getElementById('home-form');
    if (select && btn) {
        select.addEventListener('change', function () {
            btn.textContent = select.value === '/suicide' ? '🪦 Die' : 'Travel';
        });
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                window.location.href = select.value;
            });
        }
    }
})();
