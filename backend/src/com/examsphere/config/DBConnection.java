package com.examsphere.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String HOST =
            System.getenv().getOrDefault("DB_HOST", "localhost");

    private static final String PORT =
            System.getenv().getOrDefault("DB_PORT", "3306");

    private static final String DATABASE =
            System.getenv().getOrDefault("DB_NAME", "examsphere_db");

    private static final String USERNAME =
            System.getenv().getOrDefault("DB_USER", "root");

    private static final String PASSWORD =
            System.getenv().getOrDefault("DB_PASSWORD", "Murugan@411");

    private static final String URL =
            "jdbc:mysql://" + HOST + ":" + PORT + "/" + DATABASE
            + "?useSSL=false&allowPublicKeyRetrieval=true"
            + "&serverTimezone=UTC";

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

                System.out.println(
                        "Database Connected Successfully."
                );

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