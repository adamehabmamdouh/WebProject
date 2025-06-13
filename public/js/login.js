document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form[action="/login"]');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: formData.get('username'),
                        password: formData.get('password')
                    })
                });

                const data = await response.json();
                
                if (data.openInNewTab) {
                    // Open admin panel in new tab
                    window.open(data.redirect, '_blank');
                    // Redirect current tab to memberships
                    window.location.href = '/memberships';
                } else {
                    // Handle regular redirect
                    window.location.href = data.redirect || '/memberships';
                }
            } catch (error) {
                console.error('Login error:', error);
                // If there's an error, let the form submit normally
                this.submit();
            }
        });
    }

    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Handle back button
    window.addEventListener('popstate', function(event) {
        // Send a request to logout
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(() => {
            // Redirect to home page
            window.location.href = '/';
        });
    });

    // Add a history entry when the page loads
    history.pushState(null, null, location.href);

    // Add dark mode toggle button
    const darkModeButton = document.createElement('button');
    darkModeButton.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
    `;
    darkModeButton.className = 'fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors';
    darkModeButton.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(darkModeButton);

    // Toggle dark mode
    darkModeButton.addEventListener('click', toggleDarkMode);
});

// Dark Mode Toggle Function
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}
  