package com.examsphere.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.examsphere.config.DBConnection;
import com.examsphere.model.Student;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/studentHistory")
public class StudentHistoryServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session =
                request.getSession(false);

        /*
         * =====================================================
         * CHECK LOGIN
         * =====================================================
         */

        if (session == null ||
            session.getAttribute("student") == null) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Please login again.\"}"
            );

            return;
        }

        Student student =
                (Student) session.getAttribute("student");

        int studentId =
                student.getStudentId();


        /*
         * =====================================================
         * GET STUDENT EXAM HISTORY
         * =====================================================
         *
         * IMPORTANT:
         *
         * correct_answers and wrong_answers are included
         * because the Result page needs these values.
         *
         * =====================================================
         */

        String sql =
                "SELECT " +
                "r.result_id, " +
                "r.exam_id, " +
                "e.exam_code, " +
                "e.exam_title, " +
                "e.total_marks, " +
                "r.total_questions, " +
                "r.correct_answers, " +
                "r.wrong_answers, " +
                "r.score, " +
                "r.percentage, " +
                "r.grade, " +
                "r.status, " +
                "r.submitted_at " +
                "FROM results r " +
                "LEFT JOIN exams e " +
                "ON r.exam_id = e.exam_id " +
                "WHERE r.student_id = ? " +
                "ORDER BY r.submitted_at DESC";


        StringBuilder json =
                new StringBuilder();

        json.append("{");
        json.append("\"success\":true,");
        json.append("\"history\":[");


        boolean first = true;


        /*
         * =====================================================
         * DATABASE CONNECTION
         * =====================================================
         */

        try (
                Connection connection =
                        DBConnection.getConnection();

                PreparedStatement ps =
                        connection.prepareStatement(sql)
        ) {

            ps.setInt(
                    1,
                    studentId
            );


            try (
                    ResultSet rs =
                            ps.executeQuery()
            ) {

                /*
                 * =================================================
                 * READ EACH RESULT
                 * =================================================
                 */

                while (rs.next()) {

                    if (!first) {

                        json.append(",");

                    }

                    first = false;


                    /*
                     * ---------------------------------------------
                     * BASIC EXAM INFORMATION
                     * ---------------------------------------------
                     */

                    int resultId =
                            rs.getInt(
                                    "result_id"
                            );


                    int examId =
                            rs.getInt(
                                    "exam_id"
                            );


                    String examCode =
                            rs.getString(
                                    "exam_code"
                            );


                    String examTitle =
                            rs.getString(
                                    "exam_title"
                            );


                    int totalMarks =
                            rs.getInt(
                                    "total_marks"
                            );


                    /*
                     * ---------------------------------------------
                     * QUESTION STATISTICS
                     * ---------------------------------------------
                     */

                    int totalQuestions =
                            rs.getInt(
                                    "total_questions"
                            );


                    int correctAnswers =
                            rs.getInt(
                                    "correct_answers"
                            );


                    int wrongAnswers =
                            rs.getInt(
                                    "wrong_answers"
                            );


                    /*
                     * ---------------------------------------------
                     * RESULT INFORMATION
                     * ---------------------------------------------
                     */

                    double score =
                            rs.getDouble(
                                    "score"
                            );


                    double percentage =
                            rs.getDouble(
                                    "percentage"
                            );


                    String grade =
                            rs.getString(
                                    "grade"
                            );


                    String status =
                            rs.getString(
                                    "status"
                            );


                    /*
                     * ---------------------------------------------
                     * SUBMITTED DATE
                     * ---------------------------------------------
                     */

                    String submittedAt =
                            rs.getTimestamp(
                                    "submitted_at"
                            ) == null
                            ? ""
                            : rs.getTimestamp(
                                    "submitted_at"
                              ).toString();


                    /*
                     * =================================================
                     * BUILD JSON OBJECT
                     * =================================================
                     */

                    json.append("{");


                    /*
                     * RESULT ID
                     */

                    json.append(
                            "\"resultId\":"
                    );

                    json.append(
                            resultId
                    );


                    json.append(",");


                    /*
                     * EXAM ID
                     */

                    json.append(
                            "\"examId\":"
                    );

                    json.append(
                            examId
                    );


                    json.append(",");


                    /*
                     * EXAM CODE
                     */

                    json.append(
                            "\"examCode\":\""
                    );

                    json.append(
                            escapeJson(examCode)
                    );

                    json.append("\"");


                    json.append(",");


                    /*
                     * EXAM TITLE
                     */

                    json.append(
                            "\"examTitle\":\""
                    );

                    json.append(
                            escapeJson(examTitle)
                    );

                    json.append("\"");


                    json.append(",");


                    /*
                     * TOTAL MARKS
                     */

                    json.append(
                            "\"totalMarks\":"
                    );

                    json.append(
                            totalMarks
                    );


                    json.append(",");


                    /*
                     * TOTAL QUESTIONS
                     */

                    json.append(
                            "\"totalQuestions\":"
                    );

                    json.append(
                            totalQuestions
                    );


                    json.append(",");


                    /*
                     * =================================================
                     * CORRECT ANSWERS
                     * =================================================
                     */

                    json.append(
                            "\"correctAnswers\":"
                    );

                    json.append(
                            correctAnswers
                    );


                    json.append(",");


                    /*
                     * =================================================
                     * WRONG ANSWERS
                     * =================================================
                     */

                    json.append(
                            "\"wrongAnswers\":"
                    );

                    json.append(
                            wrongAnswers
                    );


                    json.append(",");


                    /*
                     * SCORE
                     */

                    json.append(
                            "\"score\":"
                    );

                    json.append(
                            score
                    );


                    json.append(",");


                    /*
                     * PERCENTAGE
                     */

                    json.append(
                            "\"percentage\":"
                    );

                    json.append(
                            percentage
                    );


                    json.append(",");


                    /*
                     * GRADE
                     */

                    json.append(
                            "\"grade\":\""
                    );

                    json.append(
                            escapeJson(grade)
                    );

                    json.append("\"");


                    json.append(",");


                    /*
                     * STATUS
                     */

                    json.append(
                            "\"status\":\""
                    );

                    json.append(
                            escapeJson(status)
                    );

                    json.append("\"");


                    json.append(",");


                    /*
                     * SUBMITTED AT
                     */

                    json.append(
                            "\"submittedAt\":\""
                    );

                    json.append(
                            escapeJson(submittedAt)
                    );

                    json.append("\"");


                    /*
                     * CLOSE JSON OBJECT
                     */

                    json.append("}");

                }

            }


            /*
             * =====================================================
             * CLOSE JSON
             * =====================================================
             */

            json.append("]");
            json.append("}");


            response.setStatus(
                    HttpServletResponse.SC_OK
            );


            response.getWriter().write(
                    json.toString()
            );


        } catch (Exception e) {

            e.printStackTrace();


            response.setStatus(
                    HttpServletResponse
                            .SC_INTERNAL_SERVER_ERROR
            );


            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Unable to load exam history.\"}"
            );

        }

    }


    /*
     * =========================================================
     * JSON ESCAPE
     * =========================================================
     */

    private String escapeJson(
            String value) {

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