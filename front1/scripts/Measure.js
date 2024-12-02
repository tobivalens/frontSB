const startMeasureBtn = document.getElementById("startMeasureBtn");
const label = document.getElementById("measureLabel");
const state = document.getElementById("status");
const cedula = document.getElementById("cedula");
const lastMedicine = document.getElementById("time");

const client = new Paho.MQTT.Client("broker.emqx.io", Number(8083), "clienteWebValensBcknd");
const topic = "icesitel";

client.connect({
    onSuccess: () => {
        console.log("Conectado!");
        client.subscribe(topic);
    }
});

const sendMessage = (msg) => {
    const message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
};

startMeasureBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const mode = document.querySelector('input[name="mode"]:checked');
    if (!state.value || !lastMedicine.value || !cedula.value || !mode) {
        alert('Por favor, complete todos los campos antes de continuar.');
        return;
    }

    let messageText = "m";
    sendMessage(messageText);
    console.log("Mensaje MQTT enviado: Iniciar Medición");
});

client.onMessageArrived = async (message) => {
    const receivedMessage = message.payloadString;
    console.log("Mensaje MQTT recibido:", receivedMessage);

    if (receivedMessage === "E") {
        // Obtener los valores de los elementos del formulario
        const cedulaValue = cedula?.value || "";
        const stateValue = state?.value || "";
        const lastMedicineValue = lastMedicine?.value || "";
        const modeElement = document.querySelector('input[name="mode"]:checked');
        const modeValue = modeElement ? modeElement.value : "";

        if (!cedulaValue || !stateValue || !lastMedicineValue || !modeValue) {
            console.error("Error: Faltan datos en el formulario.");
            return;
        } else {
            // Llamada a la función para enviar los datos al backend
            const success = await postMeasureData(cedulaValue, stateValue, lastMedicineValue, modeValue);

            if (success) {
                alert("se mandaron los datos");
                // Redirigir a la página Monitor.html si el POST fue exitoso
                location.href = "Monitor.html";
            } else {
                console.error("Error al enviar los datos al backend.");
            }
        }
    }
};

const postMeasureData = async (cedula, state, lastMedicine, mode) => {
    try {
        const data = {
            cedula: cedula,
            state: state,
            lastMedicine: lastMedicine,
            mode: mode
        };

        const response = await fetch('http://localhost:8080/introtelapi/patient/setData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.text();  // Puede ser JSON, dependiendo de la respuesta
            console.log("Datos enviados exitosamente al backend:", result);
            return true;  // Indica que el POST fue exitoso
        } else {
            console.error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            return false;
        }
    } catch (error) {
        console.error("Error al enviar datos al backend:", error);
        return false;
    }
};