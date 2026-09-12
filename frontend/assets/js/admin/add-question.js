/* ==========================================
   ExamSphere - Add Question
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("addQuestionForm");


    if (!form) {

        console.error(
            "addQuestionForm not found."
        );

        return;
    }


    // ==========================================
    // FORM SUBMIT
    // ==========================================

    form.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            // ======================================
            // GET VALUES
            // ======================================

            const subjectId =
                document.getElementById(
                    "subjectId"
                ).value;


            const categoryId =
                document.getElementById(
                    "categoryId"
                ).value;


            const questionText =
                document.getElementById(
                    "questionText"
                ).value.trim();


            const optionA =
                document.getElementById(
                    "optionA"
                ).value.trim();


            const optionB =
                document.getElementById(
                    "optionB"
                ).value.trim();


            const optionC =
                document.getElementById(
                    "optionC"
                ).value.trim();


            const optionD =
                document.getElementById(
                    "optionD"
                ).value.trim();


            const correctAnswer =
                document.getElementById(
                    "correctAnswer"
                ).value;


            const difficulty =
                document.getElementById(
                    "difficulty"
                ).value;


            const marks =
                document.getElementById(
                    "marks"
                ).value;


            const status =
                document.getElementById(
                    "status"
                ).value;


            // ======================================
            // VALIDATION
            // ======================================

            if (
                subjectId === "" ||
                categoryId === "" ||
                questionText === "" ||
                optionA === "" ||
                optionB === "" ||
                optionC === "" ||
                optionD === "" ||
                correctAnswer === "" ||
                difficulty === "" ||
                marks === ""
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            // ======================================
            // MARK VALIDATION
            // ======================================

            if (
                parseInt(marks) <= 0
            ) {

                alert(
                    "Marks must be greater than 0."
                );

                return;
            }


            // ======================================
            // PREPARE FORM DATA
            // ======================================

            const formData =
                new URLSearchParams();


            formData.append(
                "subjectId",
                subjectId
            );


            formData.append(
                "categoryId",
                categoryId
            );


            formData.append(
                "questionText",
                questionText
            );


            formData.append(
                "optionA",
                optionA
            );


            formData.append(
                "optionB",
                optionB
            );


            formData.append(
                "optionC",
                optionC
            );


            formData.append(
                "optionD",
                optionD
            );


            formData.append(
                "correctAnswer",
                correctAnswer
            );


            formData.append(
                "difficulty",
                difficulty
            );


            formData.append(
                "marks",
                marks
            );


            formData.append(
                "status",
                status
            );


            // ======================================
            // DISABLE BUTTON
            // ======================================

            const saveButton =
                form.querySelector(
                    ".save-btn"
                );


            if (saveButton) {

                saveButton.disabled =
                    true;

                saveButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Saving...
                `;

            }


            // ======================================
            // SEND TO SERVLET
            // ======================================

            fetch("../question", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded"

                },

                body:
                    formData.toString()

            })

            .then(response => {

                return response.text();

            })

            .then(result => {

                console.log(
                    "Server response:",
                    result
                );


                // ==================================
                // SUCCESS
                // ==================================

                if (
                    result.includes(
                        "Question added successfully!"
                    )
                ) {

                    alert(
                        "Question added successfully!"
                    );


                    window.location.href =
                        "admin-question-management.html";

                    return;
                }


                // ==================================
                // ERROR FROM SERVER
                // ==================================

                alert(
                    result ||
                    "Failed to add question."
                );


                enableSaveButton();

            })

            .catch(error => {

                console.error(
                    "Add question error:",
                    error
                );


                alert(
                    "Unable to connect to the server."
                );


                enableSaveButton();

            });

        }
    );


    // ==========================================
    // ENABLE SAVE BUTTON
    // ==========================================

    function enableSaveButton() {

        const saveButton =
            form.querySelector(
                ".save-btn"
            );


        if (saveButton) {

            saveButton.disabled =
                false;

            saveButton.innerHTML = `
                <i class="fa-solid fa-save"></i>
                Save Question
            `;

        }

    }


    // ==========================================
    // RESET FORM
    // ==========================================

    form.addEventListener(
        "reset",
        () => {

            setTimeout(
                () => {

                    enableSaveButton();

                },
                100
            );

        }
    );

});