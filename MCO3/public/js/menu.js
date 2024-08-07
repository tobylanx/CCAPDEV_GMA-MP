document.addEventListener("DOMContentLoaded", function() {
    checkLoginStatus();
});

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
        window.location.href = 'login.html'; // Redirect to login.html if not logged in
    }
}

function logout() {
    eraseCookie('studentLoggedIn');
    eraseCookie('techLoggedIn');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('techLoggedIn');
    window.location.href = 'login.html'; // Redirect to login.html on logout
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}
