 package com.examsphere.servlet;

import java.io.IOException;

import com.examsphere.dao.AdminDAO;
import com.examsphere.model.Admin;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/adminLogin")
public class AdminLoginServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;

    private AdminDAO adminDAO = new AdminDAO();

    @Override
    protected void doPost(HttpServletRequest request,
                          HttpServletResponse response)
            throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        Admin admin = adminDAO.loginAdmin(email, password);

        if (admin != null) {

            HttpSession session = request.getSession();

            session.setAttribute("admin", admin);

            response.sendRedirect(request.getContextPath() + "/admin/admin-dashboard.html");

        } else {

            response.sendRedirect(request.getContextPath() + "/admin/admin-login.html?error=Invalid%20Credentials");

        }

    }

}