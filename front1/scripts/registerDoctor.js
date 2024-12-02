const nameInput = document.getElementById("nameInput");
const lastnameInput = document.getElementById("lastNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const cedulaInput = document.getElementById("cedulaInput");
const phoneInput = document.getElementById("phoneInput");
const submitButton = document.getElementById("submitButton");

const postDoctor = async (json) => {
    try {
        let response = await fetch('http://localhost:8080/introtelapi/doctors/create', {
            method: 'POST',
            body: json,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            return true;
        } else {
            console.error("Error en la solicitud:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
};

submitButton.addEventListener('click', async (event) => {
    event.preventDefault();
    
    let doctor = {
        name: nameInput.value,
        lastname: lastnameInput.value,
        email: emailInput.value,
        cedula: cedulaInput.value,
        password: passwordInput.value,
        phone: phoneInput.value
    };

    let json = JSON.stringify(doctor);
    console.log(json);

    
    const success = await postDoctor(json);


    if (success) {
        alert("Registro exitoso");
        location.href = 'loginDoctor.html';
    } else {
        alert("Hubo un problema al registrar. Inténtalo nuevamente.");
    }
});
