const API_BASE = 'https://api.orbinuity.nl:34430';
let pendingUserId = null;

function getTokenCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

if (getTokenCookie()) {
    window.location.href = '/account/index.html';
}

function initLogin() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const errorElement = document.getElementById('error-msg');
        if (errorElement) errorElement.textContent = '';

        // Step 2: Verification of 2FA Code
        if (pendingUserId) {
            const code = document.getElementById('twoFactorCode').value.trim();
            try {
                const res = await fetch(`${API_BASE}/api/auth/login/2fa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: pendingUserId, code })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || '2FA Verification failed.');

                document.cookie = `token=${data.token}; path=/; max-age=604800; Secure; SameSite=Lax`;
                window.location.href = '/account/index.html';
            } catch (err) {
                if (errorElement) errorElement.textContent = err.message;
            }
            return;
        }

        // Step 1: Normal Credentials Check
        const identifier = document.getElementById('identifier').value.trim();
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed.');

            if (data.requiresTwoFactor) {
                pendingUserId = data.userId;
                document.getElementById('credentials-step').style.display = 'none';
                document.getElementById('2fa-step').style.display = 'block';
                document.getElementById('submit-btn').textContent = 'Verify Code';
                return;
            }

            document.cookie = `token=${data.token}; path=/; max-age=604800; Secure; SameSite=Lax`;
            window.location.href = '/account/index.html';

        } catch (err) {
            if (errorElement) errorElement.textContent = err.message;
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogin);
} else {
    initLogin();
}