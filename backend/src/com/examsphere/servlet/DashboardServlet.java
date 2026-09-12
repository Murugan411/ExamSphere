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

@WebServlet("/dashboardStats")
public class DashboardServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String sql =
                "SELECT " +
                "(SELECT COUNT(*) FROM students) AS total_students, " +
                "(SELECT COUNT(*) FROM subjects) AS total_subjects, " +
                "(SELECT COUNT(*) FROM questions) AS question_bank, " +
                "(SELECT COUNT(*) FROM exams) AS total_exams";

        try (
            Connection connection = DBConnection.getConnection();
            PreparedStatement statement = connection.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery()
        ) {

            if (resultSet.next()) {

                int totalStudents =
                        resultSet.getInt("total_students");

                int totalSubjects =
                        resultSet.getInt("total_subjects");

                int questionBank =
                        resultSet.getInt("question_bank");

                int totalExams =
                        resultSet.getInt("total_exams");

                String json =
                        "{" +
                        "\"totalStudents\":" + totalStudents + "," +
                        "\"totalSubjects\":" + totalSubjects + "," +
                        "\"questionBank\":" + questionBank + "," +
                        "\"totalExams\":" + totalExams +
                        "}";

                response.getWriter().write(json);

            } else {

                response.getWriter().write(
                        "{\"totalStudents\":0," +
                        "\"totalSubjects\":0," +
                        "\"questionBank\":0," +
                        "\"totalExams\":0}"
                );
            }

        } catch (Exception exception) {

            exception.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(
                    "{\"error\":\"Unable to load dashboard statistics\"}"
            );
        }
    }
}