/* ==========================================
   ExamSphere - Results Management
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SEARCH RESULT
    ================================== */

    const searchInput = document.getElementById("resultSearch");
    const tableRows = document.querySelectorAll("#resultTable tr");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {

            const resultId = row.cells[0].textContent.toLowerCase();
            const student = row.cells[1].textContent.toLowerCase();
            const exam = row.cells[2].textContent.toLowerCase();
            const subject = row.cells[3].textContent.toLowerCase();

            if (

                resultId.includes(value) ||

                student.includes(value) ||

                exam.includes(value) ||

                subject.includes(value)

            ) {

                row.style.display = "";

            }

            else {

                row.style.display = "none";

            }

        });

    });

    /* ==================================
       VIEW RESULT
    ================================== */

    const viewButtons = document.querySelectorAll(".view-btn");

    viewButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const student = row.cells[1].textContent;
            const exam = row.cells[2].textContent;
            const score = row.cells[4].textContent;
            const grade = row.cells[6].textContent;

            alert(

                "Student : " + student +

                "\nExam : " + exam +

                "\nScore : " + score +

                "\nGrade : " + grade +

                "\n\nDetailed Result will be available after backend integration."

            );

        });

    });

    /* ==================================
       EXPORT RESULTS
    ================================== */

    const exportButton = document.querySelector(".toolbar button");

    exportButton.addEventListener("click", () => {

        alert("Export Results feature will be available after backend integration.");

    });

    /* ==================================
       ROW HOVER EFFECT
    ================================== */

    tableRows.forEach((row) => {

        row.addEventListener("mouseenter", () => {

            row.style.transition = ".3s";

            row.style.background = "#EFF6FF";

        });

        row.addEventListener("mouseleave", () => {

            row.style.background = "";

        });

    });

});