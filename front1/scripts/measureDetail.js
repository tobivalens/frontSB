import { BASE_URL } from "./constants.js";

const measureId = window.localStorage.getItem('selectedMeasureId');
const doctorId = window.localStorage.getItem('userClickedDue');  
const ctx = document.getElementById('fftChart').getContext('2d');
const autoChart = document.getElementById('autoChart').getContext('2d');
const info1= document.getElementById("info1");
const info2= document.getElementById("info2");

let fftChart;

const doctorToken = window.localStorage.getItem('access_token');  // Obtener el token del doctor

if (measureId && doctorId) {
    const loadMeasureDetail = async () => {
        try {
            const response = await fetch(`${BASE_URL}/measures/${measureId}`, {
                method: 'GET',
                headers: {
                    'Authorization':` Bearer ${doctorToken}`, // Agregar token en los encabezados
                }
            });
            if (!response.ok) throw new Error("No se pudo cargar el detalle de la medición");

            const measure = await response.json();
            
            document.getElementById('measureDate').textContent = new Date(measure.dateMeasure).toLocaleString();
            document.getElementById('measureState').textContent = measure.state;
            document.getElementById('typeMeasure').textContent = measure.measureType;

            loadComments(measureId);
        } catch (error) {
            console.error("Error al cargar el detalle de la medición:", error);
        }
    };

    loadMeasureDetail();
} else {
    console.error("No se encontró el ID de la medición o doctor en localStorage.");
}

const loadComments = async (measureId) => {
    try {
        const response = await fetch(`${BASE_URL}/comments/measureCommentary/${measureId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${doctorToken}`, // Agregar token en los encabezados
            }
        });

        if (response.ok) {
            const comments = await response.json();
            console.log(comments); // Ver los comentarios en la consola

            const commentsContainer = document.getElementById('commentList');
            commentsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos comentarios

            if (comments.length === 0) {
                const emptyMessage = document.getElementById('emptyMessage');
                emptyMessage.style.display = 'block'; // Mostrar el mensaje de "No hay comentarios"
            } else {
                comments.forEach(async (comment) => {
                    console.log(comment.id);  // Verificar el ID del comentario
                    
                    // Realiza una solicitud al backend para obtener el nombre del doctor asociado al comentario
                    const response1 = await fetch(`${BASE_URL}/comments/doctorComment/${comment.id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${doctorToken}`, // Agregar token en los encabezados
                        }
                    });
                    
                    if (!response1.ok) {
                        console.error("No se pudo cargar el nombre del doctor");
                        return;  // Si hay error, no proceses el comentario
                    }
                
                    const doctorName = await response1.text();  // Aquí solo recibes el nombre como texto
                    console.log(doctorName);
                    const commentElement = document.createElement('li');
                    commentElement.classList.add('comment');
                    commentElement.innerHTML = `
                        <p><strong>${comment.content}</strong> por ${doctorName}</p>
                        <button class="delete-button">Eliminar</button>
                    `;   
                    const deleteButton = commentElement.querySelector('.delete-button');
                    deleteButton.addEventListener('click', () => deleteComment(comment.id));
                    
                    commentsContainer.appendChild(commentElement);
                 });
            }
        } else {
            const errorResponse = await response.json();
            alert(errorResponse.message || 'No se encontraron comentarios');
        }
    } catch (error) {
        console.error('Error al cargar los comentarios:', error);
        alert('Error al cargar los comentarios. Por favor, intenta de nuevo.');
    }
};

// Función para eliminar un comentario
const deleteComment = async (commentId) => {
    try {
        const response = await fetch(`${BASE_URL}/deleteComments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${doctorToken}`, // Agregar token en los encabezados
            }
        });

        if (!response.ok) throw new Error("No se pudo eliminar el comentario");

        alert("Comentario eliminado correctamente");
        loadComments(measureId); 
    } catch (error) {
        console.error("Error al eliminar el comentario:", error);
        alert("Error al eliminar el comentario. Por favor, intenta de nuevo.");
    }
};

document.getElementById('addCommentButton').addEventListener('click', () => {
    document.getElementById('commentForm').style.display = 'block';
});

