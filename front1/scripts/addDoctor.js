import { BASE_URL } from "./constants.js";

const admin_token = window.localStorage.getItem('admin_token');
if (admin_token === null) {
    location.href = './../adminLogin.html'; 
}

const saveButton = document.getElementById("saveButton");

const areFieldsComplete = (fields) => {
    for (const field of fields) {
        if (field.trim() === "") {
            return false;
        }
    }
    return true;
};

const isCedulaUnique = async (cedula) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/doctors/checkCedula?cedula=${cedula}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${admin_token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            return data.unique; 
        } else {
            alert('Error al verificar la cédula');
            return false;
        }
    } catch (error) {
        console.error('Error al verificar cédula:', error);
        alert('Error en la conexión. Por favor, intenta de nuevo.');
        return false;
    }
};

const addDoctor = async () => {
    const name = document.getElementById("name").value;
    const lastname = document.getElementById("lastname").value;
    const email = document.getElementById("email").value;
    const cedula = document.getElementById("cedula").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    const fields = [name, lastname, email, cedula, phone, password];
    if (!areFieldsComplete(fields)) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    if (!/^\d+$/.test(cedula)) {
        alert('La cédula debe contener solo números.');
        return;
    }

    const uniqueCedula = await isCedulaUnique(cedula);
    if (!uniqueCedula) {
        alert('La cédula ya está registrada.');
        return;
    }

    const doctor = {
        name,
        lastname,
        email,
        cedula,
        phone,
        password 
    };

    try {
        const response = await fetch(`${BASE_URL}/admin/doctors/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${admin_token}` 
            },
            body: JSON.stringify(doctor)  
        });

        if (response.ok) { 
            alert('Doctor agregado exitosamente');
            location.href = 'viewDoctors.html';  
        } else {
            const errorResponse = await response.json(); 
            alert('Error al agregar doctor: ' + (errorResponse.message || response.status));
        }
    } catch (error) {
        console.error('Error:', error); 
        alert('Error en la conexión. Por favor, intenta de nuevo.');
    }
};

saveButton.addEventListener('click', addDoctor);

document.getElementById("backButton").addEventListener('click', () => {
    location.href = 'adminOptions.html';  
});