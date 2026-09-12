package com.examsphere.servlet;

import java.io.BufferedReader;
import java.io.IOException;

import com.examsphere.dao.StudentDAO;
import com.examsphere.model.Student;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/updateStudent")
public class UpdateStudentServlet extends HttpServlet {

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

            String json = readRequestBody(request);

            String idValue = getNumberValue(json, "studentId");

            String fullName = getStringValue(json, "fullName");
            String registerNumber = getStringValue(json, "registerNumber");
            String email = getStringValue(json, "email");
            String phone = getStringValue(json, "phone");
            String department = getStringValue(json, "department");
            String yearValue = getNumberValue(json, "yearOfStudy");
            String status = getStringValue(json, "status");

            if (
                idValue.isEmpty() ||
                fullName.isEmpty() ||
                registerNumber.isEmpty() ||
                email.isEmpty() ||
                phone.isEmpty() ||
                department.isEmpty() ||
                yearValue.isEmpty() ||
                status.isEmpty()
            ) {

                response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write(
                    "{\"success\":false,\"message\":\"All fields are required.\"}"
                );

                return;
            }

            int studentId;
            int yearOfStudy;

            try {

                studentId = Integer.parseInt(idValue);
                yearOfStudy = Integer.parseInt(yearValue);

            } catch (NumberFormatException e) {

                response.setStatus(
                    HttpServletResponse.SC_BAD_REQUEST
                );

                response.getWriter().write(
                    "{\"success\":false,\"message\":\"Invalid student ID or year.\"}"
                );

                return;
            }

            Student student = new Student();

            student.setStudentId(studentId);
            student.setFullName(fullName);
            student.setRegisterNumber(registerNumber);
            student.setEmail(email);
            student.setPhone(phone);
            student.setDepartment(department);
            student.setYearOfStudy(yearOfStudy);
            student.setStatus(status);

            boolean success =
                studentDAO.updateStudent(student);

            if (success) {

                response.getWriter().write(
                    "{\"success\":true,\"message\":\"Student updated successfully.\"}"
                );

            } else {

                response.setStatus(
                    HttpServletResponse.SC_NOT_FOUND
                );

                response.getWriter().write(
                    "{\"success\":false,\"message\":\"Student not found or update failed.\"}"
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().write(
                "{\"success\":false,\"message\":\"Server error while updating student.\"}"
            );
        }
    }


    private String readRequestBody(
            HttpServletRequest request)
            throws IOException {

        StringBuilder body = new StringBuilder();

        BufferedReader reader =
                request.getReader();

        String line;

        while ((line = reader.readLine()) != null) {
            body.append(line);
        }

        return body.toString();
    }


    private String getStringValue(
            String json,
            String key) {

        String pattern =
                "\"" + key + "\"\\s*:\\s*\"";

        java.util.regex.Pattern regex =
                java.util.regex.Pattern.compile(pattern);

        java.util.regex.Matcher matcher =
                regex.matcher(json);

        if (matcher.find()) {

            int start = matcher.end();

            int end =
                    json.indexOf("\"", start);

            if (end != -1) {
                return json.substring(start, end);
            }
        }

        return "";
    }


    private String getNumberValue(
            String json,
            String key) {

        String pattern =
                "\"" + key + "\"\\s*:\\s*(\\d+)";

        java.util.regex.Pattern regex =
                java.util.regex.Pattern.compile(pattern);

        java.util.regex.Matcher matcher =
                regex.matcher(json);

        if (matcher.find()) {
            return matcher.group(1);
        }

        return "";
    }
}