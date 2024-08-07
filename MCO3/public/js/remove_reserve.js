window.onload = function() {
  fetch('/api/eligible-reservations')
    .then(response => response.json())
    .then(data => {
      const select = document.getElementById('reservation-select');
      if (data.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No eligible reservations found';
        option.disabled = true;
        select.appendChild(option);
      } else {
        data.forEach(reservation => {
          const option = document.createElement('option');
          option.value = reservation._id;
          option.textContent = `${reservation.labID.labname} - Seat ${reservation.seatnum} - Reserved by ${reservation.reservedby.firstname} ${reservation.reservedby.lastname}`;
          select.appendChild(option);
        });
      }
    })
    .catch(error => console.error('Error loading reservations:', error));
};

document.getElementById('removeReservationForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const reservationId = document.getElementById('reservation-select').value;

  fetch('/api/cancel-reservation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reservationId })
  }).then(response => response.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        alert(data.message);
        // Reload or redirect as needed
        location.reload();
      }
    }).catch(error => {
      console.error('Error:', error);
    });
});
