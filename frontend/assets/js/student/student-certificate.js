/* ==========================================
   ExamSphere - Student Certificate
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const downloadBtn = document.getElementById("downloadBtn");
    const printBtn = document.getElementById("printBtn");
    const certificate = document.querySelector(".certificate");

    /* ==================================
       CERTIFICATE ANIMATION
    ================================== */

    certificate.style.opacity = "0";
    certificate.style.transform = "translateY(30px)";

    setTimeout(() => {

        certificate.style.transition = "0.8s ease";

        certificate.style.opacity = "1";

        certificate.style.transform = "translateY(0)";

    }, 300);

    /* ==================================
       DOWNLOAD CERTIFICATE
    ================================== */

    downloadBtn.addEventListener("click", () => {

        alert("Certificate download will be enabled after backend integration.");

        // Future:
        // Generate PDF Certificate

    });

    /* ==================================
       PRINT CERTIFICATE
    ================================== */

    printBtn.addEventListener("click", () => {

        window.print();

    });

});