package com.examsphere.servlet;

import java.io.IOException;
import java.util.List;

import com.examsphere.dao.ExamDAO;
import com.examsphere.model.Exam;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/exam")
public class ExamServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private ExamDAO examDAO = new ExamDAO();


    // =====================================================
    // GET
    // Load all exams as JSON
    // =====================================================

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {

            List<Exam> examList =
                    examDAO.getAllExams();

            StringBuilder json =
                    new StringBuilder();

            json.append("[");

            for (int i = 0;
                 i < examList.size();
                 i++) {

                Exam exam =
                        examList.get(i);

                if (i > 0) {
                    json.append(",");
                }

                json.append("{");

                // EXAM ID
                json.append("\"examId\":")
                    .append(exam.getExamId())
                    .append(",");

                // EXAM CODE
                json.append("\"examCode\":\"")
                    .append(
                        escapeJson(
                            exam.getExamCode()
                        )
                    )
                    .append("\",");

                // EXAM TITLE
                json.append("\"examTitle\":\"")
                    .append(
                        escapeJson(
                            exam.getExamTitle()
                        )
                    )
                    .append("\",");

                // SUBJECT ID
                json.append("\"subjectId\":")
                    .append(exam.getSubjectId())
                    .append(",");

                // DURATION
                json.append("\"durationMinutes\":")
                    .append(exam.getDurationMinutes())
                    .append(",");

                // TOTAL MARKS
                json.append("\"totalMarks\":")
                    .append(exam.getTotalMarks())
                    .append(",");

                // PASSING MARKS
                json.append("\"passingMarks\":")
                    .append(exam.getPassingMarks())
                    .append(",");

                // EXAM DATE
                json.append("\"examDate\":\"")
                    .append(
                        escapeJson(
                            exam.getExamDate() == null
                                ? ""
                                : exam.getExamDate().toString()
                        )
                    )
                    .append("\",");

                // EXAM TIME
                json.append("\"examTime\":\"")
                    .append(
                        escapeJson(
                            exam.getExamTime() == null
                                ? ""
                                : exam.getExamTime().toString()
                        )
                    )
                    .append("\",");

                // STATUS
                json.append("\"status\":\"")
                    .append(
                        escapeJson(
                            exam.getStatus()
                        )
                    )
                    .append("\"");

                json.append("}");
            }

            json.append("]");

            response.getWriter().print(
                json.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                HttpServletResponse
                    .SC_INTERNAL_SERVER_ERROR
            );

            response.getWriter().print(
                "{\"error\":\"Unable to load exams\"}"
            );
        }
    }


    // =====================================================
    // POST
    // ADD / UPDATE / DELETE
    // =====================================================

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        String action =
                request.getParameter("action");


        // =================================================
        // DELETE EXAM
        // =================================================

        if ("delete".equalsIgnoreCase(action)) {

            try {

                String examIdParameter =
                        request.getParameter(
                            "examId"
                        );

                if (
                    examIdParameter == null ||
                    examIdParameter.trim().isEmpty()
                ) {

                    response.setStatus(
                        HttpServletResponse
                            .SC_BAD_REQUEST
                    );

                    response.setContentType(
                        "text/plain"
                    );

                    response.getWriter().print(
                        "Exam ID is required."
                    );

                    return;
                }

                int examId =
                        Integer.parseInt(
                            examIdParameter
                        );

                boolean deleted =
                        examDAO.deleteExam(
                            examId
                        );

                response.setContentType(
                    "text/plain"
                );

                response.setCharacterEncoding(
                    "UTF-8"
                );

                if (deleted) {

                    response.getWriter().print(
                        "Exam deleted successfully!"
                    );

                } else {

                    response.setStatus(
                        HttpServletResponse
                            .SC_INTERNAL_SERVER_ERROR
                    );

                    response.getWriter().print(
                        "Unable to delete exam."
                    );
                }

            } catch (NumberFormatException e) {

                response.setStatus(
                    HttpServletResponse
                        .SC_BAD_REQUEST
                );

                response.setContentType(
                    "text/plain"
                );

                response.getWriter().print(
                    "Invalid exam ID."
                );

            } catch (Exception e) {

                e.printStackTrace();

                response.setStatus(
                    HttpServletResponse
                        .SC_INTERNAL_SERVER_ERROR
                );

                response.setContentType(
                    "text/plain"
                );

                response.getWriter().print(
                    "Error deleting exam: "
                    + e.getMessage()
                );
            }

            return;
        }


        // =================================================
        // UPDATE EXAM
        // =================================================

        if ("update".equalsIgnoreCase(action)) {

            try {

                Exam exam =
                        new Exam();


                // EXAM ID
                exam.setExamId(
                    Integer.parseInt(
                        request.getParameter(
                            "examId"
                        )
                    )
                );


                // EXAM CODE
                exam.setExamCode(
                    request.getParameter(
                        "examCode"
                    )
                );


                // EXAM TITLE
                exam.setExamTitle(
                    request.getParameter(
                        "examTitle"
                    )
                );


                // SUBJECT
                exam.setSubjectId(
                    Integer.parseInt(
                        request.getParameter(
                            "subjectId"
                        )
                    )
                );


                // DURATION
                exam.setDurationMinutes(
                    Integer.parseInt(
                        request.getParameter(
                            "duration"
                        )
                    )
                );


                // TOTAL MARKS
                exam.setTotalMarks(
                    Integer.parseInt(
                        request.getParameter(
                            "totalMarks"
                        )
                    )
                );


                // PASSING MARKS
                exam.setPassingMarks(
                    Integer.parseInt(
                        request.getParameter(
                            "passingMarks"
                        )
                    )
                );


                // EXAM DATE
                exam.setExamDate(
                    java.sql.Date.valueOf(
                        request.getParameter(
                            "examDate"
                        )
                    )
                );


                // EXAM TIME
                // FIXED: Supports HH:mm from HTML
                exam.setExamTime(
                    convertExamTime(
                        request.getParameter(
                            "examTime"
                        )
                    )
                );


                // STATUS
                String status =
                        request.getParameter(
                            "status"
                        );

                if (
                    status == null ||
                    status.trim().isEmpty()
                ) {

                    status = "Active";
                }

                exam.setStatus(status);


                // UPDATE DATABASE
                boolean updated =
                        examDAO.updateExam(
                            exam
                        );

                response.setContentType(
                    "text/plain"
                );

                response.setCharacterEncoding(
                    "UTF-8"
                );

                if (updated) {

                    response.getWriter().print(
                        "Exam updated successfully!"
                    );

                } else {

                    response.setStatus(
                        HttpServletResponse
                            .SC_INTERNAL_SERVER_ERROR
                    );

                    response.getWriter().print(
                        "Unable to update exam."
                    );
                }


            } catch (Exception e) {

                e.printStackTrace();

                response.setStatus(
                    HttpServletResponse
                        .SC_INTERNAL_SERVER_ERROR
                );

                response.setContentType(
                    "text/plain"
                );

                response.getWriter().print(
                    "Error updating exam: "
                    + e.getMessage()
                );
            }

            return;
        }


        // =================================================
        // ADD EXAM
        // =================================================

        try {

            Exam exam =
                    new Exam();


            // EXAM CODE
            exam.setExamCode(
                request.getParameter(
                    "examCode"
                )
            );


            // EXAM TITLE
            exam.setExamTitle(
                request.getParameter(
                    "examTitle"
                )
            );


            // SUBJECT
            exam.setSubjectId(
                Integer.parseInt(
                    request.getParameter(
                        "subjectId"
                    )
                )
            );


            // DURATION
            exam.setDurationMinutes(
                Integer.parseInt(
                    request.getParameter(
                        "duration"
                    )
                )
            );


            // TOTAL MARKS
            exam.setTotalMarks(
                Integer.parseInt(
                    request.getParameter(
                        "totalMarks"
                    )
                )
            );


            // PASSING MARKS
            exam.setPassingMarks(
                Integer.parseInt(
                    request.getParameter(
                        "passingMarks"
                    )
                )
            );


            // EXAM DATE
            exam.setExamDate(
                java.sql.Date.valueOf(
                    request.getParameter(
                        "examDate"
                    )
                )
            );


            // EXAM TIME
            // FIXED: Supports HH:mm from HTML
            exam.setExamTime(
                convertExamTime(
                    request.getParameter(
                        "examTime"
                    )
                )
            );


            // STATUS
            String status =
                    request.getParameter(
                        "status"
                    );

            if (
                status == null ||
                status.trim().isEmpty()
            ) {

                status = "Active";
            }

            exam.setStatus(status);


            // ADD TO DATABASE
            boolean added =
                    examDAO.addExam(
                        exam
                    );

            response.setContentType(
                "text/plain"
            );

            response.setCharacterEncoding(
                "UTF-8"
            );

            if (added) {

                response.getWriter().print(
                    "Exam added successfully!"
                );

            } else {

                response.setStatus(
                    HttpServletResponse
                        .SC_INTERNAL_SERVER_ERROR
                );

                response.getWriter().print(
                    "Unable to add exam."
                );
            }


        } catch (Exception e) {

            e.printStackTrace();

            response.setStatus(
                HttpServletResponse
                    .SC_INTERNAL_SERVER_ERROR
            );

            response.setContentType(
                "text/plain"
            );

            response.getWriter().print(
                "Error adding exam: "
                + e.getMessage()
            );
        }
    }


    // =====================================================
    // CONVERT EXAM TIME
    // =====================================================

    private java.sql.Time convertExamTime(
            String timeValue) {

        if (
            timeValue == null ||
            timeValue.trim().isEmpty()
        ) {
            return null;
        }

        String time =
                timeValue.trim();

        /*
         * HTML <input type="time">
         * normally sends HH:mm
         *
         * Example:
         * 15:12
         *
         * java.sql.Time.valueOf()
         * requires:
         * 15:12:00
         */

        if (time.matches("\\d{2}:\\d{2}")) {
            time = time + ":00";
        }

        return java.sql.Time.valueOf(time);
    }


    // =====================================================
    // ESCAPE JSON
    // =====================================================

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