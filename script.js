const header = document.getElementById('header');

const userName = header.dataset.id;

fetch('/nogo/header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;

        const links = document.querySelectorAll('nav a');
        links.forEach(link => {
            if(link.getAttribute('href') === userName) {
                link.style.textDecoration = 'underline';
            }
        });
    });

fetch('/nogo/footer.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('footer').innerHTML = html;
    });