 /* ==========================================
   ExamSphere - Admin Profile
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ======================================
           ELEMENTS
        ====================================== */

        const profileImage =
            document.getElementById(
                "profileImage"
            );

        const profileImageInput =
            document.getElementById(
                "profileImageInput"
            );

        const displayName =
            document.getElementById(
                "displayName"
            );

        const fullName =
            document.getElementById(
                "fullName"
            );

        const adminEmail =
            document.getElementById(
                "adminEmail"
            );

        const phoneNumber =
            document.getElementById(
                "phoneNumber"
            );

        const editProfileBtn =
            document.getElementById(
                "editProfileBtn"
            );

        const saveProfileBtn =
            document.getElementById(
                "saveProfileBtn"
            );

        const cancelProfileBtn =
            document.getElementById(
                "cancelProfileBtn"
            );


        /* ======================================
           DEFAULT ADMIN DATA
        ====================================== */

        const defaultProfile = {

            name: "Administrator",

            email: "admin@examsphere.com",

            phone: "9876543210",

            image:
                "https://ui-avatars.com/api/?name=Administrator&background=2563eb&color=fff&size=160"

        };


        /* ======================================
           LOAD PROFILE
        ====================================== */

        loadProfile();


        function loadProfile() {

            const savedProfile =
                localStorage.getItem(
                    "examSphereAdminProfile"
                );


            let profile;


            if (savedProfile) {

                try {

                    profile =
                        JSON.parse(savedProfile);

                } catch (error) {

                    profile =
                        defaultProfile;

                }

            } else {

                profile =
                    defaultProfile;

            }


            fullName.value =
                profile.name;

            adminEmail.value =
                profile.email;

            phoneNumber.value =
                profile.phone;

            displayName.textContent =
                profile.name;

            profileImage.src =
                profile.image;

        }


        /* ======================================
           EDIT PROFILE
        ====================================== */

        editProfileBtn.addEventListener(
            "click",
            function () {

                fullName.disabled = false;

                adminEmail.disabled = false;

                phoneNumber.disabled = false;


                editProfileBtn.style.display =
                    "none";

                saveProfileBtn.style.display =
                    "inline-block";

                cancelProfileBtn.style.display =
                    "inline-block";


                fullName.focus();

            }
        );


        /* ======================================
           SAVE PROFILE
        ====================================== */

        saveProfileBtn.addEventListener(
            "click",
            function () {

                const name =
                    fullName.value.trim();

                const email =
                    adminEmail.value.trim();

                const phone =
                    phoneNumber.value.trim();


                /* ==============================
                   VALIDATION
                ============================== */

                if (name === "") {

                    alert(
                        "Please enter your full name."
                    );

                    fullName.focus();

                    return;

                }


                if (email === "") {

                    alert(
                        "Please enter your email address."
                    );

                    adminEmail.focus();

                    return;

                }


                if (!isValidEmail(email)) {

                    alert(
                        "Please enter a valid email address."
                    );

                    adminEmail.focus();

                    return;

                }


                if (
                    phone !== "" &&
                    !/^[0-9]{10}$/.test(phone)
                ) {

                    alert(
                        "Phone number must contain 10 digits."
                    );

                    phoneNumber.focus();

                    return;

                }


                /* ==============================
                   GET CURRENT IMAGE
                ============================== */

                let image =
                    profileImage.src;


                const profile = {

                    name: name,

                    email: email,

                    phone: phone,

                    image: image

                };


                /* ==============================
                   SAVE
                ============================== */

                localStorage.setItem(

                    "examSphereAdminProfile",

                    JSON.stringify(profile)

                );


                displayName.textContent =
                    name;


                disableEditing();


                alert(
                    "Profile updated successfully!"
                );

            }
        );


        /* ======================================
           CANCEL EDIT
        ====================================== */

        cancelProfileBtn.addEventListener(
            "click",
            function () {

                loadProfile();

                disableEditing();

            }
        );


        function disableEditing() {

            fullName.disabled = true;

            adminEmail.disabled = true;

            phoneNumber.disabled = true;


            editProfileBtn.style.display =
                "inline-block";

            saveProfileBtn.style.display =
                "none";

            cancelProfileBtn.style.display =
                "none";

        }


        /* ======================================
           PROFILE IMAGE
        ====================================== */

        profileImageInput.addEventListener(
            "change",
            function () {

                const file =
                    profileImageInput.files[0];


                if (!file) {

                    return;

                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    alert(
                        "Please select a valid image file."
                    );

                    profileImageInput.value = "";

                    return;

                }


                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        profileImage.src =
                            event.target.result;

                    };


                reader.readAsDataURL(file);

            }
        );


        /* ======================================
           EMAIL VALIDATION
        ====================================== */

        function isValidEmail(email) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email);

        }

    }
);