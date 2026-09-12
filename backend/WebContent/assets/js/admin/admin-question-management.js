/* ==========================================
   ExamSphere - Question Management
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SEARCH QUESTION
    ================================== */

    const searchInput = document.getElementById("questionSearch");
    const tableRows = document.querySelectorAll("#questionTable tr");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {

            const id = row.cells[0].textContent.toLowerCase();
            const subject = row.cells[1].textContent.toLowerCase();
            const category = row.cells[2].textContent.toLowerCase();
            const question = row.cells[3].textContent.toLowerCase();

            if (

                id.includes(value) ||

                subject.includes(value) ||

                category.includes(value) ||

                question.includes(value)

            ) {

                row.style.display = "";

            }

            else {

                row.style.display = "none";

            }

        });

    });

    /* ==================================
       ADD QUESTION
    ================================== */

    const addButton = document.querySelector(".add-btn");

    addButton.addEventListener("click", () => {

        alert("Add Question form will be connected after backend integration.");

    });

    /* ==================================
       EDIT QUESTION
    ================================== */

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const question = row.cells[3].textContent;

            alert("Edit Question:\n\n" + question);

        });

    });

    /* ==================================
       DELETE QUESTION
    ================================== */

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const question = row.cells[3].textContent;

            const confirmDelete = confirm(

                "Are you sure you want to delete this question?\n\n" +

                question

            );

            if(confirmDelete){

                row.remove();

            }

        });

    });

    /* ==================================
       IMPORT QUESTIONS
    ================================== */

    const toolbarButtons = document.querySelectorAll(".toolbar button");

    const importButton = toolbarButtons[0];

    importButton.addEventListener("click", () => {

        alert("Import Questions feature will be implemented after backend integration.");

    });

    /* ==================================
       EXPORT QUESTIONS
    ================================== */

    const exportButton = toolbarButtons[1];

    exportButton.addEventListener("click", () => {

        alert("Export Questions feature will be implemented after backend integration.");

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