/* ==========================================
   ExamSphere - Student Profile
   Backend Connected Version
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const editButton =
        document.querySelector(".button-group button:first-child");

    const saveButton =
        document.querySelector(".button-group button:last-child");

    const form =
        document.querySelector(".profile-details form");

    const inputs =
        document.querySelectorAll(".profile-details input");

    const uploadButton =
        document.querySelector(".upload-btn");


    /* ==========================================
       INPUT REFERENCES
    ========================================== */

    const fullNameInput = inputs[0];
    const studentIdInput = inputs[1];
    const emailInput = inputs[2];
    const phoneInput = inputs[3];
    const departmentInput = inputs[4];
    const yearInput = inputs[5];
    const joiningDateInput = inputs[6];


    /* ==========================================
       INITIAL STATE
    ========================================== */

    inputs.forEach(input => {

        if (!input.hasAttribute("readonly")) {
            input.disabled = true;
        }

    });


    /* ==========================================
       LOAD STUDENT PROFILE FROM BACKEND
    ========================================== */

    fetch("../studentProfile", {
        method: "GET",
        credentials: "include"
    })

    .then(response => {

        if (!response.ok) {
            throw new Error("Unable to load student profile.");
        }

        return response.json();

    })

    .then(data => {

        if (!data.success) {

            alert(data.message || "Unable to load profile.");

            return;
        }


        /* ==========================================
           DISPLAY REAL STUDENT DATA
        ========================================== */

        studentIdInput.value =
            data.studentId || "";

        fullNameInput.value =
            data.fullName || "";

        emailInput.value =
            data.email || "";

        phoneInput.value =
            data.phone || "";

        departmentInput.value =
            data.department || "";

        yearInput.value =
            data.yearOfStudy || "";


        /*
         * Date of joining is not provided
         * by the current backend.
         *
         * Keep the existing HTML value.
         */

    })

    .catch(error => {

        console.error(
            "Profile Load Error:",
            error
        );

        alert(
            "Unable to load profile. Please login again."
        );

    });


    /* ==========================================
       EDIT PROFILE
    ========================================== */

    editButton.addEventListener("click", () => {

        inputs.forEach(input => {

            /*
             * Student ID and Date of Joining
             * remain read-only.
             */

            if (!input.hasAttribute("readonly")) {

                input.disabled = false;

            }

        });

        fullNameInput.focus();

        alert("Edit Mode Enabled");

    });


    /* ==========================================
       SAVE PROFILE
    ========================================== */

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        /* ==========================================
           BASIC VALIDATION
        ========================================== */

        if (
            fullNameInput.value.trim() === "" ||
            emailInput.value.trim() === ""
        ) {

            alert(
                "Full Name and Email are required."
            );

            return;
        }


        /* ==========================================
           PREPARE DATA
        ========================================== */

        const formData =
            new URLSearchParams();


        formData.append(
            "fullName",
            fullNameInput.value.trim()
        );

        formData.append(
            "email",
            emailInput.value.trim()
        );

        formData.append(
            "phone",
            phoneInput.value.trim()
        );

        formData.append(
            "registerNumber",
            studentIdInput.value.trim()
        );

        formData.append(
            "department",
            departmentInput.value.trim()
        );

        formData.append(
            "yearOfStudy",
            yearInput.value.trim()
        );


        /* ==========================================
           SAVE TO BACKEND
        ========================================== */

        saveButton.disabled = true;

        saveButton.textContent =
            "Saving...";


        fetch("../studentProfile", {

            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body: formData.toString()

        })

        .then(response => {

            return response.json();

        })

        .then(data => {

            if (data.success) {

                /*
                 * Disable editing again
                 */

                inputs.forEach(input => {

                    if (!input.hasAttribute("readonly")) {

                        input.disabled = true;

                    }

                });


                alert(
                    "Profile updated successfully."
                );

            } else {

                alert(
                    data.message ||
                    "Unable to update profile."
                );

            }

        })

        .catch(error => {

            console.error(
                "Profile Update Error:",
                error
            );

            alert(
                "Server error. Unable to update profile."
            );

        })

        .finally(() => {

            saveButton.disabled = false;

            saveButton.textContent =
                "Save Changes";

        });

    });


    /* ==========================================
       UPLOAD PHOTO
    ========================================== */

    uploadButton.addEventListener("click", () => {

        alert(
            "Image Upload will be connected with backend later."
        );

    });

});