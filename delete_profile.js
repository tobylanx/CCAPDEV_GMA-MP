document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('deleteProfileForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/delete-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = 'login.html';
            } else {
                alert(result.error);
            }
        } catch (err) {
            alert('An error occurred while deleting the profile.');
        }
    });
});
