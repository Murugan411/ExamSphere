/* ==========================================
   ExamSphere - Student Result
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const dashboardBtn = document.getElementById("dashboardBtn");
    const downloadBtn = document.getElementById("downloadBtn");

    /* ==================================
       DASHBOARD BUTTON
    ================================== */

    dashboardBtn.addEventListener("click", () => {

        alert("Redirecting to Dashboard...");

        // Future Backend
        // window.location.href = "student-dashboard.html";

    });

    /* ==================================
       DOWNLOAD RESULT
    ================================== */

    downloadBtn.addEventListener("click", () => {

        alert("Result PDF will be downloaded after backend integration.");

    });

    /* ==================================
       SCORE ANIMATION
    ================================== */

    const scoreCards = document.querySelectorAll(".summary-card h2");

    scoreCards.forEach((card) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {

            card.style.transition = ".6s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, 300);

    });

    /* ==================================
       STATISTICS HOVER EFFECT
    ================================== */

    const statBoxes = document.querySelectorAll(".stat-box");

    statBoxes.forEach((box) => {

        box.addEventListener("mouseenter", () => {

            box.style.transform = "translateY(-8px)";
            box.style.transition = ".3s";

        });

        box.addEventListener("mouseleave", () => {

            box.style.transform = "translateY(0px)";

        });

    });

});