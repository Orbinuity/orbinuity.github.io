const script = document.currentScript;

const mail = script.dataset.mail;

function sendEmail(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const message = document.getElementById('message').value.trim();
    
    if (!name || !message) {
        alert("Please fill in both fields.");
        return;
    }
    
    alert("Thank you for messaging us, " + name + "! Your email app will now open.");
    
    const subject = encodeURIComponent(`${name} has a question!`);
    const body = encodeURIComponent(message);
    const mailto = `mailto:${mail}?subject=${subject}&body=Hello%20Orbinuity%2C%0A%0A${body}%0A%0AWith%20kind%20regards%2C%0A${encodeURIComponent(name)}`;
    
    window.location.href = mailto;
}