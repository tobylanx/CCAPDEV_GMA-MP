document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResultsContainer = document.getElementById('search-results');

  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();

    if (!query) {
      alert('Please enter a search query.');
      return;
    }

    try {
      const response = await fetch(`/api/search-user?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search users');
      }
      const users = await response.json();
      displaySearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
      alert('Error searching users. Please try again later.');
    }
  });

  function displaySearchResults(users) {
    searchResultsContainer.innerHTML = '';

    if (users.length === 0) {
      searchResultsContainer.textContent = 'No users found';
      return;
    }

    users.forEach(user => {
      const userDiv = document.createElement('div');
      userDiv.classList.add('user-result');
      userDiv.innerHTML = `
        <p>Name: ${user.firstname} ${user.lastname}</p>
        <p>Email: ${user.email}</p>
        <button onclick="viewUserProfile('${user._id}', '${user.role}')">View Profile</button>
      `;
      searchResultsContainer.appendChild(userDiv);
    });
  }
});

function viewUserProfile(userId, role) {
  console.log(`User ID: ${userId}, Role: ${role}`);
  const redirectUrl = role === 'student' ? 'st_view_user.html' : 'tech_view_user.html';
  console.log(`Redirecting to: ${redirectUrl}`);
  window.location.href = `${redirectUrl}?userId=${userId}`;
}
