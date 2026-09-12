package com.examsphere.servlet;

import com.examsphere.dao.ExamQuestionDAO;
import com.examsphere.model.ExamQuestion;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/exam-question")
public class ExamQuestionServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private final ExamQuestionDAO examQuestionDAO =
            new ExamQuestionDAO();


    // =========================================================
    // GET
    // Load questions assigned to an exam
    // =========================================================

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {

            String examIdParameter =
                    request.getParameter("examId");

            if (examIdParameter == null
                    || examIdParameter.trim().isEmpty()) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                out.print(
                        "{\"success\":false,\"message\":\"Exam ID is required\"}"
                );

                return;
            }

            int examId =
                    Integer.parseInt(examIdParameter);

            List<ExamQuestion> list =
                    examQuestionDAO.getQuestionsByExam(examId);

            StringBuilder json =
                    new StringBuilder();

            json.append("[");

            for (int i = 0; i < list.size(); i++) {

                ExamQuestion item = list.get(i);

                if (i > 0) {
                    json.append(",");
                }

                json.append("{");

                json.append("\"examQuestionId\":")
                        .append(item.getExamQuestionId())
                        .append(",");

                json.append("\"examId\":")
                        .append(item.getExamId())
                        .append(",");

                json.append("\"questionId\":")
                        .append(item.getQuestionId())
                        .append(",");

                json.append("\"questionOrder\":")
                        .append(item.getQuestionOrder())
                        .append(",");

                json.append("\"marks\":")
                        .append(item.getMarks());

                json.append("}");
            }

            json.append("]");

            out.print(json.toString());

        } catch (NumberFormatException e) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            out.print(
                    "{\"success\":false,\"message\":\"Invalid exam ID\"}"
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            out.print(
                    "{\"success\":false,\"message\":\"Unable to load exam questions\"}"
            );
        }
    }


    // =========================================================
    // POST
    // Assign question to exam
    // =========================================================

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {

            String examIdParameter =
                    request.getParameter("examId");

            String questionIdParameter =
                    request.getParameter("questionId");

            String questionOrderParameter =
                    request.getParameter("questionOrder");

            String marksParameter =
                    request.getParameter("marks");


            // -------------------------------------------------
            // VALIDATION
            // -------------------------------------------------

            if (examIdParameter == null
                    || questionIdParameter == null
                    || questionOrderParameter == null
                    || marksParameter == null) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                out.print(
                        "{\"success\":false,\"message\":\"Required fields are missing\"}"
                );

                return;
            }


            int examId =
                    Integer.parseInt(examIdParameter);

            int questionId =
                    Integer.parseInt(questionIdParameter);

            int questionOrder =
                    Integer.parseInt(questionOrderParameter);

            int marks =
                    Integer.parseInt(marksParameter);


            if (examId <= 0
                    || questionId <= 0
                    || questionOrder <= 0
                    || marks <= 0) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                out.print(
                        "{\"success\":false,\"message\":\"Invalid question assignment data\"}"
                );

                return;
            }


            // -------------------------------------------------
            // DUPLICATE CHECK
            // -------------------------------------------------

            if (examQuestionDAO.isQuestionAssigned(
                    examId,
                    questionId)) {

                response.setStatus(
                        HttpServletResponse.SC_CONFLICT
                );

                out.print(
                        "{\"success\":false,\"message\":\"Question is already assigned to this exam\"}"
                );

                return;
            }


            // -------------------------------------------------
            // CREATE OBJECT
            // -------------------------------------------------

            ExamQuestion examQuestion =
                    new ExamQuestion();

            examQuestion.setExamId(examId);

            examQuestion.setQuestionId(questionId);

            examQuestion.setQuestionOrder(
                    questionOrder
            );

            examQuestion.setMarks(marks);


            // -------------------------------------------------
            // SAVE
            // -------------------------------------------------

            boolean added =
                    examQuestionDAO.addExamQuestion(
                            examQuestion
                    );


            if (added) {

                out.print(
                        "{\"success\":true,\"message\":\"Question assigned successfully\"}"
                );

            } else {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                out.print(
                        "{\"success\":false,\"message\":\"Unable to assign question\"}"
                );
            }

        } catch (NumberFormatException e) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            out.print(
                    "{\"success\":false,\"message\":\"Invalid numeric value\"}"
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            out.print(
                    "{\"success\":false,\"message\":\"Server error while assigning question\"}"
            );
        }
    }


    // =========================================================
    // DELETE
    // Remove question from exam
    // =========================================================

    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {

            String idParameter =
                    request.getParameter(
                            "examQuestionId"
                    );

            if (idParameter == null
                    || idParameter.trim().isEmpty()) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                out.print(
                        "{\"success\":false,\"message\":\"Assignment ID is required\"}"
                );

                return;
            }

            int examQuestionId =
                    Integer.parseInt(idParameter);


            boolean deleted =
                    examQuestionDAO.deleteExamQuestion(
                            examQuestionId
                    );


            if (deleted) {

                out.print(
                        "{\"success\":true,\"message\":\"Question removed from exam\"}"
                );

            } else {

                response.setStatus(
                        HttpServletResponse.SC_NOT_FOUND
                );

                out.print(
                        "{\"success\":false,\"message\":\"Assignment not found\"}"
                );
            }

        } catch (NumberFormatException e) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            out.print(
                    "{\"success\":false,\"message\":\"Invalid assignment ID\"}"
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            out.print(
                    "{\"success\":false,\"message\":\"Server error while removing question\"}"
            );
        }
    }
}