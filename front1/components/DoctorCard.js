export default class DoctorCard {
    constructor(doctor) {
        this.doctor = doctor;
    }

    onClick() {
        const doctorData = JSON.stringify(this.doctor);
        window.localStorage.setItem('doctorClicked', doctorData);
        location.href = 'doctorDetail.html';
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('card', 'doctor-card', 'm-3', 'col-md-4'); // Cambiado de 'nicecard' a 'doctor-card'

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const title = document.createElement('h3');
        title.classList.add('card-title');

        const description = document.createElement('h6');
        description.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');

        cardBody.appendChild(title);
        cardBody.appendChild(description);
        container.appendChild(cardBody);

        title.textContent = `${this.doctor.name} ${this.doctor.lastname}`;
        description.textContent = this.doctor.email;

        container.addEventListener('click', () => this.onClick());

        return container;
    }
}