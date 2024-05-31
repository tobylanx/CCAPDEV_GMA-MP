document.addEventListener('DOMContentLoaded', () => {
    const scheduleGrid = document.getElementById('scheduleGrid');
    const days = 7; // Number of days to display
    const labs = 3; // Number of labs
    const seatsPerLab = 20; // Number of seats per lab per day

    // Sample data: Booked slots (normally this would come from a server)
    const bookedSeats = {
        '2024-06-01': { 'lab1': [1, 5, 10], 'lab2': [3, 7, 15], 'lab3': [2, 8, 18] },
        '2024-06-02': { 'lab1': [4, 6, 14], 'lab2': [1, 9, 11], 'lab3': [5, 7, 12] },
        // Add more dates and booked slots as needed
    };

    // Function to create the grid
    const createScheduleGrid = () => {
        for (let lab = 1; lab <= labs; lab++) {
            for (let day = 0; day < days; day++) {
                const date = `2024-06-${String(day + 1).padStart(2, '0')}`;

                for (let seat = 1; seat <= seatsPerLab; seat++) {
                    const slotElement = document.createElement('div');
                    slotElement.classList.add('slot');
                    slotElement.classList.add('available');
                    slotElement.dataset.lab = `lab${lab}`;
                    slotElement.dataset.day = date;
                    slotElement.dataset.seat = seat;
                    slotElement.title = `Lab ${lab} - Day ${date} - Seat ${seat}`;
                    
                    // Check if the seat is booked
                    if (bookedSeats[date] && bookedSeats[date][`lab${lab}`] && bookedSeats[date][`lab${lab}`].includes(seat)) {
                        slotElement.classList.remove('available');
                        slotElement.classList.add('booked');
                        slotElement.title += ' (Booked)';
                        slotElement.innerHTML = '<a href="student-profile.html?user_id=1">Booked</a>'; // Placeholder link to user's profile
                    }

                    scheduleGrid.appendChild(slotElement);
                }
            }
        }
    };

    createScheduleGrid();
});
