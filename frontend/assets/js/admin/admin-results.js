/* ==========================================
   ExamSphere - Admin Results Management
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("resultSearch");
    const resultTable = document.getElementById("resultTable");
    const loadingMessage = document.getElementById("loadingMessage");
    const errorMessage = document.getElementById("errorMessage");
    const resultsTable = document.getElementById("resultsTable");
    const exportButton = document.getElementById("exportResultsBtn");

    const modal = document.getElementById("resultModal");
    const closeModalButton = document.getElementById("closeModalBtn");
    const closeModalButton2 = document.getElementById("closeModalBtn2");

    let allResults = [];


    /* ==========================================
       LOAD RESULTS
    ========================================== */

    loadResults();


    function loadResults() {

        loadingMessage.style.display = "block";
        errorMessage.style.display = "none";
        resultsTable.style.display = "none";


        /*
         * IMPORTANT:
         * admin-results.html is inside /admin/
         * servlet is mapped to /result
         *
         * Correct path:
         * ../result?view=admin
         */

        fetch("../result?view=admin", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Server returned HTTP " + response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            loadingMessage.style.display = "none";
            resultsTable.style.display = "table";

            allResults = Array.isArray(data) ? data : [];

            displayResults(allResults);

        })

        .catch(function (error) {

            console.error("Results loading error:", error);

            loadingMessage.style.display = "none";

            errorMessage.style.display = "block";

            errorMessage.textContent =
                "Unable to load results. Please check the server and database.";

        });

    }


    /* ==========================================
       DISPLAY RESULTS
    ========================================== */

    function displayResults(results) {

        resultTable.innerHTML = "";


        if (results.length === 0) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td colspan="10"
                    style="text-align:center;padding:40px;color:#64748b;">
                    No examination results found.
                </td>
            `;

            resultTable.appendChild(row);

            return;
        }


        results.forEach(function (result) {

            const row = document.createElement("tr");

            const status =
                String(result.status || "").toUpperCase();

            const statusClass =
                status === "PASS"
                    ? "pass-status"
                    : "fail-status";

            const score =
                Number(result.score || 0);

            const totalMarks =
                Number(result.totalMarks || 0);

            const percentage =
                Number(result.percentage || 0);

            const examDate =
                formatDate(result.examDate);


            row.innerHTML = `

                <td>
                    R${String(result.resultId).padStart(3, "0")}
                </td>

                <td>
                    ${escapeHtml(result.studentName)}
                </td>

                <td>
                    ${escapeHtml(result.examTitle)}
                </td>

                <td>
                    ${escapeHtml(result.subjectName)}
                </td>

                <td>
                    ${score} / ${totalMarks}
                </td>

                <td>
                    ${percentage.toFixed(2)}%
                </td>

                <td>
                    ${escapeHtml(result.grade || "-")}
                </td>

                <td class="${statusClass}">
                    ${escapeHtml(status || "-")}
                </td>

                <td>
                    ${examDate}
                </td>

                <td>

                    <button
                        class="view-btn"
                        data-result-id="${result.resultId}">

                        <i class="fa-solid fa-eye"></i>
                        View

                    </button>

                </td>

            `;

            resultTable.appendChild(row);

        });


        attachViewButtons();

    }


    /* ==========================================
       VIEW BUTTONS
    ========================================== */

    function attachViewButtons() {

        const viewButtons =
            document.querySelectorAll(".view-btn");


        viewButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const resultId =
                    Number(button.dataset.resultId);


                const result =
                    allResults.find(function (item) {

                        return Number(item.resultId) === resultId;

                    });


                if (result) {

                    openResultModal(result);

                }

            });

        });

    }


    /* ==========================================
       OPEN MODAL
    ========================================== */

    function openResultModal(result) {

        document.getElementById("modalResultId").textContent =
            "R" + String(result.resultId).padStart(3, "0");


        document.getElementById("modalStudent").textContent =
            result.studentName || "-";


        document.getElementById("modalExam").textContent =
            result.examTitle || "-";


        document.getElementById("modalSubject").textContent =
            result.subjectName || "-";


        document.getElementById("modalScore").textContent =
            Number(result.score || 0)
            + " / "
            + Number(result.totalMarks || 0);


        document.getElementById("modalPercentage").textContent =
            Number(result.percentage || 0).toFixed(2)
            + "%";


        document.getElementById("modalGrade").textContent =
            result.grade || "-";


        document.getElementById("modalStatus").textContent =
            String(result.status || "-").toUpperCase();


        document.getElementById("modalExamDate").textContent =
            formatDate(result.examDate);


        document.getElementById("modalSubmittedAt").textContent =
            formatDateTime(result.submittedAt);


        modal.classList.add("show");

    }


    /* ==========================================
       CLOSE MODAL
    ========================================== */

    function closeModal() {

        modal.classList.remove("show");

    }


    closeModalButton.addEventListener(
        "click",
        closeModal
    );


    closeModalButton2.addEventListener(
        "click",
        closeModal
    );


    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                closeModal();

            }

        }
    );


    /* ==========================================
       SEARCH
    ========================================== */

    searchInput.addEventListener(
        "input",
        function () {

            const value =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (value === "") {

                displayResults(allResults);

                return;

            }


            const filtered =
                allResults.filter(function (result) {

                    return (

                        String(result.resultId)
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(result.studentName || "")
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(result.examTitle || "")
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(result.subjectName || "")
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(result.grade || "")
                            .toLowerCase()
                            .includes(value)

                        ||

                        String(result.status || "")
                            .toLowerCase()
                            .includes(value)

                    );

                });


            displayResults(filtered);

        }
    );


    /* ==========================================
       EXPORT CSV
    ========================================== */

    exportButton.addEventListener(
        "click",
        function () {

            if (allResults.length === 0) {

                alert("No results available to export.");

                return;

            }


            let csv = "";

            csv +=
                "Result ID,Student,Exam,Subject,Score,Total Marks,Percentage,Grade,Status,Exam Date\n";


            allResults.forEach(function (result) {

                csv += [

                    "R" + String(result.resultId).padStart(3, "0"),

                    csvValue(result.studentName),

                    csvValue(result.examTitle),

                    csvValue(result.subjectName),

                    result.score,

                    result.totalMarks,

                    Number(result.percentage || 0).toFixed(2) + "%",

                    csvValue(result.grade),

                    csvValue(
                        String(result.status || "").toUpperCase()
                    ),

                    csvValue(
                        formatDate(result.examDate)
                    )

                ].join(",") + "\n";

            });


            const blob =
                new Blob(
                    [csv],
                    {
                        type: "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "ExamSphere_Results.csv";


            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            URL.revokeObjectURL(url);

        }
    );


    /* ==========================================
       DATE FORMAT
    ========================================== */

    function formatDate(value) {

        if (!value) {

            return "-";

        }


        const date =
            new Date(value);


        if (isNaN(date.getTime())) {

            return value;

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
       DATETIME FORMAT
    ========================================== */

    function formatDateTime(value) {

        if (!value) {

            return "-";

        }


        const date =
            new Date(value);


        if (isNaN(date.getTime())) {

            return value;

        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    /* ==========================================
       HTML ESCAPE
    ========================================== */

    function escapeHtml(value) {

        if (value === null || value === undefined) {

            return "";

        }


        const div =
            document.createElement("div");


        div.textContent =
            value;


        return div.innerHTML;

    }


    /* ==========================================
       CSV VALUE
    ========================================== */

    function csvValue(value) {

        if (value === null || value === undefined) {

            return '""';

        }


        return '"' +
            String(value)
                .replace(/"/g, '""')
            + '"';

    }

});