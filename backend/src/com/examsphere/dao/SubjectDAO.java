package com.examsphere.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.examsphere.config.DBConnection;
import com.examsphere.model.Subject;

public class SubjectDAO {

    /* =====================================================
       ADD SUBJECT
    ===================================================== */

    public boolean addSubject(Subject subject) {

        String sql =
                "INSERT INTO subjects " +
                "(subject_code, subject_name, faculty_name, semester, credits, status) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        try (
                Connection connection =
                        DBConnection.getConnection();

                PreparedStatement preparedStatement =
                        connection.prepareStatement(sql)
        ) {

            preparedStatement.setString(
                    1,
                    subject.getSubjectCode()
            );

            preparedStatement.setString(
                    2,
                    subject.getSubjectName()
            );

            preparedStatement.setString(
                    3,
                    subject.getFacultyName()
            );

            preparedStatement.setInt(
                    4,
                    subject.getSemester()
            );

            preparedStatement.setInt(
                    5,
                    subject.getCredits()
            );

            preparedStatement.setString(
                    6,
                    subject.getStatus()
            );

            int rows =
                    preparedStatement.executeUpdate();

            return rows > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }


    /* =====================================================
       GET ALL SUBJECTS
    ===================================================== */

    public List<Subject> getAllSubjects() {

        List<Subject> subjectList =
                new ArrayList<>();

        String sql =
                "SELECT * FROM subjects ORDER BY subject_id";

        try (
                Connection connection =
                        DBConnection.getConnection();

                PreparedStatement preparedStatement =
                        connection.prepareStatement(sql);

                ResultSet resultSet =
                        preparedStatement.executeQuery()
        ) {

            while (resultSet.next()) {

                Subject subject =
                        new Subject();

                subject.setSubjectId(
                        resultSet.getInt(
                                "subject_id"
                        )
                );

                subject.setSubjectCode(
                        resultSet.getString(
                                "subject_code"
                        )
                );

                subject.setSubjectName(
                        resultSet.getString(
                                "subject_name"
                        )
                );

                subject.setFacultyName(
                        resultSet.getString(
                                "faculty_name"
                        )
                );

                subject.setSemester(
                        resultSet.getInt(
                                "semester"
                        )
                );

                subject.setCredits(
                        resultSet.getInt(
                                "credits"
                        )
                );

                subject.setStatus(
                        resultSet.getString(
                                "status"
                        )
                );

                subjectList.add(
                        subject
                );
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        return subjectList;
    }


    /* =====================================================
       UPDATE SUBJECT
    ===================================================== */

    public boolean updateSubject(
            Subject subject
    ) {

        String sql =
                "UPDATE subjects SET " +
                "subject_name = ?, " +
                "faculty_name = ?, " +
                "semester = ?, " +
                "credits = ?, " +
                "status = ? " +
                "WHERE subject_code = ?";

        try (
                Connection connection =
                        DBConnection.getConnection();

                PreparedStatement preparedStatement =
                        connection.prepareStatement(sql)
        ) {

            preparedStatement.setString(
                    1,
                    subject.getSubjectName()
            );

            preparedStatement.setString(
                    2,
                    subject.getFacultyName()
            );

            preparedStatement.setInt(
                    3,
                    subject.getSemester()
            );

            preparedStatement.setInt(
                    4,
                    subject.getCredits()
            );

            preparedStatement.setString(
                    5,
                    subject.getStatus()
            );

            preparedStatement.setString(
                    6,
                    subject.getSubjectCode()
            );

            int rows =
                    preparedStatement.executeUpdate();

            return rows > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }


    /* =====================================================
       DELETE SUBJECT
    ===================================================== */

    public boolean deleteSubject(
            String subjectCode
    ) {

        String sql =
                "DELETE FROM subjects " +
                "WHERE subject_code = ?";

        try (
                Connection connection =
                        DBConnection.getConnection();

                PreparedStatement preparedStatement =
                        connection.prepareStatement(sql)
        ) {

            preparedStatement.setString(
                    1,
                    subjectCode
            );

            int rows =
                    preparedStatement.executeUpdate();

            return rows > 0;

        } catch (Exception e) {

            e.printStackTrace();

            return false;
        }
    }

}