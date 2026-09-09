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
        if (!res.ok) throw new Error(data.error || 'Failed to load profile');

        document.getElementById('displayName').value = data.displayName || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('age').value = data.age || '';
        document.getElementById('pronouns').value = data.pronouns || '';
        document.getElementById('country').value = data.country || '';

        if (data.settings) {
            document.getElementById('theme').value = data.settings.theme || 'dark';
            document.getElementById('twoFactorEnabled').checked = Boolean(data.settings.twoFactorEnabled);
        }

    } catch (err) {
        const profileMsg = document.getElementById('profile-msg');
        if (profileMsg) {
            profileMsg.style.color = 'red';
            profileMsg.textContent = err.message;
        }
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
    const email = document.getElementById('email').value.trim();
    const ageVal = document.getElementById('age').value;
    const pronounsVal = document.getElementById('pronouns').value.trim();
    const countryVal = document.getElementById('country').value.trim();

    try {
        const res = await fetch(`${API_BASE}/api/account/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                displayName,
                email,
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
    const twoFactorEnabled = document.getElementById('twoFactorEnabled').checked;

    try {
        const res = await fetch(`${API_BASE}/api/account/settings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                settings: {
                    theme,
                    twoFactorEnabled
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

async function changePassword(event) {
    event.preventDefault();

    const token = getTokenCookie();
    const msg = document.getElementById('password-msg');
    msg.textContent = '';

    if (!token) {
        window.location.href = '/account/login.html';
        return;
    }

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        msg.style.color = 'red';
        msg.textContent = 'New passwords do not match.';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/account/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to change password.');

        msg.style.color = 'green';
        msg.textContent = data.message;

        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';

    } catch (err) {
        msg.style.color = 'red';
        msg.textContent = err.message;
    }
}

async function deleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.');
    if (!confirmed) return;

    const token = getTokenCookie();
    if (!token) {
        window.location.href = '/account/login.html';
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/api/account/me`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete account.');

        document.cookie = 'token=; path=/; max-age=0; Secure; SameSite=Lax';
        alert('Your account has been permanently deleted.');
        window.location.href = '/account/signup.html';

    } catch (err) {
        alert(err.message);
    }
}