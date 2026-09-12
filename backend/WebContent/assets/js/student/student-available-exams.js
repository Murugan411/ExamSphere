/* ==========================================
   ExamSphere - Available Exams
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.querySelector(".exam-toolbar input");
    const subjectFilter = document.querySelector(".exam-toolbar select");
    const examCards = document.querySelectorAll(".exam-card");

    /* ==================================
       SEARCH EXAM
    ================================== */

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        examCards.forEach(card => {

            const examName = card.querySelector("h2").textContent.toLowerCase();

            if (examName.includes(value)) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

    /* ==================================
       FILTER SUBJECT
    ================================== */

    subjectFilter.addEventListener("change", () => {

        const selected = subjectFilter.value.toLowerCase();

        examCards.forEach(card => {

            const subject = card.querySelector("h2").textContent.toLowerCase();

            if (selected === "all subjects") {

                card.style.display = "block";

            }

            else if (subject.includes(selected)) {

                card.style.display = "block";

            }

            else {

                card.style.display = "none";

            }

        });

    });

    /* ==================================
       START EXAM
    ================================== */

    const buttons = document.querySelectorAll(".exam-card button");

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            alert("Redirecting to Exam Instructions...");

            // Backend Integration
            // window.location.href="student-exam-instructions.html";

        });

    });

});