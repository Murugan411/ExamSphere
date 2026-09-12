/* ==========================================
   ExamSphere - Student Registration
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Password Visibility
    // ==========================

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";
            togglePassword.classList.replace("fa-eye", "fa-eye-slash");

        } else {

            password.type = "password";
            togglePassword.classList.replace("fa-eye-slash", "fa-eye");

        }

    });

    toggleConfirmPassword.addEventListener("click", () => {

        if (confirmPassword.type === "password") {

            confirmPassword.type = "text";
            toggleConfirmPassword.classList.replace("fa-eye", "fa-eye-slash");

        } else {

            confirmPassword.type = "password";
            toggleConfirmPassword.classList.replace("fa-eye-slash", "fa-eye");

        }

    });

    // ==========================
    // Form Validation
    // ==========================

    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const fullName = document.querySelector("input[type='text']").value.trim();

        const email = document.querySelector("input[type='email']").value.trim();

        const phone = document.querySelector("input[type='tel']").value.trim();

        const passwordValue = password.value.trim();

        const confirmPasswordValue = confirmPassword.value.trim();

        // Empty validation

        if (
            fullName === "" ||
            email === "" ||
            phone === "" ||
            passwordValue === "" ||
            confirmPasswordValue === ""
        ) {

            alert("Please fill in all required fields.");

            return;

        }

        // Email validation

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;

        }

        // Phone validation

        if (phone.length !== 10 || isNaN(phone)) {

            alert("Please enter a valid 10-digit phone number.");

            return;

        }

        // Password length

        if (passwordValue.length < 8) {

            alert("Password must contain at least 8 characters.");

            return;

        }

        // Password match

        if (passwordValue !== confirmPasswordValue) {

            alert("Passwords do not match.");

            return;

        }

        alert("Registration Successful! (Frontend Demo)");

        form.reset();

    });

});