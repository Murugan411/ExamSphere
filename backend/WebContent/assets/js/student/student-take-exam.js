/* ==========================================
   ExamSphere - Take Exam
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       COUNTDOWN TIMER
    ================================== */

    let totalSeconds = 60 * 60; // 60 Minutes

    const timer = document.getElementById("timer");

    const countdown = setInterval(() => {

        let minutes = Math.floor(totalSeconds / 60);

        let seconds = totalSeconds % 60;

        timer.textContent =
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        if (totalSeconds <= 0) {

            clearInterval(countdown);

            alert("Time is up! Exam will be submitted automatically.");

            // Future Backend
            // window.location.href="student-exam-submit.html";

        }

        totalSeconds--;

    }, 1000);

    /* ==================================
       QUESTION NAVIGATION
    ================================== */

    const questionButtons = document.querySelectorAll(".question-grid button");

    questionButtons.forEach((button) => {

        button.addEventListener("click", () => {

            questionButtons.forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            document.getElementById("questionNo").textContent = button.textContent;

            // Future:
            // Load selected question from database

        });

    });

    /* ==================================
       SAVE & NEXT
    ================================== */

    const nextBtn = document.getElementById("nextBtn");

    nextBtn.addEventListener("click", () => {

        const current = document.querySelector(".question-grid .active");

        current.style.background = "#16a34a";

        current.style.color = "#ffffff";

        let next = current.nextElementSibling;

        if (next) {

            current.classList.remove("active");

            next.classList.add("active");

            document.getElementById("questionNo").textContent = next.textContent;

        }

    });

    /* ==================================
       PREVIOUS
    ================================== */

    const previousBtn = document.getElementById("previousBtn");

    previousBtn.addEventListener("click", () => {

        const current = document.querySelector(".question-grid .active");

        let previous = current.previousElementSibling;

        if (previous) {

            current.classList.remove("active");

            previous.classList.add("active");

            document.getElementById("questionNo").textContent = previous.textContent;

        }

    });

    /* ==================================
       SUBMIT EXAM
    ================================== */

    const submitBtn = document.getElementById("submitExam");

    submitBtn.addEventListener("click", () => {

        const confirmSubmit = confirm(

            "Are you sure you want to submit the exam?"

        );

        if (confirmSubmit) {

            alert("Exam Submitted Successfully!");

            // Future Backend

            // window.location.href="student-exam-submit.html";

        }

    });

});