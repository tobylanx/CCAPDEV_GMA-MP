window.onload = function() {
    fetch('/api/all-reservations')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector('#reservations-table tbody');
        tableBody.innerHTML = ''; // Clear previous rows
  
        if (data.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="5">No reservations found</td></tr>';
        } else {
          data.forEach(reservation => {
            const row = document.createElement('tr');
  
            const labCell = document.createElement('td');
            labCell.textContent = reservation.labname;
            row.appendChild(labCell);
  
            const seatCell = document.createElement('td');
            seatCell.textContent = reservation.seatnum;
            row.appendChild(seatCell);
  
            const reservedByCell = document.createElement('td');
            reservedByCell.textContent = reservation.reservedby;
            row.appendChild(reservedByCell);
  
            const dateCell = document.createElement('td');
            dateCell.textContent = new Date(reservation.date).toLocaleDateString();
            row.appendChild(dateCell);
  
            const timeCell = document.createElement('td');
            timeCell.textContent = reservation.time;
            row.appendChild(timeCell);
  
            tableBody.appendChild(row);
          });
        }
      })
      .catch(error => console.error('Error loading reservations:', error));
  };
  