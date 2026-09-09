const API_BASE = 'https://api.orbinuity.nl:34430';

function getTokenCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = getTokenCookie();

    if (!token) {
        window.location.href = '/account/login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/account/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Failed to load profile.');
        }

        checkTermsConsent(data);

        document.getElementById('page-heading').textContent = `Welcome, ${data.displayName || data.username}`;

        document.getElementById('info-username').textContent = `@${data.username}`;
        document.getElementById('info-email').textContent = data.email || 'Not specified';
        document.getElementById('info-display-name').textContent = data.displayName || 'None';
        document.getElementById('info-account-type').textContent = data.settings?.isBusinessAccount ? 'Business Account' : 'Personal Account';
        document.getElementById('info-dob').textContent = data.dateOfBirth || 'Not specified';
        document.getElementById('info-pronouns').textContent = data.pronouns || 'Not specified';
        document.getElementById('info-country').textContent = data.country || 'Not specified';

        if (data.createdAt) {
            const createdDate = new Date(data.createdAt);
            document.getElementById('info-created-at').textContent = createdDate.toLocaleDateString();
        } else {
            document.getElementById('info-created-at').textContent = 'Unknown';
        }

    } catch (err) {
        const errorMsg = document.getElementById('error-msg');
        if (errorMsg) errorMsg.textContent = err.message;
    }
});