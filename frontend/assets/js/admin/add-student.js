/* ==========================================
   ExamSphere - Add Student
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("addStudentForm");

    form.addEventListener("submit", (event) => {

        event.preventDefault();

        const fullName =
            document.getElementById("fullName").value.trim();

        const registerNumber =
            document.getElementById("registerNumber").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const department =
            document.getElementById("department").value;

        const yearOfStudy =
            document.getElementById("yearOfStudy").value;

        const password =
            document.getElementById("password").value;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            fullName === "" ||
            registerNumber === "" ||
            email === "" ||
            phone === "" ||
            department === "" ||
            yearOfStudy === "" ||
            password === ""
        ) {

            alert("Please fill in all fields.");

            return;
        }


        // ==========================================
        // EMAIL VALIDATION
        // ==========================================

        const emailPattern =
            /^[^ ]+@[^ ]+\.[a-z]{2,}$/i;

        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;
        }


        // ==========================================
        // PHONE VALIDATION
        // ==========================================

        if (!/^\d{10}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }


        // ==========================================
        // PASSWORD VALIDATION
        // ==========================================

        if (password.length < 8) {

            alert(
                "Password must contain at least 8 characters."
            );

            return;
        }


        // ==========================================
        // PREPARE STUDENT DATA
        // ==========================================

        const studentData = {

            fullName: fullName,

            registerNumber: registerNumber,

            email: email,

            phone: phone,

            department: department,

            yearOfStudy: parseInt(yearOfStudy),

            password: password
        };


        // ==========================================
        // SEND DATA TO BACKEND
        // ==========================================

        fetch("../addStudent", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(studentData)

        })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to add student."
                );
            }

            return response.json();

        })

        .then(data => {

            if (data.success) {

                alert(
                    "Student added successfully!"
                );

                window.location.href =
                    "admin-student-management.html";

            } else {

                alert(
                    data.message ||
                    "Unable to add student."
                );
            }

        })

        .catch(error => {

            console.error(
                "Add student error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        });

    });

});