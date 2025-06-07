// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initFAQ(); // Initialize FAQ functionality
    // ... rest of your initialization code
});

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
                    ans.previousElementSibling.querySelector('.faq-icon').textContent = '❓';
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

// Payment Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    const modal = document.getElementById("paymentModal");
    
    // Get all "Join Now" buttons
    const joinButtons = document.querySelectorAll(".membership-button");
    
    // Get the <span> element that closes the modal
    const closeBtn = document.querySelector(".close-modal");
    
    // When user clicks on a Join Now button
    joinButtons.forEach(button => {
      button.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Get membership details
        const card = this.closest('.membership-card');
        const planName = card.querySelector('h3').textContent;
        const planPrice = card.querySelector('.membership-price').textContent;
        
        // Update modal with selected plan
        document.getElementById('planName').textContent = planName;
        document.getElementById('planPrice').textContent = planPrice + '/month';
        
        // Show modal
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent scrolling
      });
    });
    
    // When user clicks on (x), close modal
    closeBtn.onclick = function() {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
    
    // When user clicks anywhere outside modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
      }
    }
    
    // Payment form submission
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const cardName = document.getElementById('cardName').value;
      const cardNumber = document.getElementById('cardNumber').value;
      const expiryDate = document.getElementById('expiryDate').value;
      const cvv = document.getElementById('cvv').value;
      const email = document.getElementById('email').value;
      
      // Simple validation
      if (!cardName || !cardNumber || !expiryDate || !cvv || !email) {
        alert('Please fill in all fields');
        return;
      }
      
      // In a real app, you would process payment here
      console.log('Payment submitted:', {
        plan: document.getElementById('planName').textContent,
        price: document.getElementById('planPrice').textContent,
        cardName,
        cardNumber,
        expiryDate,
        cvv,
        email
      });
      
      // Show success message
      alert('Payment successful! Welcome to Fitness Hub!');
      
      // Close modal
      modal.style.display = "none";
      document.body.style.overflow = "auto";
      
      // Reset form
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
  });