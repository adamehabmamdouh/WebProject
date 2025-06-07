// public/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true';
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
    }

    // --- Dark Mode Toggle ---
    const darkModeToggleBtn = document.querySelector('.dark-mode-toggle');
    const popupContainer = document.getElementById('popupContainer'); // Get the popup container

    // Your existing toggleDarkMode function
    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');

        // Update popup container background based on mode
        if (popupContainer) { // Check if popupContainer exists before trying to style it
            if (document.body.classList.contains('dark-mode')) {
                popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
                popupContainer.style.color = 'white';
            } else {
                popupContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                popupContainer.style.color = 'black';
            }
        }

        // Save theme preference to localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }

    // Add event listener to the dark mode toggle button
    if (darkModeToggleBtn) {
        darkModeToggleBtn.addEventListener('click', toggleDarkMode);
    }

    // Apply theme on load (check localStorage)
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        // Immediately apply dark mode styles to popup if it exists
        if (popupContainer) {
            popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            popupContainer.style.color = 'white';
        }
    }


    // --- Popup Toggle ---
    // Assuming you have a button or element with class 'quick-test-btn'
    // and that the 'popup-container' is initially hidden by default via CSS.
    const quickTestBtn = document.querySelector('.quick-test-btn');

    // Your existing togglePopup function
    function togglePopup() {
        // Ensure popupContainer is correctly fetched (it already is at the top)
        if (popupContainer) { // Check if popupContainer exists
            popupContainer.classList.toggle('active');
            // If you need to stop body scrolling when popup is active:
            // document.body.classList.toggle('no-scroll');
        }
    }

    // Add event listener to the "Quick Test" button
    if (quickTestBtn) {
        quickTestBtn.addEventListener('click', togglePopup);
    }

    // Optional: Close popup when clicking outside it or on an explicit close button
    if (popupContainer) {
        popupContainer.addEventListener('click', (event) => {
            // Check if the click was directly on the container itself, not its children
            if (event.target === popupContainer) {
                togglePopup(); // Close the popup
            }
        });
        // You'll also likely need a dedicated close button inside the popup:
        // const closeButton = popupContainer.querySelector('.close-button'); // Assuming you have one
        // if (closeButton) {
        //     closeButton.addEventListener('click', togglePopup);
        // }
    }

    // You can add more functionality here for other interactive elements on your page
    // For example, if you want specific behavior for 'Explore More' or other links.
});

// IMPORTANT: Define the functions inside the DOMContentLoaded listener
// or outside it, but if they are defined outside, ensure the elements
// they reference are available in the DOM when the functions are called.
// Placing them inside DOMContentLoaded ensures everything is ready.