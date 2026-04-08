const header = document.getElementById('header');

const userName = header.dataset.id;

fetch('/nogo/header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header').innerHTML = html;
    });

fetch('/nogo/projects.json')
    .then(res => res.json())
    .then(projects => {
        const dropdown = document.getElementById('dropdown-content');
        projects['all'].forEach(project => {
            const a = document.createElement('a');
            a.href = `/project#${project}`
            a.textContent = projects[project][0];

            dropdown.appendChild(a);
        });

        const links = document.querySelectorAll('nav a, #dropdown-content a');
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