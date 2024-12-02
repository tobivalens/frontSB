export default class PatientCard {
    constructor(user) {
        this.user = user;
    }

    onClick() {
        let json = JSON.stringify(this.user);
        window.localStorage.setItem('userClicked', json);
        location.href = 'patientDetail.html';
    }

    render() {
        let container = document.createElement('div');
        container.classList.add('card', 'nicecard', 'm-3', 'col-md-4'); // Asegúrate de que las tarjetas se alineen en columnas

        let cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        let title = document.createElement('h3');
        title.classList.add('card-title');

        let description = document.createElement('h6');
        description.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');

        cardBody.appendChild(title);
        cardBody.appendChild(description);
        container.appendChild(cardBody);

        title.textContent = this.user.name;
        description.textContent = this.user.email;

        container.addEventListener('click', () => this.onClick());

        return container;
    }
}
