package com.examsphere.servlet;

import java.io.IOException;

import com.examsphere.dao.StudentDAO;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/deleteStudent")
public class DeleteStudentServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private StudentDAO studentDAO;

    @Override
    public void init() throws ServletException {
        studentDAO = new StudentDAO();
    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {

            String idValue =
                    request.getParameter("studentId");

            if (idValue == null || idValue.trim().isEmpty()) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write(
                        "{\"success\":false,\"message\":\"Student ID is required.\"}"
                );

                return;
            }

            int studentId;

            try {

                studentId =
                        Integer.parseInt(idValue);

            } catch (NumberFormatException e) {

                response.setStatus(
                        HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write(
                        "{\"success\":false,\"message\":\"Invalid student ID.\"}"
                );

                return;
            }

            boolean success =
                    studentDAO.deleteStudent(studentId);

            if (success) {

                response.getWriter().write(
                        "{\"success\":true,\"message\":\"Student deleted successfully.\"}"
                );

            } else {

                response.setStatus(
                        HttpServletResponse.SC_NOT_FOUND
                );

                response.getWriter().write(
                        "{\"success\":false,\"message\":\"Student not found.\"}"
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Server error while deleting student.\"}"
            );
        }
    }
}