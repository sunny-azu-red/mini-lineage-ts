(function () {
    // suicide confirmation
    var select = document.getElementById('suicide-select');
    var btn = document.getElementById('suicide-btn');
    if (select && btn) {
        select.addEventListener('change', function () {
            if (select.value === 'yes') {
                btn.textContent = '🪦 Die';
                btn.className = 'btn btn-danger';
            } else {
                btn.textContent = 'Phew 😅';
                btn.className = 'btn btn-secondary';
            }
        });
    }
})();
