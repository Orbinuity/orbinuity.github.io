class OrbinuitySDK {
    constructor(appKey) {
        this.appKey = appKey;
        this.iframe = null;
        this.pendingRequests = new Map();
        this._initIframe();
    }

    _initIframe() {
        this.iframe = document.createElement('iframe');
        this.iframe.src = 'https://orbinuity.nl/api/bridge.html';
        this.iframe.style.display = 'none';
        document.body.appendChild(this.iframe);

        window.addEventListener('message', (event) => {
            if (event.origin !== 'https://orbinuity.nl') return;

            const { requestId, success, data, error } = event.data || {};
            if (this.pendingRequests.has(requestId)) {
                const { resolve, reject } = this.pendingRequests.get(requestId);
                this.pendingRequests.delete(requestId);

                if (success) {
                    resolve(data);
                } else {
                    reject(new Error(error));
                }
            }
        });
    }

    _send(action, payload = null) {
        return new Promise((resolve, reject) => {
            const requestId = Math.random().toString(36).substring(2) + Date.now().toString(36);
            this.pendingRequests.set(requestId, { resolve, reject });

            const message = {
                requestId,
                action,
                appKey: this.appKey,
                payload
            };

            const post = () => {
                this.iframe.contentWindow.postMessage(message, 'https://orbinuity.nl');
            };

            if (this.iframe.contentWindow) {
                post();
            } else {
                this.iframe.onload = post;
            }
        });
    }

    getUserInfo() {
        return this._send('getUserInfo');
    }
    get() {
        return this._send('get');
    }

    save(data) {
        return this._send('save', data);
    }
}