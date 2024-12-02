import { BASE_URL } from "./constants.js"; 

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginButton = document.getElementById("loginButton");

const login = async () => {
    event.preventDefault();


    let user = {
        email: emailInput.value,
        password: passwordInput.value
    };
    
    let response = await fetch(`${BASE_URL}/doctors/login`, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 200) {
        let data = await response.json();
        

        window.localStorage.setItem('access_token', data.access_token);
        console.log(data.access_token);

        let doctorResponse = await fetch(`${BASE_URL}/doctors/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${data.access_token}`,
                'Content-Type': 'application/json'
            }
        });

        if (doctorResponse.status === 200) {
            let doctorData = await doctorResponse.json();
            window.localStorage.setItem('userClickedDue', JSON.stringify(doctorData));
        } else {
            console.error('No se pudieron obtener los datos del doctor');
        }

        location.href = "homeDoctor.html";
    } else {
        alert('Usuario o contraseña no existentes');
    }
};

loginButton.addEventListener('click', login);

backButton.addEventListener("click", () => {
    window.location.href = "userSelection.html";  
});
