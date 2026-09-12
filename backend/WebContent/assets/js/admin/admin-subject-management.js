/* ==========================================
   ExamSphere - Subject Management
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SEARCH SUBJECT
    ================================== */

    const searchInput = document.getElementById("subjectSearch");
    const tableRows = document.querySelectorAll("#subjectTable tr");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {

            const code = row.cells[0].textContent.toLowerCase();
            const subject = row.cells[1].textContent.toLowerCase();
            const faculty = row.cells[2].textContent.toLowerCase();

            if (

                code.includes(value) ||

                subject.includes(value) ||

                faculty.includes(value)

            ) {

                row.style.display = "";

            }

            else {

                row.style.display = "none";

            }

        });

    });

    /* ==================================
       ADD SUBJECT
    ================================== */

    const addButton = document.querySelector(".add-btn");

    addButton.addEventListener("click", () => {

        alert("Add Subject form will be connected after backend integration.");

    });

    /* ==================================
       EDIT SUBJECT
    ================================== */

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const subjectName = row.cells[1].textContent;

            alert("Edit Subject : " + subjectName);

        });

    });

    /* ==================================
       DELETE SUBJECT
    ================================== */

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const subjectName = row.cells[1].textContent;

            const confirmDelete = confirm(

                "Delete Subject : " + subjectName + " ?"

            );

            if (confirmDelete) {

                row.remove();

            }

        });

    });

    /* ==================================
       EXPORT SUBJECT LIST
    ================================== */

    const exportButton = document.querySelector(".toolbar button");

    exportButton.addEventListener("click", () => {

        alert("Subject list export will be available after backend integration.");

    });

    /* ==================================
       TABLE HOVER EFFECT
    ================================== */

    tableRows.forEach((row) => {

        row.addEventListener("mouseenter", () => {

            row.style.background = "#EFF6FF";

            row.style.transition = ".3s";

        });

        row.addEventListener("mouseleave", () => {

            row.style.background = "";

        });

    });

});