document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/api/student-reservations');
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
  
      const reservations = await response.json();
  
      const pastReservationsList = document.getElementById('reservation-history-list');
      reservations.forEach(reservation => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="reservation-details">
            <span class="lab">Lab ${reservation.labname}</span>
            <span class="seat">Seat ${reservation.seatnum}</span>
            <span class="date">${new Date(reservation.date).toLocaleDateString()}</span>
            <span class="time">${reservation.time}</span>
          </div>`;
        pastReservationsList.appendChild(li);
      });
    } catch (error) {
      console.error(error.message);
    }
  });
  