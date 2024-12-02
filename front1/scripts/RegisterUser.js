const nameInput = document.getElementById("nameInput");
const lastnameInput = document.getElementById("lastNameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const cedulaInput = document.getElementById("cedulaInput");
const diagnosticInput = document.getElementById("diagnosticInput");
const birthdayInput = document.getElementById("birthdayInput");

const signUpBtn = document.getElementById("signUpBtn");
const doctorToken = window.localStorage.getItem('access_token');
// Función para validar si la cédula ya existe
const checkCedulaExists = async (cedula) => {
    try {
        const response = await fetch(`http://localhost:8080/introtelapi/users/check-cedula?cedula=${cedula}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${doctorToken}`
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            return data.exists; 
        } else {
            console.error('Error al verificar la cédula');
            alert('Hubo un error al verificar la cédula. Intente más tarde.');
            return true; 
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error de conexión al verificar la cédula.');
        return true; 
    }
};


const isNumericCedula = (cedula) => {
    const numericRegex = /^[0-9]+$/; 
    return numericRegex.test(cedula);
};

const areFieldsComplete = (fields) => {
    for (const field of fields) {
        if (field.trim() === "") {
            return false;
        }
    }
    return true;
};

const postUser = async (json) => {
    try {
        let response = await fetch('http://localhost:8080/introtelapi/users/create', {
            method: 'POST',
            body: json,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${doctorToken}`
            }
        });

        if (response.status === 200) {
            console.log('Usuario registrado exitosamente');

            let responseJson = await response.json();
            console.log(responseJson);
            alert("Usuario registrado exitosamente");
            location.href = "./../screens/homeDoctor.html";
        } else {
            console.error('Error al registrar el usuario');
            alert('Hubo un problema al registrar al usuario. Verifique los datos e intente de nuevo.');
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un error al conectar con el servidor. Intente más tarde.');
    }
};

const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

signUpBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    let name = nameInput.value;
    let lastname = lastnameInput.value;
    let email = emailInput.value;
    let cedula = cedulaInput.value;
    let diagnostic = diagnosticInput.value;
    let birthday = birthdayInput.value;
    let age = calculateAge(birthday);
    let password = passwordInput.value;

    const fields = [name, lastname, email, cedula, diagnostic, birthday, password];
    if (!areFieldsComplete(fields)) {
        alert("Por favor, complete todos los campos.");
        return;
    }
    
    if (!isNumericCedula(cedula)) {
        alert("La cédula debe contener solo números.");
        return;
    }
 
    const cedulaExists = await checkCedulaExists(cedula);
    if (cedulaExists) {
        alert("La cédula ya está registrada. Por favor, ingrese una cédula diferente.");
        return; 
    }

    if (diagnostic === "si") {
        diagnostic = "CONTROL"; // Suponiendo que el backend espera "ACTIVE"
    } else if (diagnostic === "no") {
        diagnostic = "PATIENT"; // Suponiendo que el backend espera "INACTIVE"
    }

    let user = {
        name: name,
        email: email,
        lastname: lastname,
        cedula: cedula,
        password: password,
        age: age,
        birthday: birthday,
        diagnostic: diagnostic
    };

    let json = JSON.stringify(user);
    console.log(json);

    postUser(json);
});