document.addEventListener('DOMContentLoaded', function() {
    const labSelect = document.getElementById('lab-select');
    const dateSelect = document.getElementById('date-select');
    const timeSelect = document.getElementById('time-select');
    const scheduleGrid = document.getElementById('scheduleGrid');

    // Simulated nested data for bookings
    const bookings = {
        'lab1': {
            '2024-06-01': {
                '9:00 AM - 9:30 AM': [{ seat: 1, booked: true, user: 'Marsha', userId: '101' }, { seat: 5,  booked:true, user: 'Therese', userId: '104' }],
                '9:30 AM - 10:00 AM': [{ seat: 1, booked: false }, { seat: 2, booked: true, user: 'Gela', userId: '102' }]
            },
            '2024-06-02': {
                '9:00 AM - 9:30 AM': [{ seat: 1, booked: true, user: 'Gen', userId: '103' }, { seat: 2, booked: true, user: 'Therese', userId: '104' }]
            }
        },
        'lab2': {
            '2024-06-01': {
                '9:00 AM - 9:30 AM': [{ seat: 1, booked: false }, { seat: 2, booked: false }]
            }
        }
    };

    function updateScheduleGrid() {
        const lab = labSelect.value;
        const date = dateSelect.value;
        const time = timeSelect.value;

        const sessionBookings = bookings[lab]?.[date]?.[time] || [];
        scheduleGrid.innerHTML = ''; // Clear the grid first

        for (let i = 1; i <= 20; i++) { // Assuming each lab has 20 seats
            const booking = sessionBookings.find(b => b.seat === i);
            const slot = document.createElement('div');
            slot.className = 'slot ' + (booking?.booked ? 'booked' : 'available');
            slot.style.padding = '10px';
            slot.style.margin = '5px';
            slot.style.textAlign = 'center';
            slot.style.borderRadius = '5px';

            if (booking?.booked) {
                slot.innerHTML = `Seat ${i}: <a href="profile.html?user=${booking.userId}" style="color: inherit; text-decoration: none;">${booking.user}</a>`;
            } else {
                slot.textContent = `Seat ${i}: Available`;
            }
            scheduleGrid.appendChild(slot);
        }
    }

    labSelect.addEventListener('change', updateScheduleGrid);
    dateSelect.addEventListener('change', updateScheduleGrid);
    timeSelect.addEventListener('change', updateScheduleGrid);

    updateScheduleGrid(); // Initial load of the grid
});
