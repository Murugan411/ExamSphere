/* ==========================================
   ExamSphere - Admin Dashboard
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       WELCOME ANIMATION
    ================================== */

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        setTimeout(() => {

            card.style.transition = "0.5s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 150);

    });

    /* ==================================
       SIDEBAR ACTIVE MENU
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
       CARD HOVER EFFECT
    ================================== */

    cards.forEach((card) => {

        card.addEventListener("mouseenter", () => {

            card.style.transform = "translateY(-10px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "translateY(0)";

        });

    });

    /* ==================================
       ACTIVITY LIST EFFECT
    ================================== */

    const activities = document.querySelectorAll(".activity-card ul li");

    activities.forEach((activity) => {

        activity.addEventListener("mouseenter", () => {

            activity.style.background = "#eff6ff";

            activity.style.paddingLeft = "10px";

            activity.style.transition = ".3s";

        });

        activity.addEventListener("mouseleave", () => {

            activity.style.background = "transparent";

            activity.style.paddingLeft = "0";

        });

    });

    /* ==================================
       UPCOMING EXAMS TABLE
    ================================== */

    const rows = document.querySelectorAll(".exam-card tbody tr");

    rows.forEach((row) => {

        row.addEventListener("mouseenter", () => {

            row.style.background = "#eff6ff";

        });

        row.addEventListener("mouseleave", () => {

            row.style.background = "";

        });

    });

});