/* =========================================================
   ExamSphere - Student Take Exam
   Database Connected Version
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       VARIABLES
    ===================================================== */

    const params =
        new URLSearchParams(window.location.search);


    /*
     * GET EXAM ID
     *
     * First try URL:
     * student-take-exam.html?examId=1
     *
     * If missing, use sessionStorage.
     */

    let examId =
        params.get("examId");


    if (!examId) {

        examId =
            sessionStorage.getItem("selectedExamId");

    }


    /*
     * Keep selected exam ID available.
     */

    if (examId) {

        sessionStorage.setItem(
            "selectedExamId",
            examId
        );

    }


    let questions = [];

    let currentQuestionIndex = 0;

    let answers = {};

    let totalSeconds = 60 * 60;

    let countdown;


    /* =====================================================
       HTML ELEMENTS
    ===================================================== */

    const timer =
        document.getElementById("timer");

    const questionNo =
        document.getElementById("questionNo");

    const totalQuestions =
        document.getElementById("totalQuestions");

    const questionText =
        document.getElementById("questionText");

    const questionGrid =
        document.getElementById("questionGrid");

    const previousBtn =
        document.getElementById("previousBtn");

    const nextBtn =
        document.getElementById("nextBtn");

    const submitExam =
        document.getElementById("submitExam");

    const optionA =
        document.getElementById("optionA");

    const optionB =
        document.getElementById("optionB");

    const optionC =
        document.getElementById("optionC");

    const optionD =
        document.getElementById("optionD");

    const optionAText =
        document.getElementById("optionAText");

    const optionBText =
        document.getElementById("optionBText");

    const optionCText =
        document.getElementById("optionCText");

    const optionDText =
        document.getElementById("optionDText");


    /* =====================================================
       BASIC ELEMENT CHECK
    ===================================================== */

    if (
        !timer ||
        !questionNo ||
        !totalQuestions ||
        !questionText ||
        !questionGrid ||
        !previousBtn ||
        !nextBtn ||
        !submitExam ||
        !optionA ||
        !optionB ||
        !optionC ||
        !optionD
    ) {

        console.error(
            "Exam page elements are missing."
        );

        return;
    }


    /* =====================================================
       CHECK EXAM ID
    ===================================================== */

    if (!examId) {

        alert(
            "Exam ID is missing. Please select an exam again."
        );

        window.location.href =
            "student-available-exams.html";

        return;
    }


    console.log(
        "================================"
    );

    console.log(
        "TAKE EXAM STARTED"
    );

    console.log(
        "Exam ID:",
        examId
    );

    console.log(
        "================================"
    );


    /* =====================================================
       LOAD EXAM QUESTIONS
    ===================================================== */

    async function loadExamQuestions() {

        try {

            /*
             * Get questions assigned
             * to this exam.
             */

            const assignedResponse =
                await fetch(
                    "../exam-question?examId=" +
                    encodeURIComponent(examId)
                );


            if (!assignedResponse.ok) {

                throw new Error(
                    "Unable to load assigned questions. HTTP " +
                    assignedResponse.status
                );

            }


            const assignedQuestions =
                await assignedResponse.json();


            console.log(
                "Assigned Questions:",
                assignedQuestions
            );


            /*
             * Get complete question details.
             */

            const questionResponse =
                await fetch("../question");


            if (!questionResponse.ok) {

                throw new Error(
                    "Unable to load questions. HTTP " +
                    questionResponse.status
                );

            }


            const allQuestions =
                await questionResponse.json();


            console.log(
                "All Questions:",
                allQuestions
            );


            /*
             * Match assigned questions
             * with question bank.
             */

            questions =
                assignedQuestions
                    .map(assigned => {

                        const question =
                            allQuestions.find(
                                q =>
                                    Number(
                                        q.questionId
                                    ) ===
                                    Number(
                                        assigned.questionId
                                    )
                            );


                        if (!question) {

                            console.warn(
                                "Question not found:",
                                assigned.questionId
                            );

                            return null;
                        }


                        return {

                            ...question,

                            examQuestionId:
                                assigned.examQuestionId,

                            questionOrder:
                                assigned.questionOrder,

                            examMarks:
                                assigned.marks

                        };

                    })
                    .filter(
                        question =>
                            question !== null
                    );


            /*
             * Sort according to
             * question order.
             */

            questions.sort(
                (a, b) =>
                    Number(a.questionOrder) -
                    Number(b.questionOrder)
            );


            console.log(
                "Final Exam Questions:",
                questions
            );


            /* =================================================
               CHECK QUESTIONS
            ================================================= */

            if (questions.length === 0) {

                questionText.textContent =
                    "No questions assigned to this exam.";

                totalQuestions.textContent =
                    "0";

                questionGrid.innerHTML =
                    "";

                console.warn(
                    "No questions found for Exam ID:",
                    examId
                );

                return;
            }


            /* =================================================
               TOTAL QUESTIONS
            ================================================= */

            totalQuestions.textContent =
                questions.length;


            /* =================================================
               CREATE QUESTION BUTTONS
            ================================================= */

            createQuestionButtons();


            /* =================================================
               SHOW FIRST QUESTION
            ================================================= */

            showQuestion(0);


        } catch (error) {

            console.error(
                "Error loading exam:",
                error
            );

            questionText.textContent =
                "Unable to load exam questions.";

            alert(
                "Unable to load exam questions."
            );

        }

    }


    /* =====================================================
       CREATE QUESTION BUTTONS
    ===================================================== */

    function createQuestionButtons() {

        questionGrid.innerHTML =
            "";


        questions.forEach(
            (question, index) => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


                button.textContent =
                    index + 1;


                button.dataset.index =
                    index;


                button.addEventListener(
                    "click",
                    () => {

                        saveCurrentAnswer();

                        showQuestion(index);

                    }
                );


                questionGrid.appendChild(
                    button
                );

            }
        );

    }


    /* =====================================================
       SHOW QUESTION
    ===================================================== */

    function showQuestion(index) {

        if (
            index < 0 ||
            index >= questions.length
        ) {

            return;
        }


        currentQuestionIndex =
            index;


        const question =
            questions[index];


        /* ================================================
           QUESTION NUMBER
        ================================================= */

        questionNo.textContent =
            index + 1;


        totalQuestions.textContent =
            questions.length;


        /* ================================================
           QUESTION TEXT
        ================================================= */

        questionText.textContent =
            question.questionText || "";


        /* ================================================
           OPTION TEXT
        ================================================= */

        if (optionAText) {

            optionAText.textContent =
                question.optionA || "";

        }


        if (optionBText) {

            optionBText.textContent =
                question.optionB || "";

        }


        if (optionCText) {

            optionCText.textContent =
                question.optionC || "";

        }


        if (optionDText) {

            optionDText.textContent =
                question.optionD || "";

        }


        /* ================================================
           RADIO VALUES
           
           IMPORTANT:
           Backend correct_answer contains A/B/C/D.
           Therefore radio values MUST be A/B/C/D.
        ================================================= */

        optionA.value =
            "A";

        optionB.value =
            "B";

        optionC.value =
            "C";

        optionD.value =
            "D";


        /* =================================================
           RADIO NAMES
           
           Keep all four options under the same
           radio group so only one can be selected.
        ================================================= */

        optionA.name =
            "answer";

        optionB.name =
            "answer";

        optionC.name =
            "answer";

        optionD.name =
            "answer";


        /* ================================================
           CLEAR RADIO BUTTONS
        ================================================= */

        optionA.checked =
            false;

        optionB.checked =
            false;

        optionC.checked =
            false;

        optionD.checked =
            false;


        /* ================================================
           RESTORE PREVIOUS ANSWER
        ================================================= */

        const savedAnswer =
            answers[
                question.questionId
            ];


        if (savedAnswer) {

            if (
                optionA.value ===
                savedAnswer
            ) {

                optionA.checked =
                    true;

            }

            else if (
                optionB.value ===
                savedAnswer
            ) {

                optionB.checked =
                    true;

            }

            else if (
                optionC.value ===
                savedAnswer
            ) {

                optionC.checked =
                    true;

            }

            else if (
                optionD.value ===
                savedAnswer
            ) {

                optionD.checked =
                    true;

            }

        }


        /* ================================================
           UPDATE QUESTION NAVIGATION
        ================================================= */

        const buttons =
            questionGrid.querySelectorAll(
                "button"
            );


        buttons.forEach(
            (button, buttonIndex) => {

                button.classList.remove(
                    "active"
                );

                button.classList.remove(
                    "answered"
                );


                if (
                    buttonIndex ===
                    index
                ) {

                    button.classList.add(
                        "active"
                    );

                }


                /*
                 * Show answered questions.
                 */

                const currentQuestion =
                    questions[buttonIndex];


                if (
                    currentQuestion &&
                    answers[
                        currentQuestion.questionId
                    ]
                ) {

                    button.classList.add(
                        "answered"
                    );

                }

            }
        );


        /* ================================================
           PREVIOUS BUTTON
        ================================================= */

        previousBtn.disabled =
            index === 0;


        /* ================================================
           NEXT BUTTON
        ================================================= */

        if (
            index ===
            questions.length - 1
        ) {

            nextBtn.innerHTML =
                'Save & Finish <i class="fa-solid fa-check"></i>';

        }

        else {

            nextBtn.innerHTML =
                'Save & Next <i class="fa-solid fa-arrow-right"></i>';

        }

    }


    /* =====================================================
       SAVE CURRENT ANSWER
    ===================================================== */

    function saveCurrentAnswer() {

        if (
            questions.length === 0
        ) {

            return;
        }


        const question =
            questions[
                currentQuestionIndex
            ];


        if (!question) {

            return;
        }


        /*
         * Find the selected answer.
         *
         * Radio values are now:
         *
         * A
         * B
         * C
         * D
         *
         * This matches the database
         * correct_answer value.
         */

        const selected =
            document.querySelector(
                'input[name="answer"]:checked'
            );


        if (selected) {

            answers[
                question.questionId
            ] =
                selected.value;


            console.log(
                "Saved Answer:",
                question.questionId,
                selected.value
            );

        }

        else {

            console.log(
                "No answer selected for Question:",
                question.questionId
            );

        }

    }


    /* =====================================================
       NEXT BUTTON
    ===================================================== */

    nextBtn.addEventListener(
        "click",
        () => {

            saveCurrentAnswer();


            if (
                currentQuestionIndex <
                questions.length - 1
            ) {

                showQuestion(
                    currentQuestionIndex + 1
                );

            }

            else {

                alert(
                    "You have reached the last question. Click Submit Exam to submit."
                );

            }

        }
    );


    /* =====================================================
       PREVIOUS BUTTON
    ===================================================== */

    previousBtn.addEventListener(
        "click",
        () => {

            saveCurrentAnswer();


            if (
                currentQuestionIndex > 0
            ) {

                showQuestion(
                    currentQuestionIndex - 1
                );

            }

        }
    );


    /* =====================================================
       SUBMIT EXAM
    ===================================================== */

    submitExam.addEventListener(
        "click",
        () => {

            saveCurrentAnswer();


            if (
                questions.length === 0
            ) {

                alert(
                    "There are no questions to submit."
                );

                return;
            }


            const confirmSubmit =
                confirm(
                    "Are you sure you want to submit the exam?"
                );


            if (!confirmSubmit) {

                return;
            }


            submitExamToServer();

        }
    );


    /* =====================================================
       SUBMIT EXAM TO JAVA BACKEND
    ===================================================== */

    function submitExamToServer() {

        /*
         * Stop timer.
         */

        if (countdown) {

            clearInterval(
                countdown
            );

        }


        /*
         * Make sure current answer
         * is saved.
         */

        saveCurrentAnswer();


        /*
         * Create form data.
         */

        const formData =
            new URLSearchParams();


        /*
         * Add Exam ID.
         */

        formData.append(
            "examId",
            examId
        );


        /*
         * Add every answer.
         *
         * Example:
         *
         * answer_2=B
         * answer_3=B
         * answer_6=B
         *
         * The number is the actual
         * question_id.
         */

        Object.keys(answers).forEach(
            questionId => {

                const answer =
                    answers[questionId];


                if (
                    answer !== null &&
                    answer !== undefined &&
                    answer !== ""
                ) {

                    formData.append(
                        "answer_" + questionId,
                        answer
                    );

                }

            }
        );


        /*
         * DEBUG
         */

        console.log(
            "================================"
        );

        console.log(
            "SUBMITTING EXAM"
        );

        console.log(
            "Exam ID:",
            examId
        );

        console.log(
            "Answers:",
            answers
        );

        console.log(
            "POST DATA:",
            formData.toString()
        );

        console.log(
            "================================"
        );


        /*
         * Disable submit button
         * to prevent double submission.
         */

        submitExam.disabled =
            true;


        submitExam.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';


        /*
         * Send to ResultServlet.
         */

        fetch(
            "../result",
            {

                method: "POST",

                /*
                 * IMPORTANT:
                 * Keep the logged-in student's
                 * JSESSIONID cookie with this request.
                 */

                credentials: "same-origin",

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded; charset=UTF-8"

                },

                body:
                    formData.toString()

            }
        )
        .then(async response => {

            console.log(
                "ResultServlet HTTP Status:",
                response.status
            );


            const responseText =
                await response.text();


            console.log(
                "ResultServlet Response:",
                responseText
            );


            if (!response.ok) {

                throw new Error(
                    "Server returned HTTP " +
                    response.status +
                    ": " +
                    responseText
                );

            }


            return responseText;

        })
        .then(result => {

            console.log(
                "Exam submitted successfully."
            );


            /*
             * Store exam ID so the
             * result page can use it
             * if required later.
             */

            sessionStorage.setItem(
                "lastExamId",
                examId
            );


            /*
             * Open result page.
             */

            window.location.href =
                "student-result.html";

        })
        .catch(error => {

            console.error(
                "================================"
            );

            console.error(
                "SUBMISSION ERROR"
            );

            console.error(
                error
            );

            console.error(
                "================================"
            );


            submitExam.disabled =
                false;


            submitExam.innerHTML =
                '<i class="fa-solid fa-check"></i> Submit Exam';


            alert(
                "Unable to submit the exam. Please try again."
            );

        });

    }


    /* =====================================================
       COUNTDOWN TIMER
    ===================================================== */

    function startTimer() {

        updateTimer();


        countdown =
            setInterval(
                () => {

                    totalSeconds--;


                    updateTimer();


                    if (
                        totalSeconds <= 0
                    ) {

                        clearInterval(
                            countdown
                        );


                        alert(
                            "Time is up! Exam will be submitted automatically."
                        );


                        /*
                         * Automatically submit.
                         */

                        saveCurrentAnswer();

                        submitExamToServer();

                    }

                },
                1000
            );

    }


    /* =====================================================
       UPDATE TIMER
    ===================================================== */

    function updateTimer() {

        const minutes =
            Math.floor(
                totalSeconds / 60
            );


        const seconds =
            totalSeconds % 60;


        timer.textContent =
            String(minutes).padStart(
                2,
                "0"
            )
            +
            ":"
            +
            String(seconds).padStart(
                2,
                "0"
            );

    }


    /* =====================================================
       START APPLICATION
    ===================================================== */

    loadExamQuestions();

    startTimer();

});