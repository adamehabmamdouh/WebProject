
function togglePopup() {
    const popupContainer = document.getElementById('popupContainer');
    popupContainer.classList.toggle('active');
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    // Update popup container background based on mode
    const popup = document.querySelector('.popup-container');
    if (document.body.classList.contains('dark-mode')) {
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        popup.style.color = 'white';
    } else {
        popup.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        popup.style.color = 'black';
    }
}