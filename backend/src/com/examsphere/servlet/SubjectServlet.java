 package com.examsphere.servlet;

import java.io.IOException;
import java.util.List;

import com.examsphere.dao.SubjectDAO;
import com.examsphere.model.Subject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/subject")
public class SubjectServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private SubjectDAO subjectDAO =
            new SubjectDAO();


    /* =====================================================
       GET
       LOAD ALL SUBJECTS
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

        try {

            List<Subject> subjects =
                    subjectDAO.getAllSubjects();


            StringBuilder json =
                    new StringBuilder();


            json.append("{");
            json.append("\"success\":true,");
            json.append("\"subjects\":[");


            for (
                    int i = 0;
                    i < subjects.size();
                    i++
            ) {

                Subject subject =
                        subjects.get(i);


                if (i > 0) {
                    json.append(",");
                }


                json.append("{");


                json.append("\"subjectId\":")
                        .append(
                                subject.getSubjectId()
                        )
                        .append(",");


                json.append("\"subjectCode\":\"")
                        .append(
                                escapeJson(
                                        subject.getSubjectCode()
                                )
                        )
                        .append("\",");


                json.append("\"subjectName\":\"")
                        .append(
                                escapeJson(
                                        subject.getSubjectName()
                                )
                        )
                        .append("\",");


                json.append("\"facultyName\":\"")
                        .append(
                                escapeJson(
                                        subject.getFacultyName()
                                )
                        )
                        .append("\",");


                json.append("\"semester\":")
                        .append(
                                subject.getSemester()
                        )
                        .append(",");


                json.append("\"credits\":")
                        .append(
                                subject.getCredits()
                        )
                        .append(",");


                json.append("\"status\":\"")
                        .append(
                                escapeJson(
                                        subject.getStatus()
                                )
                        )
                        .append("\"");


                json.append("}");
            }


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


            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_INTERNAL_SERVER_ERROR,
                    "Unable to load subjects."
            );
        }
    }


    /* =====================================================
       POST
       ADD / UPDATE / DELETE
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


        try {

            /* =============================================
               GET ACTION
            ============================================= */

            String action =
                    request.getParameter(
                            "action"
                    );


            if (
                    action == null ||
                    action.trim().isEmpty()
            ) {

                sendJsonError(
                        response,
                        HttpServletResponse
                                .SC_BAD_REQUEST,
                        "Action is missing."
                );

                return;
            }


            action =
                    action.trim()
                           .toLowerCase();


            System.out.println(
                    "SubjectServlet Action: "
                            + action
            );


            /* =============================================
               DELETE
            ============================================= */

            if (
                    action.equals("delete")
            ) {

                deleteSubject(
                        request,
                        response
                );

                return;
            }


            /* =============================================
               ADD / UPDATE
            ============================================= */

            if (
                    action.equals("add") ||
                    action.equals("update")
            ) {

                saveSubject(
                        request,
                        response,
                        action
                );

                return;
            }


            /* =============================================
               INVALID ACTION
            ============================================= */

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Invalid subject action."
            );


        } catch (Exception e) {

            e.printStackTrace();


            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_INTERNAL_SERVER_ERROR,
                    "Server error while processing subject."
            );
        }
    }


    /* =====================================================
       ADD / UPDATE SUBJECT
    ===================================================== */

    private void saveSubject(
            HttpServletRequest request,
            HttpServletResponse response,
            String action)
            throws IOException {


        /* =============================================
           GET PARAMETERS
        ============================================= */

        String subjectCode =
                request.getParameter(
                        "subjectCode"
                );


        String subjectName =
                request.getParameter(
                        "subjectName"
                );


        String facultyName =
                request.getParameter(
                        "facultyName"
                );


        String semesterValue =
                request.getParameter(
                        "semester"
                );


        String creditsValue =
                request.getParameter(
                        "credits"
                );


        String status =
                request.getParameter(
                        "status"
                );


        /* =============================================
           VALIDATION
        ============================================= */

        if (
                subjectCode == null ||
                subjectCode.trim().isEmpty()
        ) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Subject code is required."
            );

            return;
        }


        if (
                subjectName == null ||
                subjectName.trim().isEmpty()
        ) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Subject name is required."
            );

            return;
        }


        if (
                facultyName == null ||
                facultyName.trim().isEmpty()
        ) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Faculty name is required."
            );

            return;
        }


        if (
                semesterValue == null ||
                semesterValue.trim().isEmpty()
        ) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Semester is required."
            );

            return;
        }


        if (
                creditsValue == null ||
                creditsValue.trim().isEmpty()
        ) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Credits are required."
            );

            return;
        }


        /* =============================================
           CONVERT SEMESTER
        ============================================= */

        int semester =
                convertSemester(
                        semesterValue
                );


        if (semester <= 0) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Invalid semester."
            );

            return;
        }


        /* =============================================
           CONVERT CREDITS
        ============================================= */

        int credits;


        try {

            credits =
                    Integer.parseInt(
                            creditsValue.trim()
                    );


        } catch (
                NumberFormatException e
        ) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Credits must be a number."
            );

            return;
        }


        if (
                credits < 1 ||
                credits > 10
        ) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Credits must be between 1 and 10."
            );

            return;
        }


        /* =============================================
           CREATE SUBJECT OBJECT
        ============================================= */

        Subject subject =
                new Subject();


        subject.setSubjectCode(
                subjectCode.trim()
        );


        subject.setSubjectName(
                subjectName.trim()
        );


        subject.setFacultyName(
                facultyName.trim()
        );


        subject.setSemester(
                semester
        );


        subject.setCredits(
                credits
        );


        if (
                status == null ||
                status.trim().isEmpty()
        ) {

            subject.setStatus(
                    "Active"
            );

        } else {

            subject.setStatus(
                    status.trim()
            );
        }


        /* =============================================
           ADD SUBJECT
        ============================================= */

        if (
                action.equals("add")
        ) {

            boolean added =
                    subjectDAO.addSubject(
                            subject
                    );


            if (added) {

                sendJsonSuccess(
                        response,
                        "Subject added successfully."
                );

            } else {

                sendJsonError(
                        response,
                        HttpServletResponse
                                .SC_BAD_REQUEST,
                        "Failed to add subject. Subject code may already exist."
                );
            }


            return;
        }


        /* =============================================
           UPDATE SUBJECT
        ============================================= */

        if (
                action.equals("update")
        ) {

            boolean updated =
                    subjectDAO.updateSubject(
                            subject
                    );


            if (updated) {

                sendJsonSuccess(
                        response,
                        "Subject updated successfully."
                );

            } else {

                sendJsonError(
                        response,
                        HttpServletResponse
                                .SC_BAD_REQUEST,
                        "Failed to update subject."
                );
            }


            return;
        }
    }


    /* =====================================================
       DELETE SUBJECT
    ===================================================== */

    private void deleteSubject(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {


        String subjectCode =
                request.getParameter(
                        "subjectCode"
                );


        /* =============================================
           VALIDATE SUBJECT CODE
        ============================================= */

        if (
                subjectCode == null ||
                subjectCode.trim().isEmpty()
        ) {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Subject code is required for deletion."
            );

            return;
        }


        System.out.println(
                "Deleting Subject: "
                        + subjectCode
        );


        /* =============================================
           DELETE FROM DATABASE
        ============================================= */

        boolean deleted =
                subjectDAO.deleteSubject(
                        subjectCode.trim()
                );


        if (deleted) {

            sendJsonSuccess(
                    response,
                    "Subject deleted successfully."
            );

        } else {

            sendJsonError(
                    response,
                    HttpServletResponse
                            .SC_BAD_REQUEST,
                    "Failed to delete subject."
            );
        }
    }


    /* =====================================================
       SEMESTER CONVERSION
    ===================================================== */

    private int convertSemester(
            String value) {

        if (value == null) {
            return -1;
        }


        String semester =
                value.trim()
                        .toUpperCase();


        switch (semester) {

            case "1":
            case "I":
                return 1;


            case "2":
            case "II":
                return 2;


            case "3":
            case "III":
                return 3;


            case "4":
            case "IV":
                return 4;


            case "5":
            case "V":
                return 5;


            case "6":
            case "VI":
                return 6;


            case "7":
            case "VII":
                return 7;


            case "8":
            case "VIII":
                return 8;


            default:
                return -1;
        }
    }


    /* =====================================================
       JSON SUCCESS
    ===================================================== */

    private void sendJsonSuccess(
            HttpServletResponse response,
            String message)
            throws IOException {

        response.setStatus(
                HttpServletResponse.SC_OK
        );


        response.getWriter().write(
                "{"
                + "\"success\":true,"
                + "\"message\":\""
                + escapeJson(message)
                + "\""
                + "}"
        );
    }


    /* =====================================================
       JSON ERROR
    ===================================================== */

    private void sendJsonError(
            HttpServletResponse response,
            int statusCode,
            String message)
            throws IOException {

        response.setStatus(
                statusCode
        );


        response.getWriter().write(
                "{"
                + "\"success\":false,"
                + "\"message\":\""
                + escapeJson(message)
                + "\""
                + "}"
        );
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