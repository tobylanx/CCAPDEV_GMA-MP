document.addEventListener("DOMContentLoaded", function() {
    checkLoginStatus();
});

function validateLoginForm() {
    let email = document.forms["login"]["dlsuemail"].value;
    let password = document.forms["login"]["password"].value;

    if (!email.endsWith('@dlsu.edu.ph')) {
        alert("Please input a registered email");
        return false;
    }

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dlsuemail: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else if (data.redirect) {
            window.location.href = data.redirect;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while logging in. Please try again.');
    });

    return false;
}

function checkLoginStatus() {
    const studentLoggedIn = getCookie('studentLoggedIn');
    const techLoggedIn = getCookie('techLoggedIn');

    if (studentLoggedIn) {
        window.location.href = 'menu_st.html';
    } else if (techLoggedIn) {
        window.location.href = 'menu_tech.html';
    } else {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('techLoggedIn');
    }
}

function logout() {
    eraseCookie('studentLoggedIn');
    eraseCookie('techLoggedIn');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('techLoggedIn');
    window.location.href = 'login.html'; // Redirect to login.html on logout
}

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
