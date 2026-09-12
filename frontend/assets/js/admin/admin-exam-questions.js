document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // GET VALUES FROM URL
    // =====================================================

    const params = new URLSearchParams(window.location.search);

    const examId = params.get("examId");
    const examCode = params.get("examCode");


    // =====================================================
    // HTML ELEMENTS
    // =====================================================

    const examIdElement =
        document.getElementById("examId");

    const examCodeElement =
        document.getElementById("examCode");

    const examTitleElement =
        document.getElementById("examTitle");

    const questionCountElement =
        document.getElementById("questionCount");

    const questionTableBody =
        document.getElementById("questionTableBody");

    const backBtn =
        document.getElementById("backBtn");

    const addQuestionBtn =
        document.getElementById("addQuestionBtn");


    // =====================================================
    // DISPLAY EXAM ID / CODE
    // =====================================================

    if (examIdElement) {
        examIdElement.textContent = examId || "-";
    }

    if (examCodeElement) {
        examCodeElement.textContent = examCode || "-";
    }


    // =====================================================
    // VALIDATE EXAM ID
    // =====================================================

    if (!examId) {

        if (questionTableBody) {

            questionTableBody.innerHTML = `
                <tr>
                    <td colspan="4"
                        class="empty-message">
                        No exam ID was provided.
                    </td>
                </tr>
            `;

        }

        return;
    }


    // =====================================================
    // BACK BUTTON
    // =====================================================

    if (backBtn) {

        backBtn.addEventListener("click", function () {

            window.location.href =
                "admin-exam-management.html";

        });

    }


    // =====================================================
    // LOAD EXAM DETAILS
    // =====================================================

    function loadExamDetails() {

        fetch("../exam", {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store"
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load exam details. HTTP " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            console.log(
                "Exam API response:",
                data
            );


            // =================================================
            // SUPPORT DIFFERENT API RESPONSE FORMATS
            // =================================================

            let exams = [];


            if (Array.isArray(data)) {

                exams = data;

            } else if (
                data &&
                Array.isArray(data.exams)
            ) {

                exams = data.exams;

            } else if (
                data &&
                data.success &&
                Array.isArray(data.data)
            ) {

                exams = data.data;

            }


            // =================================================
            // FIND CURRENT EXAM
            // =================================================

            const exam =
                exams.find(function (item) {

                    return Number(item.examId) ===
                        Number(examId);

                });


            // =================================================
            // DISPLAY TITLE
            // =================================================

            if (examTitleElement) {

                if (exam) {

                    examTitleElement.textContent =
                        exam.examTitle ||
                        exam.title ||
                        "-";

                } else {

                    // Try matching by exam code

                    const examByCode =
                        exams.find(function (item) {

                            return String(
                                item.examCode || ""
                            ).trim().toLowerCase() ===
                            String(
                                examCode || ""
                            ).trim().toLowerCase();

                        });


                    if (examByCode) {

                        examTitleElement.textContent =
                            examByCode.examTitle ||
                            examByCode.title ||
                            "-";

                    } else {

                        examTitleElement.textContent =
                            "Exam not found";

                    }

                }

            }

        })

        .catch(function (error) {

            console.error(
                "Exam details error:",
                error
            );


            if (examTitleElement) {

                examTitleElement.textContent =
                    "Unable to load";

            }

        });

    }


    // =====================================================
    // LOAD ASSIGNED QUESTIONS
    // =====================================================

    function loadAssignedQuestions() {

        questionTableBody.innerHTML = `
            <tr>
                <td colspan="4"
                    class="empty-message">
                    Loading questions...
                </td>
            </tr>
        `;


        fetch(
            "../exam-question?examId=" +
            encodeURIComponent(examId),
            {
                method: "GET",
                credentials: "same-origin",
                cache: "no-store"
            }
        )

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (questions) {

            console.log(
                "Assigned questions:",
                questions
            );


            if (
                !Array.isArray(questions) ||
                questions.length === 0
            ) {

                questionTableBody.innerHTML = `
                    <tr>
                        <td colspan="4"
                            class="empty-message">
                            No questions assigned to this exam yet.
                        </td>
                    </tr>
                `;

                questionCountElement.textContent = "0";

                return;

            }


            // Sort by question order

            questions.sort(function (a, b) {

                return Number(a.questionOrder) -
                    Number(b.questionOrder);

            });


            questionCountElement.textContent =
                questions.length;


            questionTableBody.innerHTML = "";


            questions.forEach(function (question) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${question.questionOrder}
                    </td>

                    <td>
                        Q${question.questionId}
                    </td>

                    <td>
                        ${question.marks}
                    </td>

                    <td>

                        <button
                            type="button"
                            class="remove-btn"
                            data-id="${question.examQuestionId}">

                            <i class="fa-solid fa-trash"></i>
                            Remove

                        </button>

                    </td>

                `;


                questionTableBody.appendChild(row);

            });


            // Remove button events

            const removeButtons =
                document.querySelectorAll(
                    ".remove-btn"
                );


            removeButtons.forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const id =
                            this.getAttribute(
                                "data-id"
                            );


                        removeQuestion(id);

                    }
                );

            });

        })

        .catch(function (error) {

            console.error(
                "Error loading exam questions:",
                error
            );


            questionTableBody.innerHTML = `
                <tr>
                    <td colspan="4"
                        class="empty-message">

                        Failed to load questions.

                        <br><br>

                        <small>
                            ${escapeHtml(error.message)}
                        </small>

                    </td>
                </tr>
            `;

        });

    }


    // =====================================================
    // REMOVE QUESTION
    // =====================================================

    function removeQuestion(examQuestionId) {

        if (!examQuestionId) {

            alert(
                "Invalid exam question ID."
            );

            return;
        }


        const confirmed =
            confirm(
                "Are you sure you want to remove this question from the exam?"
            );


        if (!confirmed) {
            return;
        }


        fetch(
            "../exam-question?examQuestionId=" +
            encodeURIComponent(examQuestionId),
            {
                method: "DELETE",
                credentials: "same-origin"
            }
        )

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "HTTP " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (result) {

            console.log(
                "Remove response:",
                result
            );


            if (result.success) {

                alert(
                    "Question removed successfully."
                );


                loadAssignedQuestions();

            } else {

                alert(
                    result.message ||
                    "Unable to remove question."
                );

            }

        })

        .catch(function (error) {

            console.error(
                "Remove question error:",
                error
            );


            alert(
                "Failed to remove question.\n\n" +
                error.message
            );

        });

    }


    // =====================================================
    // ADD QUESTION BUTTON
    // =====================================================

    if (addQuestionBtn) {

        addQuestionBtn.addEventListener(
            "click",
            function () {

                openAddQuestionModal();

            }
        );

    }


    // =====================================================
    // CREATE ADD QUESTION MODAL
    // =====================================================

    function openAddQuestionModal() {

        const existing =
            document.getElementById(
                "addQuestionModal"
            );


        if (existing) {

            existing.style.display = "flex";

            loadAvailableQuestions();

            return;

        }


        const modal =
            document.createElement("div");


        modal.id =
            "addQuestionModal";


        modal.innerHTML = `

            <div style="
                position:fixed;
                inset:0;
                background:rgba(15,23,42,.65);
                display:flex;
                align-items:center;
                justify-content:center;
                z-index:9999;
                padding:20px;
            ">

                <div style="
                    width:550px;
                    max-width:100%;
                    background:white;
                    border-radius:14px;
                    overflow:hidden;
                    box-shadow:0 25px 60px rgba(0,0,0,.25);
                ">

                    <div style="
                        background:#172554;
                        color:white;
                        padding:18px 22px;
                        display:flex;
                        justify-content:space-between;
                        align-items:center;
                    ">

                        <div>
                            <h2 style="
                                margin:0;
                                font-size:20px;
                            ">
                                Add Question
                            </h2>

                            <p style="
                                margin:5px 0 0;
                                font-size:13px;
                                opacity:.8;
                            ">
                                Assign a question to this exam
                            </p>
                        </div>

                        <button
                            type="button"
                            id="closeQuestionModal"
                            style="
                                border:none;
                                background:#334155;
                                color:white;
                                width:32px;
                                height:32px;
                                border-radius:6px;
                                cursor:pointer;
                                font-size:20px;
                            ">
                            ×
                        </button>

                    </div>


                    <div style="
                        padding:22px;
                    ">

                        <label>
                            Select Question
                        </label>

                        <select
                            id="availableQuestionSelect"
                            style="
                                width:100%;
                                padding:11px;
                                margin:7px 0 18px;
                                border:1px solid #cbd5e1;
                                border-radius:7px;
                                box-sizing:border-box;
                            ">

                            <option value="">
                                Loading questions...
                            </option>

                        </select>


                        <div
                            id="selectedQuestionPreview"
                            style="
                                background:#f8fafc;
                                border:1px solid #e2e8f0;
                                border-radius:8px;
                                padding:15px;
                                margin-bottom:18px;
                                min-height:60px;
                                color:#475569;
                            ">

                            Select a question to preview it.

                        </div>


                        <div style="
                            display:grid;
                            grid-template-columns:1fr 1fr;
                            gap:15px;
                        ">

                            <div>

                                <label>
                                    Question Order
                                </label>

                                <input
                                    type="number"
                                    id="questionOrderInput"
                                    min="1"
                                    value="1"
                                    style="
                                        width:100%;
                                        padding:10px;
                                        margin-top:7px;
                                        border:1px solid #cbd5e1;
                                        border-radius:7px;
                                        box-sizing:border-box;
                                    ">

                            </div>


                            <div>

                                <label>
                                    Marks
                                </label>

                                <input
                                    type="number"
                                    id="questionMarksInput"
                                    min="1"
                                    value="2"
                                    style="
                                        width:100%;
                                        padding:10px;
                                        margin-top:7px;
                                        border:1px solid #cbd5e1;
                                        border-radius:7px;
                                        box-sizing:border-box;
                                    ">

                            </div>

                        </div>


                        <div
                            id="addQuestionMessage"
                            style="
                                margin-top:12px;
                                color:#dc2626;
                            ">
                        </div>

                    </div>


                    <div style="
                        padding:15px 22px;
                        border-top:1px solid #e2e8f0;
                        display:flex;
                        justify-content:flex-end;
                        gap:10px;
                    ">

                        <button
                            type="button"
                            id="cancelQuestionBtn"
                            style="
                                border:none;
                                background:#e2e8f0;
                                padding:10px 17px;
                                border-radius:7px;
                                cursor:pointer;
                            ">
                            Cancel
                        </button>


                        <button
                            type="button"
                            id="assignQuestionBtn"
                            style="
                                border:none;
                                background:#2563eb;
                                color:white;
                                padding:10px 17px;
                                border-radius:7px;
                                cursor:pointer;
                            ">
                            <i class="fa-solid fa-plus"></i>
                            Assign Question
                        </button>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        document
            .getElementById("closeQuestionModal")
            .onclick =
            closeAddQuestionModal;


        document
            .getElementById("cancelQuestionBtn")
            .onclick =
            closeAddQuestionModal;


        document
            .getElementById("assignQuestionBtn")
            .onclick =
            assignQuestion;


        document
            .getElementById("availableQuestionSelect")
            .onchange =
            showSelectedQuestion;


        loadAvailableQuestions();

    }


    // =====================================================
    // CLOSE MODAL
    // =====================================================

    function closeAddQuestionModal() {

        const modal =
            document.getElementById(
                "addQuestionModal"
            );


        if (modal) {

            modal.style.display = "none";

        }

    }


    // =====================================================
    // LOAD AVAILABLE QUESTIONS
    // =====================================================

    function loadAvailableQuestions() {

        const select =
            document.getElementById(
                "availableQuestionSelect"
            );


        if (!select) {
            return;
        }


        select.innerHTML = `
            <option value="">
                Loading questions...
            </option>
        `;


        fetch("../question", {
            method: "GET",
            credentials: "same-origin"
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to load questions."
                );

            }

            return response.json();

        })

        .then(function (data) {

            let allQuestions = [];


            if (Array.isArray(data)) {

                allQuestions = data;

            } else if (
                data &&
                Array.isArray(data.questions)
            ) {

                allQuestions = data.questions;

            }


            return fetch(
                "../exam-question?examId=" +
                encodeURIComponent(examId),
                {
                    credentials: "same-origin"
                }
            )

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Unable to load assigned questions."
                    );

                }

                return response.json();

            })

            .then(function (assignedQuestions) {

                populateQuestionSelect(
                    allQuestions,
                    Array.isArray(assignedQuestions)
                        ? assignedQuestions
                        : []
                );

            });

        })

        .catch(function (error) {

            console.error(
                "Available questions error:",
                error
            );


            select.innerHTML = `
                <option value="">
                    Unable to load questions
                </option>
            `;

        });

    }


    // =====================================================
    // POPULATE QUESTION SELECT
    // =====================================================

    function populateQuestionSelect(
        allQuestions,
        assignedQuestions
    ) {

        const select =
            document.getElementById(
                "availableQuestionSelect"
            );


        if (!select) {
            return;
        }


        const assignedIds =
            new Set(
                assignedQuestions.map(
                    function (item) {

                        return Number(
                            item.questionId
                        );

                    }
                )
            );


        select.innerHTML = `
            <option value="">
                -- Select a Question --
            </option>
        `;


        let count = 0;


        allQuestions.forEach(
            function (question) {

                const questionId =
                    Number(
                        question.questionId
                    );


                if (
                    assignedIds.has(questionId)
                ) {

                    return;

                }


                count++;


                const option =
                    document.createElement("option");


                option.value =
                    questionId;


                option.textContent =
                    "Q" +
                    questionId +
                    " - " +
                    (
                        question.questionText ||
                        "Question"
                    );


                option.dataset.question =
                    JSON.stringify(question);


                select.appendChild(option);

            }
        );


        if (count === 0) {

            select.innerHTML = `
                <option value="">
                    All questions are already assigned
                </option>
            `;

        }

    }


    // =====================================================
    // SHOW QUESTION PREVIEW
    // =====================================================

    function showSelectedQuestion() {

        const select =
            document.getElementById(
                "availableQuestionSelect"
            );


        const preview =
            document.getElementById(
                "selectedQuestionPreview"
            );


        const option =
            select.options[
                select.selectedIndex
            ];


        if (
            !option ||
            !option.dataset.question
        ) {

            preview.textContent =
                "Select a question to preview it.";

            return;

        }


        const question =
            JSON.parse(
                option.dataset.question
            );


        preview.innerHTML = `

            <strong>
                Question ${question.questionId}
            </strong>

            <p>
                ${escapeHtml(
                    question.questionText || ""
                )}
            </p>

            <div>
                <b>A:</b>
                ${escapeHtml(
                    question.optionA || ""
                )}
            </div>

            <div>
                <b>B:</b>
                ${escapeHtml(
                    question.optionB || ""
                )}
            </div>

            <div>
                <b>C:</b>
                ${escapeHtml(
                    question.optionC || ""
                )}
            </div>

            <div>
                <b>D:</b>
                ${escapeHtml(
                    question.optionD || ""
                )}
            </div>

        `;

    }


    // =====================================================
    // ASSIGN QUESTION
    // =====================================================

    function assignQuestion() {

        const select =
            document.getElementById(
                "availableQuestionSelect"
            );


        const questionId =
            select.value;


        const questionOrder =
            parseInt(
                document.getElementById(
                    "questionOrderInput"
                ).value
            );


        const marks =
            parseInt(
                document.getElementById(
                    "questionMarksInput"
                ).value
            );


        const message =
            document.getElementById(
                "addQuestionMessage"
            );


        if (!questionId) {

            message.textContent =
                "Please select a question.";

            return;

        }


        if (
            !questionOrder ||
            questionOrder <= 0
        ) {

            message.textContent =
                "Question order must be greater than 0.";

            return;

        }


        if (
            !marks ||
            marks <= 0
        ) {

            message.textContent =
                "Marks must be greater than 0.";

            return;

        }


        const button =
            document.getElementById(
                "assignQuestionBtn"
            );


        button.disabled = true;

        button.textContent =
            "Assigning...";


        const formData =
            new URLSearchParams();


        formData.append(
            "examId",
            examId
        );

        formData.append(
            "questionId",
            questionId
        );

        formData.append(
            "questionOrder",
            questionOrder
        );

        formData.append(
            "marks",
            marks
        );


        fetch("../exam-question", {

            method: "POST",

            credentials: "same-origin",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body:
                formData.toString()

        })

        .then(function (response) {

            return response.text()
                .then(function (text) {

                    let result;

                    try {

                        result =
                            JSON.parse(text);

                    } catch (e) {

                        result = {
                            success: false,
                            message: text
                        };

                    }


                    if (!response.ok) {

                        throw new Error(
                            result.message ||
                            "Failed to assign question."
                        );

                    }


                    return result;

                });

        })

        .then(function (result) {

            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Question could not be assigned."
                );

            }


            alert(
                "Question assigned successfully."
            );


            closeAddQuestionModal();

            loadAssignedQuestions();

        })

        .catch(function (error) {

            console.error(
                "Assign question error:",
                error
            );


            alert(
                error.message ||
                "Error assigning question."
            );

        })

        .finally(function () {

            button.disabled = false;

            button.innerHTML =
                '<i class="fa-solid fa-plus"></i> Assign Question';

        });

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    loadExamDetails();

    loadAssignedQuestions();

});