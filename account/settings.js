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
        const res = await fetch('https://api.orbinuity.nl:34430/api/account/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');

        document.getElementById('displayName').value = data.displayName || '';
        document.getElementById('age').value = data.age || '';
        document.getElementById('pronouns').value = data.pronouns || '';
        document.getElementById('country').value = data.country || '';

        if (data.settings) {
            document.getElementById('theme').value = data.settings.theme || 'dark';
            document.getElementById('notifications').checked = Boolean(data.settings.notifications);
        }

    } catch (err) {
        const profileMsg = document.getElementById('profile-msg');
        profileMsg.style.color = 'red';
        profileMsg.textContent = err.message;
    }
});

async function saveProfile(event) {
    event.preventDefault();

    const token = getTokenCookie();
    const msg = document.getElementById('profile-msg');
    msg.textContent = '';

    if (!token) {
        window.location.href = '/account/login.html';
        return;
    }

    const displayName = document.getElementById('displayName').value.trim();
    const ageVal = document.getElementById('age').value;
    const pronounsVal = document.getElementById('pronouns').value.trim();
    const countryVal = document.getElementById('country').value.trim();

    try {
        const res = await fetch('https://api.orbinuity.nl:34430/api/account/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                displayName,
                age: ageVal ? parseInt(ageVal, 10) : null,
                pronouns: pronounsVal || null,
                country: countryVal || null
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update profile.');

        msg.style.color = 'green';
        msg.textContent = 'User info saved successfully!';

    } catch (err) {
        msg.style.color = 'red';
        msg.textContent = err.message;
    }
}

async function savePreferences(event) {
    event.preventDefault();

    const token = getTokenCookie();
    const msg = document.getElementById('settings-msg');
    msg.textContent = '';

    if (!token) {
        window.location.href = '/account/login.html';
        return;
    }

    const theme = document.getElementById('theme').value;
    const notifications = document.getElementById('notifications').checked;

    try {
        const res = await fetch('https://api.orbinuity.nl:34430/api/account/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                settings: {
                    theme,
                    notifications
                }
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update settings.');

        msg.style.color = 'green';
        msg.textContent = 'Preferences saved successfully!';

    } catch (err) {
        msg.style.color = 'red';
        msg.textContent = err.message;
    }
}