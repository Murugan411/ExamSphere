/* ===========================================
   ExamSphere Home Page JavaScript
=========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("ExamSphere Home Loaded Successfully");

    // ==============================
    // Sticky Navbar Shadow
    // ==============================

    const header = document.querySelector("header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            header.style.boxShadow = "0 8px 25px rgba(0,0,0,.12)";
        } else {
            header.style.boxShadow = "0 5px 20px rgba(0,0,0,.08)";
        }

    });

    // ==============================
    // Smooth Scroll
    // ==============================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });

    // ==============================
    // Hero Button Animation
    // ==============================

    const buttons = document.querySelectorAll(".primary-btn, .secondary-btn");

    buttons.forEach(button => {

        button.addEventListener("mouseenter", () => {

            button.style.transform = "translateY(-4px)";

        });

        button.addEventListener("mouseleave", () => {

            button.style.transform = "translateY(0px)";

        });

    });

});