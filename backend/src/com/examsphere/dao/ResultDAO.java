package com.examsphere.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.examsphere.config.DBConnection;
import com.examsphere.model.Result;

public class ResultDAO {

    public boolean saveResult(Result result) {

        boolean status = false;

        String sql = "INSERT INTO results(student_id, exam_id, total_questions, correct_answers, wrong_answers, score, percentage, grade, status) VALUES(?,?,?,?,?,?,?,?,?)";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(sql);

            ps.setInt(1, result.getStudentId());
            ps.setInt(2, result.getExamId());
            ps.setInt(3, result.getTotalQuestions());
            ps.setInt(4, result.getCorrectAnswers());
            ps.setInt(5, result.getWrongAnswers());
            ps.setDouble(6, result.getScore());
            ps.setDouble(7, result.getPercentage());
            ps.setString(8, result.getGrade());
            ps.setString(9, result.getStatus());

            status = ps.executeUpdate() > 0;

        } catch (Exception e) {

            e.printStackTrace();

        }

        return status;

    }

    public List<Result> getAllResults() {

        List<Result> resultList = new ArrayList<>();

        String sql = "SELECT * FROM results";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(sql);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                Result result = new Result();

                result.setResultId(rs.getInt("result_id"));
                result.setStudentId(rs.getInt("student_id"));
                result.setExamId(rs.getInt("exam_id"));
                result.setTotalQuestions(rs.getInt("total_questions"));
                result.setCorrectAnswers(rs.getInt("correct_answers"));
                result.setWrongAnswers(rs.getInt("wrong_answers"));
                result.setScore(rs.getDouble("score"));
                result.setPercentage(rs.getDouble("percentage"));
                result.setGrade(rs.getString("grade"));
                result.setStatus(rs.getString("status"));
                result.setSubmittedAt(rs.getTimestamp("submitted_at"));

                resultList.add(result);

            }

        } catch (Exception e) {

            e.printStackTrace();

        }

        return resultList;

    }

}