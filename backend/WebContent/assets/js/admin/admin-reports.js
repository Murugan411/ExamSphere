/* ==========================================
   ExamSphere - Reports
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       PAGE LOAD ANIMATION
    ================================== */

    const cards = document.querySelectorAll(".card");
    const reportBoxes = document.querySelectorAll(".report-box");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        setTimeout(() => {

            card.style.transition = "0.5s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 150);

    });

    reportBoxes.forEach((box, index) => {

        box.style.opacity = "0";
        box.style.transform = "translateY(30px)";

        setTimeout(() => {

            box.style.transition = "0.5s ease";

            box.style.opacity = "1";

            box.style.transform = "translateY(0)";

        }, 400 + (index * 150));

    });

    /* ==================================
       EXPORT REPORT
    ================================== */

    const exportButton = document.querySelector(".export-btn");

    exportButton.addEventListener("click", () => {

        alert("Export Report feature will be available after backend integration.");

    });

    /* ==================================
       REPORT BOX EFFECT
    ================================== */

    reportBoxes.forEach((box) => {

        box.addEventListener("mouseenter", () => {

            box.style.transform = "translateY(-8px)";

            box.style.transition = ".3s";

        });

        box.addEventListener("mouseleave", () => {

            box.style.transform = "translateY(0)";

        });

    });

    /* ==================================
       SUMMARY CARD EFFECT
    ================================== */

    cards.forEach((card) => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-10px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0)";

        });

    });

});