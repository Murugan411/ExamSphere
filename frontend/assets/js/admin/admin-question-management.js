 /* ==========================================
   ExamSphere - Question Management
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("questionSearch");

    const questionTable =
        document.getElementById("questionTable");

    const addButton =
        document.querySelector(".add-btn");

    const toolbarButtons =
        document.querySelectorAll(".toolbar button");

    let questions = [];


    /* ==========================================
       SUBJECT NAMES
    ========================================== */

    const subjectNames = {

        1: "Java Programming",
        2: "Python Programming",
        3: "Database Management System",
        4: "Computer Networks",
        5: "Operating Systems"

    };


    /* ==========================================
       CATEGORY NAMES
    ========================================== */

    const categoryNames = {

        1: "Programming",
        2: "Database",
        3: "Networking",
        4: "General"

    };


    /* ==========================================
       LOAD QUESTIONS
    ========================================== */

    function loadQuestions() {

        questionTable.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:25px;">
                    Loading questions...
                </td>
            </tr>
        `;


        fetch("../question")

            .then(response => {

                if (!response.ok) {

                    throw new Error(
                        "Failed to load questions"
                    );

                }

                return response.json();

            })

            .then(data => {

                questions = data || [];

                renderQuestions(questions);

            })

            .catch(error => {

                console.error(
                    "Question loading error:",
                    error
                );


                questionTable.innerHTML = `
                    <tr>
                        <td colspan="8"
                            style="
                                text-align:center;
                                padding:25px;
                                color:#dc2626;
                            ">
                            Unable to load questions.
                        </td>
                    </tr>
                `;

            });

    }


    /* ==========================================
       RENDER QUESTIONS
    ========================================== */

    function renderQuestions(data) {

        questionTable.innerHTML = "";


        if (!data || data.length === 0) {

            questionTable.innerHTML = `
                <tr>
                    <td colspan="8"
                        style="
                            text-align:center;
                            padding:25px;
                        ">
                        No questions found.
                    </td>
                </tr>
            `;

            return;
        }


        data.forEach(question => {

            const row =
                document.createElement("tr");


            const subject =
                subjectNames[
                    question.subjectId
                ] ||
                "Subject " +
                question.subjectId;


            const category =
                categoryNames[
                    question.categoryId
                ] ||
                "Category " +
                question.categoryId;


            const difficulty =
                question.difficulty ||
                "Easy";


            const status =
                question.status ||
                "Active";


            row.dataset.questionId =
                question.questionId;


            row.dataset.subjectId =
                question.subjectId;


            row.dataset.categoryId =
                question.categoryId;


            row.dataset.questionText =
                question.questionText || "";


            row.dataset.optionA =
                question.optionA || "";


            row.dataset.optionB =
                question.optionB || "";


            row.dataset.optionC =
                question.optionC || "";


            row.dataset.optionD =
                question.optionD || "";


            row.dataset.correctAnswer =
                question.correctAnswer || "";


            row.dataset.difficulty =
                difficulty;


            row.dataset.marks =
                question.marks;


            row.dataset.status =
                status;


            row.innerHTML = `

                <td>
                    ${question.questionId}
                </td>

                <td>
                    ${escapeHtml(subject)}
                </td>

                <td>
                    ${escapeHtml(category)}
                </td>

                <td class="question-text-cell">
                    ${escapeHtml(
                        question.questionText
                    )}
                </td>

                <td>

                    <span class="
                        difficulty-badge
                        ${String(
                            difficulty
                        ).toLowerCase()}
                    ">

                        ${escapeHtml(
                            difficulty
                        )}

                    </span>

                </td>

                <td>
                    ${question.marks}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            question.correctAnswer
                        )}
                    </strong>
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


            questionTable.appendChild(row);

        });


        attachRowEvents();

    }


    /* ==========================================
       SEARCH
    ========================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "keyup",
            () => {

                const value =
                    searchInput.value
                        .toLowerCase()
                        .trim();


                const filtered =
                    questions.filter(question => {

                        const subject =
                            (
                                subjectNames[
                                    question.subjectId
                                ] || ""
                            ).toLowerCase();


                        const category =
                            (
                                categoryNames[
                                    question.categoryId
                                ] || ""
                            ).toLowerCase();


                        const questionText =
                            (
                                question.questionText || ""
                            ).toLowerCase();


                        const difficulty =
                            (
                                question.difficulty || ""
                            ).toLowerCase();


                        const correctAnswer =
                            (
                                question.correctAnswer || ""
                            ).toLowerCase();


                        return (

                            String(
                                question.questionId
                            ).includes(value)

                            ||

                            subject.includes(value)

                            ||

                            category.includes(value)

                            ||

                            questionText.includes(value)

                            ||

                            difficulty.includes(value)

                            ||

                            correctAnswer.includes(value)

                        );

                    });


                renderQuestions(filtered);

            }
        );

    }


    /* ==========================================
       ADD QUESTION
    ========================================== */

    if (addButton) {

        addButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "add-question.html";

            }
        );

    }


    /* ==========================================
       EDIT + DELETE EVENTS
    ========================================== */

    function attachRowEvents() {


        /* ======================================
           EDIT QUESTION
        ====================================== */

        questionTable
            .querySelectorAll(".edit-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const row =
                            button.closest("tr");


                        openEditQuestionModal(
                            row
                        );

                    }
                );

            });


        /* ======================================
           DELETE QUESTION
        ====================================== */

        questionTable
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const row =
                            button.closest("tr");


                        const questionId =
                            row.dataset.questionId;


                        const questionText =
                            row.dataset.questionText;


                        const confirmDelete =
                            confirm(

                                "Are you sure you want to delete this question?\n\n"
                                +
                                questionText

                            );


                        if (!confirmDelete) {

                            return;

                        }


                        button.disabled = true;

                        button.textContent =
                            "Deleting...";


                        const formData =
                            new URLSearchParams();


                        formData.append(
                            "action",
                            "delete"
                        );


                        formData.append(
                            "questionId",
                            questionId
                        );


                        fetch("../question", {

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
                                .then(text => ({

                                    ok: response.ok,

                                    text: text

                                }));

                        })

                        .then(result => {

                            console.log(
                                "Delete response:",
                                result.text
                            );


                            if (
                                result.ok &&
                                result.text.includes(
                                    "Question deleted successfully!"
                                )
                            ) {

                                alert(
                                    "Question deleted successfully!"
                                );


                                loadQuestions();

                            }

                            else {

                                alert(
                                    result.text ||
                                    "Failed to delete question."
                                );


                                button.disabled =
                                    false;


                                button.textContent =
                                    "Delete";

                            }

                        })

                        .catch(error => {

                            console.error(
                                "Delete question error:",
                                error
                            );


                            alert(
                                "Unable to connect to the server."
                            );


                            button.disabled =
                                false;


                            button.textContent =
                                "Delete";

                        });

                    }
                );

            });

    }


    /* ==========================================
       OPEN EDIT MODAL
    ========================================== */

    function openEditQuestionModal(row) {

        removeExistingEditModal();


        const modalOverlay =
            document.createElement("div");


        modalOverlay.id =
            "editQuestionOverlay";


        modalOverlay.className =
            "edit-question-overlay";


        modalOverlay.innerHTML = `

            <div class="edit-question-modal">


                <div class="edit-question-header">

                    <div>

                        <h2>
                            <i class="fa-solid fa-pen-to-square"></i>
                            Edit Question
                        </h2>

                        <p>
                            Update question details
                        </p>

                    </div>


                    <button
                        type="button"
                        class="close-edit-btn"
                        id="closeEditQuestion">

                        <i class="fa-solid fa-xmark"></i>

                    </button>

                </div>



                <form id="editQuestionForm">


                    <input
                        type="hidden"
                        id="editQuestionId"
                        name="questionId"
                        value="${escapeAttribute(
                            row.dataset.questionId
                        )}">


                    <div class="edit-form-grid">


                        <div class="edit-form-group">

                            <label for="editSubjectId">
                                Subject
                            </label>

                            <select
                                id="editSubjectId"
                                name="subjectId"
                                required>

                                <option value="1">
                                    Java Programming
                                </option>

                                <option value="2">
                                    Python Programming
                                </option>

                                <option value="3">
                                    Database Management System
                                </option>

                                <option value="4">
                                    Computer Networks
                                </option>

                                <option value="5">
                                    Operating Systems
                                </option>

                            </select>

                        </div>



                        <div class="edit-form-group">

                            <label for="editCategoryId">
                                Category
                            </label>

                            <select
                                id="editCategoryId"
                                name="categoryId"
                                required>

                                <option value="1">
                                    Programming
                                </option>

                                <option value="2">
                                    Database
                                </option>

                                <option value="3">
                                    Networking
                                </option>

                                <option value="4">
                                    General
                                </option>

                            </select>

                        </div>


                    </div>



                    <div class="edit-form-group">

                        <label for="editQuestionText">
                            Question
                        </label>

                        <textarea
                            id="editQuestionText"
                            name="questionText"
                            rows="4"
                            required></textarea>

                    </div>



                    <div class="edit-form-grid">


                        <div class="edit-form-group">

                            <label for="editOptionA">
                                Option A
                            </label>

                            <input
                                type="text"
                                id="editOptionA"
                                name="optionA"
                                required>

                        </div>


                        <div class="edit-form-group">

                            <label for="editOptionB">
                                Option B
                            </label>

                            <input
                                type="text"
                                id="editOptionB"
                                name="optionB"
                                required>

                        </div>


                        <div class="edit-form-group">

                            <label for="editOptionC">
                                Option C
                            </label>

                            <input
                                type="text"
                                id="editOptionC"
                                name="optionC"
                                required>

                        </div>


                        <div class="edit-form-group">

                            <label for="editOptionD">
                                Option D
                            </label>

                            <input
                                type="text"
                                id="editOptionD"
                                name="optionD"
                                required>

                        </div>


                    </div>



                    <div class="edit-form-grid three-columns">


                        <div class="edit-form-group">

                            <label for="editCorrectAnswer">
                                Correct Answer
                            </label>

                            <select
                                id="editCorrectAnswer"
                                name="correctAnswer"
                                required>

                                <option value="A">
                                    Option A
                                </option>

                                <option value="B">
                                    Option B
                                </option>

                                <option value="C">
                                    Option C
                                </option>

                                <option value="D">
                                    Option D
                                </option>

                            </select>

                        </div>


                        <div class="edit-form-group">

                            <label for="editDifficulty">
                                Difficulty
                            </label>

                            <select
                                id="editDifficulty"
                                name="difficulty"
                                required>

                                <option value="Easy">
                                    Easy
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="Hard">
                                    Hard
                                </option>

                            </select>

                        </div>


                        <div class="edit-form-group">

                            <label for="editMarks">
                                Marks
                            </label>

                            <input
                                type="number"
                                id="editMarks"
                                name="marks"
                                min="1"
                                required>

                        </div>


                    </div>



                    <div class="edit-form-group">

                        <label for="editStatus">
                            Status
                        </label>

                        <select
                            id="editStatus"
                            name="status"
                            required>

                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>

                        </select>

                    </div>



                    <div class="edit-question-actions">


                        <button
                            type="button"
                            class="cancel-edit-btn"
                            id="cancelEditQuestion">

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

        `;


        document.body.appendChild(
            modalOverlay
        );


        /* ======================================
           FILL EXISTING VALUES
        ====================================== */

        document.getElementById(
            "editSubjectId"
        ).value =
            row.dataset.subjectId;


        document.getElementById(
            "editCategoryId"
        ).value =
            row.dataset.categoryId;


        document.getElementById(
            "editQuestionText"
        ).value =
            row.dataset.questionText;


        document.getElementById(
            "editOptionA"
        ).value =
            row.dataset.optionA;


        document.getElementById(
            "editOptionB"
        ).value =
            row.dataset.optionB;


        document.getElementById(
            "editOptionC"
        ).value =
            row.dataset.optionC;


        document.getElementById(
            "editOptionD"
        ).value =
            row.dataset.optionD;


        document.getElementById(
            "editCorrectAnswer"
        ).value =
            row.dataset.correctAnswer;


        document.getElementById(
            "editDifficulty"
        ).value =
            row.dataset.difficulty;


        document.getElementById(
            "editMarks"
        ).value =
            row.dataset.marks;


        document.getElementById(
            "editStatus"
        ).value =
            row.dataset.status;


        /* ======================================
           CLOSE EVENTS
        ====================================== */

        document.getElementById(
            "closeEditQuestion"
        ).addEventListener(
            "click",
            removeExistingEditModal
        );


        document.getElementById(
            "cancelEditQuestion"
        ).addEventListener(
            "click",
            removeExistingEditModal
        );


        /* ======================================
           SUBMIT UPDATE
        ====================================== */

        document.getElementById(
            "editQuestionForm"
        ).addEventListener(
            "submit",
            event => {

                event.preventDefault();


                updateQuestion(
                    row.dataset.questionId
                );

            }
        );


        /* ======================================
           CLICK OUTSIDE MODAL
        ====================================== */

        modalOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modalOverlay
                ) {

                    removeExistingEditModal();

                }

            }
        );

    }


    /* ==========================================
       UPDATE QUESTION
    ========================================== */

    function updateQuestion(questionId) {

        const form =
            document.getElementById(
                "editQuestionForm"
            );


        const formData =
            new URLSearchParams();


        formData.append(
            "action",
            "update"
        );


        formData.append(
            "questionId",
            questionId
        );


        formData.append(
            "subjectId",
            document.getElementById(
                "editSubjectId"
            ).value
        );


        formData.append(
            "categoryId",
            document.getElementById(
                "editCategoryId"
            ).value
        );


        formData.append(
            "questionText",
            document.getElementById(
                "editQuestionText"
            ).value.trim()
        );


        formData.append(
            "optionA",
            document.getElementById(
                "editOptionA"
            ).value.trim()
        );


        formData.append(
            "optionB",
            document.getElementById(
                "editOptionB"
            ).value.trim()
        );


        formData.append(
            "optionC",
            document.getElementById(
                "editOptionC"
            ).value.trim()
        );


        formData.append(
            "optionD",
            document.getElementById(
                "editOptionD"
            ).value.trim()
        );


        formData.append(
            "correctAnswer",
            document.getElementById(
                "editCorrectAnswer"
            ).value
        );


        formData.append(
            "difficulty",
            document.getElementById(
                "editDifficulty"
            ).value
        );


        formData.append(
            "marks",
            document.getElementById(
                "editMarks"
            ).value
        );


        formData.append(
            "status",
            document.getElementById(
                "editStatus"
            ).value
        );


        const saveButton =
            form.querySelector(
                ".save-edit-btn"
            );


        saveButton.disabled =
            true;


        saveButton.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Saving...
        `;


        fetch("../question", {

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
                .then(text => ({

                    ok: response.ok,

                    text: text

                }));

        })

        .then(result => {

            console.log(
                "Update response:",
                result.text
            );


            if (
                result.ok &&
                result.text.includes(
                    "Question updated successfully!"
                )
            ) {

                alert(
                    "Question updated successfully!"
                );


                removeExistingEditModal();


                loadQuestions();

            }

            else {

                alert(
                    result.text ||
                    "Failed to update question."
                );


                saveButton.disabled =
                    false;


                saveButton.innerHTML = `
                    <i class="fa-solid fa-save"></i>
                    Save Changes
                `;

            }

        })

        .catch(error => {

            console.error(
                "Update question error:",
                error
            );


            alert(
                "Unable to connect to the server."
            );


            saveButton.disabled =
                false;


            saveButton.innerHTML = `
                <i class="fa-solid fa-save"></i>
                Save Changes
            `;

        });

    }


    /* ==========================================
       REMOVE EDIT MODAL
    ========================================== */

    function removeExistingEditModal() {

        const existing =
            document.getElementById(
                "editQuestionOverlay"
            );


        if (existing) {

            existing.remove();

        }

    }


    /* ==========================================
       IMPORT QUESTIONS
    ========================================== */

    if (toolbarButtons[0]) {

        toolbarButtons[0].addEventListener(
            "click",
            () => {

                alert(
                    "Import Questions feature will be added later."
                );

            }
        );

    }


    /* ==========================================
       EXPORT QUESTIONS
    ========================================== */

    if (toolbarButtons[1]) {

        toolbarButtons[1].addEventListener(
            "click",
            () => {

                exportQuestions();

            }
        );

    }


    /* ==========================================
       EXPORT QUESTIONS
    ========================================== */

    function exportQuestions() {

        if (!questions.length) {

            alert(
                "No questions available to export."
            );

            return;

        }


        let csv =
            "ID,Subject,Category,Question,Difficulty,Marks,Correct Answer\n";


        questions.forEach(question => {

            const subject =
                subjectNames[
                    question.subjectId
                ] ||
                "Subject " +
                question.subjectId;


            const category =
                categoryNames[
                    question.categoryId
                ] ||
                "Category " +
                question.categoryId;


            csv += [

                question.questionId,

                csvEscape(subject),

                csvEscape(category),

                csvEscape(
                    question.questionText
                ),

                csvEscape(
                    question.difficulty
                ),

                question.marks,

                csvEscape(
                    question.correctAnswer
                )

            ].join(",") + "\n";

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
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "examsphere-questions.csv";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }


    /* ==========================================
       CSV ESCAPE
    ========================================== */

    function csvEscape(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        const text =
            String(value);


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
       ATTRIBUTE ESCAPE
    ========================================== */

    function escapeAttribute(value) {

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
                /"/g,
                "&quot;"
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


    /* ==========================================
       START
    ========================================== */

    loadQuestions();

});