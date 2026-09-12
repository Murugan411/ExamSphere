/* ==========================================
   ExamSphere - Student Leaderboard
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SEARCH STUDENT
    ================================== */

    const searchInput = document.getElementById("searchStudent");

    const tableRows = document.querySelectorAll("#leaderboardBody tr");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {

            const studentName = row.cells[1].textContent.toLowerCase();

            const registerNo = row.cells[2].textContent.toLowerCase();

            if (

                studentName.includes(value) ||

                registerNo.includes(value)

            ) {

                row.style.display = "";

            }

            else {

                row.style.display = "none";

            }

        });

    });

    /* ==================================
       HIGHLIGHT CURRENT USER
    ================================== */

    tableRows.forEach((row) => {

        if (row.cells[1].textContent.trim() === "You") {

            row.style.border = "2px solid #2563EB";

        }

    });

    /* ==================================
       ROW HOVER EFFECT
    ================================== */

    tableRows.forEach((row) => {

        row.addEventListener("mouseenter", () => {

            row.style.transform = "scale(1.01)";

            row.style.transition = ".3s";

        });

        row.addEventListener("mouseleave", () => {

            row.style.transform = "scale(1)";

        });

    });

});