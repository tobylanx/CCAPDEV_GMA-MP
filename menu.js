document.addEventListener("DOMContentLoaded", function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    const studentLoggedIn = getCookie('studentLoggedIn');
    const techLoggedIn = getCookie('techLoggedIn');

    if (studentLoggedIn) {
        if (window.location.pathname.endsWith('st_login.html')) {
            window.location.href = 'menu_st.html';
        }
    } else if (techLoggedIn) {
        if (window.location.pathname.endsWith('tech_login.html')) {
            window.location.href = 'menu_tech.html';
        }
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
    window.location.href = 'st_login.html';
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
