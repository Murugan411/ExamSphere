package com.examsphere.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

import com.examsphere.dao.ExamDAO;
import com.examsphere.model.Exam;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/examManagement")
public class ExamManagementServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private ExamDAO examDAO;

    @Override
    public void init() throws ServletException {

        examDAO = new ExamDAO();
    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out =
                response.getWriter();

        List<Exam> exams =
                examDAO.getAllExams();

        StringBuilder json =
                new StringBuilder();

        json.append("[");

        for (int i = 0; i < exams.size(); i++) {

            Exam exam = exams.get(i);

            if (i > 0) {
                json.append(",");
            }

            json.append("{");

            json.append("\"examId\":")
                .append(exam.getExamId())
                .append(",");

            json.append("\"examCode\":\"")
                .append(escapeJson(exam.getExamCode()))
                .append("\",");

            json.append("\"examTitle\":\"")
                .append(escapeJson(exam.getExamTitle()))
                .append("\",");

            json.append("\"subjectId\":")
                .append(exam.getSubjectId())
                .append(",");

            json.append("\"durationMinutes\":")
                .append(exam.getDurationMinutes())
                .append(",");

            json.append("\"totalMarks\":")
                .append(exam.getTotalMarks())
                .append(",");

            json.append("\"passingMarks\":")
                .append(exam.getPassingMarks())
                .append(",");

            json.append("\"examDate\":\"")
                .append(
                    exam.getExamDate() != null
                        ? exam.getExamDate().toString()
                        : ""
                )
                .append("\",");

            json.append("\"examTime\":\"")
                .append(
                    exam.getExamTime() != null
                        ? exam.getExamTime().toString()
                        : ""
                )
                .append("\",");

            json.append("\"status\":\"")
                .append(escapeJson(exam.getStatus()))
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