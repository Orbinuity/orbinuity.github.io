fetch('/nogo/projects.json')
    .then(res => res.json())
    .then(projects => {
        const cardList = document.getElementById('project-list');
        projects['all'].forEach(project => {
            const a = document.createElement('a');
            a.href = `/project#${project}`

            const button = document.createElement('button');
            button.textContent = projects[project][0];

            a.appendChild(button)
            cardList.appendChild(a);
        });
    });