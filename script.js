fetch('nogo/header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;

        const links = document.querySelectorAll('nav a');
        const currentPath = window.location.pathname;
        links.forEach(link => {
            if(link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    });