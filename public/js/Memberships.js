// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initFAQ(); // Initialize FAQ functionality
    initMembershipSelection(); // Initialize membership selection logic
});

// --- Dark Mode Toggle ---
const darkModeToggleBtn = document.querySelector('.dark-mode-toggle');
const popupContainer = document.getElementById('popupContainer'); // Get the popup container

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');

    if (popupContainer) { // Check if popupContainer exists before trying to style it
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


// Fixed FAQ Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        // Ensure answers start collapsed
        answer.style.display = 'none';

        // Add click handler
        question.addEventListener('click', function() {
            // Close all other FAQs first
            document.querySelectorAll('.faq-answer').forEach(ans => {
                if (ans !== answer) {
                    ans.style.display = 'none';
                    // Removed the faq-icon from here, as it's added dynamically.
                }
            });

            // Toggle current answer
            const isExpanded = answer.style.display === 'block';
            answer.style.display = isExpanded ? 'none' : 'block';

            // Update icon
            const icon = question.querySelector('.faq-icon') || createFAQIcon(question);
            icon.textContent = isExpanded ? '❓' : '🔽';

            // Smooth scroll if expanding
            if (!isExpanded) {
                answer.style.opacity = '0';
                answer.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    answer.style.opacity = '1';
                    question.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 10);
            }
        });

        // Add icon if not present
        if (!question.querySelector('.faq-icon')) {
            createFAQIcon(question);
        }
    });
}

function createFAQIcon(question) {
    const icon = document.createElement('span');
    icon.className = 'faq-icon';
    icon.textContent = '❓';
    icon.style.marginRight = '10px';
    question.insertBefore(icon, question.firstChild);
    return icon;
}


// Payment Modal and Membership Selection Functionality
function initMembershipSelection() {
    const modal = document.getElementById("paymentModal");
    const joinButtons = document.querySelectorAll(".membership-button");
    const closeBtn = document.querySelector(".close-modal");
    let selectedPlanName = ''; // To store the plan name selected

    // When user clicks on a Join Now button
    joinButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();

            // Check if user is logged in (isLoggedIn is passed from EJS)
            if (!isLoggedIn) {
                // If not logged in, redirect to signup page
                window.location.href = '/signup';
                return;
            }

            const card = this.closest('.membership-card');
            selectedPlanName = card.querySelector('h3').textContent; // Get the plan name
            const planPrice = card.querySelector('.membership-price').textContent;

            document.getElementById('planName').textContent = selectedPlanName + ' Membership';
            document.getElementById('planPrice').textContent = planPrice + '/month';

            modal.style.display = "block";
            document.body.style.overflow = "hidden"; // Prevent scrolling
        });
    });

    closeBtn.onclick = function() {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    document.getElementById('paymentForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission

        // Get form values and trim/clean them
        const cardName = document.getElementById('cardName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, ''); // Remove spaces for validation
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const email = document.getElementById('email').value.trim();

        // Client-Side Validation
        if (!validateCardName(cardName)) {
            alert('Please enter a valid name on card.');
            return;
        }
        if (!validateCardNumber(cardNumber)) {
            alert('Please enter a valid credit card number.');
            return;
        }
        if (!validateExpiryDate(expiryDate)) {
            alert('Please enter a valid expiry date (MM/YY, not in the past).');
            return;
        }
        if (!validateCvv(cvv)) {
            alert('Please enter a valid CVV (3 or 4 digits).');
            return;
        }
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // If all client-side validation passes, proceed with simulated payment and server update
        console.log('Payment submitted:', {
            plan: selectedPlanName,
            price: document.getElementById('planPrice').textContent,
            cardName,
            cardNumber: '********' + cardNumber.slice(-4), // NEVER LOG OR SEND FULL CARD NUMBER TO YOUR SERVER IN REAL APPS
            expiryDate,
            cvv: '***', // NEVER LOG OR SEND FULL CVV TO YOUR SERVER IN REAL APPS
            email
        });

        // Simulate a successful payment and then update membership
        try {
            const response = await fetch('/memberships/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ membershipType: selectedPlanName }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message);
                window.location.href = '/memberships'; // Redirect to refresh page or dashboard
            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.error || 'Failed to update membership.'));
            }
        } catch (error) {
            console.error('Error during membership update:', error);
            alert('An error occurred during payment and membership update.');
        }
        
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        this.reset();
    });
    
    // Format card number input
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    });
    
    // Format expiry date input
    document.getElementById('expiryDate').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    });

    // --- New Validation Helper Functions ---
    function validateCardName(name) {
        // Allows letters, spaces, dots, apostrophes, hyphens, and must be at least 2 characters
        return name.length >= 2 && /^[a-zA-Z\s.'-]+$/.test(name);
    }

    function validateCardNumber(number) {
        const cleanedNumber = number.replace(/\s/g, ''); // Remove spaces
        if (!/^\d+$/.test(cleanedNumber)) {
            return false; // Must contain only digits
        }

        const len = cleanedNumber.length;

        // Check for common card lengths based on starting digits (IIN)
        let isValidLength = false;
        if ((/^4/.test(cleanedNumber) && (len === 13 || len === 16))) { // Visa (13 or 16 digits, starts with 4)
            isValidLength = true;
        } else if ((/^5[1-5]/.test(cleanedNumber) && len === 16)) { // Mastercard (16 digits, starts with 51-55)
            isValidLength = true;
        } else if ((/^3[47]/.test(cleanedNumber) && len === 15)) { // American Express (15 digits, starts with 34 or 37)
            isValidLength = true;
        } else if ((/^6(?:011|5[0-9]{2})/.test(cleanedNumber) && len === 16)) { // Discover (16 digits, starts with 6011 or 65)
            isValidLength = true;
        } else if ((/^(?:2131|1800|35\d{3})/.test(cleanedNumber) && (len === 16 || len === 19))) { // JCB (16 or 19 digits)
            isValidLength = true;
        } else if ((/^3(?:0[0-5]|[68][0-9])/.test(cleanedNumber) && len === 14)) { // Diners Club (14 digits)
             isValidLength = true;
        } else if ((/^62/.test(cleanedNumber) && (len >= 16 && len <= 19))) { // UnionPay (16-19 digits)
            isValidLength = true;
        }


        if (!isValidLength) {
            return false;
        }

        // Luhn Algorithm (Mod 10 algorithm) for basic checksum validation
        let sum = 0;
        let parity = len % 2;
        for (let i = 0; i < len; i++) {
            let digit = parseInt(cleanedNumber.charAt(i), 10);
            if (i % 2 == parity) {
                digit *= 2;
            }
            if (digit > 9) {
                digit -= 9;
            }
            sum += digit;
        }
        const isValidLuhn = (sum % 10) == 0;
        
        return isValidLuhn;
    }

    function validateExpiryDate(date) {
        // Regex for MM/YY format
        const dateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!dateRegex.test(date)) {
            return false;
        }

        const parts = date.split('/');
        const month = parseInt(parts[0], 10);
        const year = 2000 + parseInt(parts[1], 10); // Assume 20xx

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // Month is 0-indexed in JS

        // Check if the year is in the past
        if (year < currentYear) {
            return false;
        }
        // Check if the month is in the past for the current year
        if (year === currentYear && month < currentMonth) {
            return false;
        }

        return true;
    }

    function validateCvv(cvv) {
        // CVV is typically 3 or 4 digits
        return /^[0-9]{3,4}$/.test(cvv);
    }

    function validateEmail(email) {
        // A common regex for basic email format validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}