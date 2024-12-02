import { BASE_URL } from "./constants.js";

const admin_token = window.localStorage.getItem('admin_token');
if (admin_token === null) {
    location.href = './../adminLogin.html'; 
}

const doctorList = document.getElementById("doctorList");

const getDoctors = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/doctors/list`, {
            method: 'GET',
            headers: {
                'Authorization':` Bearer ${admin_token} `
            }
        });

        if (response.ok) {
            const doctors = await response.json(); 
            renderDoctors(doctors); 
        } else {
            const errorResponse = await response.json(); 
            alert('Error al obtener la lista de doctores: ' + (errorResponse.message || response.status));
        }
    } catch (error) {
        console.error('Error:', error); 
        alert('Error en la conexión. Por favor, intenta de nuevo.');
    }
};


const renderDoctors = (doctors) => {
    doctorList.innerHTML = ''; // Limpiar la lista antes de renderizar
    doctors.forEach(doctor => {
        const doctorDiv = document.createElement('div');
        doctorDiv.className = 'doctor-card'; 
        doctorDiv.innerHTML = `
            <h3>${doctor.name} ${doctor.lastname}</h3>
            <p>Cédula: ${doctor.cedula}</p>
            <hr>
        `;
        doctorList.appendChild(doctorDiv);
    });
};


const deleteDoctor = async (event) => {
    event.preventDefault(); 

    const doctorCedula = document.getElementById('doctorId').value.trim();

    
    if (!doctorCedula) {
        alert('Por favor, ingrese una cédula válida.');
        return;
    }

    try {
        // Hacer la solicitud DELETE
        const response = await fetch(`${BASE_URL}/admin/doctors/delete/${doctorCedula}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${admin_token}`,
                'Content-Type': 'application/json'
            }
        });

        // Manejo de la respuesta
        if (response.ok) {
            const data = await response.json();
            alert(data.message);  // Mostrar mensaje de éxito
            getDoctors();  // Recargar la lista de doctores
        } else {
            const errorResponse = await response.json();
            alert('Error al eliminar el doctor: ' + errorResponse.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el doctor. Intenta nuevamente.');
    }
};

// Asociar el evento al formulario
document.getElementById('deleteDoctorForm').addEventListener('submit', deleteDoctor);

// Obtener y mostrar la lista de doctores
getDoctors();

document.getElementById("backButton").addEventListener("click", function() {
    // Redirigir a la página de opciones de administrador (o la página que quieras)
    location.href = 'adminOptions.html'; // Cambia a la página que desees
});