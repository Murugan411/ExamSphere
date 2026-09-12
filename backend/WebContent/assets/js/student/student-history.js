/* ==========================================
   ExamSphere - Student History
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SEARCH EXAM HISTORY
    ================================== */

    const searchInput = document.getElementById("searchExam");
    const tableRows = document.querySelectorAll("#historyBody tr");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {

            const subject = row.cells[1].textContent.toLowerCase();

            if (subject.includes(value)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });

    /* ==================================
       VIEW BUTTON
    ================================== */

    const viewButtons = document.querySelectorAll("table button");

    viewButtons.forEach((button) => {

        button.addEventListener("click", () => {

            alert("Opening detailed exam result...");

            // Future Backend
            // window.location.href = "student-result.html";

        });

    });

    /* ==================================
       ROW HOVER EFFECT
    ================================== */

    tableRows.forEach((row) => {

        row.addEventListener("mouseenter", () => {

            row.style.transition = ".3s";

            row.style.background = "#eff6ff";

        });

        row.addEventListener("mouseleave", () => {

            row.style.background = "";

        });

    });

});