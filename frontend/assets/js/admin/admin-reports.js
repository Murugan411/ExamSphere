/* ==========================================
   ExamSphere - Reports & Analytics
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const totalStudents =
        document.getElementById("totalStudents");

    const totalExams =
        document.getElementById("totalExams");

    const passPercentage =
        document.getElementById("passPercentage");

    const highestScore =
        document.getElementById("highestScore");

    const exportButton =
        document.querySelector(".export-btn");


    let reportData = null;

    let studentChart = null;
    let subjectChart = null;
    let examChart = null;
    let monthlyChart = null;


    /* ==========================================
       LOAD REPORT DATA
    ========================================== */

    loadReports();


    function loadReports() {

        fetch("../report?view=admin", {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "HTTP " + response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            console.log(
                "Reports loaded successfully:",
                data
            );

            reportData = data;


            updateSummary(
                data.summary
            );


            createStudentPerformanceChart(
                data.studentPerformance
            );


            createSubjectAnalysisChart(
                data.subjectAnalysis
            );


            createExamStatisticsChart(
                data.examStatistics
            );


            createMonthlyPerformanceChart(
                data.monthlyPerformance
            );

        })

        .catch(function (error) {

            console.error(
                "Reports loading error:",
                error
            );

            showReportError();

        });

    }


    /* ==========================================
       UPDATE SUMMARY CARDS
    ========================================== */

    function updateSummary(summary) {

        if (!summary) {

            return;

        }


        totalStudents.textContent =
            summary.totalStudents || 0;


        totalExams.textContent =
            summary.totalExams || 0;


        passPercentage.textContent =
            Number(
                summary.passPercentage || 0
            ).toFixed(2) + "%";


        highestScore.textContent =
            Number(
                summary.highestScore || 0
            ).toFixed(2) + "%";

    }


    /* ==========================================
       STUDENT PERFORMANCE CHART
    ========================================== */

    function createStudentPerformanceChart(
        students
    ) {

        const canvas =
            document.getElementById(
                "studentPerformanceChart"
            );


        if (!canvas) {

            return;

        }


        const labels =
            students.map(function (student) {

                return student.studentName;

            });


        const averages =
            students.map(function (student) {

                return Number(
                    student.averagePercentage || 0
                );

            });


        if (studentChart) {

            studentChart.destroy();

        }


        studentChart =
            new Chart(
                canvas,
                {

                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Average Percentage",

                                data: averages,

                                borderWidth: 1

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true,

                                max: 100,

                                title: {

                                    display: true,

                                    text:
                                        "Percentage"

                                }

                            }

                        },

                        plugins: {

                            legend: {

                                display: true

                            }

                        }

                    }

                }
            );

    }


    /* ==========================================
       SUBJECT ANALYSIS CHART
    ========================================== */

    function createSubjectAnalysisChart(
        subjects
    ) {

        const canvas =
            document.getElementById(
                "subjectAnalysisChart"
            );


        if (!canvas) {

            return;

        }


        const labels =
            subjects.map(function (subject) {

                return subject.subjectName;

            });


        const averages =
            subjects.map(function (subject) {

                return Number(
                    subject.averagePercentage || 0
                );

            });


        if (subjectChart) {

            subjectChart.destroy();

        }


        subjectChart =
            new Chart(
                canvas,
                {

                    type: "doughnut",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Average Percentage",

                                data: averages,

                                borderWidth: 1

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {

                                position: "bottom"

                            }

                        }

                    }

                }
            );

    }


    /* ==========================================
       EXAM STATISTICS CHART
    ========================================== */

    function createExamStatisticsChart(
        exams
    ) {

        const canvas =
            document.getElementById(
                "examStatisticsChart"
            );


        if (!canvas) {

            return;

        }


        const labels =
            exams.map(function (exam) {

                return exam.examTitle;

            });


        const attempts =
            exams.map(function (exam) {

                return Number(
                    exam.attempts || 0
                );

            });


        const averages =
            exams.map(function (exam) {

                return Number(
                    exam.averagePercentage || 0
                );

            });


        if (examChart) {

            examChart.destroy();

        }


        examChart =
            new Chart(
                canvas,
                {

                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Attempts",

                                data: attempts,

                                borderWidth: 1

                            },

                            {

                                label:
                                    "Average Percentage",

                                data: averages,

                                borderWidth: 1

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true

                            }

                        },

                        plugins: {

                            legend: {

                                display: true

                            }

                        }

                    }

                }

            );

    }


    /* ==========================================
       MONTHLY PERFORMANCE CHART
    ========================================== */

    function createMonthlyPerformanceChart(
        monthlyData
    ) {

        const canvas =
            document.getElementById(
                "monthlyPerformanceChart"
            );


        if (!canvas) {

            return;

        }


        const labels =
            monthlyData.map(function (item) {

                return item.month;

            });


        const averages =
            monthlyData.map(function (item) {

                return Number(
                    item.averagePercentage || 0
                );

            });


        if (monthlyChart) {

            monthlyChart.destroy();

        }


        monthlyChart =
            new Chart(
                canvas,
                {

                    type: "line",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Average Percentage",

                                data: averages,

                                borderWidth: 2,

                                tension: 0.3,

                                fill: false

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true,

                                max: 100,

                                title: {

                                    display: true,

                                    text:
                                        "Percentage"

                                }

                            }

                        }

                    }

                }

            );

    }


    /* ==========================================
       EXPORT REPORT
    ========================================== */

    exportButton.addEventListener(
        "click",
        function () {

            if (!reportData) {

                alert(
                    "Report data is still loading."
                );

                return;

            }


            let csv = "";


            /* SUMMARY */

            csv +=
                "EXAMSPHERE REPORT\n\n";


            csv +=
                "SUMMARY\n";


            csv +=
                "Total Students," +
                reportData.summary.totalStudents +
                "\n";


            csv +=
                "Total Exams," +
                reportData.summary.totalExams +
                "\n";


            csv +=
                "Pass Percentage," +
                Number(
                    reportData.summary.passPercentage
                ).toFixed(2) +
                "%\n";


            csv +=
                "Highest Score," +
                Number(
                    reportData.summary.highestScore
                ).toFixed(2) +
                "%\n\n";


            /* STUDENT PERFORMANCE */

            csv +=
                "STUDENT PERFORMANCE\n";


            csv +=
                "Student,Exams Taken,Average Percentage,Highest Percentage,Passed Exams\n";


            reportData.studentPerformance
                .forEach(function (student) {

                    csv += [

                        csvValue(
                            student.studentName
                        ),

                        student.examsTaken,

                        Number(
                            student.averagePercentage || 0
                        ).toFixed(2) + "%",

                        Number(
                            student.highestPercentage || 0
                        ).toFixed(2) + "%",

                        student.passedExams

                    ].join(",") + "\n";

                });


            csv += "\n";


            /* SUBJECT ANALYSIS */

            csv +=
                "SUBJECT-WISE ANALYSIS\n";


            csv +=
                "Subject,Attempts,Average Percentage,Highest Percentage,Passed\n";


            reportData.subjectAnalysis
                .forEach(function (subject) {

                    csv += [

                        csvValue(
                            subject.subjectName
                        ),

                        subject.attempts,

                        Number(
                            subject.averagePercentage || 0
                        ).toFixed(2) + "%",

                        Number(
                            subject.highestPercentage || 0
                        ).toFixed(2) + "%",

                        subject.passed

                    ].join(",") + "\n";

                });


            csv += "\n";


            /* EXAM STATISTICS */

            csv +=
                "EXAM STATISTICS\n";


            csv +=
                "Exam,Subject,Total Marks,Attempts,Average Percentage,Highest Percentage\n";


            reportData.examStatistics
                .forEach(function (exam) {

                    csv += [

                        csvValue(
                            exam.examTitle
                        ),

                        csvValue(
                            exam.subjectName
                        ),

                        exam.totalMarks,

                        exam.attempts,

                        Number(
                            exam.averagePercentage || 0
                        ).toFixed(2) + "%",

                        Number(
                            exam.highestPercentage || 0
                        ).toFixed(2) + "%"

                    ].join(",") + "\n";

                });


            csv += "\n";


            /* MONTHLY PERFORMANCE */

            csv +=
                "MONTHLY PERFORMANCE\n";


            csv +=
                "Month,Attempts,Average Percentage,Passed\n";


            reportData.monthlyPerformance
                .forEach(function (month) {

                    csv += [

                        csvValue(
                            month.month
                        ),

                        month.attempts,

                        Number(
                            month.averagePercentage || 0
                        ).toFixed(2) + "%",

                        month.passed

                    ].join(",") + "\n";

                });


            /* CREATE FILE */

            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;


            link.download =
                "ExamSphere_Report.csv";


            document.body.appendChild(link);


            link.click();


            document.body.removeChild(link);


            URL.revokeObjectURL(url);

        }
    );


    /* ==========================================
       CSV ESCAPE
    ========================================== */

    function csvValue(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return '""';

        }


        return '"' +
            String(value)
                .replace(/"/g, '""') +
            '"';

    }


    /* ==========================================
       ERROR MESSAGE
    ========================================== */

    function showReportError() {

        totalStudents.textContent = "—";

        totalExams.textContent = "—";

        passPercentage.textContent = "—";

        highestScore.textContent = "—";


        const boxes =
            document.querySelectorAll(
                ".report-box"
            );


        boxes.forEach(function (box) {

            const canvas =
                box.querySelector("canvas");


            if (canvas) {

                const message =
                    document.createElement("p");


                message.textContent =
                    "Unable to load report data.";


                message.style.color =
                    "#64748b";


                canvas.replaceWith(message);

            }

        });

    }


    /* ==========================================
       PAGE LOAD ANIMATION
    ========================================== */

    const cards =
        document.querySelectorAll(".card");


    const reportBoxes =
        document.querySelectorAll(
            ".report-box"
        );


    cards.forEach(function (card, index) {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(30px)";


        setTimeout(function () {

            card.style.transition =
                "0.5s ease";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, index * 150);

    });


    reportBoxes.forEach(
        function (box, index) {

            box.style.opacity = "0";

            box.style.transform =
                "translateY(30px)";


            setTimeout(function () {

                box.style.transition =
                    "0.5s ease";

                box.style.opacity = "1";

                box.style.transform =
                    "translateY(0)";

            }, 400 + (index * 150));

        }
    );

});