package com.examsphere.servlet;

import java.io.IOException;
import java.util.List;

import com.examsphere.dao.CategoryDAO;
import com.examsphere.model.Category;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/category")
public class CategoryServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private CategoryDAO categoryDAO = new CategoryDAO();

    @Override
    protected void doGet(HttpServletRequest request,
                         HttpServletResponse response)
            throws ServletException, IOException {

        List<Category> categoryList = categoryDAO.getAllCategories();

        request.setAttribute("categoryList", categoryList);

        request.getRequestDispatcher("/frontend/admin/category-management.jsp")
               .forward(request, response);

    }

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        Category category = new Category();

        category.setCategoryCode(request.getParameter("categoryCode"));
        category.setCategoryName(request.getParameter("categoryName"));
        category.setDescription(request.getParameter("description"));
        category.setStatus("Active");

        boolean status = categoryDAO.addCategory(category);

        if (status) {

            response.sendRedirect("category");

        } else {

            response.getWriter().println("Failed to Add Category.");

        }

    }

}