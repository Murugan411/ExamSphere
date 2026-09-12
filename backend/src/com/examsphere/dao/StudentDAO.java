package com.examsphere.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.examsphere.config.DBConnection;
import com.examsphere.model.Student;

public class StudentDAO {

    // ==========================================
    // REGISTER STUDENT
    // ==========================================

    public boolean registerStudent(Student student) {

        boolean status = false;

        String sql = "INSERT INTO students " +
                "(full_name, email, phone, register_number, department, " +
                "year_of_study, password, status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement preparedStatement =
                    connection.prepareStatement(sql);

            preparedStatement.setString(1, student.getFullName());
            preparedStatement.setString(2, student.getEmail());
            preparedStatement.setString(3, student.getPhone());
            preparedStatement.setString(4, student.getRegisterNumber());
            preparedStatement.setString(5, student.getDepartment());
            preparedStatement.setInt(6, student.getYearOfStudy());
            preparedStatement.setString(7, student.getPassword());
            preparedStatement.setString(8, student.getStatus());

            int rows = preparedStatement.executeUpdate();

            if (rows > 0) {
                status = true;
            }

            preparedStatement.close();

        } catch (Exception e) {

            e.printStackTrace();

        }

        return status;
    }


    // ==========================================
    // STUDENT LOGIN
    // ==========================================

    public Student loginStudent(String email, String password) {

        Student student = null;

        String sql =
                "SELECT * FROM students WHERE email = ? AND password = ?";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement preparedStatement =
                    connection.prepareStatement(sql);

            preparedStatement.setString(1, email);
            preparedStatement.setString(2, password);

            ResultSet resultSet =
                    preparedStatement.executeQuery();

            if (resultSet.next()) {

                student = new Student();

                student.setStudentId(
                        resultSet.getInt("student_id")
                );

                student.setFullName(
                        resultSet.getString("full_name")
                );

                student.setEmail(
                        resultSet.getString("email")
                );

                student.setPhone(
                        resultSet.getString("phone")
                );

                student.setRegisterNumber(
                        resultSet.getString("register_number")
                );

                student.setDepartment(
                        resultSet.getString("department")
                );

                student.setYearOfStudy(
                        resultSet.getInt("year_of_study")
                );

                student.setPassword(
                        resultSet.getString("password")
                );

                student.setStatus(
                        resultSet.getString("status")
                );
            }

            resultSet.close();
            preparedStatement.close();

        } catch (Exception e) {

            e.printStackTrace();

        }

        return student;
    }


    // ==========================================
    // GET ALL STUDENTS
    // ==========================================

    public List<Student> getAllStudents() {

        List<Student> students = new ArrayList<>();

        /*
         * Password is intentionally NOT selected.
         * The admin page does not need student passwords.
         */

        String sql =
                "SELECT student_id, full_name, email, phone, " +
                "register_number, department, year_of_study, status " +
                "FROM students ORDER BY student_id";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement preparedStatement =
                    connection.prepareStatement(sql);

            ResultSet resultSet =
                    preparedStatement.executeQuery();

            while (resultSet.next()) {

                Student student = new Student();

                student.setStudentId(
                        resultSet.getInt("student_id")
                );

                student.setFullName(
                        resultSet.getString("full_name")
                );

                student.setEmail(
                        resultSet.getString("email")
                );

                student.setPhone(
                        resultSet.getString("phone")
                );

                student.setRegisterNumber(
                        resultSet.getString("register_number")
                );

                student.setDepartment(
                        resultSet.getString("department")
                );

                student.setYearOfStudy(
                        resultSet.getInt("year_of_study")
                );

                student.setStatus(
                        resultSet.getString("status")
                );

                students.add(student);
            }

            resultSet.close();
            preparedStatement.close();

        } catch (Exception e) {

            e.printStackTrace();

        }

        return students;
    }
    public boolean updateStudent(Student student) {

    boolean status = false;

    String sql = "UPDATE students SET full_name=?, email=?, phone=?, register_number=?, department=?, year_of_study=?, status=? WHERE student_id=?";

    try {

        Connection connection = DBConnection.getConnection();

        PreparedStatement preparedStatement =
                connection.prepareStatement(sql);

        preparedStatement.setString(1, student.getFullName());
        preparedStatement.setString(2, student.getEmail());
        preparedStatement.setString(3, student.getPhone());
        preparedStatement.setString(4, student.getRegisterNumber());
        preparedStatement.setString(5, student.getDepartment());
        preparedStatement.setInt(6, student.getYearOfStudy());
        preparedStatement.setString(7, student.getStatus());
        preparedStatement.setInt(8, student.getStudentId());

        int rows = preparedStatement.executeUpdate();

        if (rows > 0) {
            status = true;
        }

    } catch (Exception e) {

        e.printStackTrace();

    }

    return status;
}
public boolean deleteStudent(int studentId) {

    boolean status = false;

    String sql = "DELETE FROM students WHERE student_id = ?";

    try {

        Connection connection =
                DBConnection.getConnection();

        PreparedStatement preparedStatement =
                connection.prepareStatement(sql);

        preparedStatement.setInt(1, studentId);

        int rows =
                preparedStatement.executeUpdate();

        if (rows > 0) {
            status = true;
        }

        preparedStatement.close();
        connection.close();

    } catch (Exception e) {

        e.printStackTrace();

    }

    return status;
}
}