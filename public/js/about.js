document.addEventListener('DOMContentLoaded', () => {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('nav-open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-open')) {
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    navLinks.classList.remove('nav-open');
                }
            });
        });
    }

    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) {
            darkModeToggle.textContent = 'Light Mode';
        }
    } else {
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

    const quickTestBtn = document.querySelector('.quick-test-btn');
    if (quickTestBtn) {
        quickTestBtn.addEventListener('click', () => {
            alert('Quick Test button clicked! Implement your test logic here.');
        });
    }
});