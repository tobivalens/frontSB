import PatientCard from "./../components/PatientCard.js";
import { BASE_URL } from "./constants.js";

// Obtener el token almacenado
const token = window.localStorage.getItem('access_token'); // Usar el nombre exacto
if (token === null) {
    location.href = './../loginDoctor.html'; // Redirigir si no hay token
}

// Obtener la lista de usuarios
const getAllUsers = async (accessToken) => {
    try {
        const response = await fetch(`${BASE_URL}/users/list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}` // Usar el token correctamente
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                // Token inválido o no autorizado
                alert("Sesión no válida. Por favor, inicia sesión nuevamente.");
                window.localStorage.removeItem('access_token'); // Eliminar token inválido
                location.href = './../loginDoctor.html'; // Redirigir al inicio de sesión
            } else {
                throw new Error("Error al obtener la lista de usuarios.");
            }
        }

        const userList = await response.json();
        console.log(userList);

        const patientList = document.getElementById('patientList');

        userList.forEach(user => {
            let patientCard = new PatientCard(user);
            let component = patientCard.render();
            patientList.appendChild(component);
        });
    } catch (error) {
        console.error("Error al cargar la lista de usuarios:", error);
        alert("Ocurrió un problema al cargar la lista. Intenta nuevamente más tarde.");
    }
};

// Llamar a la función para obtener la lista de usuarios
getAllUsers(token);
