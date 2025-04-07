
    // Function to toggle dark mode
    function toggleDarkMode() {
        const body = document.body;
        body.classList.toggle('dark-mode');

        // Save the dark mode preference in localStorage
        const isDarkMode = body.classList.contains('dark-mode');
        localStorage.setItem('darkModeEnabled', isDarkMode);
    }

    // Function to apply dark mode on page load
    function applyDarkMode() {
        const isDarkMode = localStorage.getItem('darkModeEnabled') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    // Function to validate the password
    function validatePassword(event) {
        event.preventDefault(); // Prevent form submission if validation fails

        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const passwordError = [];

        // Check password length (minimum 8 characters)
        if (password.length < 8) {
            passwordError.push("Password must be at least 8 characters long.");
        }

        // Check for at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            passwordError.push("Password must contain at least one uppercase letter.");
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            passwordError.push("Passwords do not match.");
        }

        // Display errors or submit the form
        if (passwordError.length > 0) {
            alert(passwordError.join("\n"));
        } else {
            alert("Sign-up successful!");
            document.getElementById("signup-form").submit();
        }
    }

    // Apply dark mode when the page loads
    document.addEventListener("DOMContentLoaded", () => {
        applyDarkMode();

        // Attach validation to form submission
        document.getElementById("signup-form").addEventListener("submit", validatePassword);
    });

