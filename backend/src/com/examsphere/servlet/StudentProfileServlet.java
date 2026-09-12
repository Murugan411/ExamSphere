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

@WebServlet("/studentProfile")
public class StudentProfileServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private StudentDAO studentDAO = new StudentDAO();


    /* =====================================================
       GET PROFILE
    ===================================================== */

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType(
                "application/json"
        );

        response.setCharacterEncoding(
                "UTF-8"
        );


        HttpSession session =
                request.getSession(false);


        /*
         * Check login session.
         */

        if (session == null) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Session expired. Please login again.\"}"
            );

            return;
        }


        /*
         * Get student object created
         * during login.
         */

        Student student =
                (Student) session.getAttribute(
                        "student"
                );


        if (student == null) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Student session not found.\"}"
            );

            return;
        }


        /*
         * Return student details.
         */

        String json =
                "{"
                + "\"success\":true,"
                + "\"studentId\":\""
                + escapeJson(
                        String.valueOf(
                                student.getStudentId()
                        )
                  )
                + "\","
                + "\"fullName\":\""
                + escapeJson(
                        student.getFullName()
                  )
                + "\","
                + "\"email\":\""
                + escapeJson(
                        student.getEmail()
                  )
                + "\","
                + "\"phone\":\""
                + escapeJson(
                        student.getPhone()
                  )
                + "\","
                + "\"registerNumber\":\""
                + escapeJson(
                        student.getRegisterNumber()
                  )
                + "\","
                + "\"department\":\""
                + escapeJson(
                        student.getDepartment()
                  )
                + "\","
                + "\"yearOfStudy\":\""
                + escapeJson(
                        String.valueOf(
                                student.getYearOfStudy()
                        )
                  )
                + "\""
                + "}";


        response.setStatus(
                HttpServletResponse.SC_OK
        );

        response.getWriter().write(
                json
        );
    }


    /* =====================================================
       UPDATE PROFILE
    ===================================================== */

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType(
                "application/json"
        );

        response.setCharacterEncoding(
                "UTF-8"
        );


        HttpSession session =
                request.getSession(false);


        /*
         * Check session.
         */

        if (session == null) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Session expired. Please login again.\"}"
            );

            return;
        }


        /*
         * Get logged-in student.
         */

        Student student =
                (Student) session.getAttribute(
                        "student"
                );


        if (student == null) {

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Student session not found.\"}"
            );

            return;
        }


        /*
         * Get updated values.
         */

        String fullName =
                request.getParameter(
                        "fullName"
                );

        String email =
                request.getParameter(
                        "email"
                );

        String phone =
                request.getParameter(
                        "phone"
                );

        String registerNumber =
                request.getParameter(
                        "registerNumber"
                );

        String department =
                request.getParameter(
                        "department"
                );

        String yearOfStudyValue =
                request.getParameter(
                        "yearOfStudy"
                );


        /*
         * Basic validation.
         */

        if (
                fullName == null ||
                fullName.trim().isEmpty() ||

                email == null ||
                email.trim().isEmpty()
        ) {

            response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Name and email are required.\"}"
            );

            return;
        }


        int yearOfStudy;

        try {

            yearOfStudy =
                    Integer.parseInt(
                            yearOfStudyValue
                    );

        } catch (Exception e) {

            /*
             * Keep existing year if
             * the submitted value is invalid.
             */

            yearOfStudy =
                    student.getYearOfStudy();
        }


        /*
         * Update Student object.
         */

        student.setFullName(
                fullName.trim()
        );

        student.setEmail(
                email.trim()
        );

        student.setPhone(
                phone == null
                        ? ""
                        : phone.trim()
        );

        student.setRegisterNumber(
                registerNumber == null
                        ? ""
                        : registerNumber.trim()
        );

        student.setDepartment(
                department == null
                        ? ""
                        : department.trim()
        );

        student.setYearOfStudy(
                yearOfStudy
        );


        /*
         * Save to database.
         *
         * Existing StudentDAO method:
         * updateStudent(Student student)
         */

        boolean updated =
                studentDAO.updateStudent(
                        student
                );


        if (updated) {

            /*
             * Update the same session object.
             */

            session.setAttribute(
                    "student",
                    student
            );


            System.out.println(
                    "================================"
            );

            System.out.println(
                    "STUDENT PROFILE UPDATED"
            );

            System.out.println(
                    "Student ID: "
                    + student.getStudentId()
            );

            System.out.println(
                    "Name: "
                    + student.getFullName()
            );

            System.out.println(
                    "Email: "
                    + student.getEmail()
            );

            System.out.println(
                    "================================"
            );


            response.setStatus(
                    HttpServletResponse.SC_OK
            );

            response.getWriter().write(
                    "{\"success\":true,\"message\":\"Profile updated successfully.\"}"
            );

        } else {

            response.setStatus(
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Unable to update profile.\"}"
            );
        }

    }


    /* =====================================================
       JSON ESCAPE
    ===================================================== */

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