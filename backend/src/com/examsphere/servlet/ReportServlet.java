package com.examsphere.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.examsphere.config.DBConnection;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/report")
public class ReportServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;


    /* =====================================================
       GET
       URL:
       /report?view=admin
       ===================================================== */

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {


        String view =
                request.getParameter("view");


        if (!"admin".equalsIgnoreCase(view)) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.setContentType(
                    "application/json;charset=UTF-8"
            );

            response.getWriter().print(
                    "{\"error\":\"Invalid report view\"}"
            );

            return;
        }


        response.setContentType(
                "application/json;charset=UTF-8"
        );


        Connection connection = null;


        try {

            connection =
                    DBConnection.getConnection();


            /* =====================================================
               SUMMARY STATISTICS
               ===================================================== */

            String summarySQL =
                    "SELECT " +

                    "(SELECT COUNT(*) " +
                    " FROM students " +
                    " WHERE LOWER(status) = 'active') " +
                    "AS total_students, " +

                    "(SELECT COUNT(*) " +
                    " FROM exams) " +
                    "AS total_exams, " +

                    "(SELECT " +
                    "   COALESCE( " +
                    "       ROUND( " +
                    "           SUM( " +
                    "               CASE " +
                    "                   WHEN LOWER(status) = 'pass' " +
                    "                   THEN 1 ELSE 0 " +
                    "               END " +
                    "           ) * 100.0 / NULLIF(COUNT(*), 0), " +
                    "           2 " +
                    "       ), " +
                    "       0 " +
                    "   ) " +
                    " FROM results) " +
                    "AS pass_percentage, " +

                    "(SELECT " +
                    "   COALESCE(MAX(percentage), 0) " +
                    " FROM results) " +
                    "AS highest_score";


            int totalStudents = 0;

            int totalExams = 0;

            double passPercentage = 0;

            double highestScore = 0;


            try (
                    PreparedStatement statement =
                            connection.prepareStatement(
                                    summarySQL
                            );

                    ResultSet rs =
                            statement.executeQuery()
            ) {


                if (rs.next()) {

                    totalStudents =
                            rs.getInt(
                                    "total_students"
                            );


                    totalExams =
                            rs.getInt(
                                    "total_exams"
                            );


                    passPercentage =
                            rs.getDouble(
                                    "pass_percentage"
                            );


                    highestScore =
                            rs.getDouble(
                                    "highest_score"
                            );

                }

            }


            /* =====================================================
               JSON START
               ===================================================== */

            StringBuilder json =
                    new StringBuilder();


            json.append("{");


            /* =====================================================
               SUMMARY
               ===================================================== */

            json.append("\"summary\":{");


            json.append("\"totalStudents\":")
                    .append(totalStudents)
                    .append(",");


            json.append("\"totalExams\":")
                    .append(totalExams)
                    .append(",");


            json.append("\"passPercentage\":")
                    .append(passPercentage)
                    .append(",");


            json.append("\"highestScore\":")
                    .append(highestScore);


            json.append("},");


            /* =====================================================
               STUDENT PERFORMANCE
               ===================================================== */

            json.append(
                    "\"studentPerformance\":["
            );


            String studentPerformanceSQL =
                    "SELECT " +
                    "s.student_id, " +
                    "s.full_name, " +
                    "COUNT(r.result_id) AS exams_taken, " +
                    "ROUND(AVG(r.percentage), 2) AS average_percentage, " +
                    "MAX(r.percentage) AS highest_percentage, " +
                    "SUM( " +
                    "   CASE " +
                    "       WHEN LOWER(r.status) = 'pass' " +
                    "       THEN 1 ELSE 0 " +
                    "   END " +
                    ") AS passed_exams " +
                    "FROM students s " +
                    "LEFT JOIN results r " +
                    "ON s.student_id = r.student_id " +
                    "GROUP BY " +
                    "s.student_id, " +
                    "s.full_name " +
                    "ORDER BY average_percentage DESC";


            try (
                    PreparedStatement statement =
                            connection.prepareStatement(
                                    studentPerformanceSQL
                            );

                    ResultSet rs =
                            statement.executeQuery()
            ) {


                boolean first = true;


                while (rs.next()) {

                    if (!first) {

                        json.append(",");

                    }

                    first = false;


                    json.append("{");


                    json.append("\"studentId\":")
                            .append(
                                    rs.getInt(
                                            "student_id"
                                    )
                            )
                            .append(",");


                    json.append("\"studentName\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "full_name"
                                            )
                                    )
                            )
                            .append("\",");


                    json.append("\"examsTaken\":")
                            .append(
                                    rs.getInt(
                                            "exams_taken"
                                    )
                            )
                            .append(",");


                    json.append("\"averagePercentage\":")
                            .append(
                                    rs.getDouble(
                                            "average_percentage"
                                    )
                            )
                            .append(",");


                    json.append("\"highestPercentage\":")
                            .append(
                                    rs.getDouble(
                                            "highest_percentage"
                                    )
                            )
                            .append(",");


                    json.append("\"passedExams\":")
                            .append(
                                    rs.getInt(
                                            "passed_exams"
                                    )
                            );


                    json.append("}");

                }

            }


            json.append("],");


            /* =====================================================
               SUBJECT-WISE ANALYSIS
               ===================================================== */

            json.append(
                    "\"subjectAnalysis\":["
            );


            String subjectSQL =
                    "SELECT " +
                    "sub.subject_id, " +
                    "sub.subject_name, " +
                    "COUNT(r.result_id) AS attempts, " +
                    "ROUND(AVG(r.percentage), 2) AS average_percentage, " +
                    "MAX(r.percentage) AS highest_percentage, " +
                    "SUM( " +
                    "   CASE " +
                    "       WHEN LOWER(r.status) = 'pass' " +
                    "       THEN 1 ELSE 0 " +
                    "   END " +
                    ") AS passed " +
                    "FROM subjects sub " +
                    "LEFT JOIN exams e " +
                    "ON sub.subject_id = e.subject_id " +
                    "LEFT JOIN results r " +
                    "ON e.exam_id = r.exam_id " +
                    "GROUP BY " +
                    "sub.subject_id, " +
                    "sub.subject_name " +
                    "ORDER BY average_percentage DESC";


            try (
                    PreparedStatement statement =
                            connection.prepareStatement(
                                    subjectSQL
                            );

                    ResultSet rs =
                            statement.executeQuery()
            ) {


                boolean first = true;


                while (rs.next()) {

                    if (!first) {

                        json.append(",");

                    }

                    first = false;


                    json.append("{");


                    json.append("\"subjectId\":")
                            .append(
                                    rs.getInt(
                                            "subject_id"
                                    )
                            )
                            .append(",");


                    json.append("\"subjectName\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "subject_name"
                                            )
                                    )
                            )
                            .append("\",");


                    json.append("\"attempts\":")
                            .append(
                                    rs.getInt(
                                            "attempts"
                                    )
                            )
                            .append(",");


                    json.append("\"averagePercentage\":")
                            .append(
                                    rs.getDouble(
                                            "average_percentage"
                                    )
                            )
                            .append(",");


                    json.append("\"highestPercentage\":")
                            .append(
                                    rs.getDouble(
                                            "highest_percentage"
                                    )
                            )
                            .append(",");


                    json.append("\"passed\":")
                            .append(
                                    rs.getInt(
                                            "passed"
                                    )
                            );


                    json.append("}");

                }

            }


            json.append("],");


            /* =====================================================
               EXAM STATISTICS
               ===================================================== */

            json.append(
                    "\"examStatistics\":["
            );


            String examSQL =
                    "SELECT " +
                    "e.exam_id, " +
                    "e.exam_title, " +
                    "sub.subject_name, " +
                    "e.total_marks, " +
                    "COUNT(r.result_id) AS attempts, " +
                    "ROUND(AVG(r.percentage), 2) AS average_percentage, " +
                    "MAX(r.percentage) AS highest_percentage " +
                    "FROM exams e " +
                    "LEFT JOIN subjects sub " +
                    "ON e.subject_id = sub.subject_id " +
                    "LEFT JOIN results r " +
                    "ON e.exam_id = r.exam_id " +
                    "GROUP BY " +
                    "e.exam_id, " +
                    "e.exam_title, " +
                    "sub.subject_name, " +
                    "e.total_marks " +
                    "ORDER BY e.exam_id DESC";


            try (
                    PreparedStatement statement =
                            connection.prepareStatement(
                                    examSQL
                            );

                    ResultSet rs =
                            statement.executeQuery()
            ) {


                boolean first = true;


                while (rs.next()) {

                    if (!first) {

                        json.append(",");

                    }

                    first = false;


                    json.append("{");


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


                    json.append("\"subjectName\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "subject_name"
                                            )
                                    )
                            )
                            .append("\",");


                    json.append("\"totalMarks\":")
                            .append(
                                    rs.getInt(
                                            "total_marks"
                                    )
                            )
                            .append(",");


                    json.append("\"attempts\":")
                            .append(
                                    rs.getInt(
                                            "attempts"
                                    )
                            )
                            .append(",");


                    json.append("\"averagePercentage\":")
                            .append(
                                    rs.getDouble(
                                            "average_percentage"
                                    )
                            )
                            .append(",");


                    json.append("\"highestPercentage\":")
                            .append(
                                    rs.getDouble(
                                            "highest_percentage"
                                    )
                            );


                    json.append("}");

                }

            }


            json.append("],");


            /* =====================================================
               MONTHLY PERFORMANCE
               ===================================================== */

            json.append(
                    "\"monthlyPerformance\":["
            );


            String monthlySQL =
                    "SELECT " +
                    "DATE_FORMAT(submitted_at, '%Y-%m') AS month, " +
                    "COUNT(*) AS attempts, " +
                    "ROUND(AVG(percentage), 2) AS average_percentage, " +
                    "SUM( " +
                    "   CASE " +
                    "       WHEN LOWER(status) = 'pass' " +
                    "       THEN 1 ELSE 0 " +
                    "   END " +
                    ") AS passed " +
                    "FROM results " +
                    "GROUP BY DATE_FORMAT(submitted_at, '%Y-%m') " +
                    "ORDER BY month ASC";


            try (
                    PreparedStatement statement =
                            connection.prepareStatement(
                                    monthlySQL
                            );

                    ResultSet rs =
                            statement.executeQuery()
            ) {


                boolean first = true;


                while (rs.next()) {

                    if (!first) {

                        json.append(",");

                    }

                    first = false;


                    json.append("{");


                    json.append("\"month\":\"")
                            .append(
                                    escapeJson(
                                            rs.getString(
                                                    "month"
                                            )
                                    )
                            )
                            .append("\",");


                    json.append("\"attempts\":")
                            .append(
                                    rs.getInt(
                                            "attempts"
                                    )
                            )
                            .append(",");


                    json.append("\"averagePercentage\":")
                            .append(
                                    rs.getDouble(
                                            "average_percentage"
                                    )
                            )
                            .append(",");


                    json.append("\"passed\":")
                            .append(
                                    rs.getInt(
                                            "passed"
                                    )
                            );


                    json.append("}");

                }

            }


            json.append("]");


            /* =====================================================
               JSON END
               ===================================================== */

            json.append("}");


            response.getWriter().print(
                    json.toString()
            );


        } catch (Exception e) {

            e.printStackTrace();


            response.setStatus(
                    HttpServletResponse
                            .SC_INTERNAL_SERVER_ERROR
            );


            response.setContentType(
                    "application/json;charset=UTF-8"
            );


            response.getWriter().print(
                    "{\"error\":\"Unable to load reports\"}"
            );


        } finally {

            if (connection != null) {

                try {

                    connection.close();

                } catch (Exception ignored) {

                }

            }

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