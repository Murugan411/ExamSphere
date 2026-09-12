package com.examsphere.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.examsphere.config.DBConnection;
import com.examsphere.model.Question;

public class QuestionDAO {

    public boolean addQuestion(Question question) {

        boolean status = false;

        String sql = "INSERT INTO questions(subject_id, category_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setInt(1, question.getSubjectId());
            preparedStatement.setInt(2, question.getCategoryId());
            preparedStatement.setString(3, question.getQuestionText());
            preparedStatement.setString(4, question.getOptionA());
            preparedStatement.setString(5, question.getOptionB());
            preparedStatement.setString(6, question.getOptionC());
            preparedStatement.setString(7, question.getOptionD());
            preparedStatement.setString(8, question.getCorrectAnswer());
            preparedStatement.setString(9, question.getDifficulty());
            preparedStatement.setInt(10, question.getMarks());
            preparedStatement.setString(11, question.getStatus());

            int rows = preparedStatement.executeUpdate();

            if (rows > 0) {
                status = true;
            }

        } catch (Exception e) {

            e.printStackTrace();

        }

        return status;

    }

    public List<Question> getAllQuestions() {

        List<Question> questionList = new ArrayList<>();

        String sql = "SELECT * FROM questions";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {

                Question question = new Question();

                question.setQuestionId(resultSet.getInt("question_id"));
                question.setSubjectId(resultSet.getInt("subject_id"));
                question.setCategoryId(resultSet.getInt("category_id"));
                question.setQuestionText(resultSet.getString("question_text"));
                question.setOptionA(resultSet.getString("option_a"));
                question.setOptionB(resultSet.getString("option_b"));
                question.setOptionC(resultSet.getString("option_c"));
                question.setOptionD(resultSet.getString("option_d"));
                question.setCorrectAnswer(resultSet.getString("correct_answer"));
                question.setDifficulty(resultSet.getString("difficulty"));
                question.setMarks(resultSet.getInt("marks"));
                question.setStatus(resultSet.getString("status"));

                questionList.add(question);

            }

        } catch (Exception e) {

            e.printStackTrace();

        }

        return questionList;

    }
    public boolean updateQuestion(Question question) {

    boolean status = false;

    String sql =
            "UPDATE questions SET " +
            "subject_id = ?, " +
            "category_id = ?, " +
            "question_text = ?, " +
            "option_a = ?, " +
            "option_b = ?, " +
            "option_c = ?, " +
            "option_d = ?, " +
            "correct_answer = ?, " +
            "difficulty = ?, " +
            "marks = ?, " +
            "status = ? " +
            "WHERE question_id = ?";

    try {

        Connection connection =
                DBConnection.getConnection();

        PreparedStatement preparedStatement =
                connection.prepareStatement(sql);

        preparedStatement.setInt(
                1,
                question.getSubjectId()
        );

        preparedStatement.setInt(
                2,
                question.getCategoryId()
        );

        preparedStatement.setString(
                3,
                question.getQuestionText()
        );

        preparedStatement.setString(
                4,
                question.getOptionA()
        );

        preparedStatement.setString(
                5,
                question.getOptionB()
        );

        preparedStatement.setString(
                6,
                question.getOptionC()
        );

        preparedStatement.setString(
                7,
                question.getOptionD()
        );

        preparedStatement.setString(
                8,
                question.getCorrectAnswer()
        );

        preparedStatement.setString(
                9,
                question.getDifficulty()
        );

        preparedStatement.setInt(
                10,
                question.getMarks()
        );

        preparedStatement.setString(
                11,
                question.getStatus()
        );

        preparedStatement.setInt(
                12,
                question.getQuestionId()
        );

        int rows =
                preparedStatement.executeUpdate();

        if (rows > 0) {

            status = true;

        }

    } catch (Exception e) {

        e.printStackTrace();

    }

    return status;
}
public boolean deleteQuestion(int questionId) {

    boolean status = false;

    String sql =
            "DELETE FROM questions WHERE question_id = ?";

    try {

        Connection connection =
                DBConnection.getConnection();

        PreparedStatement preparedStatement =
                connection.prepareStatement(sql);

        preparedStatement.setInt(
                1,
                questionId
        );

        int rows =
                preparedStatement.executeUpdate();

        if (rows > 0) {

            status = true;

        }

    } catch (Exception e) {

        e.printStackTrace();

    }

    return status;
}

}