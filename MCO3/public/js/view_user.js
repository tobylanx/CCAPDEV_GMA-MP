document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');

  if (!userId) {
    console.error('User ID not found in URL');
    return;
  }

  try {
    const profileResponse = await fetch(`/api/user-profile?userId=${userId}`);
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch user profile');
    }
    const user = await profileResponse.json();

    document.getElementById('profile-pic').src = user.profile.profilepic || 'images/profile.png';
    document.getElementById('user-name').textContent = `${user.firstname} ${user.lastname}`;
    document.getElementById('user-bio').textContent = user.profile.bio;

    const reservationsResponse = await fetch(`/api/user-reservations?userId=${userId}`);
    if (!reservationsResponse.ok) {
      throw new Error('Failed to fetch user reservations');
    }
    const reservations = await reservationsResponse.json();
    displayReservations(reservations);
  } catch (error) {
    console.error('Error fetching user profile or reservations:', error);
  }
});

function displayReservations(reservations) {
  const reservationsList = document.getElementById('reservations-list');
  reservationsList.innerHTML = '';

  if (reservations.length === 0) {
    reservationsList.textContent = 'No current reservations';
    return;
  }

  reservations.forEach(reservation => {
    const listItem = document.createElement('li');
    listItem.textContent = `Lab: ${reservation.labID.labname}, Seat: ${reservation.seatnum}, Time: ${reservation.timeslot.timestart}`;
    reservationsList.appendChild(listItem);
  });
}
