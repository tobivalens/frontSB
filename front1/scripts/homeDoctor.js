const measureBtn= document.getElementById("measureButton");
const patientsButton= document.getElementById("patientsButton");
const registerPatientButton= document.getElementById("registerPatientButton");

const access_token = window.localStorage.getItem('access_token');
if(access_token === null){
    location.href = './../homeDoctor.html';
}

patientsButton.addEventListener("click", (event)=>{
    location.href= "Patients.html";
});


measureButton.addEventListener("click", (event)=>{
    location.href= "Measure.html";
});

registerPatientButton.addEventListener("click", (event)=>{
    location.href= "RegisterUser.html";
});

const backButton = document.getElementById("backButton");

    backButton.addEventListener("click", () => {
        window.location.href = "loginDoctor.html";  
    });