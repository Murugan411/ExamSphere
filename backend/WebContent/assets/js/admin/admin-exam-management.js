/* ==========================================
   ExamSphere - Exam Management
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SEARCH EXAM
    ================================== */

    const searchInput = document.getElementById("examSearch");
    const tableRows = document.querySelectorAll("#examTable tr");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {

            const examId = row.cells[0].textContent.toLowerCase();
            const examTitle = row.cells[1].textContent.toLowerCase();
            const subject = row.cells[2].textContent.toLowerCase();

            if (

                examId.includes(value) ||

                examTitle.includes(value) ||

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
       CREATE EXAM
    ================================== */

    const addButton = document.querySelector(".add-btn");

    addButton.addEventListener("click", () => {

        alert("Create Exam form will be connected after backend integration.");

    });

    /* ==================================
       EDIT EXAM
    ================================== */

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const examName = row.cells[1].textContent;

            alert("Edit Exam : " + examName);

        });

    });

    /* ==================================
       DELETE EXAM
    ================================== */

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const examName = row.cells[1].textContent;

            const confirmDelete = confirm(

                "Are you sure you want to delete '" +

                examName +

                "' ?"

            );

            if(confirmDelete){

                row.remove();

            }

        });

    });

    /* ==================================
       EXPORT EXAM LIST
    ================================== */

    const exportButton = document.querySelector(".toolbar button");

    exportButton.addEventListener("click", () => {

        alert("Export feature will be available after backend integration.");

    });

    /* ==================================
       TABLE ANIMATION
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