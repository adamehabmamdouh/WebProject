// public/js/about.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('nav-open'); // Add a class to show/hide the menu
        });

        // Close mobile nav when a link is clicked (optional, but good UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-open')) {
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('nav-open');
                }
            });
        });
    }

    // --- Dark Mode Toggle ---
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // Check for saved theme preference on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            // Update button text if it exists (assuming it says "Dark Mode" initially)
            darkModeToggle.textContent = 'Light Mode';
        }
    } else {
        // Ensure the button text is "Dark Mode" if it's not dark mode
        if (darkModeToggle) {
            darkModeToggle.textContent = 'Dark Mode';
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                darkModeToggle.textContent = 'Light Mode';
            } else {
                localStorage.setItem('theme', 'light');
                darkModeToggle.textContent = 'Dark Mode';
            }
        });
    }

    // --- Quick Test Button (Placeholder Functionality) ---
    const quickTestBtn = document.querySelector('.quick-test-btn');
    if (quickTestBtn) {
        quickTestBtn.addEventListener('click', () => {
            alert('Quick Test button clicked! Implement your test logic here.');
            // You can replace this alert with more complex logic,
            // like opening a modal, navigating to a test page, etc.
        });
    }
});