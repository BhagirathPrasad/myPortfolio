// email.js
// EmailJS Integration for Contact Form

(function() {
    // Initialize EmailJS with your user ID (public key)
    // IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init("YOUR_PUBLIC_KEY");
    
    console.log('EmailJS initialized successfully');
})();

// Handle contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        console.log('Contact form found, setting up EmailJS handler');
        
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Form submission triggered');
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            const originalBg = submitBtn.style.background;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.8';
            
            // Get form data
            const formData = {
                from_name: document.getElementById('name').value.trim(),
                from_email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            console.log('Form data collected:', formData);
            
            // Validate form data
            if (!formData.from_name || !formData.from_email || !formData.subject || !formData.message) {
                alert('Please fill in all fields before submitting.');
                resetButtonState(submitBtn, originalText, originalBg);
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.from_email)) {
                alert('Please enter a valid email address.');
                resetButtonState(submitBtn, originalText, originalBg);
                return;
            }
            
            // Prepare data for EmailJS template
            const templateParams = {
                first_name: formData.from_name.split(' ')[0],
                last_name: formData.from_name.split(' ').slice(1).join(' ') || '',
                problem: formData.subject,
                address: '', // Not collected in form
                mail: formData.from_email,
                phone: '', // Not collected in form
                msg: formData.message
            };
            
            console.log('Template parameters prepared:', templateParams);
            
            // Send email using EmailJS
            // Service ID: service_8a7n7w9
            // Template ID: template_i931pit
            emailjs.send('service_8a7n7w9', 'template_i931pit', templateParams)
            .then(function(response) {
                console.log('SUCCESS! Email sent:', response.status, response.text);
                
                // Show success message with better styling
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
                // Reset button state
                resetButtonState(submitBtn, originalText, originalBg);
                
                // Optional: Track successful submission in console
                console.log('Form reset, ready for next submission');
            }, function(error) {
                console.log('FAILED to send email:', error);
                
                // Show error message
                showNotification('Failed to send message. Please try again or contact me directly at chandany67071@gmail.com', 'error');
                
                // Reset button state
                resetButtonState(submitBtn, originalText, originalBg);
                
                // Optional: Log detailed error for debugging
                console.error('EmailJS Error Details:', {
                    status: error.status,
                    text: error.text,
                    message: error.message
                });
            });
        });
    } else {
        console.warn('Contact form not found. Make sure the form has id="contactForm"');
    }
    
    // Function to reset button state
    function resetButtonState(button, originalText, originalBg) {
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.opacity = '1';
            if (originalBg) {
                button.style.background = originalBg;
            }
        }, 500);
    }
    
    // Function to show notification
    function showNotification(message, type) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-color, #10b981)' : 'var(--primary-color, #3b82f6)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            min-width: 300px;
            max-width: 500px;
            animation: slideIn 0.3s ease-out;
            font-family: 'Poppins', sans-serif;
        `;
        
        // Add slideIn animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.3rem;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Add slideOut animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
        
        // Add to DOM
        document.body.appendChild(notification);
    }
    
    // Log that email.js is loaded
    console.log('EmailJS handler loaded successfully');
});

// Add a global error handler for EmailJS
window.addEventListener('emailjs:error', function(event) {
    console.error('EmailJS Global Error:', event.detail);
    alert('There was an error with the email service. Please try again later or contact me directly.');
});

// Optional: Add form validation styles
function addValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-input:invalid,
        .form-textarea:invalid {
            border-color: #ef4444;
        }
        
        .form-input:valid,
        .form-textarea:valid {
            border-color: var(--glass-border);
        }
        
        .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        .fa-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize validation styles when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addValidationStyles);
} else {
    addValidationStyles();
}
