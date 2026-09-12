/* ==========================================
   ExamSphere - Admin Settings
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ==================================
       PAGE ANIMATION
    ================================== */

    const settingCards = document.querySelectorAll(".setting-card");

    settingCards.forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";

        setTimeout(() => {

            card.style.transition = "0.5s ease";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 150);

    });

    /* ==================================
       SAVE SETTINGS
    ================================== */

    const saveButton = document.querySelector(".save-btn");

    saveButton.addEventListener("click", () => {

        alert("Settings saved successfully! (Frontend Demo)");

    });

    /* ==================================
       RESET SETTINGS
    ================================== */

    const resetButton = document.querySelector(".reset-btn");

    resetButton.addEventListener("click", () => {

        const confirmReset = confirm("Reset all settings?");

        if(confirmReset){

            location.reload();

        }

    });

    /* ==================================
       DARK MODE TOGGLE
    ================================== */

    const switches = document.querySelectorAll(".switch input");

    if(switches.length > 1){

        const darkModeSwitch = switches[1];

        darkModeSwitch.addEventListener("change", () => {

            if(darkModeSwitch.checked){

                alert("Dark Mode Enabled (Frontend Demo)");

            }

            else{

                alert("Dark Mode Disabled");

            }

        });

    }

    /* ==================================
       NOTIFICATION TOGGLE
    ================================== */

    if(switches.length > 0){

        const notificationSwitch = switches[0];

        notificationSwitch.addEventListener("change", () => {

            if(notificationSwitch.checked){

                alert("Notifications Enabled");

            }

            else{

                alert("Notifications Disabled");

            }

        });

    }

    /* ==================================
       LANGUAGE CHANGE
    ================================== */

    const language = document.querySelector("select");

    language.addEventListener("change", () => {

        alert(

            "Language changed to : " +

            language.value +

            "\n\nBackend integration will apply the language."

        );

    });

    /* ==================================
       UPDATE PROFILE
    ================================== */

    const settingButtons = document.querySelectorAll(".setting-btn");

    settingButtons.forEach((button) => {

        button.addEventListener("click", () => {

            alert(

                button.innerText +

                " feature will be available after backend integration."

            );

        });

    });

});