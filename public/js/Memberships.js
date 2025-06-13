document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initMembershipSelection();
});

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

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        answer.style.display = 'none';

        question.addEventListener('click', function() {
            document.querySelectorAll('.faq-answer').forEach(ans => {
                if (ans !== answer) {
                    ans.style.display = 'none';
                }
            });

            const isExpanded = answer.style.display === 'block';
            answer.style.display = isExpanded ? 'none' : 'block';

            const icon = question.querySelector('.faq-icon') || createFAQIcon(question);
            icon.textContent = isExpanded ? '❓' : '🔽';

            if (!isExpanded) {
                answer.style.opacity = '0';
                answer.style.transition = 'opacity 0.3s ease';
                setTimeout(() => {
                    answer.style.opacity = '1';
                    question.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 10);
            }
        });

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

function initMembershipSelection() {
    const modal = document.getElementById("paymentModal");
    const joinButtons = document.querySelectorAll(".membership-button");
    const closeBtn = document.querySelector(".close-modal");
    let selectedPlanName = '';

    joinButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.preventDefault();

            if (!isLoggedIn) {
                window.location.href = '/signup';
                return;
            }

            const card = this.closest('.membership-card');
            selectedPlanName = card.querySelector('h3').textContent;
            const planPrice = card.querySelector('.membership-price').textContent;

            document.getElementById('planName').textContent = selectedPlanName + ' Membership';
            document.getElementById('planPrice').textContent = planPrice + '/month';

            modal.style.display = "block";
            document.body.style.overflow = "hidden";
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
        e.preventDefault();

        const cardName = document.getElementById('cardName').value.trim();
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        const email = document.getElementById('email').value.trim();

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

        console.log('Payment submitted:', {
            plan: selectedPlanName,
            price: document.getElementById('planPrice').textContent,
            cardName,
            cardNumber: '********' + cardNumber.slice(-4),
            expiryDate,
            cvv: '***',
            email
        });

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
                window.location.href = '/memberships';
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

    document.getElementById('cardNumber').addEventListener('input', function(e) {
        this.value = this.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    });

    document.getElementById('expiryDate').addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    });

    function validateCardName(name) {
        return name.length >= 2 && /^[a-zA-Z\s.'-]+$/.test(name);
    }

    function validateCardNumber(number) {
        const cleanedNumber = number.replace(/\s/g, '');

        if (!/^\d+$/.test(cleanedNumber)) {
            return false;
        }

        const len = cleanedNumber.length;

        if (len < 13 || len > 19) {
            return false;
        }

        let sum = 0;
        let parity = len % 2;

        for (let i = 0; i < len; i++) {
            let digit = parseInt(cleanedNumber.charAt(i), 10);

            if ((i % 2) === parity) {
                digit *= 2;
            }

            if (digit > 9) {
                digit -= 9;
            }
            sum += digit;
        }
        const isValidLuhn = (sum % 10) === 0;

        if (!isValidLuhn) {
            return false;
        }

        return true;
    }
    function validateExpiryDate(date) {
        const dateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!dateRegex.test(date)) {
            return false;
        }

        const parts = date.split('/');
        const month = parseInt(parts[0], 10);
        const year = 2000 + parseInt(parts[1], 10);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (year < currentYear) {
            return false;
        }
        if (year === currentYear && month < currentMonth) {
            return false;
        }

        return true;
    }

    function validateCvv(cvv) {
        return /^[0-9]{3,4}$/.test(cvv);
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}