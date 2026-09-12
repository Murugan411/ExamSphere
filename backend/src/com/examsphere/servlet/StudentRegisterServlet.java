package com.examsphere.servlet;

import java.io.IOException;

import com.examsphere.dao.StudentDAO;
import com.examsphere.model.Student;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/studentRegister")
public class StudentRegisterServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private StudentDAO studentDAO = new StudentDAO();

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        Student student = new Student();

        student.setFullName(request.getParameter("fullName"));
        student.setEmail(request.getParameter("email"));
        student.setPhone(request.getParameter("phone"));
        student.setRegisterNumber(request.getParameter("registerNumber"));
        student.setDepartment(request.getParameter("department"));
        student.setYearOfStudy(
                Integer.parseInt(request.getParameter("yearOfStudy"))
        );
        student.setPassword(request.getParameter("password"));
        student.setStatus("Active");

        boolean status = studentDAO.registerStudent(student);

        if (status) {

            response.sendRedirect("../frontend/login.html?success=true");

        } else {

            response.sendRedirect("../frontend/register.html?error=true");

        }

    }

}