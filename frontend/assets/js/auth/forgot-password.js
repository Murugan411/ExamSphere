/* ==========================================
   ExamSphere - Forgot Password
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // SHOW / HIDE NEW PASSWORD
    // ==========================

    const newPassword = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const toggleNewPassword = document.getElementById("toggleNewPassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    toggleNewPassword.addEventListener("click", () => {

        if (newPassword.type === "password") {

            newPassword.type = "text";

            toggleNewPassword.classList.replace("fa-eye", "fa-eye-slash");

        } else {

            newPassword.type = "password";

            toggleNewPassword.classList.replace("fa-eye-slash", "fa-eye");

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
    // FORM VALIDATION
    // ==========================

    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const email = document.querySelector("input[type='email']").value.trim();

        const newPasswordValue = newPassword.value.trim();

        const confirmPasswordValue = confirmPassword.value.trim();

        if (
            email === "" ||
            newPasswordValue === "" ||
            confirmPasswordValue === ""
        ) {

            alert("Please fill in all fields.");

            return;

        }

        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;

        }

        if (newPasswordValue.length < 8) {

            alert("Password must contain at least 8 characters.");

            return;

        }

        if (newPasswordValue !== confirmPasswordValue) {

            alert("Passwords do not match.");

            return;

        }

        alert("Password reset successful! (Frontend Demo)");

        form.reset();

    });

});