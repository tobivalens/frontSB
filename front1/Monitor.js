
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
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                },
                {
                    label: 'Movimiento en y',
                    data: dataInputB,
                    borderWidth: 3,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                },
                {
                    label: 'Movimiento en z',
                    data: dataInputC,
                    borderWidth: 3,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                }
            ],
        },
        options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};


const getMeasureById = async(id) => {
    let fs = 260;
    let response = await fetch(`http://localhost:8080/evaluation/${id}`);
    let objeto = await response.json();
    let array= objeto.readings.accelerometer;
    console.log(objeto.readings.accelerometer);

    let AccDataX=[]; 
    let AccDataY=[];
    let AccDataZ=[];  

    let time = 0;
    for(let i =0; i<array.length; i++){
        console.log(array[i]);
        let pointA = {x: time, y:array[i].x}
        let pointB = {x: time, y:array[i].y}
        let pointC = {x: time, y:array[i].z}

        AccDataX.push(pointA)
        AccDataY.push(pointB)
        AccDataZ.push(pointC)

        time += (1000/fs)

    }
    plot(ctxAcc, AccDataX, AccDataY, AccDataZ);

    let arrayGiroscope= objeto.readings.gyroscope;
    let AccDataXG=[]; 
    let AccDataYG=[];
    let AccDataZG=[];  
    for(let i =0; i<arrayGiroscope.length; i++){
        console.log(arrayGiroscope[i]);
        let pointE = {x: time, y:arrayGiroscope[i].x}
        let pointF = {x: time, y:arrayGiroscope[i].y}
        let pointG = {x: time, y:arrayGiroscope[i].z}

        AccDataXG.push(pointE)
        AccDataYG.push(pointF)
        AccDataZG.push(pointG)

        time += (1000/fs)

    }
    plot(ctxGyro, AccDataXG, AccDataYG, AccDataZG);
    
};

//getMeasureById(202);

const getMeasureToPlot= async() => {
  let response = await fetch(`http://localhost:8080/measureGetId`);
    
  if (!response.ok) {
      console.error('Error al obtener el ID de la medida:', response.statusText);
      return; // Manejo de errores
  }
  
  // Extraer el ID de la respuesta
  let id = await response.json();
  getMeasureById(id);
};

getMeasureToPlot();

    