fetch('/nogo/projects.json')
    .then(res => res.json())
    .then(projects => {
        const cardList = document.getElementById('project-list');
        projects.forEach(project => {
            const button = document.createElement('button');
            button.addEventListener('keypress', (event) => {
                window.location.href = `/project/${project[0]}`;
            });
            button.textContent = project[1];
            cardList.appendChild(button);
        });
    });
