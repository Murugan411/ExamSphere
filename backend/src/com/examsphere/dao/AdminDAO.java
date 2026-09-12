package com.examsphere.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import com.examsphere.config.DBConnection;
import com.examsphere.model.Admin;

public class AdminDAO {

    public Admin loginAdmin(String email, String password) {

        Admin admin = null;

        String sql = "SELECT * FROM admins WHERE email = ? AND password = ?";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement preparedStatement =
                    connection.prepareStatement(sql);

            preparedStatement.setString(1, email);
            preparedStatement.setString(2, password);

            ResultSet resultSet = preparedStatement.executeQuery();

            if (resultSet.next()) {

                admin = new Admin();

                admin.setAdminId(resultSet.getInt("admin_id"));
                admin.setFullName(resultSet.getString("full_name"));
                admin.setEmail(resultSet.getString("email"));
                admin.setPhone(resultSet.getString("phone"));
                admin.setPassword(resultSet.getString("password"));
                admin.setRole(resultSet.getString("role"));

            }

        } catch (Exception exception) {

            exception.printStackTrace();

        }

        return admin;

    }

}