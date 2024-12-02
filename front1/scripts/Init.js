
import { BASE_URL } from "./constants.js";
const measureBtn= document.getElementById("measureButton");
const registerBtn= document.getElementById("registerButton");

const emailInput= document.getElementById("emailInput");
const passwordInput= document.getElementById("passwordInput");
const loginButton= document.getElementById("loginButton");



const login = async () => {
    
    let user = {
        email:emailInput.value,
        password:passwordInput.value
    }
    
    let response = await fetch(`${BASE_URL}/users/login`,{
        method: 'POST',
        body:JSON.stringify(user),
        headers:{
            'Content-Type':'application/json'
        }
    });


    if(response.status === 200){
        let data = await response.json();
        console.log(data.access_token);
        //Almacenar el token
        window.localStorage.setItem('access_token', data.access_token);
        location.href = 'screens/Patients.html';

    }else{
        alert('Usuario o contraseño no existen en nuestros registros');
    }

}

loginButton.addEventListener('click', login);



measureBtn.addEventListener("click", (event)=>{
    location.href= "screens/Measure.html";
});

registerBtn.addEventListener("click", (event)=>{
    location.href= "screens/RegisterUser.html";
});