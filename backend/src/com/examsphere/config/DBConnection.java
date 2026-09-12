package com.examsphere.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/examsphere_db";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "Murugan@411";

    private static Connection connection;

    public static Connection getConnection() {

        try {

            if (connection == null || connection.isClosed()) {

                Class.forName("com.mysql.cj.jdbc.Driver");

                connection = DriverManager.getConnection(
                        URL,
                        USERNAME,
                        PASSWORD
                );

                System.out.println("Database Connected Successfully.");

            }

        } catch (ClassNotFoundException e) {

            System.out.println("MySQL Driver Not Found.");
            e.printStackTrace();

        } catch (SQLException e) {

            System.out.println("Database Connection Failed.");
            e.printStackTrace();

        }

        return connection;

    }

}