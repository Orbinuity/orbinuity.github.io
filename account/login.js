async function login(event) {
    event.preventDefault();

    const errorElement = document.getElementById('error-msg');
    errorElement.textContent = '';

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('https://api.orbinuity.nl:34430/api/auth/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || 'Login failed');
        }

        document.cookie = `token=${data.token}; path=/; max-age=604800; Secure; SameSite=Lax`;

        window.location.href = '/account';

    } catch (err) {
        errorElement.textContent = err.message;
    }
}