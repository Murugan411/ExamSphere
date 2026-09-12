package com.examsphere.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import com.examsphere.dao.StudentDAO;
import com.examsphere.model.Student;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/studentManagement")
public class StudentManagementServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private StudentDAO studentDAO;

    @Override
    public void init() throws ServletException {

        studentDAO = new StudentDAO();
    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        List<Student> students = studentDAO.getAllStudents();

        StringBuilder json = new StringBuilder();

        json.append("[");

        for (int i = 0; i < students.size(); i++) {

            Student student = students.get(i);

            if (i > 0) {
                json.append(",");
            }

            json.append("{");

            json.append("\"studentId\":")
                .append(student.getStudentId())
                .append(",");

            json.append("\"fullName\":\"")
                .append(escapeJson(student.getFullName()))
                .append("\",");

            json.append("\"email\":\"")
                .append(escapeJson(student.getEmail()))
                .append("\",");

            json.append("\"phone\":\"")
                .append(escapeJson(student.getPhone()))
                .append("\",");

            json.append("\"registerNumber\":\"")
                .append(escapeJson(student.getRegisterNumber()))
                .append("\",");

            json.append("\"department\":\"")
                .append(escapeJson(student.getDepartment()))
                .append("\",");

            json.append("\"yearOfStudy\":")
                .append(student.getYearOfStudy())
                .append(",");

            json.append("\"status\":\"")
                .append(escapeJson(student.getStatus()))
                .append("\"");

            json.append("}");
        }

        json.append("]");

        out.print(json.toString());

        out.flush();
    }

    private String escapeJson(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\r", "\\r")
                .replace("\n", "\\n");
    }
}