const darkModeToggleBtn = document.querySelector('.dark-mode-toggle');
const popupContainer = document.getElementById('popupContainer');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    if (popupContainer) {
        if (document.body.classList.contains('dark-mode')) {
            popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            popupContainer.style.color = 'white';
        } else {
            popupContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            popupContainer.style.color = 'black';
        }
    }

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

if (darkModeToggleBtn) {
    darkModeToggleBtn.addEventListener('click', toggleDarkMode);
}

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (popupContainer) {
        popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        popupContainer.style.color = 'white';
    }
}