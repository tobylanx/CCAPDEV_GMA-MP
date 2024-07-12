function resetPassword() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const newpassword = document.getElementById('newpassword').value;
    const confirmpassword = document.getElementById('confirmpassword').value;

    if (newpassword !== confirmpassword) {
        alert('Passwords do not match.');
        return false;
    }

    fetch('/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, newpassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            window.location.href = 'reset_pass_success.html';
        } else {
            alert('Error resetting password.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while resetting the password. Please try again.');
    });

    return false;
}
