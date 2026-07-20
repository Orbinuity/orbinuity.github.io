function renderContent() {
    const hashRoute = window.location.hash.substring(1);
    if (hashRoute && hashRoute !== '/') {
        const newUrl = `${window.location.pathname}?id=${encodeURIComponent(hashRoute)}`;
        window.history.replaceState(null, '', newUrl);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const route = urlParams.get('id');

    const title = document.getElementById('project-title');
    const name = document.getElementById('project-name');
    const description = document.getElementById('project-description');
    const buttons = document.getElementById('project-buttons');

    if (!route || route === '/') {
        title.textContent = "Orbinuity - Project";
        name.textContent = "Project";
        description.textContent = "";
        if (buttons) buttons.innerHTML = '';
        return;
    } else {
        fetch('/nogo/projects.json')
        .then(res => res.json())
        .then(projects => {
            const project = projects[route];

            if (!project) return;

            title.textContent = `Orbinuity - ${project[0]}`;
            name.textContent = project[0];
            description.textContent = project[1];

            let pageButtons = [
                [`https://github.com/Orbinuity/${route}`, "Repo"], 
                [`https://github.com/Orbinuity/${route}/releases`, "Download"], 
                [`https://help.orbinuity.nl/docs/${route}`, "Docs"]
            ];
            
            pageButtons = pageButtons.concat(project[2] || []);
            
            buttons.innerHTML = '';
            pageButtons.forEach(button => {
                const a = document.createElement('a');
                a.className = "no-underline";
                a.href = button[0];

                const pageButton = document.createElement('button');
                pageButton.textContent = button[1];

                a.appendChild(pageButton);
                buttons.appendChild(a);
                buttons.appendChild(document.createTextNode(' '));
            });
        })
        .catch(err => console.error("Failed to load projects:", err));
    }
}

renderContent();

window.addEventListener('popstate', renderContent);