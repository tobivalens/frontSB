const viewDoctors = document.getElementById("viewDoctors");
const addDoctor = document.getElementById("addDoctor");
const editDoctor = document.getElementById("editDoctor");
const deleteDoctor = document.getElementById("deleteDoctor");

viewDoctors.addEventListener("click", () => {
    event.preventDefault()
    window.location.href = "viewDoctors.html";
});

addDoctor.addEventListener("click", () => {
    event.preventDefault()
    window.location.href = "addDoctor.html";
});

deleteDoctor.addEventListener("click", () => {
    event.preventDefault()

    window.location.href = "deleteDoctor.html";
});

backButton.addEventListener("click", () => {
    window.location.href = "adminLogin.html"; 
});