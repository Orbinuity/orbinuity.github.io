fetch('/nogo/projects.json')
    .then(res => res.json())
    .then(projects => {
        const cardList = document.getElementById('project-list');
        projects.forEach(project => {
            const a = document.createElement('a');
            const button = document.createElement('button');
            
            a.href = `/project/${project[0]}`
            button.textContent = project[1];

            a.appendChild(button)
            cardList.appendChild(a);
        });
    });