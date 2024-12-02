const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const nameElement = document.getElementById('name');
const lastnameElement = document.getElementById('lastname');
const cedulaElement = document.getElementById('cedula');
const emailElement = document.getElementById('email');
const phoneElement = document.getElementById('phone');

const doctor = JSON.parse(window.localStorage.getItem('doctorClicked'));

if (doctor) {
    title.textContent = `${doctor.name} ${doctor.lastname}`;
    subtitle.textContent = "Detalles del Doctor";
    nameElement.textContent = doctor.name;
    lastnameElement.textContent = doctor.lastname;
    cedulaElement.textContent = doctor.cedula;
    emailElement.textContent = doctor.email;
    phoneElement.textContent = doctor.phone || "No disponible";
}

document.getElementById("backButton").addEventListener('click', () => {
    location.href = 'viewDoctors.html';
});