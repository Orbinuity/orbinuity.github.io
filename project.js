function renderContent() {
    const route = window.location.hash.substring(1); 
    const title = document.getElementById('project-title');
    const name = document.getElementById('project-name')
    const description = document.getElementById('project-description');
    const buttons = document.getElementById('project-buttons');

    if (!route || route === '/') {
        title.textContent = "Orbinuity - Project";
        name.textContent = "Project"
        description.textContent = ""
        return;
    } else {
        fetch('/nogo/projects.json')
        .then(res => res.json())
        .then(projects => {
            const project = projects[route]

            title.textContent = `Orbinuity - ${project[0]}`
            name.textContent = project[0]
            description.textContent = project[1]

            let pageButtons = [[`https://github.com/Orbinuity/${route}`, "Repo"], [`https://github.com/Orbinuity/${route}/releases`, "Download"], [`https://help.orbinuity.nl/docs/${route}`, "Docs"]]
            
            pageButtons = pageButtons.concat(project[2])
            
            buttons.innerHTML = '';
            pageButtons.forEach(button => {
                const a = document.createElement('a');
                a.className = "no-underline"
                a.href = button[0]

                const pageButton = document.createElement('button');
                pageButton.textContent = button[1];

                a.appendChild(pageButton)
                buttons.appendChild(a);
                buttons.appendChild(document.createTextNode(' '));
            });
        });
    }
}

renderContent();

window.addEventListener('hashchange', renderContent);