/**
 * Login Page Script
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Login form loaded');
  
  const form = document.getElementById('login-form');
  
  if (!form) {
    console.error('Login form not found!');
    return;
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error-message');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Disable button during request
    submitBtn.disabled = true;
    submitBtn.textContent = 'Connexion...';
    
    try {
      console.log('Sending login request...');
      const res = await fetch('/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Login successful:', data);
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        console.error('Login failed:', data);
        errorDiv.textContent = data.error || 'Identifiants invalides';
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Se connecter';
      }
    } catch (error) {
      console.error('Login error:', error);
      errorDiv.textContent = 'Erreur de connexion au serveur';
      errorDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Se connecter';
    }
  });
});

