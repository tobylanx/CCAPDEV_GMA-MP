document.addEventListener('DOMContentLoaded', function() {
  const labSelect = document.getElementById('lab-select');
  const dateSelect = document.getElementById('date-select');
  const timeSelect = document.getElementById('time-select');
  const scheduleGrid = document.getElementById('scheduleGrid');

  function setDateRange() {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const formatDate = (date) => date.toISOString().split('T')[0];

    dateSelect.min = formatDate(today);
    dateSelect.max = formatDate(nextWeek);

    dateSelect.value = formatDate(today);
  }

  async function fetchBookings() {
    const lab = labSelect.value;
    const date = dateSelect.value;
    const time = timeSelect.value;

    try {
      const response = await fetch(`/api/bookings?lab=${encodeURIComponent(lab)}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const bookings = await response.json();
      console.log('Bookings fetched:', bookings);
      updateScheduleGrid(bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }

  function updateScheduleGrid(bookings) {
    scheduleGrid.innerHTML = '';

    for (let i = 1; i <= 20; i++) {
      const booking = bookings.find(b => b.seatnum === i);
      const slot = document.createElement('div');
      slot.className = 'slot ' + (booking && booking.reserved ? 'booked' : 'available');
      slot.style.padding = '10px';
      slot.style.margin = '5px';
      slot.style.textAlign = 'center';
      slot.style.borderRadius = '5px';

      if (booking && booking.reserved) {
        slot.innerHTML = `Seat ${i}: ${booking.anonymous ? 'Anonymous' : booking.reservedby}`;
        slot.title = `Reserved on: ${new Date(booking.dateReserved).toLocaleDateString()}`;
        slot.dataset.userId = booking.reservedby._id; // Ensure this is correctly set
        slot.addEventListener('click', viewUserProfile); // Add click event listener
      } else {
        slot.textContent = `Seat ${i}: Available`;
        slot.title = '';
      }
      scheduleGrid.appendChild(slot);
    }
  }

  async function viewUserProfile(event) {
    const userId = event.currentTarget.dataset.userId;

    if (!userId) {
      console.error('User ID is undefined');
      return;
    }

    try {
      const response = await fetch(`/api/user-profile?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const user = await response.json();
      
      // Redirect to profile page with user data
      window.location.href = `/view_user.html?userId=${userId}`;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  labSelect.addEventListener('change', fetchBookings);
  dateSelect.addEventListener('change', fetchBookings);
  timeSelect.addEventListener('change', fetchBookings);

  setDateRange(); // Initialize the date input range and default value
  fetchBookings(); // Initial load
});
