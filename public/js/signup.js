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

function validatePassword(event) {
    event.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const passwordError = [];

    if (password.length < 8) {
        passwordError.push("Password must be at least 8 characters long.");
    }

    if (!/[A-Z]/.test(password)) {
        passwordError.push("Password must contain at least one uppercase letter.");
    }

    if (password !== confirmPassword) {
        passwordError.push("Passwords do not match.");
    }

    if (passwordError.length > 0) {
        alert(passwordError.join("\n"));
    } else {
        alert("Sign-up successful!");
        document.getElementById("signup-form").submit();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    applyDarkMode();

    document.getElementById("signup-form").addEventListener("submit", validatePassword);
});