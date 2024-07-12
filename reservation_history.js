document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/reservations');
        if (!response.ok) {
            throw new Error('Failed to fetch reservations');
        }

        const { current, past } = await response.json();

        const pastReservationsList = document.getElementById('reservation-history-list');
        past.forEach(reservation => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="reservation-details">
                    <span class="lab">Lab ${reservation.labID.labname}</span>
                    <span class="seat">Seat ${reservation.seatnum}</span>
                    <span class="date">${new Date(reservation.timeslot.date).toLocaleDateString()}</span>
                    <span class="time">${reservation.timeslot.timestart}</span>
                </div>`;
            pastReservationsList.appendChild(li);
        });
    } catch (error) {
        console.error(error.message);
    }
});
