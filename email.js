// email.js
// EmailJS Integration for Contact Form - Template Matched Version

(function() {
    // Initialize EmailJS with your user ID (public key)
    // IMPORTANT: Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    // Get it from: https://dashboard.emailjs.com/admin/integration
    emailjs.init("dHL0rzfRRzmUah2oy");
    
    console.log('✅ EmailJS initialized for portfolio contact form');
    console.log('📧 Using Service ID: service_8a7n7w9');
    console.log('📄 Using Template ID: template_4eevei2');
})();

// Handle contact form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.error('❌ Contact form not found! Make sure form has id="contactForm"');
        return;
    }
    
    console.log('✅ Contact form found, setting up EmailJS handler');
    
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('📤 Form submission started');
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        console.log('📝 Form data collected:', formData);
        
        // Validate form data
        if (!validateForm(formData)) {
            resetButtonState(submitBtn, originalText);
            return;
        }
        
        // Prepare data for EmailJS template - EXACT MATCH to your template variables
        const templateParams = {
            first_name: extractFirstName(formData.name),
            last_name: extractLastName(formData.name),
            problem: formData.subject, // This goes to "Company" field in template
            address: '', // Not collected in form, sent as empty
            mail: formData.email, // This is the Reply-To email
            phone: '', // Not collected in form, sent as empty
            msg: formData.message
        };
        
        console.log('📦 Template parameters prepared:', templateParams);
        console.log('📤 Sending email to: chandany67071@gmail.com');
        
        // Send email using EmailJS
        emailjs.send('service_8a7n7w9', 'template_4eevei2', templateParams)
        .then(function(response) {
            console.log('✅ SUCCESS! Email sent:', {
                status: response.status,
                text: response.text,
                timestamp: new Date().toISOString()
            });
            
            // Show success notification
            showNotification('🎉 Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button state
            resetButtonState(submitBtn, originalText);
            
            // Log success
            logSubmission(formData, 'success');
            
        }, function(error) {
            console.error('❌ FAILED to send email:', {
                status: error.status,
                text: error.text,
                message: error.message
            });
            
            // Show error message with retry option
            showNotification(
                '❌ Failed to send message. Please try again or contact me directly at chandany67071@gmail.com',
                'error'
            );
            
            // Reset button state
            resetButtonState(submitBtn, originalText);
            
            // Log error
            logSubmission(formData, 'error', error);
        });
    });
    
    // Helper Functions
    
    function validateForm(formData) {
        // Check all fields are filled
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('📝 Please fill in all fields before submitting.', 'warning');
            return false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showNotification('📧 Please enter a valid email address.', 'warning');
            return false;
        }
        
        // Name validation (at least 2 characters)
        if (formData.name.length < 2) {
            showNotification('👤 Please enter your full name.', 'warning');
            return false;
        }
        
        // Message validation (at least 10 characters)
        if (formData.message.length < 10) {
            showNotification('💬 Please write a meaningful message (at least 10 characters).', 'warning');
            return false;
        }
        
        return true;
    }
    
    function extractFirstName(fullName) {
        // Extract first name (first word)
        return fullName.split(' ')[0] || '';
    }
    
    function extractLastName(fullName) {
        // Extract last name (everything after first word)
        const parts = fullName.split(' ');
        return parts.length > 1 ? parts.slice(1).join(' ') : '';
    }
    
    function resetButtonState(button, originalText) {
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.opacity = '1';
        }, 500);
    }
    
    function showNotification(message, type) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        
        // Set icon based on type
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles for notification
        const styles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: getBackgroundColor(type),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            minWidth: '300px',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s ease-out',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.95rem'
        };
        
        // Apply styles
        Object.assign(notification.style, styles);
        
        // Add animation keyframes
        addNotificationStyles();
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            closeNotification(notification);
        });
        
        // Auto-remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                closeNotification(notification);
            }
        }, 5000);
        
        // Add to DOM
        document.body.appendChild(notification);
    }
    
    function getBackgroundColor(type) {
        const colors = {
            success: '#10b981', // Green
            error: '#ef4444',   // Red
            warning: '#f59e0b', // Yellow
            info: '#3b82f6'     // Blue
        };
        return colors[type] || colors.info;
    }
    
    function addNotificationStyles() {
        // Check if styles already exist
        if (document.getElementById('notification-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                flex: 1;
            }
            
            .notification-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                cursor: pointer;
                padding: 0.3rem 0.5rem;
                border-radius: 4px;
                transition: background 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    function closeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    function logSubmission(formData, status, error = null) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            status: status,
            formData: {
                name: formData.name,
                email: formData.email.substring(0, 3) + '...', // Partially hide email for privacy
                subject: formData.subject,
                messageLength: formData.message.length
            }
        };
        
        if (error) {
            logEntry.error = {
                status: error.status,
                text: error.text
            };
        }
        
        console.log('📋 Form Submission Log:', logEntry);
    }
    
    // Add input validation styles dynamically
    function setupFormValidation() {
        const inputs = document.querySelectorAll('.form-input, .form-textarea');
        
        inputs.forEach(input => {
            // Add real-time validation
            input.addEventListener('blur', function() {
                validateSingleField(this);
            });
            
            // Clear error on focus
            input.addEventListener('focus', function() {
                clearFieldError(this);
            });
        });
        
        // Add validation styles
        const style = document.createElement('style');
        style.textContent = `
            .form-input:invalid,
            .form-textarea:invalid {
                border-color: #ef4444 !important;
            }
            
            .form-input:valid,
            .form-textarea:valid {
                border-color: var(--glass-border) !important;
            }
            
            .form-input:focus:invalid,
            .form-textarea:focus:invalid {
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
            }
            
            .field-error {
                color: #ef4444;
                font-size: 0.85rem;
                margin-top: 0.3rem;
                display: block;
            }
            
            .fa-spinner {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .submit-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
    
    function validateSingleField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.id === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        if (field.id === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters';
        }
        
        if ((field.id === 'subject' || field.id === 'message') && value && value.length < 3) {
            isValid = false;
            errorMessage = 'This field must be at least 3 characters';
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }
    }
    
    function showFieldError(field, message) {
        // Remove existing error
        clearFieldError(field);
        
        // Add error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
        
        // Add error styling
        field.style.borderColor = '#ef4444';
    }
    
    function clearFieldError(field) {
        // Remove error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Reset styling
        field.style.borderColor = '';
    }
    
    // Initialize form validation
    setupFormValidation();
    
    console.log('✅ EmailJS setup complete. Ready to send emails!');
    console.log('📧 Template will send emails to: chandany67071@gmail.com');
    console.log('📝 Template variables configured: first_name, last_name, problem, address, mail, phone, msg');
});

// Global error handler for EmailJS
window.addEventListener('emailjs:error', function(event) {
    console.error('🌐 EmailJS Global Error:', event.detail);
    alert('There was an error with the email service. Please try again later or contact me directly at chandany67071@gmail.com');
});
