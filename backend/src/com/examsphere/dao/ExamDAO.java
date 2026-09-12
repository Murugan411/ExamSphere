 package com.examsphere.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.examsphere.config.DBConnection;
import com.examsphere.model.Exam;

public class ExamDAO {

    // =========================================================
    // ADD EXAM
    // =========================================================

    public boolean addExam(Exam exam) {

        boolean status = false;

        String sql =
                "INSERT INTO exams " +
                "(exam_code, exam_title, subject_id, duration_minutes, " +
                "total_marks, passing_marks, exam_date, exam_time, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {

            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    connection.prepareStatement(sql);

            ps.setString(
                    1,
                    exam.getExamCode()
            );

            ps.setString(
                    2,
                    exam.getExamTitle()
            );

            ps.setInt(
                    3,
                    exam.getSubjectId()
            );

            ps.setInt(
                    4,
                    exam.getDurationMinutes()
            );

            ps.setInt(
                    5,
                    exam.getTotalMarks()
            );

            ps.setInt(
                    6,
                    exam.getPassingMarks()
            );

            ps.setDate(
                    7,
                    exam.getExamDate()
            );

            ps.setTime(
                    8,
                    exam.getExamTime()
            );

            ps.setString(
                    9,
                    exam.getStatus()
            );

            status =
                    ps.executeUpdate() > 0;

            ps.close();
            connection.close();

        } catch (Exception e) {

            e.printStackTrace();

        }

        return status;
    }


    // =========================================================
    // GET ALL EXAMS
    // =========================================================

    public List<Exam> getAllExams() {

        List<Exam> examList =
                new ArrayList<>();

        String sql =
                "SELECT * FROM exams ORDER BY exam_id DESC";

        try {

            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    connection.prepareStatement(sql);

            ResultSet rs =
                    ps.executeQuery();

            while (rs.next()) {

                Exam exam =
                        new Exam();

                exam.setExamId(
                        rs.getInt("exam_id")
                );

                exam.setExamCode(
                        rs.getString("exam_code")
                );

                exam.setExamTitle(
                        rs.getString("exam_title")
                );

                exam.setSubjectId(
                        rs.getInt("subject_id")
                );

                exam.setDurationMinutes(
                        rs.getInt("duration_minutes")
                );

                exam.setTotalMarks(
                        rs.getInt("total_marks")
                );

                exam.setPassingMarks(
                        rs.getInt("passing_marks")
                );

                exam.setExamDate(
                        rs.getDate("exam_date")
                );

                exam.setExamTime(
                        rs.getTime("exam_time")
                );

                exam.setStatus(
                        rs.getString("status")
                );

                examList.add(exam);
            }

            rs.close();
            ps.close();
            connection.close();

        } catch (Exception e) {

            e.printStackTrace();

        }

        return examList;
    }


    // =========================================================
    // UPDATE EXAM
    // =========================================================

    public boolean updateExam(Exam exam) {

        boolean status = false;

        String sql =
                "UPDATE exams SET " +
                "exam_code = ?, " +
                "exam_title = ?, " +
                "subject_id = ?, " +
                "duration_minutes = ?, " +
                "total_marks = ?, " +
                "passing_marks = ?, " +
                "exam_date = ?, " +
                "exam_time = ?, " +
                "status = ? " +
                "WHERE exam_id = ?";

        try {

            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    connection.prepareStatement(sql);

            ps.setString(
                    1,
                    exam.getExamCode()
            );

            ps.setString(
                    2,
                    exam.getExamTitle()
            );

            ps.setInt(
                    3,
                    exam.getSubjectId()
            );

            ps.setInt(
                    4,
                    exam.getDurationMinutes()
            );

            ps.setInt(
                    5,
                    exam.getTotalMarks()
            );

            ps.setInt(
                    6,
                    exam.getPassingMarks()
            );

            ps.setDate(
                    7,
                    exam.getExamDate()
            );

            ps.setTime(
                    8,
                    exam.getExamTime()
            );

            ps.setString(
                    9,
                    exam.getStatus()
            );

            ps.setInt(
                    10,
                    exam.getExamId()
            );

            status =
                    ps.executeUpdate() > 0;

            ps.close();
            connection.close();

        } catch (Exception e) {

            // =================================================
            // UPDATE ERROR DETAILS
            // =================================================

            System.out.println(
                    "========== UPDATE EXAM ERROR =========="
            );

            System.out.println(
                    "Exam ID: "
                    + exam.getExamId()
            );

            System.out.println(
                    "Exam Code: "
                    + exam.getExamCode()
            );

            System.out.println(
                    "Exam Title: "
                    + exam.getExamTitle()
            );

            System.out.println(
                    "Subject ID: "
                    + exam.getSubjectId()
            );

            System.out.println(
                    "Error: "
                    + e.getMessage()
            );

            e.printStackTrace();

            System.out.println(
                    "======================================="
            );
        }

        return status;
    }


    // =========================================================
    // DELETE EXAM
    // =========================================================

    public boolean deleteExam(int examId) {

        boolean status = false;

        String sql =
                "DELETE FROM exams WHERE exam_id = ?";

        try {

            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    connection.prepareStatement(sql);

            ps.setInt(
                    1,
                    examId
            );

            status =
                    ps.executeUpdate() > 0;

            ps.close();
            connection.close();

        } catch (Exception e) {

            e.printStackTrace();

        }

        return status;
    }

}