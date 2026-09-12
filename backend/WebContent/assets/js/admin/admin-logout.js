/* ==========================================
   ExamSphere - Admin Logout
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       PAGE LOAD ANIMATION
    ================================== */

    const logoutCard = document.querySelector(".logout-card");

    logoutCard.style.opacity = "0";
    logoutCard.style.transform = "translateY(30px)";

    setTimeout(() => {

        logoutCard.style.transition = "0.6s ease";

        logoutCard.style.opacity = "1";

        logoutCard.style.transform = "translateY(0)";

    }, 200);

    /* ==================================
       LOGOUT BUTTON
    ================================== */

    const logoutButton = document.getElementById("logoutBtn");

    logoutButton.addEventListener("click", () => {

        const confirmLogout = confirm(

            "Are you sure you want to logout?"

        );

        if(confirmLogout){

            alert("Logged out successfully.");

            // Backend Integration
            // Destroy Session

            window.location.href = "../login.html";

        }

    });

    /* ==================================
       CANCEL BUTTON
    ================================== */

    const cancelButton = document.getElementById("cancelBtn");

    cancelButton.addEventListener("click", () => {

        window.location.href = "admin-dashboard.html";

    });

    /* ==================================
       BUTTON HOVER EFFECT
    ================================== */

    const buttons = document.querySelectorAll("button");

    buttons.forEach((button) => {

        button.addEventListener("mouseenter", () => {

            button.style.transition = ".3s";

            button.style.transform = "translateY(-3px)";

        });

        button.addEventListener("mouseleave", () => {

            button.style.transform = "translateY(0)";

        });

    });

});