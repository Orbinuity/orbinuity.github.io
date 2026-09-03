const signout = document.getElementById("signout");
const account = document.getElementById("account");
const navBar = document.getElementById("nav-bar");

const token = document.cookie
    .split("; ")
    .find(row => row.startsWith('token='))
    ?.split("=")[1];

fetch('/nogo/projects.json')
    .then(res => res.json())
    .then(projects => {
        Object.keys(projects).forEach(project => {
            const dropdown = document.getElementById("dropdown-projects");
            const a = document.createElement('a');
            a.href = `/project?id=${project}`
            a.textContent = projects[project][0];

            dropdown.appendChild(a);
        });
    });

signout.addEventListener("click", (e) => {
    e.preventDefault();
    document.cookie = "token=; max-age=0; path=/";
    location.reload();
});

if (!token) {
    account.remove()

    const login = document.createElement("a");
    login.href = "/account/login";
    login.innerText = "Login";

    const signout = document.createElement("a");
    signout.href = "/account/signup";
    signout.innerText = "Signup";

    navBar.innerHTML += login.outerHTML;
    navBar.innerHTML += signout.outerHTML;
}