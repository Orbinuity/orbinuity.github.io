const mondal = document.getElementById("mondal");
const mondalStay = document.getElementById("mondal");

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

mondalStay.onclick = () => mondal.close();

getUserCountry().then(country => {
    console.log(country);
    if (country === "NL") {
        mondal.showModal();
    }
})
