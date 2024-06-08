function validateForgotPasswordForm() {
    let email = document.forms["forgot_password"]["dlsuemail"].value;

    if (!email.endsWith('@dlsu.edu.ph')) {
        alert("Please enter a valid DLSU email address.");
        return false;
    }

    alert("A password reset link has been sent to your email address.");

    // put server request code here for mco2

    return true;
}

// for server
function sendPasswordResetRequest(email) {
    setTimeout(() => {
        console.log(`Password reset link sent to ${email}`);
        // Show a confirmation message to the user
        alert("A password reset link has been sent to your email address.");
    }, 1000);
}