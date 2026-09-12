 /* ==========================================
   ExamSphere - Admin Settings
   Frontend Settings Management
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const settingCards =
        document.querySelectorAll(".setting-card");

    const saveSettingsBtn =
        document.getElementById("saveSettingsBtn");

    const resetSettingsBtn =
        document.getElementById("resetSettingsBtn");

    const notificationToggle =
        document.getElementById("notificationToggle");

    const darkModeToggle =
        document.getElementById("darkModeToggle");

    const languageSelect =
        document.getElementById("languageSelect");

    const updateProfileBtn =
        document.getElementById("updateProfileBtn");

    const changePasswordBtn =
        document.getElementById("changePasswordBtn");

    const passwordModal =
        document.getElementById("passwordModal");

    const closePasswordModal =
        document.getElementById("closePasswordModal");

    const cancelPasswordBtn =
        document.getElementById("cancelPasswordBtn");

    const savePasswordBtn =
        document.getElementById("savePasswordBtn");

    const currentPassword =
        document.getElementById("currentPassword");

    const newPassword =
        document.getElementById("newPassword");

    const confirmPassword =
        document.getElementById("confirmPassword");


    /* ==========================================
       PAGE ANIMATION
    ========================================== */

    settingCards.forEach(function (card, index) {

        card.style.opacity = "0";
        card.style.transform = "translateY(25px)";

        setTimeout(function () {

            card.style.transition =
                "all 0.5s ease";

            card.style.opacity = "1";
            card.style.transform =
                "translateY(0)";

        }, index * 100);

    });


    /* ==========================================
       LOAD SAVED SETTINGS
    ========================================== */

    loadSettings();


    /* ==========================================
       DARK MODE
    ========================================== */

    darkModeToggle.addEventListener(
        "change",
        function () {

            if (darkModeToggle.checked) {

                enableDarkMode();

            } else {

                disableDarkMode();

            }

        }
    );


    /* ==========================================
       NOTIFICATION TOGGLE
    ========================================== */

    notificationToggle.addEventListener(
        "change",
        function () {

            if (notificationToggle.checked) {

                showMessage(
                    "Notifications enabled"
                );

            } else {

                showMessage(
                    "Notifications disabled"
                );

            }

        }
    );


    /* ==========================================
       LANGUAGE
    ========================================== */

    languageSelect.addEventListener(
        "change",
        function () {

            localStorage.setItem(
                "examSphereLanguage",
                languageSelect.value
            );

            showMessage(
                "Language selected: "
                + languageSelect.value
            );

        }
    );


    /* ==========================================
       SAVE SETTINGS
    ========================================== */

    saveSettingsBtn.addEventListener(
        "click",
        function () {

            saveSettings();

            showMessage(
                "Settings saved successfully!"
            );

        }
    );


    /* ==========================================
       RESET SETTINGS
    ========================================== */

    resetSettingsBtn.addEventListener(
        "click",
        function () {

            const confirmReset =
                confirm(
                    "Are you sure you want to reset all settings?"
                );

            if (!confirmReset) {
                return;
            }


            localStorage.removeItem(
                "examSphereSettings"
            );

            localStorage.removeItem(
                "examSphereLanguage"
            );

            localStorage.removeItem(
                "examSphereDarkMode"
            );


            notificationToggle.checked = true;

            darkModeToggle.checked = false;

            languageSelect.value = "English";


            disableDarkMode();


            showMessage(
                "Settings have been reset successfully!"
            );

        }
    );


    /* ==========================================
       UPDATE PROFILE
    ========================================== */

    updateProfileBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "admin-profile.html";

        }
    );


    /* ==========================================
       OPEN CHANGE PASSWORD
    ========================================== */

    changePasswordBtn.addEventListener(
        "click",
        function () {

            passwordModal.classList.add(
                "show"
            );

            currentPassword.value = "";
            newPassword.value = "";
            confirmPassword.value = "";

        }
    );


    /* ==========================================
       CLOSE PASSWORD MODAL
    ========================================== */

    closePasswordModal.addEventListener(
        "click",
        closePasswordModalFunction
    );


    cancelPasswordBtn.addEventListener(
        "click",
        closePasswordModalFunction
    );


    function closePasswordModalFunction() {

        passwordModal.classList.remove(
            "show"
        );

    }


    /* ==========================================
       SAVE PASSWORD
    ========================================== */

    savePasswordBtn.addEventListener(
        "click",
        function () {

            const current =
                currentPassword.value.trim();

            const newPass =
                newPassword.value.trim();

            const confirmPass =
                confirmPassword.value.trim();


            if (current === "") {

                alert(
                    "Please enter your current password."
                );

                return;
            }


            if (newPass === "") {

                alert(
                    "Please enter a new password."
                );

                return;
            }


            if (newPass.length < 6) {

                alert(
                    "New password must contain at least 6 characters."
                );

                return;
            }


            if (confirmPass === "") {

                alert(
                    "Please confirm your new password."
                );

                return;
            }


            if (newPass !== confirmPass) {

                alert(
                    "New password and confirm password do not match."
                );

                return;
            }


            /*
             * Frontend project implementation.
             * Password is not sent to database here.
             */

            localStorage.setItem(
                "examSpherePasswordChanged",
                "true"
            );


            passwordModal.classList.remove(
                "show"
            );


            currentPassword.value = "";
            newPassword.value = "";
            confirmPassword.value = "";


            showMessage(
                "Password changed successfully!"
            );

        }
    );


    /* ==========================================
       CLOSE MODAL WHEN CLICKING OUTSIDE
    ========================================== */

    passwordModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === passwordModal
            ) {

                closePasswordModalFunction();

            }

        }
    );


    /* ==========================================
       SAVE SETTINGS FUNCTION
    ========================================== */

    function saveSettings() {

        const settings = {

            notifications:
                notificationToggle.checked,

            darkMode:
                darkModeToggle.checked,

            language:
                languageSelect.value

        };


        localStorage.setItem(
            "examSphereSettings",
            JSON.stringify(settings)
        );


        localStorage.setItem(
            "examSphereLanguage",
            languageSelect.value
        );


        localStorage.setItem(
            "examSphereDarkMode",
            darkModeToggle.checked
        );

    }


    /* ==========================================
       LOAD SETTINGS FUNCTION
    ========================================== */

    function loadSettings() {

        const savedSettings =
            localStorage.getItem(
                "examSphereSettings"
            );


        if (savedSettings) {

            try {

                const settings =
                    JSON.parse(savedSettings);


                notificationToggle.checked =
                    settings.notifications !== false;


                darkModeToggle.checked =
                    settings.darkMode === true;


                if (settings.language) {

                    languageSelect.value =
                        settings.language;

                }

            } catch (error) {

                console.log(
                    "Unable to load saved settings."
                );

            }

        }


        /*
         * Load old dark mode value
         */

        const savedDarkMode =
            localStorage.getItem(
                "examSphereDarkMode"
            );


        if (savedDarkMode === "true") {

            darkModeToggle.checked = true;

            enableDarkMode();

        } else {

            darkModeToggle.checked = false;

            disableDarkMode();

        }


        /*
         * Load language
         */

        const savedLanguage =
            localStorage.getItem(
                "examSphereLanguage"
            );


        if (savedLanguage) {

            languageSelect.value =
                savedLanguage;

        }

    }


    /* ==========================================
       ENABLE DARK MODE
    ========================================== */

    function enableDarkMode() {

        document.body.classList.add(
            "dark-mode"
        );

        localStorage.setItem(
            "examSphereDarkMode",
            "true"
        );

    }


    /* ==========================================
       DISABLE DARK MODE
    ========================================== */

    function disableDarkMode() {

        document.body.classList.remove(
            "dark-mode"
        );

        localStorage.setItem(
            "examSphereDarkMode",
            "false"
        );

    }


    /* ==========================================
       MESSAGE
    ========================================== */

    function showMessage(message) {

        alert(message);

    }

});