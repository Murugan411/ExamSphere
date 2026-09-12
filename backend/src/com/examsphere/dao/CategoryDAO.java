package com.examsphere.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import com.examsphere.config.DBConnection;
import com.examsphere.model.Category;

public class CategoryDAO {

    public boolean addCategory(Category category) {

        boolean status = false;

        String sql = "INSERT INTO categories(category_code, category_name, description, status) VALUES (?, ?, ?, ?)";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            preparedStatement.setString(1, category.getCategoryCode());
            preparedStatement.setString(2, category.getCategoryName());
            preparedStatement.setString(3, category.getDescription());
            preparedStatement.setString(4, category.getStatus());

            int rows = preparedStatement.executeUpdate();

            if (rows > 0) {
                status = true;
            }

        } catch (Exception e) {

            e.printStackTrace();

        }

        return status;

    }

    public List<Category> getAllCategories() {

        List<Category> categoryList = new ArrayList<>();

        String sql = "SELECT * FROM categories";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement preparedStatement = connection.prepareStatement(sql);

            ResultSet resultSet = preparedStatement.executeQuery();

            while (resultSet.next()) {

                Category category = new Category();

                category.setCategoryId(resultSet.getInt("category_id"));
                category.setCategoryCode(resultSet.getString("category_code"));
                category.setCategoryName(resultSet.getString("category_name"));
                category.setDescription(resultSet.getString("description"));
                category.setStatus(resultSet.getString("status"));

                categoryList.add(category);

            }

        } catch (Exception e) {

            e.printStackTrace();

        }

        return categoryList;

    }

}