/* ==========================================
   ExamSphere - Create Exam
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("createExamForm");


    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const examCode =
            document.getElementById("examCode")
                .value
                .trim();

        const examTitle =
            document.getElementById("examTitle")
                .value
                .trim();

        const subjectId =
            document.getElementById("subjectId")
                .value;

        const duration =
            document.getElementById("duration")
                .value;

        const totalMarks =
            document.getElementById("totalMarks")
                .value;

        const passingMarks =
            document.getElementById("passingMarks")
                .value;

        const examDate =
            document.getElementById("examDate")
                .value;

        const examTime =
            document.getElementById("examTime")
                .value;

        const status =
            document.getElementById("status")
                .value;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            examCode === "" ||
            examTitle === "" ||
            subjectId === "" ||
            duration === "" ||
            totalMarks === "" ||
            passingMarks === "" ||
            examDate === "" ||
            examTime === ""
        ) {

            alert(
                "Please fill in all required fields."
            );

            return;
        }


        if (parseInt(duration) <= 0) {

            alert(
                "Duration must be greater than 0."
            );

            return;
        }


        if (parseInt(totalMarks) <= 0) {

            alert(
                "Total marks must be greater than 0."
            );

            return;
        }


        if (
            parseInt(passingMarks) <= 0 ||
            parseInt(passingMarks) > parseInt(totalMarks)
        ) {

            alert(
                "Passing marks must be greater than 0 and cannot exceed total marks."
            );

            return;
        }


        // ======================================
        // SEND TO BACKEND
        // ======================================

        const formData =
            new URLSearchParams();


        formData.append(
            "examCode",
            examCode
        );

        formData.append(
            "examTitle",
            examTitle
        );

        formData.append(
            "subjectId",
            subjectId
        );

        formData.append(
            "duration",
            duration
        );

        formData.append(
            "totalMarks",
            totalMarks
        );

        formData.append(
            "passingMarks",
            passingMarks
        );

        formData.append(
            "examDate",
            examDate
        );

        formData.append(
            "examTime",
            examTime + ":00"
        );

        formData.append(
            "status",
            status
        );


        fetch("../exam", {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body:
                formData.toString()

        })

        .then(response => {

            if (
                response.redirected
            ) {

                alert(
                    "Exam created successfully!"
                );

                window.location.href =
                    "admin-exam-management.html";

                return null;
            }


            return response.text();

        })

        .then(data => {

            if (data === null) {
                return;
            }

            if (
                data.includes(
                    "Failed to Add Exam"
                )
            ) {

                alert(
                    "Unable to create exam."
                );

                return;
            }


            alert(
                "Exam created successfully!"
            );

            window.location.href =
                "admin-exam-management.html";
        })

        .catch(error => {

            console.error(
                "Create exam error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        });

    });

});