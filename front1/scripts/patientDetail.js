import { BASE_URL } from "./constants.js";

// Elementos existentes
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const lastnameElement = document.getElementById('lastname');
const cedulaElement = document.getElementById('cedula');
const diseaseElement = document.getElementById('disease');
const emailElement = document.getElementById('email');
const nameElement = document.getElementById('name');
const deletePatientButton = document.getElementById("deletePatientButton");

const user = JSON.parse(window.localStorage.getItem('userClicked'));
const patientId = user.cedula;

title.innerHTML = user.name;
subtitle.innerHTML = user.cedula;
lastnameElement.innerHTML = user.lastname;
cedulaElement.innerHTML = user.cedula;
diseaseElement.innerHTML = user.diagnostic;
emailElement.innerHTML = user.email;
nameElement.innerHTML = user.name;

// Función para eliminar paciente
const deletePatient = async (patientId) => {
    try {
        const token = window.localStorage.getItem('access_token'); // Obtener el token desde localStorage
        
        const response = await fetch(`${BASE_URL}/patients/delete/${patientId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Añadir el token a la cabecera
            }
        });

        if (response.ok) {
            alert("Paciente eliminado con éxito");
        } else {
            alert("No se pudo eliminar el paciente. Verifica si existe.");
        }
    } catch (error) {
        console.error("Error al eliminar el paciente:", error);
    }
};

deletePatientButton.addEventListener('click', () => deletePatient(patientId));

// Función para cargar las mediciones del paciente
const loadMeasures = async (cedula) => {
    try {
        const token = window.localStorage.getItem('access_token'); // Obtener el token desde localStorage

        const response = await fetch(`${BASE_URL}/users/allMeasures/${cedula}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Añadir el token a la cabecera
            }
        });

        if (!response.ok) {
            // Si la respuesta no es exitosa (404 o cualquier otro error)
            if (response.status === 404) {
                // Mostrar una alerta si no se encuentran mediciones
                alert("No se encontraron mediciones para este paciente.");
            } else {
                // Manejo general de errores
                throw new Error("No se pudieron cargar las mediciones.");
            }
            return;
        }

        const measures = await response.json();
        const measuresContainer = document.getElementById('patient-measures-container');
        measuresContainer.innerHTML = ''; // Limpiar contenedor

        if (measures.length === 0) {
            // Si no hay mediciones, mostrar alerta
            alert("No se encontraron mediciones para este paciente.");
        } else {
            // Si hay mediciones, mostrar los detalles
            measures.forEach(measure => {
                const measureElement = document.createElement('div');
                measureElement.classList.add('measure-item');

                measureElement.innerHTML = `
                    <p><strong>Fecha:</strong> ${new Date(measure.dateMeasure).toLocaleString("es-ES", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                    <button class="btn btn-primary btn-detail" data-id="${measure.id}">Ver detalles</button>
                `;
                
                // Agregar evento de clic para el botón "Ver detalles"
                measureElement.querySelector('.btn-detail').addEventListener('click', () => {
                    // Guarda el ID de la medición en localStorage
                    window.localStorage.setItem('selectedMeasureId', measure.id);
                    
                    // Redirige al HTML de detalles de la medición
                    location.href = 'measureDetail.html';
                });

                measuresContainer.appendChild(measureElement);
            });
        }
    } catch (error) {
        // Mostrar alerta de error si ocurre algo en el proceso
        alert("Error al cargar las mediciones. Intenta nuevamente más tarde.");
    }
};

// Llamar a la función para cargar las mediciones del paciente
loadMeasures(patientId);

