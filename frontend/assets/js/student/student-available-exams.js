/* =========================================================
   ExamSphere - Student Available Exams
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const buttons =
        document.querySelectorAll(".start-exam-btn");


    /* =====================================================
       START EXAM BUTTONS
    ===================================================== */

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const examId =
                button.getAttribute("data-exam-id");


            const subject =
                button.getAttribute("data-subject");


            console.log(
                "Selected Exam ID:",
                examId
            );


            console.log(
                "Selected Subject:",
                subject
            );


            /* =============================================
               CHECK EXAM ID
            ============================================= */

            if (!examId) {

                alert(
                    "Exam ID is missing."
                );

                return;

            }


            /* =============================================
               SAVE EXAM ID
            ============================================= */

            sessionStorage.setItem(
                "selectedExamId",
                examId
            );


            sessionStorage.setItem(
                "selectedExamSubject",
                subject
            );


            /* =============================================
               GO TO INSTRUCTIONS
            ============================================= */

            window.location.href =
                "student-exam-instructions.html?examId=" +
                encodeURIComponent(examId);

        });

    });


    /* =====================================================
       SEARCH
    ===================================================== */

    const searchInput =
        document.getElementById("searchExam");


    const cards =
        document.querySelectorAll(".exam-card");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const searchValue =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                cards.forEach(card => {

                    const text =
                        card.textContent
                            .toLowerCase();


                    if (
                        text.includes(
                            searchValue
                        )
                    ) {

                        card.style.display =
                            "";

                    }

                    else {

                        card.style.display =
                            "none";

                    }

                });

            }
        );

    }


    /* =====================================================
       SUBJECT FILTER
    ===================================================== */

    const subjectFilter =
        document.getElementById(
            "subjectFilter"
        );


    if (subjectFilter) {

        subjectFilter.addEventListener(
            "change",
            () => {

                const selected =
                    subjectFilter.value
                        .toLowerCase();


                cards.forEach(card => {

                    const cardText =
                        card.textContent
                            .toLowerCase();


                    if (
                        selected === "all" ||
                        cardText.includes(
                            selected
                        )
                    ) {

                        card.style.display =
                            "";

                    }

                    else {

                        card.style.display =
                            "none";

                    }

                });

            }
        );

    }

});