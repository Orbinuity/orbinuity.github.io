fetch('/project/files.json')
    .then(res => res.json())
    .then(files => {
        const cardList = document.getElementById('project-list');
        files.forEach(file => {
            const button = document.createElement('button');
            button.onclick = `window.location.href = '/project/${file[0]}';`;
            button.textContent = file[1];
            cardList.appendChild(button);
        });
    });
