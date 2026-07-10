fetch('http://127.0.0.1:3000/nogo/news.html')
    .then(response => response.text())
    .then(html => {
        if (document.currentScript?.dataset?.nonews !== "true") {
            const range = document.createRange();
            const fragment = range.createContextualFragment(html);
            document.getElementById('header').appendChild(fragment);
        }
    });

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