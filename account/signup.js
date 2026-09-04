document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Signup form submitted');

        const errorElement = document.getElementById('error-msg');
        errorElement.textContent = '';

        const username = document.getElementById('username').value.trim();
        const displayName = document.getElementById('displayName').value.trim();
        const password = document.getElementById('password').value;
        const ageVal = document.getElementById('age').value;
        const pronounsVal = document.getElementById('pronouns').value.trim();
        const countryVal = document.getElementById('country').value.trim();

        const payload = { username, displayName, password };
        if (ageVal) payload.age = parseInt(ageVal, 10);
        if (pronounsVal) payload.pronouns = pronounsVal;
        if (countryVal) payload.country = countryVal;

        const API_BASE = 'https://api.orbinuity.nl:34430';

        try {
            console.log('Sending registration payload:', payload);

            const registerRes = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const contentType = registerRes.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`Server error (${registerRes.status}): ${registerRes.statusText}`);
            }

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

            console.log('Registration successful, attempting auto-login...');

            const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const loginData = await loginRes.json();
            if (!loginRes.ok) {
                throw new Error(loginData.error || 'Auto-login failed');
            }

            console.log('Login successful, setting cookie...');
            document.cookie = `token=${loginData.token}; path=/; max-age=604800; Secure; SameSite=Lax`;
            window.location.href = '/account/me.html';

        } catch (err) {
            console.error('Signup error:', err);
            errorElement.textContent = err.message;
        }
    });
});