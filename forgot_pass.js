function validateForgotPasswordForm() {
    let email = document.forms["forgot_password"]["dlsuemail"].value;

    if (!email.endsWith('@dlsu.edu.ph')) {
        alert("Please enter a valid DLSU email address.");
        return false;
    }

    sendPasswordResetRequest(email);
    return false;
}

function sendPasswordResetRequest(email) {
    fetch('/api/request-password-reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.exists) {
            alert("A password reset link has been sent to your email address.");
            window.location.href = `reset_pass.html?email=${encodeURIComponent(email)}`;
        } else {
            alert("Email address not found.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while sending the reset link. Please try again.");
    });
}