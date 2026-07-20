const mondal = document.getElementById("mondal");
const mondalStay = document.getElementById("mondal");

function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${name}=${encodedValue}; ${expires}; path=/; SameSite=Lax; Secure`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return decodeURIComponent(cookie.substring(nameEQ.length));
        }
    }
    return null;
}

async function getUserCountry() {
    try {
        const response = await fetch('https://ipapi.co/json');
        const data = await response.json();
        return data.country_code;
    } catch (error) {
        console.log(error)
        const userLocale = navigator.language || navigator.languages[0];
        return userLocale.includes('-') ? userLocale.split('-')[1] : null;
    }
}

mondalStay.onclick = () => {
    mondal.close();
    setCookie("stay", "yes", 14);
};

if (getCookie("stay") !== "yes") {
    getUserCountry().then(country => {
        console.log(country);
        if (country === "NL") {
            mondal.showModal();
        }
    });
}