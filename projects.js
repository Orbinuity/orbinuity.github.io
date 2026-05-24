fetch('/nogo/projects.json')
    .then(res => res.json())
    .then(projects => {
        const cardList = document.getElementById('project-list');
        projects.keys().forEach(project => {
            const a = document.createElement('a');
            a.className = "no-underline"
            a.href = `/project#${project}`

            const button = document.createElement('button');
            button.textContent = projects[project][0];

            a.appendChild(button)
            cardList.appendChild(a);

            cardList.appendChild(document.createTextNode(' '));
        });
    });