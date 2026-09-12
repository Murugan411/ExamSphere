/* ==========================================
   ExamSphere - Admin Login
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SHOW / HIDE PASSWORD
    ================================== */

    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.classList.remove("fa-eye");

            togglePassword.classList.add("fa-eye-slash");

        } else {

            passwordInput.type = "password";

            togglePassword.classList.remove("fa-eye-slash");

            togglePassword.classList.add("fa-eye");

        }

    });

    /* ==================================
       LOGIN FORM
    ================================== */

    const loginForm = document.querySelector("form");

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const email = document.querySelector("input[type='email']").value.trim();
        const password = passwordInput.value.trim();

        if (email === "" || password === "") {

            alert("Please enter Admin Email and Password.");

            return;

        }

        alert("Admin Login Successful! (Frontend Demo)");

        // Future Backend Integration
        // window.location.href = "admin-dashboard.html";

    });

    /* ==================================
       ENTER KEY SUPPORT
    ================================== */

    document.addEventListener("keypress", (event) => {

        if (event.key === "Enter") {

            loginForm.requestSubmit();

        }

    });

    /* ==================================
       PAGE LOAD ANIMATION
    ================================== */

    const loginBox = document.querySelector(".login-box");

    loginBox.style.opacity = "0";
    loginBox.style.transform = "translateY(40px)";

    setTimeout(() => {

        loginBox.style.transition = "0.6s ease";

        loginBox.style.opacity = "1";

        loginBox.style.transform = "translateY(0)";

    }, 200);

});