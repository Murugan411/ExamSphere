 /* ==========================================
   ExamSphere - Admin Logout
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ======================================
           ELEMENTS
        ====================================== */

        const cancelLogout =
            document.getElementById(
                "cancelLogout"
            );

        const confirmLogout =
            document.getElementById(
                "confirmLogout"
            );


        /* ======================================
           CANCEL LOGOUT
        ====================================== */

        cancelLogout.addEventListener(
            "click",
            function () {

                window.location.href =
                    "admin-dashboard.html";

            }
        );


        /* ======================================
           CONFIRM LOGOUT
        ====================================== */

        confirmLogout.addEventListener(
            "click",
            function () {

                const confirmation =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmation) {

                    return;

                }


                /* ==============================
                   CLEAR USER SESSION DATA
                ============================== */

                sessionStorage.clear();

                localStorage.removeItem(
                    "examSphereSettings"
                );

                localStorage.removeItem(
                    "examSphereLanguage"
                );

                localStorage.removeItem(
                    "examSphereDarkMode"
                );

                localStorage.removeItem(
                    "examSpherePasswordChanged"
                );


                /*
                 * Clear any common login/session
                 * values that may exist.
                 */

                localStorage.removeItem(
                    "adminLoggedIn"
                );

                localStorage.removeItem(
                    "adminEmail"
                );

                localStorage.removeItem(
                    "adminName"
                );

                localStorage.removeItem(
                    "userEmail"
                );

                localStorage.removeItem(
                    "userName"
                );


                /* ==============================
                   LOGOUT SUCCESS MESSAGE
                ============================== */

                alert(
                    "You have been logged out successfully!"
                );


                /* ==============================
                   REDIRECT TO ADMIN LOGIN
                ============================== */

                window.location.replace(
    "/ExamSphere/admin/admin-login.html"
              );

            }
        );

    }
);