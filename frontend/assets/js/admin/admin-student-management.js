 /* ==========================================
   ExamSphere - Student Management
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("studentSearch");

    const studentTable =
        document.getElementById("studentTable");


    // ==========================================
    // LOAD STUDENTS
    // ==========================================

    function loadStudents() {

        fetch("../studentManagement")

            .then(response => {

                if (!response.ok) {
                    throw new Error("Unable to load students");
                }

                return response.json();
            })

            .then(students => {

                studentTable.innerHTML = "";

                if (students.length === 0) {

                    studentTable.innerHTML = `
                        <tr>
                            <td colspan="8"
                                style="text-align:center;">
                                No students found
                            </td>
                        </tr>
                    `;

                    return;
                }

                students.forEach(student => {

                    const row =
                        document.createElement("tr");

                    row.innerHTML = `

                        <td>${student.studentId}</td>

                        <td>
                            ${escapeHtml(student.fullName)}
                        </td>

                        <td>
                            ${escapeHtml(student.email)}
                        </td>

                        <td>
                            ${escapeHtml(student.phone)}
                        </td>

                        <td>
                            ${escapeHtml(student.department)}
                        </td>

                        <td>
                            ${student.yearOfStudy}
                        </td>

                        <td class="${
                            student.status === "Active"
                                ? "active-status"
                                : "inactive-status"
                        }">

                            ${escapeHtml(student.status)}

                        </td>

                        <td>

                            <button
                                class="edit-btn"
                                type="button">

                                Edit

                            </button>

                            <button
                                class="delete-btn"
                                type="button">

                                Delete

                            </button>

                        </td>
                    `;

                    // Store register number
                    row.dataset.registerNumber =
                        student.registerNumber || "";

                    studentTable.appendChild(row);
                });

                attachEvents();
            })

            .catch(error => {

                console.error(
                    "Student loading error:",
                    error
                );

                studentTable.innerHTML = `
                    <tr>
                        <td colspan="8"
                            style="text-align:center;">
                            Unable to load students
                        </td>
                    </tr>
                `;
            });
    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener("keyup", () => {

            const value =
                searchInput.value
                    .toLowerCase()
                    .trim();

            document
                .querySelectorAll("#studentTable tr")
                .forEach(row => {

                    if (row.cells.length < 8) {
                        return;
                    }

                    const text =
                        row.textContent.toLowerCase();

                    row.style.display =
                        text.includes(value)
                            ? ""
                            : "none";
                });
        });
    }


    // ==========================================
    // ADD STUDENT
    // ==========================================

    const addButton =
        document.querySelector(".add-btn");

    if (addButton) {

        addButton.addEventListener("click", () => {

            window.location.href =
                "add-student.html";

        });
    }


    // ==========================================
    // ATTACH BUTTON EVENTS
    // ==========================================

    function attachEvents() {

        // ======================================
        // EDIT
        // ======================================

        document
            .querySelectorAll(".edit-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const row =
                            button.closest("tr");

                        const student = {

                            studentId:
                                parseInt(
                                    row.cells[0]
                                        .textContent
                                        .trim()
                                ),

                            fullName:
                                row.cells[1]
                                    .textContent
                                    .trim(),

                            email:
                                row.cells[2]
                                    .textContent
                                    .trim(),

                            phone:
                                row.cells[3]
                                    .textContent
                                    .trim(),

                            department:
                                row.cells[4]
                                    .textContent
                                    .trim(),

                            yearOfStudy:
                                parseInt(
                                    row.cells[5]
                                        .textContent
                                        .trim()
                                ),

                            status:
                                row.cells[6]
                                    .textContent
                                    .trim(),

                            registerNumber:
                                row.dataset.registerNumber
                        };

                        openEditModal(student);
                    }
                );
            });


        // ======================================
        // DELETE
        // ======================================

        document
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const row =
                            button.closest("tr");

                        const studentId =
                            parseInt(
                                row.cells[0]
                                    .textContent
                                    .trim()
                            );

                        const studentName =
                            row.cells[1]
                                .textContent
                                .trim();


                        const confirmDelete =
                            confirm(
                                "Are you sure you want to delete " +
                                studentName +
                                "?"
                            );


                        if (!confirmDelete) {
                            return;
                        }


                        const formData =
                            new URLSearchParams();

                        formData.append(
                            "studentId",
                            studentId
                        );


                        fetch("../deleteStudent", {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/x-www-form-urlencoded"
                            },

                            body:
                                formData.toString()

                        })

                        .then(response => {

                            if (!response.ok) {

                                throw new Error(
                                    "Delete request failed"
                                );
                            }

                            return response.json();
                        })

                        .then(data => {

                            if (data.success) {

                                alert(
                                    "Student deleted successfully!"
                                );

                                loadStudents();

                            } else {

                                alert(
                                    data.message ||
                                    "Unable to delete student."
                                );
                            }
                        })

                        .catch(error => {

                            console.error(
                                "Delete error:",
                                error
                            );

                            alert(
                                "Unable to connect to the server."
                            );
                        });
                    }
                );
            });
    }


    // ==========================================
    // EDIT MODAL
    // ==========================================

    function openEditModal(student) {

        const oldModal =
            document.getElementById(
                "editStudentModal"
            );

        if (oldModal) {
            oldModal.remove();
        }


        const modal =
            document.createElement("div");

        modal.id =
            "editStudentModal";


        modal.innerHTML = `

            <div class="edit-modal-overlay">

                <div class="edit-modal">

                    <div class="edit-modal-header">

                        <h2>

                            <i class="fa-solid fa-user-pen"></i>

                            Edit Student

                        </h2>


                        <button
                            type="button"
                            id="closeEditModal">

                            &times;

                        </button>

                    </div>


                    <form id="editStudentForm">

                        <div class="edit-form-grid">


                            <!-- FULL NAME -->

                            <div class="edit-form-group">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    id="editFullName"
                                    required>

                            </div>


                            <!-- REGISTER NUMBER -->

                            <div class="edit-form-group">

                                <label>
                                    Register Number
                                </label>

                                <input
                                    type="text"
                                    id="editRegisterNumber"
                                    required>

                            </div>


                            <!-- EMAIL -->

                            <div class="edit-form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="editEmail"
                                    required>

                            </div>


                            <!-- PHONE -->

                            <div class="edit-form-group">

                                <label>
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    id="editPhone"
                                    maxlength="10"
                                    required>

                            </div>


                            <!-- DEPARTMENT -->

                            <div class="edit-form-group">

                                <label>
                                    Department
                                </label>

                                <select
                                    id="editDepartment"
                                    required>

                                    <option value="CSE">
                                        CSE
                                    </option>

                                    <option value="IT">
                                        IT
                                    </option>

                                    <option value="ECE">
                                        ECE
                                    </option>

                                    <option value="EEE">
                                        EEE
                                    </option>

                                    <option value="MECH">
                                        MECH
                                    </option>

                                    <option value="CIVIL">
                                        CIVIL
                                    </option>

                                </select>

                            </div>


                            <!-- YEAR -->

                            <div class="edit-form-group">

                                <label>
                                    Year
                                </label>

                                <select
                                    id="editYear"
                                    required>

                                    <option value="1">
                                        I Year
                                    </option>

                                    <option value="2">
                                        II Year
                                    </option>

                                    <option value="3">
                                        III Year
                                    </option>

                                    <option value="4">
                                        IV Year
                                    </option>

                                </select>

                            </div>


                            <!-- STATUS -->

                            <div class="edit-form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    id="editStatus"
                                    required>

                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                        </div>


                        <!-- ACTIONS -->

                        <div class="edit-form-actions">

                            <button
                                type="button"
                                id="cancelEdit">

                                Cancel

                            </button>


                            <button
                                type="submit">

                                <i class="fa-solid fa-save"></i>

                                Save Changes

                            </button>

                        </div>

                    </form>

                </div>

            </div>
        `;


        document.body.appendChild(modal);


        // ======================================
        // FILL EXISTING DATA
        // ======================================

        document.getElementById(
            "editFullName"
        ).value =
            student.fullName;


        document.getElementById(
            "editRegisterNumber"
        ).value =
            student.registerNumber || "";


        document.getElementById(
            "editEmail"
        ).value =
            student.email;


        document.getElementById(
            "editPhone"
        ).value =
            student.phone;


        document.getElementById(
            "editDepartment"
        ).value =
            student.department;


        document.getElementById(
            "editYear"
        ).value =
            student.yearOfStudy;


        document.getElementById(
            "editStatus"
        ).value =
            student.status;


        // ======================================
        // CLOSE BUTTON
        // ======================================

        document.getElementById(
            "closeEditModal"
        ).addEventListener(
            "click",
            closeEditModal
        );


        // ======================================
        // CANCEL BUTTON
        // ======================================

        document.getElementById(
            "cancelEdit"
        ).addEventListener(
            "click",
            closeEditModal
        );


        // ======================================
        // SAVE
        // ======================================

        document.getElementById(
            "editStudentForm"
        ).addEventListener(
            "submit",
            event => {

                event.preventDefault();

                updateStudent(
                    student.studentId
                );
            }
        );
    }


    // ==========================================
    // UPDATE STUDENT
    // ==========================================

    function updateStudent(studentId) {

        const phone =
            document.getElementById(
                "editPhone"
            ).value.trim();


        if (!/^\d{10}$/.test(phone)) {

            alert(
                "Please enter a valid 10-digit phone number."
            );

            return;
        }


        const studentData = {

            studentId: studentId,

            fullName:
                document.getElementById(
                    "editFullName"
                ).value.trim(),

            registerNumber:
                document.getElementById(
                    "editRegisterNumber"
                ).value.trim(),

            email:
                document.getElementById(
                    "editEmail"
                ).value.trim(),

            phone: phone,

            department:
                document.getElementById(
                    "editDepartment"
                ).value,

            yearOfStudy:
                parseInt(
                    document.getElementById(
                        "editYear"
                    ).value
                ),

            status:
                document.getElementById(
                    "editStatus"
                ).value
        };


        fetch("../updateStudent", {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(studentData)

        })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Update failed"
                );
            }

            return response.json();
        })

        .then(data => {

            if (data.success) {

                alert(
                    "Student updated successfully!"
                );

                closeEditModal();

                loadStudents();

            } else {

                alert(
                    data.message ||
                    "Unable to update student."
                );
            }
        })

        .catch(error => {

            console.error(
                "Update error:",
                error
            );

            alert(
                "Unable to connect to the server."
            );
        });
    }


    // ==========================================
    // CLOSE EDIT MODAL
    // ==========================================

    function closeEditModal() {

        const modal =
            document.getElementById(
                "editStudentModal"
            );

        if (modal) {
            modal.remove();
        }
    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHtml(value) {

        return String(
            value ?? ""
        )
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


    // ==========================================
    // INITIAL LOAD
    // ==========================================

    loadStudents();

});