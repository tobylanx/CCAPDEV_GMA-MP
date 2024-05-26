function validateLoginForm() {
    let email = document.forms["login"]["dlsuemail"].value;
    
    if (!email.endsWith('@dlsu.edu.ph')) {
        alert("Email should end with @dlsu.edu.ph");
        return false;
    }
    
    return true;
}
