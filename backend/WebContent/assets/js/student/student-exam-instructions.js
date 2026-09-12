/* ==========================================
   ExamSphere - Exam Instructions
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const agreeCheckbox = document.getElementById("agree");
    const startExamBtn = document.getElementById("startExamBtn");
    const backBtn = document.getElementById("backBtn");

    /* ==================================
       START EXAM
    ================================== */

    startExamBtn.addEventListener("click", () => {

        if (!agreeCheckbox.checked) {

            alert("Please accept the exam instructions before starting.");

            return;

        }

        alert("Redirecting to the Exam Page...");

        // Backend Integration
        // window.location.href = "student-take-exam.html";

    });

    /* ==================================
       BACK BUTTON
    ================================== */

    backBtn.addEventListener("click", () => {

        // Backend Integration
        // window.location.href = "student-available-exams.html";

        history.back();

    });

});