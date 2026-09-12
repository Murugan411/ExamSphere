/* ==========================================
   ExamSphere - Admin Profile
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       PROFILE CARD ANIMATION
    ================================== */

    const profileCard = document.querySelector(".profile-card");

    profileCard.style.opacity = "0";
    profileCard.style.transform = "translateY(30px)";

    setTimeout(() => {

        profileCard.style.transition = "0.6s ease";

        profileCard.style.opacity = "1";

        profileCard.style.transform = "translateY(0)";

    }, 200);

    /* ==================================
       EDIT PROFILE
    ================================== */

    const editButton = document.querySelector(".edit-btn");

    editButton.addEventListener("click", () => {

        alert("Edit Profile feature will be available after backend integration.");

    });

    /* ==================================
       CHANGE PASSWORD
    ================================== */

    const passwordButton = document.querySelector(".password-btn");

    passwordButton.addEventListener("click", () => {

        alert("Change Password feature will be available after backend integration.");

    });

    /* ==================================
       BUTTON HOVER EFFECT
    ================================== */

    const buttons = document.querySelectorAll(".button-group button");

    buttons.forEach((button) => {

        button.addEventListener("mouseenter", () => {

            button.style.transform = "translateY(-3px)";
            button.style.transition = ".3s";

        });

        button.addEventListener("mouseleave", () => {

            button.style.transform = "translateY(0)";

        });

    });

});