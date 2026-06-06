/* Form Handling & Mock Interactions (LocalStorage & Code Playground) */

document.addEventListener('DOMContentLoaded', () => {
  initFormHandler();
  initCodePlayground();
});

/* 1. Form Validation, Storage, and Toast Alert System */
function initFormHandler() {
  const forms = document.querySelectorAll('.booking-form, .contact-form');
  const toastContainer = document.createElement('div');
  toastContainer.classList.add('toast-container');
  document.body.appendChild(toastContainer);

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation
      const nameInput = form.querySelector('[name="parent_name"]');
      const emailInput = form.querySelector('[name="email"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const childNameInput = form.querySelector('[name="child_name"]');
      const programSelect = form.querySelector('[name="program"]');
      const messageInput = form.querySelector('[name="message"]');

      if (nameInput && nameInput.value.trim() === '') {
        showToast('Please enter your name.', 'error');
        return;
      }
      if (emailInput && emailInput.value.trim() === '') {
        showToast('Please enter your email.', 'error');
        return;
      }
      if (phoneInput && phoneInput.value.trim() === '') {
        showToast('Please enter your phone number.', 'error');
        return;
      }

      // Collect data
      const bookingData = {
        id: 'book_' + Date.now(),
        parentName: nameInput ? nameInput.value : '',
        email: emailInput ? emailInput.value : '',
        phone: phoneInput ? phoneInput.value : '',
        childName: childNameInput ? childNameInput.value : '',
        program: programSelect ? programSelect.value : 'General Inquiry',
        message: messageInput ? messageInput.value : '',
        dateSubmitted: new Date().toISOString()
      };

      // Store in localStorage for prototype demonstration
      try {
        const currentBookings = JSON.parse(localStorage.getItem('academy_bookings') || '[]');
        currentBookings.push(bookingData);
        localStorage.setItem('academy_bookings', JSON.stringify(currentBookings));
        
        console.log('Mock Data Saved in localStorage:', bookingData);
        
        // Show Success Toast
        showToast(`🎉 Success! Booking submitted for ${bookingData.program}. We will contact you soon!`, 'success');
        
        // Reset form
        form.reset();
      } catch (err) {
        showToast('Failed to save booking. Please try again.', 'error');
        console.error('LocalStorage write error:', err);
      }
    });
  });

  // Global Toast function
  window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? '✓' : '✗';
    
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">${message}</div>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    // Remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 4000);
  };
}

/* 2. AI & Coding Interactive Editor Simulator (for programming.html) */
function initCodePlayground() {
  const runBtn = document.getElementById('run-code-btn');
  const codeInput = document.getElementById('code-input');
  const outputScreen = document.getElementById('output-screen');

  if (!runBtn || !codeInput || !outputScreen) return;

  runBtn.addEventListener('click', () => {
    const code = codeInput.value;
    outputScreen.innerHTML = '<span class="system">// Initializing Badminton AI robot...</span>\n';
    
    // Simulate steps in compiler
    let lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let delay = 600;

    if (lines.length === 0) {
      setTimeout(() => {
        outputScreen.innerHTML += '<span class="error">Error: No commands detected. Try typing moveRight(); and smash();</span>';
      }, delay);
      return;
    }

    lines.forEach((line, idx) => {
      setTimeout(() => {
        if (line === 'moveRight();' || line === 'robot.moveRight();') {
          outputScreen.innerHTML += '<span>✓ Robot moved right to intercept shuttlecock.</span>\n';
        } else if (line === 'jump();' || line === 'robot.jump();') {
          outputScreen.innerHTML += '<span>✓ Jumped high, ready for contact.</span>\n';
        } else if (line === 'smash();' || line === 'robot.smash();') {
          outputScreen.innerHTML += '<span class="accent">⚡ SMASH! High-speed strike executed at 280 km/h! Point scored!</span>\n';
        } else if (line.startsWith('//') || line.startsWith('/*')) {
          // Ignore comments
        } else {
          outputScreen.innerHTML += `<span class="error">SyntaxError: Unknown command "${line}". Check syntax.</span>\n`;
        }

        // Auto scroll to bottom of simulated output screen
        outputScreen.scrollTop = outputScreen.scrollHeight;
        
        // Final completion logic
        if (idx === lines.length - 1) {
          setTimeout(() => {
            const hasError = outputScreen.innerHTML.includes('SyntaxError');
            if (hasError) {
              outputScreen.innerHTML += '<span class="error">\n[EXECUTION FAILED] Please correct the errors and try again.</span>';
            } else {
              outputScreen.innerHTML += '\n<span class="system">[COMPLETED SUCCESSFULLY] Code compiled. AI combo completed!</span>';
              showToast('🏆 Combo Completed! Excellent coding skills!', 'success');
            }
          }, 400);
        }
      }, delay * (idx + 1));
    });
  });
}
