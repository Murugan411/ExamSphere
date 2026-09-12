package com.examsphere.dao;

import com.examsphere.config.DBConnection;
import com.examsphere.model.ExamQuestion;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ExamQuestionDAO {

    // =========================================================
    // ADD QUESTION TO EXAM
    // =========================================================

    public boolean addExamQuestion(ExamQuestion examQuestion) {

        String checkSql =
                "SELECT COUNT(*) " +
                "FROM exam_questions " +
                "WHERE exam_id = ? AND question_id = ?";

        String insertSql =
                "INSERT INTO exam_questions " +
                "(exam_id, question_id, question_order, marks) " +
                "VALUES (?, ?, ?, ?)";

        try (Connection connection = DBConnection.getConnection()) {

            // -------------------------------------------------
            // CHECK DUPLICATE
            // -------------------------------------------------

            try (PreparedStatement checkStatement =
                         connection.prepareStatement(checkSql)) {

                checkStatement.setInt(
                        1,
                        examQuestion.getExamId()
                );

                checkStatement.setInt(
                        2,
                        examQuestion.getQuestionId()
                );

                try (ResultSet resultSet =
                             checkStatement.executeQuery()) {

                    if (resultSet.next()
                            && resultSet.getInt(1) > 0) {

                        return false;
                    }
                }
            }

            // -------------------------------------------------
            // INSERT
            // -------------------------------------------------

            try (PreparedStatement statement =
                         connection.prepareStatement(insertSql)) {

                statement.setInt(
                        1,
                        examQuestion.getExamId()
                );

                statement.setInt(
                        2,
                        examQuestion.getQuestionId()
                );

                statement.setInt(
                        3,
                        examQuestion.getQuestionOrder()
                );

                statement.setInt(
                        4,
                        examQuestion.getMarks()
                );

                return statement.executeUpdate() > 0;
            }

        } catch (Exception e) {

            e.printStackTrace();
            return false;
        }
    }


    // =========================================================
    // GET QUESTIONS ASSIGNED TO AN EXAM
    // =========================================================

    public List<ExamQuestion> getQuestionsByExam(int examId) {

        List<ExamQuestion> list =
                new ArrayList<>();

        String sql =
                "SELECT exam_question_id, exam_id, " +
                "question_id, question_order, marks " +
                "FROM exam_questions " +
                "WHERE exam_id = ? " +
                "ORDER BY question_order ASC";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, examId);

            try (ResultSet resultSet =
                         statement.executeQuery()) {

                while (resultSet.next()) {

                    ExamQuestion examQuestion =
                            new ExamQuestion();

                    examQuestion.setExamQuestionId(
                            resultSet.getInt(
                                    "exam_question_id"
                            )
                    );

                    examQuestion.setExamId(
                            resultSet.getInt(
                                    "exam_id"
                            )
                    );

                    examQuestion.setQuestionId(
                            resultSet.getInt(
                                    "question_id"
                            )
                    );

                    examQuestion.setQuestionOrder(
                            resultSet.getInt(
                                    "question_order"
                            )
                    );

                    examQuestion.setMarks(
                            resultSet.getInt(
                                    "marks"
                            )
                    );

                    list.add(examQuestion);
                }
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return list;
    }


    // =========================================================
    // CHECK WHETHER QUESTION IS ALREADY ASSIGNED
    // =========================================================

    public boolean isQuestionAssigned(
            int examId,
            int questionId) {

        String sql =
                "SELECT COUNT(*) " +
                "FROM exam_questions " +
                "WHERE exam_id = ? AND question_id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, examId);
            statement.setInt(2, questionId);

            try (ResultSet resultSet =
                         statement.executeQuery()) {

                if (resultSet.next()) {

                    return resultSet.getInt(1) > 0;
                }
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return false;
    }


    // =========================================================
    // DELETE QUESTION FROM EXAM
    // =========================================================

    public boolean deleteExamQuestion(
            int examQuestionId) {

        String sql =
                "DELETE FROM exam_questions " +
                "WHERE exam_question_id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(
                    1,
                    examQuestionId
            );

            return statement.executeUpdate() > 0;

        } catch (Exception e) {

            e.printStackTrace();
            return false;
        }
    }


    // =========================================================
    // DELETE ALL QUESTIONS FROM AN EXAM
    // =========================================================

    public boolean deleteQuestionsByExam(
            int examId) {

        String sql =
                "DELETE FROM exam_questions " +
                "WHERE exam_id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(1, examId);

            statement.executeUpdate();

            return true;

        } catch (Exception e) {

            e.printStackTrace();
            return false;
        }
    }


    // =========================================================
    // UPDATE QUESTION ORDER AND MARKS
    // =========================================================

    public boolean updateExamQuestion(
            ExamQuestion examQuestion) {

        String sql =
                "UPDATE exam_questions " +
                "SET question_order = ?, marks = ? " +
                "WHERE exam_question_id = ?";

        try (Connection connection = DBConnection.getConnection();
             PreparedStatement statement =
                     connection.prepareStatement(sql)) {

            statement.setInt(
                    1,
                    examQuestion.getQuestionOrder()
            );

            statement.setInt(
                    2,
                    examQuestion.getMarks()
            );

            statement.setInt(
                    3,
                    examQuestion.getExamQuestionId()
            );

            return statement.executeUpdate() > 0;

        } catch (Exception e) {

            e.printStackTrace();
            return false;
        }
    }
}