fetch('/nogo/header.html')
    .then(response => response.text())
    .then(html => {
        const range = document.createRange();
        const fragment = range.createContextualFragment(html);
        document.getElementById('header').appendChild(fragment);
    });

fetch('/nogo/footer.html')
    .then(response => response.text())
    .then(html => {
        const range = document.createRange();
        const fragment = range.createContextualFragment(html);
        document.getElementById('footer').appendChild(fragment);
    });

async function checkTermsConsent(userData) {
    if (!userData.needsTermsAcceptance) return;

    let modal = document.getElementById('terms-modal');
    if (!modal) {
        modal = document.createElement('dialog');
        modal.id = 'terms-modal';
        modal.innerHTML = `
            <h2>Updated Terms & Policies</h2>
            <p style="margin: 15px 0; color: var(--dark-text);">
                We have updated our Terms of Service and Privacy Policy. You must review and accept the changes to continue using your account.
            </p>
            <p style="margin-bottom: 20px;">
                <a href="/terms" target="_blank">Terms of Service</a> | 
                <a href="/privacy" target="_blank">Privacy Policy</a>
            </p>
            <button id="accept-terms-btn">I Agree & Continue</button>
        `;
        document.body.appendChild(modal);
    }

    modal.showModal();

    document.getElementById('accept-terms-btn').onclick = async () => {
        const token = getTokenCookie();
        const res = await fetch(`${API_BASE}/api/account/accept-terms`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            modal.close();
            window.location.reload();
        } else {
            alert('Failed to update terms acceptance.');
        }
    };
}