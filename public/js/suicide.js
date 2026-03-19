(function () {
    // suicide confirmation
    var sel = document.getElementById('suicide-select');
    var btn = document.getElementById('suicide-btn');
    if (sel && btn) {
        sel.addEventListener('change', function () {
            if (sel.value === 'yes') {
                btn.textContent = '🪦 Die';
                btn.className = 'btn btn-danger';
            } else {
                btn.textContent = 'Phew 😅';
                btn.className = 'btn btn-secondary';
            }
        });
    }
})();
