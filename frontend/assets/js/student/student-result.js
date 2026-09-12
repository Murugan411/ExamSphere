/*
 * ============================================================
 * ExamSphere - Student Result
 * ============================================================
 * Loads the latest submitted result for the logged-in student.
 *
 * Priority:
 * 1. Student History - latest result
 * 2. Result API - fallback
 *
 * This prevents an old/stale result from being displayed.
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       GET PAGE ELEMENTS
    ======================================================== */

    const dashboardBtn =
        document.getElementById("dashboardBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const summaryCards =
        document.querySelectorAll(
            ".summary-card h2"
        );

    const performanceRow =
        document.querySelector(
            ".performance-card tbody tr"
        );

    const statBoxes =
        document.querySelectorAll(
            ".stat-box h3"
        );


    /* ========================================================
       START
    ======================================================== */

    loadLatestResult();


    /* ========================================================
       LOAD LATEST RESULT
    ======================================================== */

    async function loadLatestResult() {

        let historyResult = null;
        let directResult = null;


        /*
         * ----------------------------------------------------
         * LOAD STUDENT HISTORY
         * ----------------------------------------------------
         *
         * The history page is already showing:
         *
         * 100 / 100
         * 100%
         * A+
         * PASS
         *
         * Therefore use its latest record as the primary
         * source for the result page.
         * ----------------------------------------------------
         */

        try {

            const historyResponse =
                await fetch(
                    "../studentHistory?ts=" +
                    Date.now(),
                    {
                        method: "GET",
                        credentials: "same-origin",
                        cache: "no-store",
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            if (historyResponse.ok) {

                const historyData =
                    await historyResponse.json();


                console.log(
                    "Student History:",
                    historyData
                );


                if (
                    historyData &&
                    Array.isArray(
                        historyData.history
                    ) &&
                    historyData.history.length > 0
                ) {

                    /*
                     * Make a copy so we do not modify
                     * the original response.
                     */

                    const history =
                        [...historyData.history];


                    /*
                     * Sort newest first when submittedAt
                     * is available.
                     */

                    history.sort(
                        (a, b) => {

                            const dateA =
                                new Date(
                                    a.submittedAt ||
                                    a.submitted_at ||
                                    a.date ||
                                    0
                                ).getTime();


                            const dateB =
                                new Date(
                                    b.submittedAt ||
                                    b.submitted_at ||
                                    b.date ||
                                    0
                                ).getTime();


                            return dateB - dateA;

                        }
                    );


                    /*
                     * Latest completed examination.
                     */

                    historyResult =
                        normalizeResult(
                            history[0]
                        );


                    console.log(
                        "Latest History Result:",
                        historyResult
                    );

                }

            }

        } catch (error) {

            console.warn(
                "Student history could not be loaded:",
                error
            );

        }


        /* ====================================================
           LOAD DIRECT RESULT AS FALLBACK
        ==================================================== */

        try {

            const resultResponse =
                await fetch(
                    "../result?ts=" +
                    Date.now(),
                    {
                        method: "GET",
                        credentials: "same-origin",
                        cache: "no-store",
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            if (resultResponse.ok) {

                const contentType =
                    resultResponse.headers
                        .get(
                            "content-type"
                        ) || "";


                if (
                    contentType.includes(
                        "application/json"
                    )
                ) {

                    const resultData =
                        await resultResponse.json();


                    console.log(
                        "Direct Result API:",
                        resultData
                    );


                    directResult =
                        normalizeResult(
                            resultData
                        );

                }

            }

        } catch (error) {

            console.warn(
                "Direct result could not be loaded:",
                error
            );

        }


        /* ====================================================
           SELECT RESULT
        ==================================================== */

        let finalResult = null;


        /*
         * History is preferred because it contains the
         * latest submitted examination.
         */

        if (historyResult) {

            finalResult =
                historyResult;

        }

        else if (directResult) {

            finalResult =
                directResult;

        }


        /* ====================================================
           NO RESULT
        ==================================================== */

        if (!finalResult) {

            console.error(
                "No result data available."
            );

            showEmptyResult();

            return;

        }


        console.log(
            "FINAL RESULT DISPLAYED:",
            finalResult
        );


        /* ====================================================
           DISPLAY
        ==================================================== */

        displayResult(
            finalResult
        );

    }


    /* ========================================================
       NORMALIZE RESULT
    ======================================================== */

    function normalizeResult(data) {

        if (!data) {

            return null;

        }


        /*
         * Some APIs may return:
         *
         * {
         *   result: {...}
         * }
         *
         * Handle that format too.
         */

        if (
            data.result &&
            typeof data.result === "object"
        ) {

            data =
                data.result;

        }


        return {

            resultId:
                data.resultId ??
                data.result_id ??
                null,


            studentId:
                data.studentId ??
                data.student_id ??
                null,


            examId:
                data.examId ??
                data.exam_id ??
                null,


            totalQuestions:
                Number(
                    data.totalQuestions ??
                    data.total_questions ??
                    0
                ),


            correctAnswers:
                Number(
                    data.correctAnswers ??
                    data.correct_answers ??
                    0
                ),


            wrongAnswers:
                Number(
                    data.wrongAnswers ??
                    data.wrong_answers ??
                    0
                ),


            score:
                Number(
                    data.score ??
                    0
                ),


            percentage:
                Number(
                    data.percentage ??
                    0
                ),


            grade:
                data.grade ??
                "-",


            status:
                data.status ??
                "-",


            totalMarks:
                Number(
                    data.totalMarks ??
                    data.total_marks ??
                    0
                ),


            examTitle:
                data.examTitle ??
                data.exam_title ??
                data.title ??
                "Exam",


            subjectName:
                data.subjectName ??
                data.subject_name ??
                data.subject ??
                data.examTitle ??
                data.exam_title ??
                "Exam",


            submittedAt:
                data.submittedAt ??
                data.submitted_at ??
                ""

        };

    }


    /* ========================================================
       DISPLAY RESULT
    ======================================================== */

    function displayResult(result) {

        console.log(
            "Displaying:",
            result
        );


        /* ====================================================
           SUMMARY CARDS
        ==================================================== */

        if (
            summaryCards.length >= 4
        ) {

            /*
             * TOTAL SCORE
             */

            summaryCards[0].textContent =
                formatNumber(
                    result.score
                ) +
                " / " +
                formatNumber(
                    getTotalMarks(result)
                );


            /*
             * PERCENTAGE
             */

            summaryCards[1].textContent =
                formatNumber(
                    result.percentage
                ) +
                "%";


            /*
             * GRADE
             */

            summaryCards[2].textContent =
                (
                    result.grade ||
                    "-"
                ) +
                " Grade";


            /*
             * STATUS
             */

            summaryCards[3].textContent =
                (
                    result.status ||
                    "-"
                ).toUpperCase();

        }


        /* ====================================================
           PERFORMANCE TABLE
        ==================================================== */

        if (performanceRow) {

            const cells =
                performanceRow.querySelectorAll(
                    "td"
                );


            if (
                cells.length >= 4
            ) {

                /*
                 * SUBJECT / EXAM
                 */

                cells[0].textContent =
                    result.subjectName ||
                    result.examTitle ||
                    "Exam";


                /*
                 * TOTAL MARKS
                 */

                cells[1].textContent =
                    formatNumber(
                        getTotalMarks(result)
                    );


                /*
                 * OBTAINED
                 */

                cells[2].textContent =
                    formatNumber(
                        result.score
                    );


                /*
                 * PERCENTAGE
                 */

                cells[3].textContent =
                    formatNumber(
                        result.percentage
                    ) +
                    "%";

            }

        }


        /* ====================================================
           STATISTICS
        ==================================================== */

        if (
            statBoxes.length >= 4
        ) {

            /*
             * TOTAL QUESTIONS
             */

            statBoxes[0].textContent =
                result.totalQuestions;


            /*
             * CORRECT ANSWERS
             */

            statBoxes[1].textContent =
                result.correctAnswers;


            /*
             * WRONG ANSWERS
             */

            statBoxes[2].textContent =
                result.wrongAnswers;


            /*
             * RANK
             *
             * Backend currently does not provide rank.
             */

            statBoxes[3].textContent =
                "N/A";

        }


        /* ====================================================
           UPDATE STATUS STYLE
        ==================================================== */

        updateStatusStyle(
            result.status
        );

    }


    /* ========================================================
       TOTAL MARKS
    ======================================================== */

    function getTotalMarks(result) {

        /*
         * Backend/history provides total marks.
         */

        if (
            result.totalMarks &&
            Number(result.totalMarks) > 0
        ) {

            return Number(
                result.totalMarks
            );

        }


        /*
         * Calculate from score and percentage
         * when total marks is not supplied.
         */

        if (
            Number(result.percentage) > 0
        ) {

            return Math.round(
                (
                    Number(result.score) /
                    Number(result.percentage)
                ) * 100
            );

        }


        return 0;

    }


    /* ========================================================
       FORMAT NUMBER
    ======================================================== */

    function formatNumber(value) {

        const number =
            Number(value);


        if (
            Number.isNaN(number)
        ) {

            return "0";

        }


        if (
            Number.isInteger(number)
        ) {

            return String(number);

        }


        return number.toFixed(2);

    }


    /* ========================================================
       EMPTY RESULT
    ======================================================== */

    function showEmptyResult() {

        if (
            summaryCards.length >= 4
        ) {

            summaryCards[0].textContent =
                "0 / 0";

            summaryCards[1].textContent =
                "0%";

            summaryCards[2].textContent =
                "- Grade";

            summaryCards[3].textContent =
                "NO RESULT";

        }


        if (statBoxes.length >= 4) {

            statBoxes[0].textContent =
                "0";

            statBoxes[1].textContent =
                "0";

            statBoxes[2].textContent =
                "0";

            statBoxes[3].textContent =
                "N/A";

        }

    }


    /* ========================================================
       STATUS STYLE
    ======================================================== */

    function updateStatusStyle(status) {

        const normalizedStatus =
            String(
                status || ""
            ).toUpperCase();


        const statusCard =
            summaryCards.length >= 4
                ? summaryCards[3]
                    .closest(".summary-card")
                : null;


        if (!statusCard) {

            return;

        }


        statusCard.classList.remove(
            "pass",
            "fail"
        );


        if (
            normalizedStatus ===
            "PASS"
        ) {

            statusCard.classList.add(
                "pass"
            );

        }

        else if (
            normalizedStatus ===
            "FAIL"
        ) {

            statusCard.classList.add(
                "fail"
            );

        }

    }


    /* ========================================================
       DASHBOARD BUTTON
    ======================================================== */

    if (dashboardBtn) {

        dashboardBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "student-dashboard.html";

            }
        );

    }


    /* ========================================================
       DOWNLOAD RESULT
    ======================================================== */

    if (downloadBtn) {

        downloadBtn.addEventListener(
            "click",
            () => {

                window.print();

            }
        );

    }


    /* ========================================================
       SCORE ANIMATION
    ======================================================== */

    summaryCards.forEach(
        (card) => {

            card.style.opacity =
                "0";

            card.style.transform =
                "translateY(20px)";


            setTimeout(
                () => {

                    card.style.transition =
                        "0.6s ease";

                    card.style.opacity =
                        "1";

                    card.style.transform =
                        "translateY(0)";

                },
                300
            );

        }
    );


    /* ========================================================
       STATISTICS HOVER EFFECT
    ======================================================== */

    const statBoxesContainer =
        document.querySelectorAll(
            ".stat-box"
        );


    statBoxesContainer.forEach(
        (box) => {

            box.addEventListener(
                "mouseenter",
                () => {

                    box.style.transform =
                        "translateY(-8px)";

                    box.style.transition =
                        "0.3s";

                }
            );


            box.addEventListener(
                "mouseleave",
                () => {

                    box.style.transform =
                        "translateY(0px)";

                }
            );

        }
    );

});