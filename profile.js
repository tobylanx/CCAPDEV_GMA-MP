document.addEventListener('DOMContentLoaded', async () => {
    try {
      const userResponse = await fetch('/api/user'); // Fetch user data
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      const user = await userResponse.json();
  
      // Populate student name, bio, and profile picture
      document.getElementById('name').textContent = `${user.firstname} ${user.lastname}`;
      document.getElementById('bio').textContent = user.profile.bio;
      document.querySelector('.profile-img').src = user.profile.profilepic || '/images/default_profile.png';
  
      const reservationsResponse = await fetch('/api/reservations');
      if (!reservationsResponse.ok) {
        throw new Error('Failed to fetch reservations');
      }
  
      const { current, past } = await reservationsResponse.json();
  
      const currentReservationsList = document.getElementById('current-reservations');
      current.forEach(reservation => {
        const li = document.createElement('li');
        li.textContent = `Lab ${reservation.labID.labname} - Seat ${reservation.seatnum}, Date: ${new Date(reservation.timeslot.date).toLocaleDateString()}, Time: ${reservation.timeslot.timestart}`;
        currentReservationsList.appendChild(li);
      });
    } catch (error) {
      console.error(error.message);
    }
  });
  
  document.getElementById('edit-profile-form').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const formData = new FormData();
    const profilepic = document.getElementById('profilepic').files[0];
    const bio = document.getElementById('bio').value;
  
    if (profilepic) {
      formData.append('profilepic', profilepic);
    }
    formData.append('bio', bio);
  
    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        body: formData
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message);
        window.location.href = 'tech_profile.html';
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the profile.');
    }
  });
  