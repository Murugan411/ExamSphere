 package com.examsphere.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.List;

import com.examsphere.config.DBConnection;
import com.examsphere.dao.ResultDAO;
import com.examsphere.model.Result;
import com.examsphere.model.Student;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/result")
public class ResultServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private ResultDAO resultDAO = new ResultDAO();


    /* =====================================================
       GET
       ===================================================== */

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {


        String view =
                request.getParameter("view");


        /* =====================================================
           ADMIN RESULTS API
           URL: /result?view=admin
           ===================================================== */

        if ("admin".equalsIgnoreCase(view)) {

            response.setContentType(
                    "application/json;charset=UTF-8"
            );


            String sql =
                    "SELECT " +
                    "r.result_id, " +
                    "r.student_id, " +
                    "r.exam_id, " +
                    "r.total_questions, " +
                    "r.correct_answers, " +
                    "r.wrong_answers, " +
                    "r.score, " +
                    "r.percentage, " +
                    "r.grade, " +
                    "r.status, " +
                    "r.submitted_at, " +
                    "s.full_name AS student_name, " +
                    "e.exam_title, " +
                    "e.total_marks, " +
                    "e.exam_date, " +
                    "sub.subject_name " +
                    "FROM results r " +
                    "LEFT JOIN students s " +
                    "ON r.student_id = s.student_id " +
                    "LEFT JOIN exams e " +
                    "ON r.exam_id = e.exam_id " +
                    "LEFT JOIN subjects sub " +
                    "ON e.subject_id = sub.subject_id " +
                    "ORDER BY r.submitted_at DESC";


            StringBuilder json =
                    new StringBuilder();


            json.append("[");


            try (
                    Connection connection =
                            DBConnection.getConnection();

                    PreparedStatement statement =
                            connection.prepareStatement(sql);

                    ResultSet rs =
                            statement.executeQuery()
            ) {


                boolean first =
                        true;


                while (rs.next()) {


                    if (!first) {

                        json.append(",");

                    }


                    first = false;


                    json.append("{");


                    /* Result ID */

                    json.append("\"resultId\":")
                            .append(
                                    rs.getInt("result_id")
                            )
                            .append(",");


                    /* Student ID */

                    json.append("\"studentId\":")
                            .append(
                                    rs.getInt("student_id")
                            )
                            .append(",");


                    /* Student Name */

                    json.append("\"studentName\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "student_name"
                                            )
                                    )
                            )
                            .append("\",");


                    /* Exam ID */

                    json.append("\"examId\":")
                            .append(
                                    rs.getInt("exam_id")
                            )
                            .append(",");


                    /* Exam Title */

                    json.append("\"examTitle\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "exam_title"
                                            )
                                    )
                            )
                            .append("\",");


                    /* Subject */

                    json.append("\"subjectName\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "subject_name"
                                            )
                                    )
                            )
                            .append("\",");


                    /* Score */

                    json.append("\"score\":")
                            .append(
                                    rs.getDouble("score")
                            )
                            .append(",");


                    /* Total Marks */

                    json.append("\"totalMarks\":")
                            .append(
                                    rs.getDouble(
                                            "total_marks"
                                    )
                            )
                            .append(",");


                    /* Percentage */

                    json.append("\"percentage\":")
                            .append(
                                    rs.getDouble(
                                            "percentage"
                                    )
                            )
                            .append(",");


                    /* Grade */

                    json.append("\"grade\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "grade"
                                            )
                                    )
                            )
                            .append("\",");


                    /* Status */

                    json.append("\"status\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "status"
                                            )
                                    )
                            )
                            .append("\",");


                    /* Exam Date */

                    json.append("\"examDate\":\"")
                            .append(
                                    rs.getDate(
                                            "exam_date"
                                    ) == null
                                            ? ""
                                            : rs.getDate(
                                                    "exam_date"
                                            ).toString()
                            )
                            .append("\",");


                    /* Submitted At */

                    json.append("\"submittedAt\":\"")
                            .append(
                                    rs.getTimestamp(
                                            "submitted_at"
                                    ) == null
                                            ? ""
                                            : rs.getTimestamp(
                                                    "submitted_at"
                                            ).toString()
                            )
                            .append("\"");


                    json.append("}");

                }


            } catch (Exception e) {

                e.printStackTrace();

                response.setStatus(
                        HttpServletResponse
                                .SC_INTERNAL_SERVER_ERROR
                );

                response.getWriter().print(
                        "{\"error\":\"Unable to load admin results\"}"
                );

                return;
            }


            json.append("]");


            response.getWriter().print(
                    json.toString()
            );


            return;
        }


        /* =====================================================
           STUDENT RESULT API
           URL: /result?view=student
           ===================================================== */

        if ("student".equalsIgnoreCase(view)) {

            response.setContentType(
                    "application/json"
            );

            response.setCharacterEncoding(
                    "UTF-8"
            );


            HttpSession session =
                    request.getSession(false);


            if (
                    session == null
                    ||
                    session.getAttribute("student") == null
            ) {

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.getWriter().print(
                        "{\"error\":\"Student login required\"}"
                );

                return;
            }


            Student student =
                    (Student) session.getAttribute(
                            "student"
                    );


            int studentId =
                    student.getStudentId();


            String sql =
                    "SELECT " +
                    "r.result_id, " +
                    "r.student_id, " +
                    "r.exam_id, " +
                    "r.total_questions, " +
                    "r.correct_answers, " +
                    "r.wrong_answers, " +
                    "r.score, " +
                    "r.percentage, " +
                    "r.grade, " +
                    "r.status, " +
                    "r.submitted_at, " +
                    "e.exam_title, " +
                    "e.total_marks " +
                    "FROM results r " +
                    "JOIN exams e " +
                    "ON r.exam_id = e.exam_id " +
                    "WHERE r.student_id = ? " +
                    "ORDER BY r.submitted_at DESC " +
                    "LIMIT 1";


            try (
                    Connection connection =
                            DBConnection.getConnection();

                    PreparedStatement statement =
                            connection.prepareStatement(sql)
            ) {


                statement.setInt(
                        1,
                        studentId
                );


                try (
                        ResultSet rs =
                                statement.executeQuery()
                ) {


                    if (rs.next()) {

                        StringBuilder json =
                                new StringBuilder();


                        json.append("{");


                        json.append("\"resultId\":")
                                .append(
                                        rs.getInt(
                                                "result_id"
                                        )
                                )
                                .append(",");


                        json.append("\"studentId\":")
                                .append(
                                        rs.getInt(
                                                "student_id"
                                        )
                                )
                                .append(",");


                        json.append("\"examId\":")
                                .append(
                                        rs.getInt(
                                                "exam_id"
                                        )
                                )
                                .append(",");


                        json.append("\"examTitle\":\"")
                                .append(
                                        escapeJson(
                                                rs.getString(
                                                        "exam_title"
                                                )
                                        )
                                )
                                .append("\",");


                        json.append("\"totalMarks\":")
                                .append(
                                        rs.getDouble(
                                                "total_marks"
                                        )
                                )
                                .append(",");


                        json.append("\"totalQuestions\":")
                                .append(
                                        rs.getInt(
                                                "total_questions"
                                        )
                                )
                                .append(",");


                        json.append("\"correctAnswers\":")
                                .append(
                                        rs.getInt(
                                                "correct_answers"
                                        )
                                )
                                .append(",");


                        json.append("\"wrongAnswers\":")
                                .append(
                                        rs.getInt(
                                                "wrong_answers"
                                        )
                                )
                                .append(",");


                        json.append("\"score\":")
                                .append(
                                        rs.getDouble(
                                                "score"
                                        )
                                )
                                .append(",");


                        json.append("\"percentage\":")
                                .append(
                                        rs.getDouble(
                                                "percentage"
                                        )
                                )
                                .append(",");


                        json.append("\"grade\":\"")
                                .append(
                                        escapeJson(
                                                rs.getString(
                                                        "grade"
                                                )
                                        )
                                )
                                .append("\",");


                        json.append("\"status\":\"")
                                .append(
                                        escapeJson(
                                                rs.getString(
                                                        "status"
                                                )
                                        )
                                )
                                .append(",");


                        json.append("\"submittedAt\":\"")
                                .append(
                                        rs.getTimestamp(
                                                "submitted_at"
                                        ) == null
                                                ? ""
                                                : rs.getTimestamp(
                                                        "submitted_at"
                                                ).toString()
                                )
                                .append("\"");


                        json.append("}");


                        response.getWriter().print(
                                json.toString()
                        );

                    } else {

                        response.setStatus(
                                HttpServletResponse.SC_NOT_FOUND
                        );

                        response.getWriter().print(
                                "{\"error\":\"No result found\"}"
                        );

                    }

                }

            } catch (Exception e) {

                e.printStackTrace();

                response.setStatus(
                        HttpServletResponse
                                .SC_INTERNAL_SERVER_ERROR
                );

                response.getWriter().print(
                        "{\"error\":\"Unable to load result\"}"
                );

            }


            return;
        }


        /* =====================================================
           DEFAULT ADMIN PAGE
           ===================================================== */

        List<Result> resultList =
                resultDAO.getAllResults();


        request.setAttribute(
                "resultList",
                resultList
        );


        request.getRequestDispatcher(
                "/frontend/admin/results.jsp"
        ).forward(
                request,
                response
        );

    }


    /* =====================================================
       POST
       Student Exam Submission
       ===================================================== */

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {


        response.setContentType(
                "text/plain;charset=UTF-8"
        );


        try {


            HttpSession session =
                    request.getSession(false);


            if (session == null) {

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.getWriter().write(
                        "Student session not found."
                );

                return;
            }


            Student student =
                    (Student) session.getAttribute(
                            "student"
                    );


            if (student == null) {

                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                response.getWriter().write(
                        "Student is not logged in."
                );

                return;
            }


            String examIdParameter =
                    request.getParameter("examId");


            if (
                    examIdParameter == null
                    ||
                    examIdParameter.trim().isEmpty()
            ) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write(
                        "Exam ID is missing."
                );

                return;
            }


            int examId =
                    Integer.parseInt(
                            examIdParameter
                    );


            String examQuestionSQL =
                    "SELECT question_id, marks " +
                    "FROM exam_questions " +
                    "WHERE exam_id = ? " +
                    "ORDER BY question_order ASC";


            String questionSQL =
                    "SELECT correct_answer " +
                    "FROM questions " +
                    "WHERE question_id = ?";


            int totalQuestions = 0;

            int correctAnswers = 0;

            int wrongAnswers = 0;

            double score = 0;

            double totalMarks = 0;


            try (
                    Connection connection =
                            DBConnection.getConnection();

                    PreparedStatement examStatement =
                            connection.prepareStatement(
                                    examQuestionSQL
                            );

                    PreparedStatement questionStatement =
                            connection.prepareStatement(
                                    questionSQL
                            )
            ) {


                examStatement.setInt(
                        1,
                        examId
                );


                try (
                        ResultSet examRS =
                                examStatement.executeQuery()
                ) {


                    while (examRS.next()) {

                        int questionId =
                                examRS.getInt(
                                        "question_id"
                                );


                        int marks =
                                examRS.getInt(
                                        "marks"
                                );


                        totalQuestions++;

                        totalMarks += marks;


                        questionStatement.setInt(
                                1,
                                questionId
                        );


                        String correctAnswer = null;


                        try (
                                ResultSet questionRS =
                                        questionStatement
                                                .executeQuery()
                        ) {

                            if (questionRS.next()) {

                                correctAnswer =
                                        questionRS.getString(
                                                "correct_answer"
                                        );

                            }

                        }


                        String studentAnswer =
                                request.getParameter(
                                        "answer_" + questionId
                                );


                        if (
                                studentAnswer != null
                                &&
                                correctAnswer != null
                                &&
                                studentAnswer.trim()
                                        .equalsIgnoreCase(
                                                correctAnswer.trim()
                                        )
                        ) {

                            correctAnswers++;

                            score += marks;

                        } else {

                            wrongAnswers++;

                        }

                    }

                }

            }


            double percentage = 0;


            if (totalMarks > 0) {

                percentage =
                        (score / totalMarks) * 100;

            }


            String grade;


            if (percentage >= 90) {

                grade = "A+";

            } else if (percentage >= 80) {

                grade = "A";

            } else if (percentage >= 70) {

                grade = "B";

            } else if (percentage >= 60) {

                grade = "C";

            } else if (percentage >= 50) {

                grade = "D";

            } else {

                grade = "F";

            }


            String status;


            if (percentage >= 40) {

                status = "PASS";

            } else {

                status = "FAIL";

            }


            Result result =
                    new Result();


            result.setStudentId(
                    student.getStudentId()
            );


            result.setExamId(
                    examId
            );


            result.setTotalQuestions(
                    totalQuestions
            );


            result.setCorrectAnswers(
                    correctAnswers
            );


            result.setWrongAnswers(
                    wrongAnswers
            );


            result.setScore(
                    score
            );


            result.setPercentage(
                    percentage
            );


            result.setGrade(
                    grade
            );


            result.setStatus(
                    status
            );


            boolean saved =
                    resultDAO.saveResult(
                            result
                    );


            if (saved) {

                response.setStatus(
                        HttpServletResponse.SC_OK
                );

                response.getWriter().write(
                        "SUCCESS"
                );

            } else {

                response.setStatus(
                        HttpServletResponse
                                .SC_INTERNAL_SERVER_ERROR
                );

                response.getWriter().write(
                        "Unable to save exam result."
                );

            }


        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse
                            .SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(
                    "Server error: "
                            + e.getMessage()
            );

        }

    }


    /* =====================================================
       JSON ESCAPE
       ===================================================== */

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