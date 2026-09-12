/* ==========================================
   ExamSphere - Exam Submit
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const dashboardBtn = document.getElementById("dashboardBtn");
    const resultBtn = document.getElementById("resultBtn");

    /* ==================================
       DASHBOARD BUTTON
    ================================== */

    dashboardBtn.addEventListener("click", () => {

        alert("Redirecting to Student Dashboard...");

        // Backend Integration
        // window.location.href = "student-dashboard.html";

    });

    /* ==================================
       VIEW RESULT BUTTON
    ================================== */

    resultBtn.addEventListener("click", () => {

        alert("Redirecting to Result Page...");

        // Backend Integration
        // window.location.href = "student-result.html";

    });

    /* ==================================
       SUCCESS ANIMATION
    ================================== */

    const successIcon = document.querySelector(".success-icon i");

    successIcon.style.transform = "scale(0.5)";
    successIcon.style.opacity = "0";

    setTimeout(() => {

        successIcon.style.transition = "0.5s ease";

        successIcon.style.transform = "scale(1)";

        successIcon.style.opacity = "1";

    }, 200);

    /* ==================================
       PREVENT PAGE REFRESH
    ================================== */

    window.addEventListener("beforeunload", function (event) {

        event.preventDefault();

        event.returnValue = "";

    });

});