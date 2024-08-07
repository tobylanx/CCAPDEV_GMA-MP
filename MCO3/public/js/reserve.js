document.addEventListener('DOMContentLoaded', () => {
  const addSeatButton = document.getElementById('addSeatButton');
  const seatContainer = document.getElementById('seatContainer');

  // Generate seat options excluding already selected seats
  const generateSeatOptions = (selectedSeats = []) => {
      const options = [];
      for (let i = 1; i <= 20; i++) {
          if (!selectedSeats.includes(i.toString())) {
              options.push(`<option value="${i}">${i}</option>`);
          }
      }
      return options.join('');
  };

  // Populate initial seat select options
  const initialSeatSelect = seatContainer.querySelector('.seat-select');
  initialSeatSelect.innerHTML = generateSeatOptions();

  // Add another seat selection
  addSeatButton.addEventListener('click', () => {
      const selectedSeats = Array.from(seatContainer.querySelectorAll('.seat-select')).map(select => select.value);

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

  // Update seat options dynamically when seat selection changes
  seatContainer.addEventListener('change', (e) => {
      if (e.target.classList.contains('seat-select')) {
          const selectedSeats = Array.from(seatContainer.querySelectorAll('.seat-select')).map(select => select.value);

          Array.from(seatContainer.querySelectorAll('.seat-select')).forEach(select => {
              const currentValue = select.value;
              select.innerHTML = generateSeatOptions(selectedSeats.filter(seat => seat !== currentValue));
              select.value = currentValue;
          });
      }
  });

  // Populate date options for the next 7 days
  const populateDates = () => {
      const dateSelect = document.getElementById('date-select');
      const today = new Date();

      for (let i = 0; i < 7; i++) {
          const dateOption = document.createElement('option');
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          dateOption.value = date.toISOString().split('T')[0];
          dateOption.textContent = date.toISOString().split('T')[0];
          dateSelect.appendChild(dateOption);
      }
  };

  populateDates();

  // Filter past time slots for the selected date
  const filterTimeOptions = () => {
      const timeSelect = document.querySelector('select[name="time"]');
      const dateSelect = document.querySelector('select[name="date"]');
      const selectedDate = new Date(dateSelect.value);
      const currentTime = new Date();
      const timeOptions = [
          '9:00 AM - 9:30 AM',
          '9:30 AM - 10:00 AM',
          '10:00 AM - 10:30 AM',
          '10:30 AM - 11:00 AM',
          '11:00 AM - 11:30 AM',
          '11:30 AM - 12:00 PM',
          '12:00 PM - 12:30 PM',
          '12:30 PM - 1:00 PM',
          '1:00 PM - 1:30 PM',
          '1:30 PM - 2:00 PM',
          '2:00 PM - 2:30 PM',
          '2:30 PM - 3:00 PM',
          '3:00 PM - 3:30 PM',
          '3:30 PM - 4:00 PM',
          '4:00 PM - 4:30 PM',
          '4:30 PM - 5:00 PM'
      ];

      const filteredOptions = timeOptions.filter(time => {
          const [hour, minute, period] = time.split(/:| /);
          const slotTime = new Date(selectedDate);
          slotTime.setHours(period === 'PM' && parseInt(hour) !== 12 ? parseInt(hour) + 12 : parseInt(hour));
          slotTime.setMinutes(parseInt(minute));

          return slotTime > currentTime;
      });

      timeSelect.innerHTML = filteredOptions.map(option => `<option value="${option}">${option}</option>`).join('');
  };

  document.querySelector('select[name="date"]').addEventListener('change', filterTimeOptions);
  filterTimeOptions(); // Initial call to filter based on the current date

  // Form submission handler
  document.getElementById('reservationForm').addEventListener('submit', async (event) => {
      event.preventDefault();

      const lab = document.querySelector('select[name="lab"]').value;
      const date = document.querySelector('select[name="date"]').value;
      const time = document.querySelector('select[name="time"]').value;
      const seats = Array.from(document.querySelectorAll('select[name="seat"]')).map(seat => seat.value);
      const anonymous = document.querySelector('input[name="anonymous"]').checked;
      const dlsuemail = document.querySelector('input[name="dlsuemail"]') ? document.querySelector('input[name="dlsuemail"]').value : null;

      console.log({ lab, date, time, seats, anonymous, dlsuemail });

      if (!date || !time) {
          alert('Date and time are required');
          return;
      }

      if (dlsuemail && !dlsuemail.includes('@dlsu.edu.ph')) {
          alert('Invalid student email');
          return;
      }

      try {
          const response = await fetch('/api/reserve', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ lab, date, time, seats, anonymous, dlsuemail })
          });

          const result = await response.json();

          if (!response.ok) {
              throw new Error(result.error);
          }

          alert('Reservation successful');
          window.location.reload();
      } catch (error) {
          alert('Failed to make a reservation: ' + error.message);
      }
  });
});
