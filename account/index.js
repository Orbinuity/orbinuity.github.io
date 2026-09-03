function getTokenCookie() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = getTokenCookie();

    // Redirect to login if token is missing
    if (!token) {
        window.location.href = '/account/login.html';
        return;
    }

    try {
        const res = await fetch('https://api.orbinuity.nl:34430/api/account/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Failed to load profile.');
        }

        // Set Heading
        document.getElementById('page-heading').textContent = `Welcome, ${data.displayName || data.username}`;

        // Populate User Info
        document.getElementById('info-username').textContent = `@${data.username}`;
        document.getElementById('info-display-name').textContent = data.displayName || 'None';
        document.getElementById('info-age').textContent = data.age ?? 'Not specified';
        document.getElementById('info-pronouns').textContent = data.pronouns || 'Not specified';
        document.getElementById('info-country').textContent = data.country || 'Not specified';

        // Format Member Since Date
        if (data.createdAt) {
            const createdDate = new Date(data.createdAt);
            document.getElementById('info-created-at').textContent = createdDate.toLocaleDateString();
        } else {
            document.getElementById('info-created-at').textContent = 'Unknown';
        }

    } catch (err) {
        const errorMsg = document.getElementById('error-msg');
        errorMsg.textContent = err.message;
    }
});