import { BASE_URL } from "./constants.js";
import DoctorCard from './../components/DoctorCard.js';

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
                'Authorization': `Bearer ${admin_token}`
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
    doctors.forEach(doctor => {
        const doctorCard = new DoctorCard(doctor);
        doctorList.appendChild(doctorCard.render());
    });
};

document.getElementById("backButton").addEventListener('click', () => {
    location.href = 'adminOptions.html';
});

getDoctors();