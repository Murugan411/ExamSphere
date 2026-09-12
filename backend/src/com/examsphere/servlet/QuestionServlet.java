package com.examsphere.servlet;

import java.io.IOException;
import java.util.List;

import com.examsphere.dao.QuestionDAO;
import com.examsphere.model.Question;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/question")
public class QuestionServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private QuestionDAO questionDAO;


    // =====================================================
    // INIT
    // =====================================================

    @Override
    public void init() throws ServletException {

        questionDAO = new QuestionDAO();

    }


    // =====================================================
    // GET
    // Load all questions as JSON
    // =====================================================

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        List<Question> questionList =
                questionDAO.getAllQuestions();

        StringBuilder json =
                new StringBuilder();

        json.append("[");


        for (int i = 0;
             i < questionList.size();
             i++) {

            Question question =
                    questionList.get(i);


            if (i > 0) {

                json.append(",");

            }


            json.append("{");


            json.append("\"questionId\":")
                .append(question.getQuestionId())
                .append(",");


            json.append("\"subjectId\":")
                .append(question.getSubjectId())
                .append(",");


            json.append("\"categoryId\":")
                .append(question.getCategoryId())
                .append(",");


            json.append("\"questionText\":\"")
                .append(
                    escapeJson(
                        question.getQuestionText()
                    )
                )
                .append("\",");


            json.append("\"optionA\":\"")
                .append(
                    escapeJson(
                        question.getOptionA()
                    )
                )
                .append("\",");


            json.append("\"optionB\":\"")
                .append(
                    escapeJson(
                        question.getOptionB()
                    )
                )
                .append("\",");


            json.append("\"optionC\":\"")
                .append(
                    escapeJson(
                        question.getOptionC()
                    )
                )
                .append("\",");


            json.append("\"optionD\":\"")
                .append(
                    escapeJson(
                        question.getOptionD()
                    )
                )
                .append("\",");


            json.append("\"correctAnswer\":\"")
                .append(
                    escapeJson(
                        question.getCorrectAnswer()
                    )
                )
                .append("\",");


            json.append("\"difficulty\":\"")
                .append(
                    escapeJson(
                        question.getDifficulty()
                    )
                )
                .append("\",");


            json.append("\"marks\":")
                .append(question.getMarks())
                .append(",");


            json.append("\"status\":\"")
                .append(
                    escapeJson(
                        question.getStatus()
                    )
                )
                .append("\"");


            json.append("}");

        }


        json.append("]");


        response.getWriter().print(
                json.toString()
        );

    }


    // =====================================================
    // POST
    // Handles ADD + UPDATE + DELETE
    // =====================================================

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");


        String action =
                request.getParameter("action");


        try {


            // =================================================
            // UPDATE QUESTION
            // =================================================

            if ("update".equalsIgnoreCase(action)) {

                Question question =
                        new Question();


                String questionId =
                        request.getParameter(
                                "questionId"
                        );


                if (questionId == null ||
                    questionId.trim().isEmpty()) {

                    response.setStatus(
                            HttpServletResponse
                                    .SC_BAD_REQUEST
                    );

                    response.getWriter().print(
                            "Question ID is required."
                    );

                    return;

                }


                question.setQuestionId(
                        Integer.parseInt(
                                questionId
                        )
                );


                question.setSubjectId(
                        Integer.parseInt(
                                request.getParameter(
                                        "subjectId"
                                )
                        )
                );


                question.setCategoryId(
                        Integer.parseInt(
                                request.getParameter(
                                        "categoryId"
                                )
                        )
                );


                question.setQuestionText(
                        request.getParameter(
                                "questionText"
                        )
                );


                question.setOptionA(
                        request.getParameter(
                                "optionA"
                        )
                );


                question.setOptionB(
                        request.getParameter(
                                "optionB"
                        )
                );


                question.setOptionC(
                        request.getParameter(
                                "optionC"
                        )
                );


                question.setOptionD(
                        request.getParameter(
                                "optionD"
                        )
                );


                question.setCorrectAnswer(
                        request.getParameter(
                                "correctAnswer"
                        )
                );


                question.setDifficulty(
                        request.getParameter(
                                "difficulty"
                        )
                );


                question.setMarks(
                        Integer.parseInt(
                                request.getParameter(
                                        "marks"
                                )
                        )
                );


                String status =
                        request.getParameter(
                                "status"
                        );


                if (status == null ||
                    status.trim().isEmpty()) {

                    status = "Active";

                }


                question.setStatus(status);


                boolean updated =
                        questionDAO.updateQuestion(
                                question
                        );


                if (updated) {

                    response.getWriter().print(
                            "Question updated successfully!"
                    );

                } else {

                    response.setStatus(
                            HttpServletResponse
                                    .SC_INTERNAL_SERVER_ERROR
                    );

                    response.getWriter().print(
                            "Failed to update question."
                    );

                }


                return;

            }


            // =================================================
            // DELETE QUESTION
            // =================================================

            if ("delete".equalsIgnoreCase(action)) {

                String questionId =
                        request.getParameter(
                                "questionId"
                        );


                if (questionId == null ||
                    questionId.trim().isEmpty()) {

                    response.setStatus(
                            HttpServletResponse
                                    .SC_BAD_REQUEST
                    );

                    response.getWriter().print(
                            "Question ID is required."
                    );

                    return;

                }


                int id =
                        Integer.parseInt(
                                questionId
                        );


                boolean deleted =
                        questionDAO.deleteQuestion(
                                id
                        );


                if (deleted) {

                    response.getWriter().print(
                            "Question deleted successfully!"
                    );

                } else {

                    response.setStatus(
                            HttpServletResponse
                                    .SC_INTERNAL_SERVER_ERROR
                    );

                    response.getWriter().print(
                            "Failed to delete question."
                    );

                }


                return;

            }


            // =================================================
            // ADD QUESTION
            // =================================================

            Question question =
                    new Question();


            question.setSubjectId(
                    Integer.parseInt(
                            request.getParameter(
                                    "subjectId"
                            )
                    )
            );


            question.setCategoryId(
                    Integer.parseInt(
                            request.getParameter(
                                    "categoryId"
                            )
                    )
            );


            question.setQuestionText(
                    request.getParameter(
                            "questionText"
                    )
            );


            question.setOptionA(
                    request.getParameter(
                            "optionA"
                    )
            );


            question.setOptionB(
                    request.getParameter(
                            "optionB"
                    )
            );


            question.setOptionC(
                    request.getParameter(
                            "optionC"
                    )
            );


            question.setOptionD(
                    request.getParameter(
                            "optionD"
                    )
            );


            question.setCorrectAnswer(
                    request.getParameter(
                            "correctAnswer"
                    )
            );


            question.setDifficulty(
                    request.getParameter(
                            "difficulty"
                    )
            );


            question.setMarks(
                    Integer.parseInt(
                            request.getParameter(
                                    "marks"
                            )
                    )
            );


            String status =
                    request.getParameter(
                            "status"
                    );


            if (status == null ||
                status.trim().isEmpty()) {

                status = "Active";

            }


            question.setStatus(status);


            boolean added =
                    questionDAO.addQuestion(
                            question
                    );


            if (added) {

                response.getWriter().print(
                        "Question added successfully!"
                );

            } else {

                response.setStatus(
                        HttpServletResponse
                                .SC_INTERNAL_SERVER_ERROR
                );

                response.getWriter().print(
                        "Failed to add question."
                );

            }


        } catch (NumberFormatException e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse
                            .SC_BAD_REQUEST
            );

            response.getWriter().print(
                    "Invalid number format: "
                    + e.getMessage()
            );


        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse
                            .SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().print(
                    "Error processing question: "
                    + e.getMessage()
            );

        }

    }


    // =====================================================
    // ESCAPE JSON
    // =====================================================

    private String escapeJson(String value) {

        if (value == null) {

            return "";

        }


        return value

                .replace(
                        "\\",
                        "\\\\"
                )

                .replace(
                        "\"",
                        "\\\""
                )

                .replace(
                        "\r",
                        "\\r"
                )

                .replace(
                        "\n",
                        "\\n"
                );

    }

}