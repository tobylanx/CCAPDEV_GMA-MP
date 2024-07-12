document.addEventListener('DOMContentLoaded', () => {
    const addSeatButton = document.getElementById('addSeatButton');
    const seatContainer = document.getElementById('seatContainer');
  
    const generateSeatOptions = (selectedSeats = []) => {
      const options = [];
      for (let i = 1; i <= 20; i++) {
        if (!selectedSeats.includes(i.toString())) {
          options.push(`<option value="${i}">${i}</option>`);
        }
      }
      return options.join('');
    };
  
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
  
    seatContainer.addEventListener('change', (e) => {
      if (e.target.classList.contains('seat-select')) {
        const selectedSeats = Array.from(seatContainer.querySelectorAll('.seat-select'))
          .map(select => select.value);
  
        Array.from(seatContainer.querySelectorAll('.seat-select')).forEach(select => {
          const currentValue = select.value;
          select.innerHTML = generateSeatOptions(selectedSeats.filter(seat => seat !== currentValue));
          select.value = currentValue;
        });
      }
    });
  
    document.getElementById('reservationForm').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const lab = document.querySelector('select[name="lab"]').value;
      const date = document.querySelector('select[name="date"]').value;
      const time = document.querySelector('select[name="time"]').value;
      const seats = Array.from(document.querySelectorAll('select[name="seat"]')).map(seat => seat.value);
      const anonymous = document.querySelector('input[name="anonymous"]').checked;
      const dlsuemail = document.querySelector('input[name="dlsuemail"]') ? document.querySelector('input[name="dlsuemail"]').value : null;
  
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
  });
  