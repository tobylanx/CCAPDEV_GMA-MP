function validateForgotPasswordForm() {
    var email = document.forms["forgot_password"]["dlsuemail"].value;
    if (email == "") {
        alert("Email must be filled out");
        return false;
    }
    return true;
}