document.getElementById('submitComment').addEventListener('click', async () => {
    const commentText = document.getElementById('commentInput').value;

    if (commentText && doctorId && measureId) {
        try {
            const doctor = JSON.parse(localStorage.getItem('userClickedDue')); // Supongo que guardas el objeto completo de doctor

            if (doctor && doctor.id) {
                const doctorId = doctor.id;

                console.log(doctorId);  // Imprime el ID del doctor

                const response = await fetch(`${BASE_URL}/addComment`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${doctorToken}`, // Agregar token en los encabezados
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: commentText, 
                        measureId: measureId,
                        doctorId: doctorId
                    }),
                });
    
                if (!response.ok) throw new Error("No se pudo añadir el comentario");
    
                document.getElementById('commentInput').value = '';
                loadComments(measureId); // Refrescar la lista de comentarios
            } 
        } catch (error) {
            console.error("Error al añadir comentario:", error);
        }
    } else {
        console.error("Falta el texto del comentario o el ID de doctor/medición.");
    }
});

// nueva parte: logica para visualizar una medicion
const ctxAcc = document.getElementById('myChart').getContext('2d'); // Contexto para el acelerómetro
const ctxGyro = document.getElementById('myChartGyro').getContext('2d'); // Contexto para el giroscopio

const plot = (ctx, dataInputA, dataInputB, dataInputC) => {
    new Chart(ctx, {
        type: 'scatter', 
        data: {
            datasets: [
                {
                    label: 'Movimiento en x',
                    data: dataInputA,
                    borderWidth: 1, 
                    radius: 2, 
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    showLine: true, 
                    tension: 0.4,
                },
                {
                    label: 'Movimiento en y',
                    data: dataInputB,
                    borderWidth: 1, 
                    radius: 2, 
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    showLine: true,
                    tension: 0.4,
                },
                {
                    label: 'Movimiento en z',
                    data: dataInputC,
                    borderWidth: 1, 
                    radius: 2, 
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
                    type: 'linear', 
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
        let response = await fetch(`${BASE_URL}/evaluation/${id}`, {
            method: 'GET',
            headers: {
                'Authorization':` Bearer ${doctorToken}`, // Agregar token en los encabezados
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
    time = 0; 
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







function renderFFT(frequencies, spectrum) {
    if (fftChart) {
        fftChart.destroy(); // Destruye la gráfica previa si ya existe
    }

    fftChart = new Chart(ctx, {
        type: 'line', // Tipo de gráfica
        data: {
            labels: frequencies, // Frecuencias en el eje X
            datasets: [{
                label: 'FFT Spectrum',
                data: spectrum, // Valores del espectro en el eje Y
                borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Relleno
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Frequency (Hz)' // Etiqueta del eje X
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amplitude' // Etiqueta del eje Y
                    }
                }
            }
        }
    });
}

const  fetchFFTData= async (id) => {
    try {
         const response = await fetch(`http://localhost:8080/introtelapi/evaluation/${id}/fft`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del backend');
        }


        const responseText = await response.text();

        let objeto;
       
        try {
        objeto = JSON.parse(responseText);
        console.log(objeto.domain)
        console.log(objeto.entropy)
        } catch (error) {
        console.error("Error al parsear JSON:", error);
    return;
    }

        renderFFT(objeto.frequency, objeto.spectrum);
        info1.innerText = `El nivel de entropía es de: ${objeto.entropy}
        La frecuencia maxima es: ${objeto.filtered}`;


    } catch (error) {
        console.error('Error al graficar FFT:', error);
    }
}


async function fetchAutocorrelation(id) {
    const response = await fetch(`http://localhost:8080/introtelapi/evaluation/${id}/autocorrelation`);
    const data = await response.json();
    return { lags: data.lags, autocorrNorm: data.autocorrNorm};  
}

async function plotAutocorrelation(id) {
    const { lags, autocorrNorm } = await fetchAutocorrelation(id);
    new Chart(autoChart, {
        type: 'line',  // Tipo de gráfico
        data: {
            labels: lags,  
            datasets: [{
                label: 'Autocorrelación',
                data: autocorrNorm,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Lag (s)'  // Aquí mostramos los lags en segundos
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Autocorrelación'
                    }
                }
            }
        }
    });
}

plotAutocorrelation(measureId);
fetchFFTData(measureId);
getMeasureById(measureId);