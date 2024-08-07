document.addEventListener('DOMContentLoaded', async () => {
    const addSeatButton = document.getElementById('addSeatButton');
    const seatContainer = document.getElementById('seatContainer');
    const reservationSelect = document.getElementById('reservation-select');
    const labSelect = document.querySelector('select[name="lab"]');
    const dateSelect = document.getElementById('date-select');
    const timeSelect = document.querySelector('select[name="time"]');
    const reservationIdField = document.getElementById('reservation-id');
  
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
  
    // Populate initial seat select options if exists
    const initialSeatSelect = seatContainer.querySelector('.seat-select');
    if (initialSeatSelect) {
      initialSeatSelect.innerHTML = generateSeatOptions();
    }
  
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
  
    dateSelect.addEventListener('change', filterTimeOptions);
    filterTimeOptions(); // Initial call to filter based on the current date
  
    // Fetch and display future reservations based on user role
    try {
      const response = await fetch('/api/current-reservations');
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }
      const reservations = await response.json();
  
      reservationSelect.innerHTML = '<option value="">Select a reservation</option>';
      reservations.forEach(reservation => {
        const option = document.createElement('option');
        option.value = reservation._id; // Ensure this is the original reservation ID
        option.textContent = `Lab: ${reservation.labname}, Seat: ${reservation.seatnum}, Date: ${new Date(reservation.date).toLocaleDateString()}, Time: ${reservation.time}`;
        reservationSelect.appendChild(option);
      });
  
      // Populate the form fields when a reservation is selected
      reservationSelect.addEventListener('change', () => {
        const selectedReservation = reservations.find(reservation => reservation._id === reservationSelect.value);
        if (selectedReservation) {
          console.log('Selected Reservation:', selectedReservation); // Debug log
          labSelect.value = selectedReservation.labname;
          dateSelect.value = new Date(selectedReservation.date).toISOString().split('T')[0];
          filterTimeOptions(new Date(selectedReservation.date));
          timeSelect.value = selectedReservation.time;
  
          // Set the reservation ID in the hidden input field
          reservationIdField.value = selectedReservation._id;
          console.log('Reservation ID set to:', reservationIdField.value); // Debug log
  
          // Populate initial seat select options
          seatContainer.innerHTML = '';
          const seatEntry = document.createElement('div');
          seatEntry.classList.add('seat-entry');
  
          const label = document.createElement('label');
          label.textContent = 'Choose Seat ID (1-20):';
  
          const select = document.createElement('select');
          select.className = 'seat-select';
          select.name = 'seat';
          select.innerHTML = generateSeatOptions([selectedReservation.seatnum]);
  
          seatEntry.appendChild(label);
          seatEntry.appendChild(select);
          seatContainer.appendChild(seatEntry);
        }
      });
  
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
    }
  
    // Form submission handler
    document.getElementById('editReservationForm').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const reservationId = reservationIdField.value;
      const lab = labSelect.value;
      const date = dateSelect.value;
      const time = timeSelect.value;
      const seats = Array.from(document.querySelectorAll('select[name="seat"]')).map(seat => seat.value);
  
      console.log('Submitting with reservation ID:', reservationId); // Debug log
  
      if (!reservationId) {
        alert('Please select a reservation to edit');
        return;
      }
  
      if (!date || !time) {
        alert('Date and time are required');
        return;
      }
  
      try {
        const response = await fetch('/api/update-reservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ reservationId, lab, date, time, seats })
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error);
        }
  
        alert('Reservation updated successfully');
        window.location.href = 'st_reservations_menu.html';
      } catch (error) {
        alert('Failed to update the reservation: ' + error.message);
        console.log('Backend Error:', error); // Debug log
      }
    });
  });
  