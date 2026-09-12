 /* =========================================================
   ExamSphere - Admin Subject Management
   Complete Database Connected CRUD
   Add + Edit + Delete + Search + Export
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const searchInput =
        document.getElementById("subjectSearch");

    const table =
        document.getElementById("subjectTable");

    const addButton =
        document.querySelector(".add-btn");

    const exportButton =
        document.querySelector(".toolbar button");

    let allSubjects = [];


    /* =====================================================
       LOAD SUBJECTS FROM DATABASE
    ===================================================== */

    async function loadSubjects() {

        if (!table) {
            console.error(
                "Subject table not found."
            );
            return;
        }

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#64748b;
                    ">
                    Loading subjects...
                </td>
            </tr>
        `;

        try {

            const response =
                await fetch("../subject", {
                    method: "GET",
                    credentials: "same-origin",
                    cache: "no-store"
                });


            if (!response.ok) {

                throw new Error(
                    "Unable to load subjects. HTTP " +
                    response.status
                );

            }


            const data =
                await response.json();


            console.log(
                "Subjects loaded from database:",
                data
            );


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load subjects."
                );

            }


            allSubjects =
                Array.isArray(data.subjects)
                    ? data.subjects
                    : [];


            renderSubjects(allSubjects);


        } catch (error) {

            console.error(
                "Load Subjects Error:",
                error
            );


            table.innerHTML = `
                <tr>
                    <td colspan="7"
                        style="
                            text-align:center;
                            padding:25px;
                            color:#dc2626;
                        ">
                        Unable to load subjects.
                        <br>
                        <small>
                            Check browser console and Tomcat.
                        </small>
                    </td>
                </tr>
            `;

        }

    }


    /* =====================================================
       RENDER SUBJECTS
    ===================================================== */

    function renderSubjects(subjects) {

        if (!table) {
            return;
        }


        if (
            !subjects ||
            subjects.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="7"
                        style="
                            text-align:center;
                            padding:25px;
                            color:#777;
                        ">
                        No subjects found.
                    </td>
                </tr>
            `;

            return;
        }


        table.innerHTML = "";


        subjects.forEach(subject => {

            const row =
                document.createElement("tr");


            const status =
                subject.status || "Active";


            const statusClass =
                String(status)
                    .toLowerCase()
                    .includes("inactive")
                    ? "inactive"
                    : "active";


            row.innerHTML = `

                <td>
                    ${escapeValue(
                        subject.subjectCode
                    )}
                </td>

                <td>
                    ${escapeValue(
                        subject.subjectName
                    )}
                </td>

                <td>
                    ${escapeValue(
                        subject.facultyName
                    )}
                </td>

                <td>
                    ${numberToRoman(
                        subject.semester
                    )}
                </td>

                <td>
                    ${escapeValue(
                        subject.credits
                    )}
                </td>

                <td>
                    <span class="${statusClass}">
                        ${escapeValue(status)}
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        class="edit-btn">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-btn">
                        Delete
                    </button>

                </td>

            `;


            table.appendChild(row);

        });


        attachActionButtons();

    }


    /* =====================================================
       SEARCH SUBJECTS
    ===================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "keyup",
            () => {

                const value =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                const filteredSubjects =
                    allSubjects.filter(
                        subject => {

                            const text =
                                (
                                    subject.subjectCode +
                                    " " +
                                    subject.subjectName +
                                    " " +
                                    subject.facultyName +
                                    " " +
                                    subject.semester +
                                    " " +
                                    subject.credits +
                                    " " +
                                    subject.status
                                )
                                .toLowerCase();


                            return text.includes(
                                value
                            );

                        }
                    );


                renderSubjects(
                    filteredSubjects
                );

            }
        );

    }


    /* =====================================================
       ADD SUBJECT BUTTON
    ===================================================== */

    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                showSubjectForm(null);

            }
        );

    }


    /* =====================================================
       ATTACH EDIT + DELETE BUTTONS
    ===================================================== */

    function attachActionButtons() {

        const editButtons =
            document.querySelectorAll(
                ".edit-btn"
            );


        const deleteButtons =
            document.querySelectorAll(
                ".delete-btn"
            );


        /* =================================================
           EDIT
        ================================================= */

        editButtons.forEach(
            button => {

                button.onclick = () => {

                    const row =
                        button.closest("tr");


                    if (!row) {
                        return;
                    }


                    showSubjectForm(row);

                };

            }
        );


        /* =================================================
           DELETE
        ================================================= */

        deleteButtons.forEach(
            button => {

                button.onclick =
                    async () => {

                        const row =
                            button.closest("tr");


                        if (!row) {
                            return;
                        }


                        const subjectCode =
                            row.cells[0]
                                .textContent
                                .trim();


                        const subjectName =
                            row.cells[1]
                                .textContent
                                .trim();


                        if (!subjectCode) {

                            alert(
                                "Subject code not found."
                            );

                            return;
                        }


                        const confirmed =
                            confirm(
                                "Are you sure you want to delete " +
                                subjectName +
                                "?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        try {

                            button.disabled =
                                true;

                            button.textContent =
                                "Deleting...";


                            const response =
                                await fetch(
                                    "../subject",
                                    {
                                        method: "POST",

                                        credentials:
                                            "same-origin",

                                        headers: {
                                            "Content-Type":
                                                "application/x-www-form-urlencoded;charset=UTF-8"
                                        },

                                        body:
                                            new URLSearchParams({

                                                action:
                                                    "delete",

                                                subjectCode:
                                                    subjectCode

                                            }).toString()
                                    }
                                );


                            const data =
                                await readServerResponse(
                                    response
                                );


                            if (
                                !response.ok ||
                                !data.success
                            ) {

                                throw new Error(
                                    data.message ||
                                    "Unable to delete subject."
                                );

                            }


                            alert(
                                data.message ||
                                "Subject deleted successfully."
                            );


                            /*
                             * Reload only the table
                             * from the database.
                             */

                            await loadSubjects();


                        } catch (error) {

                            console.error(
                                "Delete Subject Error:",
                                error
                            );


                            alert(
                                error.message ||
                                "Unable to delete subject."
                            );


                            button.disabled =
                                false;

                            button.textContent =
                                "Delete";

                        }

                    };

            }
        );

    }


    /* =====================================================
       SUBJECT FORM
    ===================================================== */

    function showSubjectForm(row) {

        const isEdit =
            row !== null;


        let subjectCode = "";
        let subjectName = "";
        let facultyName = "";
        let semester = "1";
        let credits = "";
        let status = "Active";


        /* =================================================
           GET EXISTING VALUES
        ================================================= */

        if (isEdit) {

            subjectCode =
                row.cells[0]
                    .textContent
                    .trim();


            subjectName =
                row.cells[1]
                    .textContent
                    .trim();


            facultyName =
                row.cells[2]
                    .textContent
                    .trim();


            semester =
                romanToNumber(
                    row.cells[3]
                        .textContent
                        .trim()
                );


            credits =
                row.cells[4]
                    .textContent
                    .trim();


            if (row.cells[5]) {

                status =
                    row.cells[5]
                        .textContent
                        .trim();

            }

        }


        /* =================================================
           REMOVE OLD FORM
        ================================================= */

        const oldForm =
            document.getElementById(
                "subjectFormOverlay"
            );


        if (oldForm) {
            oldForm.remove();
        }


        /* =================================================
           CREATE FORM
        ================================================= */

        const form =
            document.createElement("div");


        form.id =
            "subjectFormOverlay";


        form.innerHTML = `

            <div style="
                position:fixed;
                inset:0;
                background:rgba(0,0,0,.55);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:9999;
            ">

                <div style="
                    width:420px;
                    max-width:90%;
                    background:white;
                    border-radius:14px;
                    padding:25px;
                    box-shadow:0 20px 50px rgba(0,0,0,.25);
                ">

                    <h2 style="
                        margin:0 0 20px;
                        color:#172554;
                    ">

                        ${
                            isEdit
                                ? "Edit Subject"
                                : "Add Subject"
                        }

                    </h2>


                    <!-- SUBJECT CODE -->

                    <label>
                        Subject Code
                    </label>

                    <input
                        id="subjectCodeInput"
                        type="text"
                        value="${escapeValue(subjectCode)}"
                        ${isEdit ? "readonly" : ""}
                        placeholder="Example: CS304"
                        style="
                            width:100%;
                            padding:10px;
                            margin:6px 0 14px;
                            border:1px solid #cbd5e1;
                            border-radius:7px;
                            box-sizing:border-box;
                        "
                    >


                    <!-- SUBJECT NAME -->

                    <label>
                        Subject Name
                    </label>

                    <input
                        id="subjectNameInput"
                        type="text"
                        value="${escapeValue(subjectName)}"
                        placeholder="Example: Computer Networks"
                        style="
                            width:100%;
                            padding:10px;
                            margin:6px 0 14px;
                            border:1px solid #cbd5e1;
                            border-radius:7px;
                            box-sizing:border-box;
                        "
                    >


                    <!-- FACULTY -->

                    <label>
                        Faculty Name
                    </label>

                    <input
                        id="facultyNameInput"
                        type="text"
                        value="${escapeValue(facultyName)}"
                        placeholder="Example: Dr. Kumar"
                        style="
                            width:100%;
                            padding:10px;
                            margin:6px 0 14px;
                            border:1px solid #cbd5e1;
                            border-radius:7px;
                            box-sizing:border-box;
                        "
                    >


                    <!-- SEMESTER -->

                    <label>
                        Semester
                    </label>

                    <select
                        id="semesterInput"
                        style="
                            width:100%;
                            padding:10px;
                            margin:6px 0 14px;
                            border:1px solid #cbd5e1;
                            border-radius:7px;
                            box-sizing:border-box;
                        "
                    >

                        <option value="1">I</option>
                        <option value="2">II</option>
                        <option value="3">III</option>
                        <option value="4">IV</option>
                        <option value="5">V</option>
                        <option value="6">VI</option>
                        <option value="7">VII</option>
                        <option value="8">VIII</option>

                    </select>


                    <!-- CREDITS -->

                    <label>
                        Credits
                    </label>

                    <input
                        id="creditsInput"
                        type="number"
                        min="1"
                        max="10"
                        value="${escapeValue(credits)}"
                        placeholder="Example: 4"
                        style="
                            width:100%;
                            padding:10px;
                            margin:6px 0 14px;
                            border:1px solid #cbd5e1;
                            border-radius:7px;
                            box-sizing:border-box;
                        "
                    >


                    <!-- STATUS -->

                    <label>
                        Status
                    </label>

                    <select
                        id="statusInput"
                        style="
                            width:100%;
                            padding:10px;
                            margin:6px 0 20px;
                            border:1px solid #cbd5e1;
                            border-radius:7px;
                            box-sizing:border-box;
                        "
                    >

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>

                    </select>


                    <!-- BUTTONS -->

                    <div style="
                        display:flex;
                        justify-content:flex-end;
                        gap:10px;
                    ">

                        <button
                            id="cancelSubjectBtn"
                            type="button"
                            style="
                                border:0;
                                padding:10px 18px;
                                border-radius:7px;
                                cursor:pointer;
                                background:#e2e8f0;
                            "
                        >
                            Cancel
                        </button>


                        <button
                            id="saveSubjectBtn"
                            type="button"
                            style="
                                border:0;
                                padding:10px 18px;
                                border-radius:7px;
                                cursor:pointer;
                                color:white;
                                background:#2563eb;
                            "
                        >

                            ${
                                isEdit
                                    ? "Save Changes"
                                    : "Add Subject"
                            }

                        </button>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(form);


        /* =================================================
           SET SELECT VALUES
        ================================================= */

        document.getElementById(
            "semesterInput"
        ).value =
            String(
                semester || "1"
            );


        document.getElementById(
            "statusInput"
        ).value =
            String(status)
                .toLowerCase()
                .includes("inactive")
                ? "Inactive"
                : "Active";


        /* =================================================
           CANCEL
        ================================================= */

        document.getElementById(
            "cancelSubjectBtn"
        ).onclick = () => {

            form.remove();

        };


        /* =================================================
           SAVE
        ================================================= */

        document.getElementById(
            "saveSubjectBtn"
        ).onclick = async () => {

            await saveSubject(
                isEdit
            );

        };

    }


    /* =====================================================
       SAVE SUBJECT
       ADD / UPDATE
    ===================================================== */

    async function saveSubject(isEdit) {

        const subjectCodeInput =
            document.getElementById(
                "subjectCodeInput"
            );


        const subjectNameInput =
            document.getElementById(
                "subjectNameInput"
            );


        const facultyNameInput =
            document.getElementById(
                "facultyNameInput"
            );


        const semesterInput =
            document.getElementById(
                "semesterInput"
            );


        const creditsInput =
            document.getElementById(
                "creditsInput"
            );


        const statusInput =
            document.getElementById(
                "statusInput"
            );


        if (
            !subjectCodeInput ||
            !subjectNameInput ||
            !facultyNameInput ||
            !semesterInput ||
            !creditsInput ||
            !statusInput
        ) {

            alert(
                "Subject form fields are missing."
            );

            return;

        }


        const subjectCode =
            subjectCodeInput.value
                .trim();


        const subjectName =
            subjectNameInput.value
                .trim();


        const facultyName =
            facultyNameInput.value
                .trim();


        const semester =
            semesterInput.value;


        const credits =
            creditsInput.value
                .trim();


        const status =
            statusInput.value;


        /* =================================================
           VALIDATION
        ================================================= */

        if (!subjectCode) {

            alert(
                "Please enter subject code."
            );

            subjectCodeInput.focus();

            return;

        }


        if (!subjectName) {

            alert(
                "Please enter subject name."
            );

            subjectNameInput.focus();

            return;

        }


        if (!facultyName) {

            alert(
                "Please enter faculty name."
            );

            facultyNameInput.focus();

            return;

        }


        if (!semester) {

            alert(
                "Please select semester."
            );

            return;

        }


        if (!credits) {

            alert(
                "Please enter credits."
            );

            creditsInput.focus();

            return;

        }


        if (
            Number(credits) < 1 ||
            Number(credits) > 10
        ) {

            alert(
                "Credits must be between 1 and 10."
            );

            creditsInput.focus();

            return;

        }


        /* =================================================
           DETERMINE ACTION
        ================================================= */

        const action =
            isEdit
                ? "update"
                : "add";


        /* =================================================
           SAVE BUTTON
        ================================================= */

        const saveButton =
            document.getElementById(
                "saveSubjectBtn"
            );


        if (saveButton) {

            saveButton.disabled =
                true;


            saveButton.textContent =
                isEdit
                    ? "Saving..."
                    : "Adding...";

        }


        try {

            /* =============================================
               SEND REQUEST
            ============================================= */

            const response =
                await fetch(
                    "../subject",
                    {
                        method: "POST",

                        credentials:
                            "same-origin",

                        headers: {
                            "Content-Type":
                                "application/x-www-form-urlencoded;charset=UTF-8"
                        },

                        body:
                            new URLSearchParams({

                                action:
                                    action,

                                subjectCode:
                                    subjectCode,

                                subjectName:
                                    subjectName,

                                facultyName:
                                    facultyName,

                                semester:
                                    semester,

                                credits:
                                    credits,

                                status:
                                    status

                            }).toString()
                    }
                );


            /* =============================================
               READ RESPONSE
            ============================================= */

            const data =
                await readServerResponse(
                    response
                );


            /* =============================================
               CHECK RESPONSE
            ============================================= */

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to save subject."
                );

            }


            /* =============================================
               SUCCESS
            ============================================= */

            alert(
                data.message ||
                (
                    isEdit
                        ? "Subject updated successfully."
                        : "Subject added successfully."
                )
            );


            /* =============================================
               CLOSE FORM
            ============================================= */

            const form =
                document.getElementById(
                    "subjectFormOverlay"
                );


            if (form) {
                form.remove();
            }


            /* =============================================
               IMPORTANT:
               LOAD FRESH DATA FROM DATABASE
            ============================================= */

            await loadSubjects();


        } catch (error) {

            console.error(
                "Subject Save Error:",
                error
            );


            alert(
                error.message ||
                "Unable to save subject."
            );


            if (saveButton) {

                saveButton.disabled =
                    false;


                saveButton.textContent =
                    isEdit
                        ? "Save Changes"
                        : "Add Subject";

            }

        }

    }


    /* =====================================================
       SAFE SERVER RESPONSE
    ===================================================== */

    async function readServerResponse(
        response
    ) {

        const text =
            await response.text();


        if (
            !text ||
            !text.trim()
        ) {

            return {
                success: false,
                message:
                    "Server returned an empty response."
            };

        }


        try {

            return JSON.parse(
                text
            );

        } catch (error) {

            console.error(
                "Invalid JSON from server:",
                text
            );


            return {
                success: false,
                message: text
            };

        }

    }


    /* =====================================================
       EXPORT SUBJECTS
    ===================================================== */

    function exportSubjects() {

        if (!table) {

            alert(
                "Subject table not found."
            );

            return;

        }


        const rows =
            table.querySelectorAll("tr");


        let csv =
            "Subject Code,Subject Name,Faculty,Semester,Credits,Status\n";


        rows.forEach(row => {

            if (
                row.style.display === "none"
            ) {
                return;
            }


            const cells =
                row.querySelectorAll("td");


            if (cells.length < 6) {
                return;
            }


            const values = [

                cells[0]
                    .innerText
                    .trim(),

                cells[1]
                    .innerText
                    .trim(),

                cells[2]
                    .innerText
                    .trim(),

                cells[3]
                    .innerText
                    .trim(),

                cells[4]
                    .innerText
                    .trim(),

                cells[5]
                    .innerText
                    .trim()

            ];


            csv +=
                values
                    .map(
                        value =>
                            csvEscape(value)
                    )
                    .join(",") +
                "\n";

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
            "ExamSphere_Subjects.csv";


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


    /* =====================================================
       CSV ESCAPE
    ===================================================== */

    function csvEscape(value) {

        const text =
            String(
                value || ""
            );


        if (
            text.includes(",") ||
            text.includes('"') ||
            text.includes("\n")
        ) {

            return '"' +
                text.replace(
                    /"/g,
                    '""'
                ) +
                '"';

        }


        return text;

    }


    /* =====================================================
       NUMBER TO ROMAN
    ===================================================== */

    function numberToRoman(value) {

        const map = {

            1: "I",
            2: "II",
            3: "III",
            4: "IV",
            5: "V",
            6: "VI",
            7: "VII",
            8: "VIII"

        };


        return (
            map[Number(value)] ||
            value
        );

    }


    /* =====================================================
       ROMAN TO NUMBER
    ===================================================== */

    function romanToNumber(value) {

        const map = {

            "I": 1,
            "II": 2,
            "III": 3,
            "IV": 4,
            "V": 5,
            "VI": 6,
            "VII": 7,
            "VIII": 8

        };


        const cleaned =
            String(
                value || ""
            )
                .trim()
                .toUpperCase();


        return (
            map[cleaned] ||
            cleaned
        );

    }


    /* =====================================================
       HTML / ATTRIBUTE ESCAPE
    ===================================================== */

    function escapeValue(value) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            );

    }


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    loadSubjects();

});