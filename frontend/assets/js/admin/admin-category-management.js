/* ==========================================
   ExamSphere - Category Management
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       SEARCH CATEGORY
    ================================== */

    const searchInput = document.getElementById("categorySearch");
    const tableRows = document.querySelectorAll("#categoryTable tr");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        tableRows.forEach((row) => {

            const code = row.cells[0].textContent.toLowerCase();
            const category = row.cells[1].textContent.toLowerCase();
            const description = row.cells[2].textContent.toLowerCase();

            if (

                code.includes(value) ||

                category.includes(value) ||

                description.includes(value)

            ) {

                row.style.display = "";

            }

            else {

                row.style.display = "none";

            }

        });

    });

    /* ==================================
       ADD CATEGORY
    ================================== */

    const addButton = document.querySelector(".add-btn");

    addButton.addEventListener("click", () => {

        alert("Add Category form will be connected after backend integration.");

    });

    /* ==================================
       EDIT CATEGORY
    ================================== */

    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const categoryName = row.cells[1].textContent;

            alert("Edit Category : " + categoryName);

        });

    });

    /* ==================================
       DELETE CATEGORY
    ================================== */

    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            const categoryName = row.cells[1].textContent;

            const confirmDelete = confirm(

                "Delete Category : " + categoryName + " ?"

            );

            if(confirmDelete){

                row.remove();

            }

        });

    });

    /* ==================================
       EXPORT CATEGORY LIST
    ================================== */

    const exportButton = document.querySelector(".toolbar button");

    exportButton.addEventListener("click", () => {

        alert("Category list export will be available after backend integration.");

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