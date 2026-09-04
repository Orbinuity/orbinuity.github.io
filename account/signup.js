async function signup(event) {
    event.preventDefault();

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

    try {
        const registerRes = await fetch('https://api.orbinuity.nl/api/auth/register', {
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

        const loginRes = await fetch('https://api.orbinuity.nl/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const loginData = await loginRes.json();
        if (!loginRes.ok) {
            throw new Error(loginData.error || 'Auto-login failed');
        }

        document.cookie = `token=${loginData.token}; path=/; max-age=604800; Secure; SameSite=Lax`;
        window.location.href = '/account/me.html';

    } catch (err) {
        errorElement.textContent = err.message;
    }
}