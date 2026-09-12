package com.examsphere.servlet;

import java.io.IOException;

import com.examsphere.dao.StudentDAO;
import com.examsphere.model.Student;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/studentLogin")
public class StudentLoginServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private StudentDAO studentDAO = new StudentDAO();

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String email =
                request.getParameter("email");

        String password =
                request.getParameter("password");


        System.out.println(
                "Student Login Request"
        );

        System.out.println(
                "Email: " + email
        );


        Student student =
                studentDAO.loginStudent(
                        email,
                        password
                );


        if (student != null) {

            System.out.println(
                    "LOGIN SUCCESS"
            );


            HttpSession session =
                    request.getSession(true);


            session.setAttribute(
                    "student",
                    student
            );


            response.sendRedirect(
                    request.getContextPath()
                    + "/student/student-dashboard.html"
            );


        } else {

            System.out.println(
                    "LOGIN FAILED"
            );


            response.sendRedirect(
                    request.getContextPath()
                    + "/auth/login.html?error=true"
            );

        }

    }

}