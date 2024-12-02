
const ctxAcc = document.getElementById('myChart').getContext('2d'); // Contexto para el acelerómetro
const ctxGyro = document.getElementById('myChartGyro').getContext('2d'); // Contexto para el giroscopio

const plot = (ctx, dataInputA, dataInputB, dataInputC) => {
    new Chart(ctx, {
        type: 'scatter', // Mantener el tipo como 'scatter'
        data: {
            datasets: [
                {
                    label: 'Movimiento en x',
                    data: dataInputA,
                    borderWidth: 1, // Reducir el ancho del borde
                    radius: 2, // Reducción del tamaño del punto
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    showLine: true, // Dibujar líneas entre puntos
                    tension: 0.4, // Suavizar líneas (opcional)
                },
                {
                    label: 'Movimiento en y',
                    data: dataInputB,
                    borderWidth: 1, // Reducir el ancho del borde
                    radius: 2, // Reducción del tamaño del punto
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    showLine: true,
                    tension: 0.4,
                },
                {
                    label: 'Movimiento en z',
                    data: dataInputC,
                    borderWidth: 1, // Reducir el ancho del borde
                    radius: 2, // Reducción del tamaño del punto
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    showLine: true,
                    tension: 0.4,
                }
            ],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear', // Eje X lineal para un gráfico scatter
                    position: 'bottom',
                },
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};




const getMeasureById = async (id) => {
    let fs = 260;
    const token = window.localStorage.getItem('access_token'); 
    
    let response = await fetch(`http://localhost:8080/evaluation/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Añadir el token a la cabecera
            'Content-Type': 'application/json',
        }
    });
    
    if (!response.ok) {
        console.error("Error al obtener la evaluación:", response.statusText);
        return;
    }

    const responseText = await response.text();
    console.log("Texto del JSON recibido:", responseText); 
    let objeto;
    try {
        objeto = JSON.parse(responseText);
    } catch (error) {
        console.error("Error al parsear JSON:", error);
        return;
    }

    let array = objeto.readings.accelerometer;
    let AccDataX = []; 
    let AccDataY = [];
    let AccDataZ = [];  

    let time = 0;
    for (let i = 0; i < array.length; i++) {
        let pointA = { x: time, y: array[i].x };
        let pointB = { x: time, y: array[i].y };
        let pointC = { x: time, y: array[i].z };

        AccDataX.push(pointA);
        AccDataY.push(pointB);
        AccDataZ.push(pointC);

        time += (1000 / fs);
    }
    plot(ctxAcc, AccDataX, AccDataY, AccDataZ);

    let arrayGiroscope = objeto.readings.gyroscope;
    let AccDataXG = []; 
    let AccDataYG = [];
    let AccDataZG = [];  
    time = 0; // Reiniciar el tiempo para el giroscopio
    for (let i = 0; i < arrayGiroscope.length; i++) {
        let pointE = { x: time, y: arrayGiroscope[i].x };
        let pointF = { x: time, y: arrayGiroscope[i].y };
        let pointG = { x: time, y: arrayGiroscope[i].z };

        AccDataXG.push(pointE);
        AccDataYG.push(pointF);
        AccDataZG.push(pointG);

        time += (1000 / fs);
    }
    plot(ctxGyro, AccDataXG, AccDataYG, AccDataZG);
};

const getMeasureToPlot = async () => {
    const token = window.localStorage.getItem('access_token'); // Obtener el token desde localStorage
    
    let response = await fetch(`http://localhost:8080/measureGetId`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`, // Añadir el token a la cabecera
            'Content-Type': 'application/json',
        }
    });
    
    if (!response.ok) {
        console.error('Error al obtener el ID de la medida:', response.statusText);
        return; // Manejo de errores
    }
    
    // Extraer el ID de la respuesta
    let id = await response.json();
    getMeasureById(id);
};


getMeasureToPlot();

document.getElementById("backButton").addEventListener('click', () => {
    location.href = 'homeDoctor.html';  
});

    