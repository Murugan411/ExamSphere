/* ==========================================
   ExamSphere - Student Profile
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const editButton = document.querySelector(".button-group button:first-child");
    const saveButton = document.querySelector(".button-group button:last-child");

    const inputs = document.querySelectorAll(".profile-details input");

    // ==========================
    // Disable Editing Initially
    // ==========================

    inputs.forEach(input => {

        if (!input.hasAttribute("readonly")) {

            input.disabled = true;

        }

    });

    // ==========================
    // Enable Edit Mode
    // ==========================

    editButton.addEventListener("click", () => {

        inputs.forEach(input => {

            if (!input.hasAttribute("readonly")) {

                input.disabled = false;

            }

        });

        alert("Edit Mode Enabled");

    });

    // ==========================
    // Save Changes
    // ==========================

    saveButton.addEventListener("click", (event) => {

        event.preventDefault();

        inputs.forEach(input => {

            if (!input.hasAttribute("readonly")) {

                input.disabled = true;

            }

        });

        alert("Profile Updated Successfully! (Frontend Demo)");

    });

    // ==========================
    // Upload Photo
    // ==========================

    const uploadButton = document.querySelector(".upload-btn");

    uploadButton.addEventListener("click", () => {

        alert("Image Upload will be connected with backend later.");

    });

});5