function validateLoginForm() {
    let email = document.forms["login"]["dlsuemail"].value;
    let password = document.forms["login"]["password"].value;

    const validCredentials = [
        { email: 'marsha_tarrosa@dlsu.edu.ph', password: 'PQ@123south' },
        { email: 'angela_tobias@dlsu.edu.ph', password: 'MKT_south456' },
        { email: 'genelle_chua@dlsu.edu.ph', password: 'MLBNnorth_789' }
    ];

    if (!email.endsWith('@dlsu.edu.ph')) {
        alert("Please input a registered email");
        return false;
    }

    let isValid = validCredentials.some(function (credential) {
        return credential.email === email && credential.password === password;
    });

    if (!isValid) {
        alert("Invalid email or password");
        return false;
    }

    localStorage.setItem('loggedIn', 'true');
    return true;
}
