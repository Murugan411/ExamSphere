/* =========================================================
   ExamSphere - Student Exam Instructions
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       GET EXAM ID FROM URL
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    let examId =
        params.get("examId");


    /* =====================================================
       FALLBACK TO SESSION STORAGE
    ===================================================== */

    if (!examId) {

        examId =
            sessionStorage.getItem(
                "selectedExamId"
            );

    }


    /* =====================================================
       SAVE EXAM ID
    ===================================================== */

    if (examId) {

        sessionStorage.setItem(
            "selectedExamId",
            examId
        );

    }


    console.log(
        "Instructions Exam ID:",
        examId
    );


    /* =====================================================
       HTML ELEMENTS
    ===================================================== */

    const agreeCheckbox =
        document.getElementById(
            "agree"
        );


    const startExamBtn =
        document.getElementById(
            "startExamBtn"
        );


    const backBtn =
        document.getElementById(
            "backBtn"
        );


    /* =====================================================
       CHECK EXAM ID
    ===================================================== */

    if (!examId) {

        alert(
            "Exam ID is missing."
        );


        window.location.href =
            "student-available-exams.html";


        return;

    }


    /* =====================================================
       START EXAM
    ===================================================== */

    startExamBtn.addEventListener(
        "click",
        () => {


            /* =============================================
               CHECK AGREEMENT
            ============================================= */

            if (!agreeCheckbox.checked) {

                alert(
                    "Please accept the exam instructions before starting."
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


            console.log(
                "Starting Exam ID:",
                examId
            );


            /* =============================================
               GO TO TAKE EXAM
            ============================================= */

            window.location.href =
                "student-take-exam.html?examId=" +
                encodeURIComponent(
                    examId
                );

        }
    );


    /* =====================================================
       BACK BUTTON
    ===================================================== */

    backBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "student-available-exams.html";

        }
    );

});