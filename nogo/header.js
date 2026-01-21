fetch('/nogo/projects.json')
    .then(res => res.json())
    .then(projects => {
        const dropdown = document.getElementById('dropdown-content');
        projects.forEach(project => {
            const a = document.createElement('a');
            a.href = `/project/${project[0]}`

            dropdown.appendChild(a);
        });
    });