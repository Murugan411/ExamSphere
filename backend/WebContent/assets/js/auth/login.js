/* ==========================================
   ExamSphere - Student Login
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       SHOW / HIDE PASSWORD
    ========================== */

    const password = document.getElementById("password");

    const togglePassword = document.getElementById("togglePassword");

    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.classList.remove("fa-eye");

            togglePassword.classList.add("fa-eye-slash");

        } else {

            password.type = "password";

            togglePassword.classList.remove("fa-eye-slash");

            togglePassword.classList.add("fa-eye");

        }

    });

    /* ==========================
       FORM VALIDATION
    ========================== */

    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const email = document.querySelector("input[type='email']").value.trim();

        const passwordValue = password.value.trim();

        if (email === "" || passwordValue === "") {

            alert("Please enter your email and password.");

            return;

        }

        alert("Frontend Login Successful!");

    });

});