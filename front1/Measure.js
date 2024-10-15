const startMeasureBtn= document.getElementById("startMeasure");
const label = document.getElementById("measureLabel");


const client = new Paho.MQTT.Client("broker.hivemq.com", Number(8000), "cliente_web");
const topic= "icesitel"


    label.textContent = "Presiona el botón para iniciar la medición:";
    label.style.fontSize = "18px";
    label.style.color = "black";

    label.style.fontWeight = "bold";
    label.style.marginRight = "15px"; 
    document.body.style.display = "flex";
    document.body.style.justifyContent = "center";   
    document.body.style.alignItems = "center"; 
    document.body.style.height = "100vh";            
    document.body.style.margin = "0";                
    document.body.style.backgroundColor = "#f0f8ff"; 
    document.body.style.fontFamily = "Arial, sans-serif";



    startMeasureBtn.style.padding = "50px 70px";
    startMeasureBtn.style.backgroundColor = "#4CAF50"; 
    startMeasureBtn.style.color = "white";
    startMeasureBtn.style.border = "none";
    startMeasureBtn.style.borderRadius = "5px";
    startMeasureBtn.style.cursor = "pointer";
    startMeasureBtn.style.fontSize = "26px";

    startMeasureBtn.disabled ? startMeasureBtn.style.opacity = "0.5" : startMeasureBtn.style.opacity = "1.0";

client.connect({onSuccess:() => {
    console.log("conectado!")
    client.subscribe(topic);
}});

const sendMessage = (msg) => {
    message = new Paho.MQTT.Message(msg);
    message.destinationName = topic;
    client.send(message);
};

startMeasureBtn.addEventListener("click", (event)=>{
    event.preventDefault();
    let messageText= "m";
    sendMessage(messageText);
    console.log("Mensaje MQTT enviado: Iniciar Medición");

});




