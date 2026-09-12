/* =========================================================
   ExamSphere - Student Login
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const loginBtn = document.getElementById("loginBtn");


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener("click", function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.classList.remove("fa-eye");
                togglePassword.classList.add("fa-eye-slash");

            } else {

                passwordInput.type = "password";

                togglePassword.classList.remove("fa-eye-slash");
                togglePassword.classList.add("fa-eye");

            }

        });

    }


    /* =====================================================
       LOGIN FORM
       
       IMPORTANT:
       DO NOT use fetch()
       DO NOT use preventDefault()

       The HTML form directly sends:
       
       POST /ExamSphere/studentLogin

       StudentLoginServlet handles the request.
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", function () {

            /*
             * Browser will naturally submit the form.
             *
             * We only change the button appearance.
             *
             * DO NOT:
             * event.preventDefault()
             * fetch()
             */

            if (loginBtn) {

                loginBtn.disabled = true;

                loginBtn.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

            }

        });

    }

});/* =========================================================
   ExamSphere - Student Login
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       GET ELEMENTS
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const togglePassword =
        document.getElementById("togglePassword");

    const loginBtn =
        document.getElementById("loginBtn");


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            function () {

                if (passwordInput.type === "password") {

                    passwordInput.type = "text";

                    togglePassword.classList.remove(
                        "fa-eye"
                    );

                    togglePassword.classList.add(
                        "fa-eye-slash"
                    );

                } else {

                    passwordInput.type = "password";

                    togglePassword.classList.remove(
                        "fa-eye-slash"
                    );

                    togglePassword.classList.add(
                        "fa-eye"
                    );

                }

            }
        );

    }


    /* =====================================================
       LOGIN FORM SUBMISSION
       
       IMPORTANT:
       
       We are NOT using fetch().
       We are NOT using preventDefault().
       
       The browser will directly submit:
       
       POST ../studentLogin
       
       StudentLoginServlet will handle the login.
    ===================================================== */

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function () {

                /* -----------------------------------------
                   Basic validation
                ----------------------------------------- */

                if (!emailInput.value.trim()) {

                    alert("Please enter your email.");

                    return;

                }


                if (!passwordInput.value.trim()) {

                    alert("Please enter your password.");

                    return;

                }


                /* -----------------------------------------
                   Show loading state
                   
                   DO NOT stop form submission.
                ----------------------------------------- */

                if (loginBtn) {

                    loginBtn.disabled = true;

                    loginBtn.innerHTML =
                        '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

                }

                /*
                 * IMPORTANT:
                 *
                 * No event.preventDefault()
                 *
                 * The form continues to:
                 *
                 * ../studentLogin
                 */

            }
        );

    }

});