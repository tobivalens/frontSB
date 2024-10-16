const nameInput= document.getElementById("nameInput")
const lastnameInput= document.getElementById("lastNameInput")
const emailInput=document.getElementById("emailInput")
const passwordInput=document.getElementById("passwordInput")
const cedulaInput=document.getElementById("cedulaInput")
const diseaseInput=document.getElementById("diseaseInput")
const estadoInput=document.getElementById("estadoInput")

const signUpBtn= document.getElementById("signUpBtn")


const postUser=async(json)=>{
    let response=await fetch('http://localhost:8080/users/create',{
         method: 'POST',
         body: json,
         headers:{
             'Content-Type':'application/json'
         }       
     });
     let responseJson=await response.json();
     
 
 
 }
 
 signUpBtn.addEventListener('click', (event)=>{
     event.preventDefault();
     let name= nameInput.value;
     let lastname= lastnameInput.value;
     let email= emailInput.value;
     let cedula= cedulaInput.value;
     let disease= diseaseInput.value;
     let state= estadoInput.value;
     let password= passwordInput.value;
 
     let user= {
         name:name,
         lastname: lastname,
         email:email,
         cedula: cedula,
         disease: disease,
         state: state,
         password:password
 
     };
 
     //objeto a json
 
     let json =JSON.stringify(user);
     console.log(json);
 
     //post
     postUser(json);
     console.log('fin metodo')
 
 });
 