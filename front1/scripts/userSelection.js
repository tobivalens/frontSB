const adminButton = document.getElementById("adminButton");
adminButton.addEventListener("click", () => {
    window.location.href = "/screens/adminLogin.html";
});

const doctorButton = document.getElementById("doctorButton");
doctorButton.addEventListener("click", () => {
    window.location.href = "/screens/loginDoctor.html";
});

