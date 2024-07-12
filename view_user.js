document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  if (!userId) {
    console.error('User ID not found in URL');
    return;
  }

  try {
    const response = await fetch(`/api/user-profile?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    const user = await response.json();

    document.getElementById('profile-pic').src = user.profile.profilepic || '/images/profile.png';
    document.getElementById('user-name').textContent = `${user.firstname} ${user.lastname}`;
    document.getElementById('user-bio').textContent = user.profile.bio;
  } catch (error) {
    console.error('Error fetching user profile:', error);
  }
});
