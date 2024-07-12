document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');

  searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query === '') return;

    try {
      const response = await fetch(`/api/search-user?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const users = await response.json();
      searchResults.innerHTML = '';

      if (users.length === 0) {
        searchResults.innerHTML = '<p>No users found.</p>';
        return;
      }

      users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'search-result-item';
        userDiv.textContent = `${user.firstname} ${user.lastname} (${user.email})`;
        searchResults.appendChild(userDiv);
      });
    } catch (error) {
      console.error('Error:', error);
      searchResults.innerHTML = '<p>Failed to search users.</p>';
    }
  });
});
