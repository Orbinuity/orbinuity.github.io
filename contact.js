const script = document.currentScript;

const mail = script.dataset.mail;
const sub = script.dataset.sub;
const prt = script.dataset.prt;
const ms = script.dataset.ms;

function sendEmail(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !message) {
        alert("Please fill in both fields.");
        return;
    }
    
    alert(ms.replace("&(name)", name));
    
    const subject = encodeURIComponent(sub.replace("&(name)", name));
    const body = encodeURIComponent(prt.replace("&(body)", message).replace("&(name)", name));
    const mailto = `mailto:${mail}?subject=${subject}&body=${body}`;
    
    window.open(mailto, "_blank");
}