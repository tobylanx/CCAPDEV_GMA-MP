document.addEventListener('DOMContentLoaded', () => {
    const addSeatButton = document.getElementById('addSeatButton');
    const seatContainer = document.getElementById('seatContainer');

    // Function to generate seat options
    const generateSeatOptions = (selectedSeats = []) => {
        const options = [];
        for (let i = 1; i <= 20; i++) {
            if (!selectedSeats.includes(i.toString())) {
                options.push(`<option value="${i}">${i}</option>`);
            }
        }
        return options.join('');
    };

    // Initial population of the first seat select
    const initialSeatSelect = seatContainer.querySelector('.seat-select');
    initialSeatSelect.innerHTML = generateSeatOptions();

    addSeatButton.addEventListener('click', () => {
        const selectedSeats = Array.from(seatContainer.querySelectorAll('.seat-select'))
            .map(select => select.value);

        const seatEntry = document.createElement('div');
        seatEntry.classList.add('seat-entry');

        const label = document.createElement('label');
        label.textContent = 'Choose Seat ID (1-20):';

        const select = document.createElement('select');
        select.className = 'seat-select';
        select.name = 'seat';
        select.innerHTML = generateSeatOptions(selectedSeats);

        seatEntry.appendChild(label);
        seatEntry.appendChild(select);
        seatContainer.appendChild(seatEntry);
    });

    // Update available options when a seat is selected
    seatContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('seat-select')) {
            const selectedSeats = Array.from(seatContainer.querySelectorAll('.seat-select'))
                .map(select => select.value);

            Array.from(seatContainer.querySelectorAll('.seat-select')).forEach(select => {
                const currentValue = select.value;
                select.innerHTML = generateSeatOptions(selectedSeats);
                select.value = currentValue; // Preserve the current value
            });
        }
    });
});

