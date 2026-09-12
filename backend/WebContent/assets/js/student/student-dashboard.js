/* ==========================================
   ExamSphere - Student Dashboard
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Student Dashboard Loaded");

    /* ==================================
       ACTIVE SIDEBAR MENU
    ================================== */

    const menuItems = document.querySelectorAll(".sidebar ul li");

    menuItems.forEach((item) => {

        item.addEventListener("click", () => {

            menuItems.forEach((menu) => {

                menu.classList.remove("active");

            });

            item.classList.add("active");

        });

    });

    /* ==================================
       DASHBOARD CARD HOVER EFFECT
    ================================== */

    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-10px)";
            card.style.transition = ".3s";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0px)";

        });

    });

    /* ==================================
       START EXAM BUTTON
    ================================== */

    const buttons = document.querySelectorAll("table button");

    buttons.forEach((button) => {

        button.addEventListener("click", () => {

            alert("This will navigate to the Exam Instructions page.");

            // Future Backend Navigation
            // window.location.href = "student-exam-instructions.html";

        });

    });

});