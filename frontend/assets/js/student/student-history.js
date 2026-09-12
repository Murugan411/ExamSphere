/* ==========================================
   ExamSphere - Student History
   Backend Connected Version
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("searchExam");

    const historyBody =
        document.getElementById("historyBody");


    let historyData = [];


    /* ==========================================
       LOAD HISTORY
    ========================================== */

    async function loadHistory() {

        try {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        Loading exam history...
                    </td>
                </tr>
            `;


            const response =
                await fetch(
                    "../studentHistory",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to load history."
                );

            }


            const data =
                await response.json();


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load history."
                );

            }


            historyData =
                data.history || [];


            renderHistory(
                historyData
            );


        } catch (error) {

            console.error(
                "History Error:",
                error
            );


            historyBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        Unable to load exam history.
                    </td>
                </tr>
            `;

        }
    }


    /* ==========================================
       RENDER HISTORY
    ========================================== */

    function renderHistory(data) {

        historyBody.innerHTML = "";


        if (data.length === 0) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="8">
                        No completed exams found.
                    </td>
                </tr>
            `;

            return;
        }


        data.forEach(exam => {

            const row =
                document.createElement("tr");


            const formattedDate =
                formatDate(
                    exam.submittedAt
                );


            const scoreText =
                Number(exam.score).toFixed(0)
                + " / "
                + exam.totalMarks;


            const percentageText =
                Number(
                    exam.percentage
                ).toFixed(2)
                + "%";


            const status =
                (exam.status || "")
                    .toUpperCase();


            const statusClass =
                status === "PASS"
                    ? "pass"
                    : "fail";


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        exam.examCode ||
                        ("EX" + exam.examId)
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        exam.examTitle ||
                        "Exam"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        formattedDate
                    )}
                </td>

                <td>
                    ${scoreText}
                </td>

                <td>
                    ${percentageText}
                </td>

                <td>
                    ${escapeHtml(
                        exam.grade || "-"
                    )}
                </td>

                <td class="${statusClass}">
                    ${escapeHtml(
                        status || "-"
                    )}
                </td>

                <td>

                    <button
                        type="button"
                        class="view-result-btn"
                        data-exam-id="${exam.examId}">
                        View
                    </button>

                </td>
            `;


            historyBody.appendChild(
                row
            );
        });


        attachViewButtons();
        attachHoverEffects();
    }


    /* ==========================================
       SEARCH
    ========================================== */

    searchInput.addEventListener(
        "keyup",
        () => {

            const value =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const filtered =
                historyData.filter(
                    exam => {

                        const title =
                            (
                                exam.examTitle ||
                                ""
                            ).toLowerCase();


                        const code =
                            (
                                exam.examCode ||
                                ""
                            ).toLowerCase();


                        return (
                            title.includes(value) ||
                            code.includes(value)
                        );

                    }
                );


            renderHistory(
                filtered
            );

        }
    );


    /* ==========================================
       VIEW RESULT
    ========================================== */

    function attachViewButtons() {

        const buttons =
            document.querySelectorAll(
                ".view-result-btn"
            );


        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const examId =
                        button.dataset.examId;


                    if (!examId) {

                        alert(
                            "Exam ID not found."
                        );

                        return;
                    }


                    /*
                     * Existing result page
                     * can use lastExamId.
                     */

                    sessionStorage.setItem(
                        "lastExamId",
                        examId
                    );


                    window.location.href =
                        "student-result.html";

                }
            );

        });

    }


    /* ==========================================
       HOVER EFFECT
    ========================================== */

    function attachHoverEffects() {

        const rows =
            document.querySelectorAll(
                "#historyBody tr"
            );


        rows.forEach(row => {

            row.addEventListener(
                "mouseenter",
                () => {

                    row.style.transition =
                        ".3s";

                    row.style.background =
                        "#eff6ff";

                }
            );


            row.addEventListener(
                "mouseleave",
                () => {

                    row.style.background =
                        "";

                }
            );

        });

    }


    /* ==========================================
       DATE FORMAT
    ========================================== */

    function formatDate(
        dateString
    ) {

        if (!dateString) {
            return "-";
        }


        const date =
            new Date(
                dateString
            );


        if (isNaN(date.getTime())) {
            return dateString;
        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* ==========================================
       HTML ESCAPE
    ========================================== */

    function escapeHtml(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }


        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );
    }


    /* ==========================================
       START
    ========================================== */

    loadHistory();

});