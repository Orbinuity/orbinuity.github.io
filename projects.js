fetch('/project/files.json')
    .then(res => res.json())
    .then(files => {
        const ul = document.getElementById('file-list');
        files.forEach(file => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '/project/' + file;
            a.textContent = file;
            li.appendChild(a);
            ul.appendChild(li);
        });
    });
