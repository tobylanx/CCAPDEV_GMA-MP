function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
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

    if (remember) {
        setCookie('studentLoggedIn', 'true', 21);
    }

    localStorage.setItem('loggedIn', 'true');
    return true;
}

function validateTechLoginForm() {
    let email = document.forms["techLogin"]["techEmail"].value;
    let password = document.forms["techLogin"]["techPassword"].value;

    const validTechCredentials = [
        { email: 'tony_bautista@dlsu.edu.ph', password: 'techpassword1' },
        { email: 'alden_richards@dlsu.edu.ph', password: 'techpassword2' },
        { email: 'daniel_padilla@dlsu.edu.ph', password: 'techpassword3' }
    ];

    if (!email.endsWith('@dlsu.edu.ph')) {
        alert("Please input a registered email");
        return false;
    }

    let isValid = validTechCredentials.some(function (credential) {
        return credential.email === email && credential.password === password;
    });

    if (!isValid) {
        alert("Invalid email or password");
        return false;
    }

    if (remember) {
        setCookie('techLoggedIn', 'true', 21);
    }

    localStorage.setItem('techLoggedIn', 'true');
    return true;
}

