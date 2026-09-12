/* ==========================================
   ExamSphere - Student Management
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SEARCH STUDENT
    ================================== */

    const searchInput = document.getElementById("studentSearch");
    const tableRows = document.querySelectorAll("#studentTable tr");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {

            const id = row.cells[0].textContent.toLowerCase();
            const name = row.cells[1].textContent.toLowerCase();
            const email = row.cells[2].textContent.toLowerCase();
            const department = row.cells[4].textContent.toLowerCase();

            if (

                id.includes(value) ||

                name.includes(value) ||

                email.includes(value) ||

                department.includes(value)

            ) {

                row.style.display = "";

            }

            else {

                row.style.display = "none";

            }

        });

    });

    /* ==================================
       ADD STUDENT
    ================================== */

    const addButton = document.querySelector(".add-btn");

    addButton.addEventListener("click", () => {

        alert("Add Student Form will open after backend integration.");

    });

    /* ==================================
       EDIT STUDENT
    ================================== */

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const studentName = row.cells[1].textContent;

            alert("Edit Student : " + studentName);

        });

    });

    /* ==================================
       DELETE STUDENT
    ================================== */

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const studentName = row.cells[1].textContent;

            const confirmDelete = confirm(

                "Delete " + studentName + " ?"

            );

            if(confirmDelete){

                row.remove();

            }

        });

    });

    /* ==================================
       EXPORT STUDENT LIST
    ================================== */

    const exportButton = document.querySelector(".toolbar button");

    exportButton.addEventListener("click", () => {

        alert("Student List Export (CSV / Excel) will be available after backend integration.");

    });

    /* ==================================
       TABLE ROW ANIMATION
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