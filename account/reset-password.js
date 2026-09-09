const API_BASE = 'https://api.orbinuity.nl:34430';

function initResetPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    const requestForm = document.getElementById('request-reset-form');
    const submitForm = document.getElementById('submit-new-password-form');

    // If token exists in URL, show new password form
    if (token) {
        if (requestForm) requestForm.style.display = 'none';
        if (submitForm) submitForm.style.display = 'flex';

        submitForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const msgElement = document.getElementById('submit-msg');
            msgElement.textContent = '';

            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (newPassword !== confirmPassword) {
                msgElement.style.color = 'red';
                msgElement.textContent = 'Passwords do not match.';
                return;
            }

            try {
                const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, newPassword })
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Failed to reset password.');

                msgElement.style.color = 'green';
                msgElement.textContent = data.message;

                setTimeout(() => {
                    window.location.href = '/account/login.html';
                }, 2000);

            } catch (err) {
                msgElement.style.color = 'red';
                msgElement.textContent = err.message;
            }
        });

    } else {
        // Default mode: Request reset link via email
        if (requestForm) {
            requestForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                const msgElement = document.getElementById('request-msg');
                msgElement.textContent = '';

                const identifier = document.getElementById('reset-identifier').value.trim();

                try {
                    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ identifier })
                    });

                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Failed to send reset link.');

                    msgElement.style.color = 'green';
                    msgElement.textContent = data.message;

                } catch (err) {
                    msgElement.style.color = 'red';
                    msgElement.textContent = err.message;
                }
            });
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initResetPassword);
} else {
    initResetPassword();
}