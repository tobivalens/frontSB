import { BASE_URL } from "./constants.js";

const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async () => {
    event.preventDefault()

    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    const credentials = { username, password };

    const response = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        const data = await response.json();
        window.localStorage.setItem('admin_token', data.access_token); 
        console.log('Token almacenado:', data.access_token); 
        window.location.href = "adminOptions.html";
    } else {
        alert("Credenciales incorrectas");
    }
});

backButton.addEventListener("click", () => {
    window.location.href = "userSelection.html";  
});