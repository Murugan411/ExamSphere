 /* =========================================================
   EXAMSPHERE - ADMIN EXAM MANAGEMENT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const examTable = document.getElementById("examTableBody");
    const searchInput = document.getElementById("searchExam");
    const addExamBtn = document.querySelector(".add-btn");
    const exportExamBtn = document.getElementById("exportExamBtn");

    let allExams = [];


    /* =====================================================
       LOAD EXAMS
       ===================================================== */

    function loadExams() {

        if (!examTable) {
            console.error("Exam table body not found.");
            return;
        }

        examTable.innerHTML = `
            <tr>
                <td colspan="9"
                    style="text-align:center;padding:25px;">
                    Loading exams...
                </td>
            </tr>
        `;

        fetch("../exam")
            .then(response => {

                if (!response.ok) {
                    throw new Error(
                        "HTTP Error: " + response.status
                    );
                }

                return response.json();
            })
            .then(exams => {

                console.log("Exams loaded:", exams);

                allExams = Array.isArray(exams)
                    ? exams
                    : [];

                renderExams(allExams);
            })
            .catch(error => {

                console.error(
                    "Unable to load exams:",
                    error
                );

                examTable.innerHTML = `
                    <tr>
                        <td colspan="9"
                            style="
                                text-align:center;
                                padding:25px;
                                color:red;
                            ">
                            Unable to load exams
                        </td>
                    </tr>
                `;
            });
    }


    /* =====================================================
       RENDER EXAMS
       ===================================================== */

    function renderExams(exams) {

        if (!examTable) {
            return;
        }

        if (!exams || exams.length === 0) {

            examTable.innerHTML = `
                <tr>
                    <td colspan="9"
                        style="
                            text-align:center;
                            padding:25px;
                            color:#777;
                        ">
                        No exams found.
                    </td>
                </tr>
            `;

            return;
        }

        examTable.innerHTML = "";

        exams.forEach(exam => {

            const row = document.createElement("tr");

            row.dataset.examId =
                exam.examId;

            row.dataset.examCode =
                exam.examCode || "";


            /* ---------------------------------------------
               FORMAT DATE
               --------------------------------------------- */

            let formattedDate = "";

            if (exam.examDate) {

                const date =
                    new Date(exam.examDate);

                if (!isNaN(date.getTime())) {

                    formattedDate =
                        String(date.getDate()).padStart(2, "0")
                        + "/"
                        + String(
                            date.getMonth() + 1
                        ).padStart(2, "0")
                        + "/"
                        + date.getFullYear();
                }
                else {

                    formattedDate =
                        exam.examDate;
                }
            }


            /* ---------------------------------------------
               FORMAT TIME
               --------------------------------------------- */

            let formattedTime = "";

            if (exam.examTime) {

                formattedTime =
                    String(exam.examTime)
                        .substring(0, 5);
            }


            /* ---------------------------------------------
               STATUS
               --------------------------------------------- */

            const status =
                exam.status || "Active";

            const statusClass =
                status.toLowerCase() === "active"
                    ? "active"
                    : "inactive";


            /* ---------------------------------------------
               ROW
               --------------------------------------------- */

            row.innerHTML = `

                <td>
                    ${escapeHtml(exam.examCode || "")}
                </td>

                <td>
                    ${escapeHtml(exam.examTitle || "")}
                </td>

                <td>
                    ${escapeHtml(
                        getSubjectName(exam.subjectId)
                    )}
                </td>

                <td>
                    ${exam.durationMinutes || 0} Min
                </td>

                <td>
                    ${exam.totalMarks || 0}
                </td>

                <td>
                    ${exam.passingMarks || 0}
                </td>

                <td>
                    ${formattedDate}
                    ${
                        formattedTime
                            ? "<br><small>" +
                              escapeHtml(formattedTime) +
                              "</small>"
                            : ""
                    }
                </td>

                <td>
                    <span class="status-${statusClass}">
                        ${escapeHtml(status)}
                    </span>
                </td>

                <td>

                    <div class="exam-action-buttons">

                        <button
                            type="button"
                            class="questions-btn"
                            title="Manage Questions">

                            <i class="fa-solid fa-circle-question"></i>
                            Questions

                        </button>


                        <button
                            type="button"
                            class="edit-btn"
                            title="Edit Exam">

                            <i class="fa-solid fa-pen"></i>
                            Edit

                        </button>


                        <button
                            type="button"
                            class="delete-btn"
                            title="Delete Exam">

                            <i class="fa-solid fa-trash"></i>
                            Delete

                        </button>

                    </div>

                </td>
            `;

            examTable.appendChild(row);

        });


        attachExamEvents();
    }


    /* =====================================================
       SUBJECT NAME

       IMPORTANT:
       These IDs match your current MySQL subjects table.
       ===================================================== */

    function getSubjectName(subjectId) {

        const subjects = {

            1: "Java loop",

            2: "Python Programming",

            4: "Computer Networks",

            5: "Operating Systems",

            16: "computer networks",

            18: "computer networks",

            19: "computer networks",

            21: "computer networks",

            22: "Java Programming",

            23: "computer networks"

        };

        return subjects[subjectId]
            || "Subject " + subjectId;
    }


    /* =====================================================
       SUBJECT OPTIONS
       ===================================================== */

    function getSubjectOptions(selectedId) {

        const subjects = [

            {
                id: 1,
                name: "Java loop"
            },

            {
                id: 2,
                name: "Python Programming"
            },

            {
                id: 4,
                name: "Computer Networks"
            },

            {
                id: 5,
                name: "Operating Systems"
            },

            {
                id: 16,
                name: "computer networks"
            },

            {
                id: 18,
                name: "computer networks"
            },

            {
                id: 19,
                name: "computer networks"
            },

            {
                id: 21,
                name: "computer networks"
            },

            {
                id: 22,
                name: "Java Programming"
            },

            {
                id: 23,
                name: "computer networks"
            }

        ];

        let options = `
            <option value="">
                Select Subject
            </option>
        `;

        subjects.forEach(subject => {

            options += `
                <option
                    value="${subject.id}"
                    ${String(subject.id) === String(selectedId)
                        ? "selected"
                        : ""}>
                    ${escapeHtml(subject.name)}
                </option>
            `;

        });

        return options;
    }


    /* =====================================================
       EDIT + DELETE + QUESTIONS EVENTS
       ===================================================== */

    function attachExamEvents() {


        /* =================================================
           MANAGE QUESTIONS
           ================================================= */

        document
            .querySelectorAll(".questions-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const row =
                            button.closest("tr");

                        if (!row) {
                            return;
                        }

                        const examId =
                            row.dataset.examId;

                        const examCode =
                            row.dataset.examCode;


                        if (!examId) {

                            alert(
                                "Exam ID not found."
                            );

                            return;
                        }


                        console.log(
                            "Opening questions for Exam ID:",
                            examId
                        );


                        window.location.href =
                            "admin-exam-questions.html?examId="
                            + encodeURIComponent(examId)
                            + "&examCode="
                            + encodeURIComponent(
                                examCode || ""
                            );

                    }
                );

            });


        /* =================================================
           EDIT EXAM
           ================================================= */

        document
            .querySelectorAll(".edit-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const row =
                            button.closest("tr");

                        if (!row) {
                            return;
                        }

                        const examId =
                            parseInt(
                                row.dataset.examId
                            );


                        const exam =
                            allExams.find(
                                item =>
                                    parseInt(
                                        item.examId
                                    ) === examId
                            );


                        if (!exam) {

                            alert(
                                "Exam details not found."
                            );

                            return;
                        }


                        openEditExamModal(exam);

                    }
                );

            });


        /* =================================================
           DELETE EXAM
           ================================================= */

        document
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const row =
                            button.closest("tr");

                        if (!row) {
                            return;
                        }


                        const examId =
                            row.dataset.examId;

                        const examCode =
                            row.dataset.examCode;


                        const exam =
                            allExams.find(
                                item =>
                                    String(
                                        item.examId
                                    ) === String(examId)
                            );


                        const examName =
                            exam
                                ? exam.examTitle
                                : "this exam";


                        const confirmDelete =
                            confirm(
                                "Are you sure you want to delete "
                                + examCode
                                + " - "
                                + examName
                                + "?"
                            );


                        if (!confirmDelete) {
                            return;
                        }


                        button.disabled = true;

                        button.innerHTML =
                            "Deleting...";


                        const formData =
                            new URLSearchParams();


                        formData.append(
                            "action",
                            "delete"
                        );


                        formData.append(
                            "examId",
                            examId
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

                            if (!response.ok) {

                                throw new Error(
                                    "HTTP Error: "
                                    + response.status
                                );
                            }

                            return response.text();

                        })

                        .then(result => {

                            console.log(
                                "Delete response:",
                                result
                            );


                            if (
                                result
                                    .toLowerCase()
                                    .includes("success")
                            ) {

                                alert(
                                    "Exam deleted successfully!"
                                );

                                loadExams();

                            }
                            else {

                                alert(
                                    result ||
                                    "Unable to delete exam."
                                );

                                button.disabled =
                                    false;

                                button.innerHTML =
                                    `
                                    <i class="fa-solid fa-trash"></i>
                                    Delete
                                    `;
                            }

                        })

                        .catch(error => {

                            console.error(
                                "Delete exam error:",
                                error
                            );


                            alert(
                                "Unable to connect to the server."
                            );


                            button.disabled =
                                false;


                            button.innerHTML =
                                `
                                <i class="fa-solid fa-trash"></i>
                                Delete
                                `;
                        });

                    }
                );

            });

    }


    /* =====================================================
       OPEN EDIT EXAM MODAL
       ===================================================== */

    function openEditExamModal(exam) {

        const existingModal =
            document.getElementById(
                "editExamModal"
            );


        if (existingModal) {
            existingModal.remove();
        }


        const modal =
            document.createElement("div");


        modal.id =
            "editExamModal";


        modal.innerHTML = `

            <div class="edit-exam-overlay">

                <div class="edit-exam-modal">

                    <div class="edit-exam-header">

                        <div>

                            <h2>
                                <i class="fa-solid fa-pen-to-square"></i>
                                Edit Exam
                            </h2>

                            <p>
                                Update examination details
                            </p>

                        </div>


                        <button
                            type="button"
                            id="closeEditExam">

                            &times;

                        </button>

                    </div>


                    <form id="editExamForm">

                        <div class="edit-exam-grid">


                            <div class="edit-form-group">

                                <label>
                                    Exam Code
                                </label>

                                <input
                                    type="text"
                                    id="editExamCode"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Exam Title
                                </label>

                                <input
                                    type="text"
                                    id="editExamTitle"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Subject
                                </label>

                                <select
                                    id="editSubjectId"
                                    required>

                                    ${getSubjectOptions(
                                        exam.subjectId
                                    )}

                                </select>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Duration (Minutes)
                                </label>

                                <input
                                    type="number"
                                    id="editDuration"
                                    min="1"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Total Marks
                                </label>

                                <input
                                    type="number"
                                    id="editTotalMarks"
                                    min="1"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Passing Marks
                                </label>

                                <input
                                    type="number"
                                    id="editPassingMarks"
                                    min="1"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Exam Date
                                </label>

                                <input
                                    type="date"
                                    id="editExamDate"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Exam Time
                                </label>

                                <input
                                    type="time"
                                    id="editExamTime"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    id="editExamStatus"
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


                        <div class="edit-exam-actions">

                            <button
                                type="button"
                                id="cancelEditExam"
                                class="cancel-edit-btn">

                                Cancel

                            </button>


                            <button
                                type="submit"
                                class="save-edit-btn">

                                <i class="fa-solid fa-save"></i>

                                Save Changes

                            </button>

                        </div>

                    </form>

                </div>

            </div>
        `;


        document.body.appendChild(modal);


        /* =================================================
           FILL EXISTING DATA
           ================================================= */

        document.getElementById(
            "editExamCode"
        ).value =
            exam.examCode || "";


        document.getElementById(
            "editExamTitle"
        ).value =
            exam.examTitle || "";


        document.getElementById(
            "editSubjectId"
        ).value =
            exam.subjectId || "";


        document.getElementById(
            "editDuration"
        ).value =
            exam.durationMinutes || "";


        document.getElementById(
            "editTotalMarks"
        ).value =
            exam.totalMarks || "";


        document.getElementById(
            "editPassingMarks"
        ).value =
            exam.passingMarks || "";


        document.getElementById(
            "editExamDate"
        ).value =
            formatDateForInput(
                exam.examDate
            );


        document.getElementById(
            "editExamTime"
        ).value =
            exam.examTime
                ? String(
                    exam.examTime
                ).substring(0, 5)
                : "";


        document.getElementById(
            "editExamStatus"
        ).value =
            exam.status || "Active";


        /* =================================================
           CLOSE MODAL
           ================================================= */

        document.getElementById(
            "closeEditExam"
        ).addEventListener(
            "click",
            closeEditExamModal
        );


        document.getElementById(
            "cancelEditExam"
        ).addEventListener(
            "click",
            closeEditExamModal
        );


        /* =================================================
           SUBMIT UPDATE
           ================================================= */

        document.getElementById(
            "editExamForm"
        ).addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                updateExam(
                    exam.examId
                );

            }
        );

    }


    /* =====================================================
       UPDATE EXAM
       ===================================================== */

    function updateExam(examId) {

        const examCode =
            document.getElementById(
                "editExamCode"
            ).value.trim();


        const examTitle =
            document.getElementById(
                "editExamTitle"
            ).value.trim();


        const subjectId =
            document.getElementById(
                "editSubjectId"
            ).value;


        const duration =
            document.getElementById(
                "editDuration"
            ).value;


        const totalMarks =
            document.getElementById(
                "editTotalMarks"
            ).value;


        const passingMarks =
            document.getElementById(
                "editPassingMarks"
            ).value;


        const examDate =
            document.getElementById(
                "editExamDate"
            ).value;


        const examTime =
            document.getElementById(
                "editExamTime"
            ).value;


        const status =
            document.getElementById(
                "editExamStatus"
            ).value;


        /* =================================================
           VALIDATION
           ================================================= */

        if (
            !examCode ||
            !examTitle ||
            !subjectId ||
            !duration ||
            !totalMarks ||
            !passingMarks ||
            !examDate ||
            !examTime ||
            !status
        ) {

            alert(
                "Please fill all exam details."
            );

            return;
        }


        if (
            parseInt(passingMarks) >
            parseInt(totalMarks)
        ) {

            alert(
                "Passing marks cannot be greater than total marks."
            );

            return;
        }


        /* =================================================
           PREPARE DATA
           ================================================= */

        const formData =
            new URLSearchParams();


        formData.append(
            "action",
            "update"
        );


        formData.append(
            "examId",
            examId
        );


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
            examTime
        );


        formData.append(
            "status",
            status
        );


        /* =================================================
           SEND UPDATE
           ================================================= */

        const saveButton =
            document.querySelector(
                "#editExamForm .save-edit-btn"
            );


        if (saveButton) {

            saveButton.disabled =
                true;

            saveButton.innerHTML =
                `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Saving...
                `;
        }


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

            return response.text()
                .then(result => {

                    if (!response.ok) {

                        throw new Error(
                            result ||
                            "HTTP Error: "
                            + response.status
                        );
                    }

                    return result;
                });

        })

        .then(result => {

            console.log(
                "Update response:",
                result
            );


            if (
                result
                    .toLowerCase()
                    .includes("success")
            ) {

                alert(
                    "Exam updated successfully!"
                );


                closeEditExamModal();


                loadExams();

            }
            else {

                alert(
                    result ||
                    "Unable to update exam."
                );


                if (saveButton) {

                    saveButton.disabled =
                        false;

                    saveButton.innerHTML =
                        `
                        <i class="fa-solid fa-save"></i>
                        Save Changes
                        `;
                }
            }

        })

        .catch(error => {

            console.error(
                "Update exam error:",
                error
            );


            alert(
                error.message ||
                "Unable to connect to the server."
            );


            if (saveButton) {

                saveButton.disabled =
                    false;

                saveButton.innerHTML =
                    `
                    <i class="fa-solid fa-save"></i>
                    Save Changes
                    `;
            }

        });

    }


    /* =====================================================
       CLOSE EDIT MODAL
       ===================================================== */

    function closeEditExamModal() {

        const modal =
            document.getElementById(
                "editExamModal"
            );


        if (modal) {

            modal.remove();

        }

    }


    /* =====================================================
       SEARCH EXAMS
       ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                const searchText =
                    this.value
                        .trim()
                        .toLowerCase();


                if (!searchText) {

                    renderExams(
                        allExams
                    );

                    return;
                }


                const filteredExams =
                    allExams.filter(
                        exam => {

                            return (

                                String(
                                    exam.examCode || ""
                                )
                                .toLowerCase()
                                .includes(searchText)

                                ||

                                String(
                                    exam.examTitle || ""
                                )
                                .toLowerCase()
                                .includes(searchText)

                                ||

                                getSubjectName(
                                    exam.subjectId
                                )
                                .toLowerCase()
                                .includes(searchText)

                                ||

                                String(
                                    exam.status || ""
                                )
                                .toLowerCase()
                                .includes(searchText)

                            );

                        }
                    );


                renderExams(
                    filteredExams
                );

            }
        );

    }


    /* =====================================================
       CREATE EXAM BUTTON
       ===================================================== */

    if (addExamBtn) {

        addExamBtn.addEventListener(
            "click",
            function () {

                openCreateExamModal();

            }
        );

    }


    /* =====================================================
       CREATE EXAM MODAL
       ===================================================== */

    function openCreateExamModal() {

        const existingModal =
            document.getElementById(
                "createExamModal"
            );


        if (existingModal) {

            existingModal.remove();

        }


        const modal =
            document.createElement("div");


        modal.id =
            "createExamModal";


        modal.innerHTML = `

            <div class="edit-exam-overlay">

                <div class="edit-exam-modal">

                    <div class="edit-exam-header">

                        <div>

                            <h2>
                                <i class="fa-solid fa-file-circle-plus"></i>
                                Create Exam
                            </h2>

                            <p>
                                Create a new examination
                            </p>

                        </div>


                        <button
                            type="button"
                            id="closeCreateExam">

                            &times;

                        </button>

                    </div>


                    <form id="createExamForm">

                        <div class="edit-exam-grid">


                            <div class="edit-form-group">

                                <label>
                                    Exam Code
                                </label>

                                <input
                                    type="text"
                                    id="createExamCode"
                                    placeholder="EX005"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Exam Title
                                </label>

                                <input
                                    type="text"
                                    id="createExamTitle"
                                    placeholder="Java Programming Test"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Subject
                                </label>

                                <select
                                    id="createSubjectId"
                                    required>

                                    ${getSubjectOptions("")}

                                </select>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Duration (Minutes)
                                </label>

                                <input
                                    type="number"
                                    id="createDuration"
                                    min="1"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Total Marks
                                </label>

                                <input
                                    type="number"
                                    id="createTotalMarks"
                                    min="1"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Passing Marks
                                </label>

                                <input
                                    type="number"
                                    id="createPassingMarks"
                                    min="1"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Exam Date
                                </label>

                                <input
                                    type="date"
                                    id="createExamDate"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Exam Time
                                </label>

                                <input
                                    type="time"
                                    id="createExamTime"
                                    required>

                            </div>


                            <div class="edit-form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    id="createExamStatus"
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


                        <div class="edit-exam-actions">

                            <button
                                type="button"
                                id="cancelCreateExam"
                                class="cancel-edit-btn">

                                Cancel

                            </button>


                            <button
                                type="submit"
                                class="save-edit-btn">

                                <i class="fa-solid fa-plus"></i>

                                Create Exam

                            </button>

                        </div>

                    </form>

                </div>

            </div>
        `;


        document.body.appendChild(modal);


        /* =================================================
           CLOSE
           ================================================= */

        document.getElementById(
            "closeCreateExam"
        ).addEventListener(
            "click",
            closeCreateExamModal
        );


        document.getElementById(
            "cancelCreateExam"
        ).addEventListener(
            "click",
            closeCreateExamModal
        );


        /* =================================================
           SUBMIT
           ================================================= */

        document.getElementById(
            "createExamForm"
        ).addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                createExam();

            }
        );

    }


    /* =====================================================
       CREATE EXAM
       ===================================================== */

    function createExam() {

        const examCode =
            document.getElementById(
                "createExamCode"
            ).value.trim();


        const examTitle =
            document.getElementById(
                "createExamTitle"
            ).value.trim();


        const subjectId =
            document.getElementById(
                "createSubjectId"
            ).value;


        const duration =
            document.getElementById(
                "createDuration"
            ).value;


        const totalMarks =
            document.getElementById(
                "createTotalMarks"
            ).value;


        const passingMarks =
            document.getElementById(
                "createPassingMarks"
            ).value;


        const examDate =
            document.getElementById(
                "createExamDate"
            ).value;


        const examTime =
            document.getElementById(
                "createExamTime"
            ).value;


        const status =
            document.getElementById(
                "createExamStatus"
            ).value;


        /* =================================================
           VALIDATION
           ================================================= */

        if (
            !examCode ||
            !examTitle ||
            !subjectId ||
            !duration ||
            !totalMarks ||
            !passingMarks ||
            !examDate ||
            !examTime ||
            !status
        ) {

            alert(
                "Please fill all exam details."
            );

            return;
        }


        if (
            parseInt(passingMarks) >
            parseInt(totalMarks)
        ) {

            alert(
                "Passing marks cannot be greater than total marks."
            );

            return;
        }


        /* =================================================
           FORM DATA
           ================================================= */

        const formData =
            new URLSearchParams();


        formData.append(
            "action",
            "add"
        );


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
            examTime
        );


        formData.append(
            "status",
            status
        );


        const createButton =
            document.querySelector(
                "#createExamForm .save-edit-btn"
            );


        if (createButton) {

            createButton.disabled =
                true;

            createButton.innerHTML =
                `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Creating...
                `;
        }


        /* =================================================
           SEND CREATE REQUEST
           ================================================= */

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

            return response.text()
                .then(result => {

                    if (!response.ok) {

                        throw new Error(
                            result ||
                            "HTTP Error: "
                            + response.status
                        );
                    }

                    return result;
                });

        })

        .then(result => {

            console.log(
                "Create response:",
                result
            );


            if (
                result
                    .toLowerCase()
                    .includes("success")
            ) {

                alert(
                    "Exam created successfully!"
                );


                closeCreateExamModal();


                loadExams();

            }
            else {

                alert(
                    result ||
                    "Unable to create exam."
                );


                if (createButton) {

                    createButton.disabled =
                        false;

                    createButton.innerHTML =
                        `
                        <i class="fa-solid fa-plus"></i>
                        Create Exam
                        `;
                }

            }

        })

        .catch(error => {

            console.error(
                "Create exam error:",
                error
            );


            alert(
                error.message ||
                "Unable to connect to the server."
            );


            if (createButton) {

                createButton.disabled =
                    false;

                createButton.innerHTML =
                    `
                    <i class="fa-solid fa-plus"></i>
                    Create Exam
                    `;
            }

        });

    }


    /* =====================================================
       CLOSE CREATE MODAL
       ===================================================== */

    function closeCreateExamModal() {

        const modal =
            document.getElementById(
                "createExamModal"
            );


        if (modal) {

            modal.remove();

        }

    }


    /* =====================================================
       EXPORT EXAMS
       ===================================================== */

    if (exportExamBtn) {

        exportExamBtn.addEventListener(
            "click",
            function () {

                if (
                    !allExams ||
                    allExams.length === 0
                ) {

                    alert(
                        "No exams available to export."
                    );

                    return;
                }


                let csv =
                    "Exam ID,Exam Code,Exam Title,Subject,Duration,Total Marks,Passing Marks,Exam Date,Exam Time,Status\n";


                allExams.forEach(exam => {

                    csv +=
                        `"${exam.examId || ""}",`
                        + `"${escapeCsv(exam.examCode || "")}",`
                        + `"${escapeCsv(exam.examTitle || "")}",`
                        + `"${escapeCsv(getSubjectName(exam.subjectId))}",`
                        + `"${exam.durationMinutes || ""}",`
                        + `"${exam.totalMarks || ""}",`
                        + `"${exam.passingMarks || ""}",`
                        + `"${exam.examDate || ""}",`
                        + `"${exam.examTime || ""}",`
                        + `"${escapeCsv(exam.status || "")}"\n`;

                });


                const blob =
                    new Blob(
                        [csv],
                        {
                            type:
                                "text/csv;charset=utf-8;"
                        }
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    url;


                link.download =
                    "ExamSphere_Exams.csv";


                document.body.appendChild(
                    link
                );


                link.click();


                document.body.removeChild(
                    link
                );


                URL.revokeObjectURL(
                    url
                );

            }
        );

    }


    /* =====================================================
       HELPERS
       ===================================================== */

    function formatDateForInput(dateValue) {

        if (!dateValue) {
            return "";
        }


        const value =
            String(dateValue);


        if (
            /^\d{4}-\d{2}-\d{2}$/.test(value)
        ) {

            return value;
        }


        const date =
            new Date(value);


        if (
            isNaN(date.getTime())
        ) {

            return "";
        }


        return (
            date.getFullYear()
            + "-"
            + String(
                date.getMonth() + 1
            ).padStart(2, "0")
            + "-"
            + String(
                date.getDate()
            ).padStart(2, "0")
        );

    }


    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function escapeCsv(value) {

        return String(value)
            .replace(/"/g, '""');

    }


    /* =====================================================
       START
       ===================================================== */

    loadExams();

});