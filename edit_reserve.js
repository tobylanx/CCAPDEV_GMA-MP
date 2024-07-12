document.addEventListener('DOMContentLoaded', async () => {
    const reservationSelect = document.getElementById('reservation-select');
  
    // Fetch and display student's current reservations
    try {
      const response = await fetch('/api/student-reservations');
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const reservations = await response.json();
  
      reservationSelect.innerHTML = '';
      reservations.forEach(reservation => {
        const option = document.createElement('option');
        option.value = reservation._id;
        option.textContent = `Reservation - Lab: ${reservation.labID.labname}, Seat: ${reservation.seatnum}, Date: ${new Date(reservation.timeslot.date).toLocaleDateString()}, Time: ${reservation.timeslot.timestart}`;
        reservationSelect.appendChild(option);
      });
    } catch (error) {
      console.error(error.message);
    }
  
    // Handle form submission for updating reservation
    document.getElementById('editReservationForm').addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const reservationId = reservationSelect.value;
      const lab = document.querySelector('select[name="lab"]').value;
      const date = document.querySelector('input[name="date"]').value;
      const time = document.querySelector('select[name="time"]').value;
      const seat = document.querySelector('input[name="seat"]').value;
  
      try {
        const response = await fetch('/api/update-reservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reservationId, lab, date, time, seat })
        });
  
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          window.location.href = 'st_reservations_menu.html';
        } else {
          alert(result.error);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the reservation.');
      }
    });
  });
  