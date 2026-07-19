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