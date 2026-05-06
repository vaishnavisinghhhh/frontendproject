// auth.js
window.switchTab = function(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const indicator = document.getElementById('tab-indicator');

    if (tab === 'login') {
        loginForm.classList.add('active-form');
        registerForm.classList.remove('active-form');
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        indicator.style.transform = 'translateX(0)';
    } else {
        loginForm.classList.remove('active-form');
        registerForm.classList.add('active-form');
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        indicator.style.transform = 'translateX(100%)';
    }
};

window.togglePassword = function(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
};

window.checkStrength = function(password) {
    const bar = document.getElementById('strength-bar');
    const text = document.getElementById('strength-text');
    
    if (!password) {
        bar.style.width = '0';
        bar.style.backgroundColor = 'var(--text-muted)';
        text.innerText = 'Minimum 8 characters';
        return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]+/)) strength += 25;
    if (password.match(/[A-Z]+/)) strength += 25;
    if (password.match(/[0-9]+/)) strength += 25;

    bar.style.width = strength + '%';
    
    if (strength <= 25) {
        bar.style.backgroundColor = 'var(--error)';
        text.innerText = 'Weak';
    } else if (strength <= 50) {
        bar.style.backgroundColor = 'var(--warning)';
        text.innerText = 'Fair';
    } else if (strength <= 75) {
        bar.style.backgroundColor = 'var(--success)';
        text.innerText = 'Good';
    } else {
        bar.style.backgroundColor = 'var(--accent-primary)';
        text.innerText = 'Strong';
    }
};

window.handleLogin = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Signing In...';
    btn.style.opacity = '0.8';
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Check against hardcoded local storage data first
    const storedEmail = localStorage.getItem('auth_email');
    const storedPassword = localStorage.getItem('auth_password');

    if (email === storedEmail && password === storedPassword) {
        localStorage.setItem('token', 'hardcoded-test-token');
        if (typeof showToast === 'function') {
            showToast('You are logged in ✅', 'success');
        } else {
            alert('You are logged in ✅');
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            if (typeof showToast === 'function') showToast(data.error || 'Login failed', 'error');
            btn.innerText = originalText;
            btn.style.opacity = '1';
            return;
        }

        localStorage.setItem('token', data.token);
        if (typeof showToast === 'function') showToast('You are logged in ✅', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (err) {
        if (typeof showToast === 'function') showToast('Network error occurred', 'error');
        btn.innerText = originalText;
        btn.style.opacity = '1';
    }
};

window.handleRegister = async function(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;
    btn.innerText = 'Creating Account...';
    btn.style.opacity = '0.8';
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const res = await fetch('http://localhost:5000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            const errMsg = data.errors ? data.errors[0].message : data.error;
            if (typeof showToast === 'function') showToast(errMsg || 'Registration failed', 'error');
            btn.innerText = originalText;
            btn.style.opacity = '1';
            return;
        }

        localStorage.setItem('token', data.token);
        if (typeof showToast === 'function') showToast('You are now signed up 🎉', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    } catch (err) {
        if (typeof showToast === 'function') showToast('Network error occurred', 'error');
        btn.innerText = originalText;
        btn.style.opacity = '1';
    }
};

window.addEventListener('DOMContentLoaded', () => {
    // Hardcoded Local Storage Data for Testing
    if (!localStorage.getItem('auth_email')) {
        localStorage.setItem('auth_email', 'test@example.com');
        localStorage.setItem('auth_password', 'password123');
    }

    // Auto-fill login form with hardcoded data
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    if(loginEmail && loginPassword) {
        loginEmail.value = localStorage.getItem('auth_email');
        loginPassword.value = localStorage.getItem('auth_password');
    }
});
