function getTokenCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

if (getTokenCookie()) {
    window.location.href = '/account/index.html';
}

const API_BASE = 'https://api.orbinuity.nl:34430';

function initSignup() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const errorElement = document.getElementById('error-msg');
        if (errorElement) errorElement.textContent = '';

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const displayName = document.getElementById('displayName').value.trim();
        const password = document.getElementById('password').value;
        const ageVal = document.getElementById('age').value;
        const pronounsVal = document.getElementById('pronouns').value.trim();
        const countryVal = document.getElementById('country').value.trim();

        const payload = { username, email, displayName, password };
        if (ageVal) payload.age = parseInt(ageVal, 10);
        if (pronounsVal) payload.pronouns = pronounsVal;
        if (countryVal) payload.country = countryVal;

        try {
            const registerRes = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const registerData = await registerRes.json();

            if (!registerRes.ok) {
                if (registerData.details) {
                    const firstKey = Object.keys(registerData.details).find(k => k !== '_errors');
                    if (firstKey && registerData.details[firstKey]._errors?.[0]) {
                        throw new Error(`${firstKey}: ${registerData.details[firstKey]._errors[0]}`);
                    }
                }
                throw new Error(registerData.error || 'Registration failed');
            }

            alert(registerData.message);
            window.location.href = '/account/login.html';

        } catch (err) {
            if (errorElement) errorElement.textContent = err.message;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSignup);
} else {
    initSignup();
}