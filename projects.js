fetch('/project/')
    .then(res => res.text())
    .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        const ul = document.getElementById('project-list');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if(href.endsWith('.html')) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '/htmls/' + href;
                a.textContent = href;
                li.appendChild(a);
                ul.appendChild(li);
            }
        });
    });