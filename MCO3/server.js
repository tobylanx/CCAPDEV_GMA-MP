const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Import models
const User = require('./models/User');
const Session = require('./models/Session');
const Laboratory = require('./models/Laboratory');
const Timeslot = require('./models/Timeslot');
const { Reservation } = require('./models/Reservation');
const bcrypt = require('bcrypt');

// Hard-coded connection string with the database name
const mongoUri = 'mongodb+srv://member1:gmaMPd4t4b4se@cluster0.1cvdsh7.mongodb.net/BookMyLab';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    populateDatabase();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

  const populateDatabase = async () => {
    try {
      // Check if there are any existing laboratories
      const existingLabs = await Laboratory.countDocuments();
      
      if (existingLabs === 0) {
        const labs = [
          {
            labname: 'Goks 123',
            location: 'Gokongwei Building 123',
            capacity: 20,
            seats: Array.from({ length: 20 }, (_, i) => ({ seatnum: i + 1 })),
          },
          {
            labname: 'Goks 234',
            location: 'Gokongwei Building 234',
            capacity: 20,
            seats: Array.from({ length: 20 }, (_, i) => ({ seatnum: i + 1 })),
          },
          {
            labname: 'Goks 345',
            location: 'Gokongwei Building 345',
            capacity: 20,
            seats: Array.from({ length: 20 }, (_, i) => ({ seatnum: i + 1 })),
          },
          {
            labname: 'Goks 456',
            location: 'Gokongwei Building 456',
            capacity: 20,
            seats: Array.from({ length: 20 }, (_, i) => ({ seatnum: i + 1 })),
          },
          {
            labname: 'Goks 567',
            location: 'Gokongwei Building 567',
            capacity: 20,
            seats: Array.from({ length: 20 }, (_, i) => ({ seatnum: i + 1 })),
          },
        ];
  
        const insertedLabs = await Laboratory.insertMany(labs);
        console.log('Database populated with sample data');
      } else {
        console.log('Labs already exist, skipping sample data population');
      }
    } catch (err) {
      console.error('Error populating database:', err.message);
    }
  };
  
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/register', [
  body('dlsuemail').isEmail().withMessage('Enter a valid email').matches(/@dlsu.edu.ph$/).withMessage('Email should end with @dlsu.edu.ph'),
  body('firstname').isLength({ min: 1, max: 25 }).withMessage('First name should be between 1 and 25 characters').toUpperCase(),
  body('lastname').isLength({ min: 1, max: 25 }).withMessage('Last name should be between 1 and 25 characters').toUpperCase(),
  body('password').isLength({ min: 8, max: 25 }).withMessage('Password should be between 8 and 25 characters')
    .matches(/[A-Z]/).withMessage('Password should contain at least one capital letter')
    .matches(/[!@#$%^&*(),.?":{}|<>_]/).withMessage('Password should contain at least one special character')
    .matches(/[0-9]/).withMessage('Password should contain at least one number'),
  body('role').isIn(['student', 'technician']).withMessage('Invalid role')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { dlsuemail, firstname, lastname, password, role } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: dlsuemail,
      firstname: firstname.toUpperCase(), // Ensure uppercase
      lastname: lastname.toUpperCase(), // Ensure uppercase
      password: hashedPassword, // Save the hashed password
      role,
      profile: {
        profilepic: '',
        bio: '',
      },
    });

    await newUser.save();
    if (role === 'student') {
      res.redirect('/menu_st.html');
    } else if (role === 'technician') {
      res.redirect('/menu_tech.html');
    } else {
      res.status(400).send('Invalid role');
    }
  } catch (err) {
    res.status(500).send('Error saving user: ' + err.message);
  }
});


app.post('/login', async (req, res) => {
  const { dlsuemail, password } = req.body;

  try {
    const user = await User.findOne({ email: dlsuemail });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const sessionToken = crypto.randomBytes(16).toString('hex');
    const dateExpired = new Date();
    dateExpired.setHours(dateExpired.getHours() + 1);

    const newSession = new Session({
      userId: user._id,
      sessionToken,
      dateStart: new Date(),
      dateExpired
    });

    await newSession.save();

    res.cookie('sessionToken', sessionToken, { httpOnly: true, expires: dateExpired });

    if (user.role === 'student') {
      res.json({ redirect: '/menu_st.html' });
    } else if (user.role === 'technician') {
      res.json({ redirect: '/menu_tech.html' });
    } else {
      res.status(400).json({ error: 'Invalid role' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error logging in: ' + err.message });
  }
});


const authenticateUser = async (req, res, next) => {
  const sessionToken = req.cookies.sessionToken;
  if (!sessionToken) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const session = await Session.findOne({ sessionToken }).populate('userId');
    if (!session || session.dateExpired < new Date()) {
      return res.status(401).send('Session expired or invalid');
    }
    req.user = session.userId;
    next();
  } catch (err) {
    res.status(500).send('Error verifying session: ' + err.message);
  }
};

app.get('/protected', authenticateUser, (req, res) => {
  res.send(`Hello ${req.user.firstname}, you have access to protected content!`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/api/request-password-reset', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ exists: false });
        }

        // For this implementation, we'll just confirm the email exists
        res.status(200).json({ exists: true });
    } catch (err) {
        res.status(500).json({ error: 'Error checking user: ' + err.message });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { email, newpassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);
        user.password = newpassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).json({ error: 'Error resetting password: ' + err.message });
    }
});

app.get('/api/bookings', async (req, res) => {
  const { lab, date, time } = req.query;

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const laboratory = await Laboratory.findOne({ labname: lab });
    if (!laboratory) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }

    const reservations = await Reservation.find({
      labID: laboratory._id,
      'timeslot.date': parsedDate,
      'timeslot.timestart': time
    }).populate('reservedby', 'firstname lastname');

    const allSeats = laboratory.seats.map(seat => {
      const reservation = reservations.find(r => r.seatnum === seat.seatnum);
      return {
        seatnum: seat.seatnum,
        reserved: !!reservation,
        reservedby: reservation ? (reservation.anonymous ? 'Anonymous' : `${reservation.reservedby.firstname} ${reservation.reservedby.lastname}`) : null,
        dateReserved: reservation ? reservation.dateReserved : null,
      };
    });

    res.json(allSeats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching bookings' });
  }
});

app.get('/api/public/bookings', async (req, res) => {
  const { lab, date, time } = req.query;

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const laboratory = await Laboratory.findOne({ labname: lab });
    if (!laboratory) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }

    const timeslot = await Timeslot.findOne({ date: parsedDate, timestart: time, "reservations.labID": laboratory._id }).populate('reservations.reservedby', 'firstname lastname');

    let reservations = [];
    if (timeslot) {
      reservations = timeslot.reservations;
    }

    const allSeats = laboratory.seats.map(seat => {
      const reservation = reservations.find(r => r.seatnum === seat.seatnum);
      return {
        seatnum: seat.seatnum,
        reserved: !!reservation,
        reservedby: reservation ? `${reservation.reservedby.firstname} ${reservation.reservedby.lastname}` : null,
        dateReserved: reservation ? reservation.dateReserved : null,
      };
    });

    res.json(allSeats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while fetching bookings' });
  }
});

app.post('/api/reserve', authenticateUser, async (req, res) => {
  const { lab, date, time, seats, anonymous, dlsuemail } = req.body;

  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ error: 'No seats selected' });
  }

  try {
    console.log("Received request with data:", { lab, date, time, seats, anonymous, dlsuemail });

    if (!date || !time) {
      return res.status(400).json({ error: 'Date and time are required' });
    }

    const parsedDate = new Date(date);
    console.log("Parsed date:", parsedDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const now = new Date();
    const [startHour, startMinute, startPeriod] = time.split(/:| /);
    const startDateTime = new Date(parsedDate);
    startDateTime.setHours(startPeriod === 'PM' && parseInt(startHour) !== 12 ? parseInt(startHour) + 12 : parseInt(startHour));
    startDateTime.setMinutes(parseInt(startMinute));
    console.log("Start DateTime:", startDateTime);

    if (startDateTime < now) {
      return res.status(400).json({ error: 'Cannot reserve a slot for a time that has already passed' });
    }

    const laboratory = await Laboratory.findOne({ labname: lab });
    if (!laboratory) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }

    let reservedByUser = req.user._id;
    if (dlsuemail) {
      const student = await User.findOne({ email: dlsuemail });
      if (!student) {
        return res.status(404).json({ error: 'Student email not found' });
      }
      reservedByUser = student._id;
    }

    const newReservations = seats.map(seat => ({
      labID: laboratory._id,
      seatnum: seat,
      reservedby: reservedByUser,
      anonymous,
      timeslot: {
        date: parsedDate,
        timestart: time
      },
      dateReserved: new Date()
    }));

    console.log("New reservations to insert:", newReservations);

    // Ensure the reservation does not already exist
    for (const reservation of newReservations) {
      const conflict = await Reservation.findOne({
        labID: reservation.labID,
        'timeslot.date': reservation.timeslot.date,
        'timeslot.timestart': reservation.timeslot.timestart,
        seatnum: reservation.seatnum
      });
      if (conflict) {
        console.log("Conflict found:", conflict);
        return res.status(400).json({ error: `Seat ${reservation.seatnum} is already reserved for the selected time slot.` });
      }
    }

    await Reservation.insertMany(newReservations);

    res.status(200).json({ message: 'Reservation successful' });
  } catch (err) {
    console.error("Error inserting reservation:", err);
    res.status(500).json({ error: 'Failed to make a reservation' });
  }
});

app.get('/api/user', authenticateUser, async (req, res) => {
  try {
      const user = await User.findById(req.user._id);
      res.json(user);
  } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

app.get('/api/checkUser', async (req, res) => {
  const { email } = req.query;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ exists: false });
      }
      res.status(200).json({ exists: true });
  } catch (err) {
      res.status(500).json({ error: 'Error checking user: ' + err.message });
  }
});

app.post('/api/cancel-reservation', authenticateUser, async (req, res) => {
  const { reservationId } = req.body;

  try {
    const reservation = await Reservation.findById(reservationId).populate('labID');

    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const reservationTime = new Date(reservation.timeslot.date);
    reservationTime.setHours(parseInt(reservation.timeslot.timestart.split(':')[0]));
    reservationTime.setMinutes(parseInt(reservation.timeslot.timestart.split(':')[1]));

    const currentTime = new Date();
    const tenMinutesAfter = new Date(reservationTime.getTime() + 10 * 60000);

    if (currentTime > tenMinutesAfter) {
      await Reservation.deleteOne({ _id: reservation._id });
      res.status(200).json({ message: 'Reservation cancelled successfully' });
    } else {
      res.status(400).json({ error: 'It is not yet 10 minutes past the reservation time' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

app.get('/api/eligible-reservations', authenticateUser, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('reservedby', 'firstname lastname').populate('labID');
    const currentTime = new Date();

    const eligibleReservations = reservations.filter(reservation => {
      const [hour, minute] = reservation.timeslot.timestart.split(':').map(Number);
      const reservationTime = new Date(reservation.timeslot.date);
      reservationTime.setHours(hour);
      reservationTime.setMinutes(minute);

      const tenMinutesAfter = new Date(reservationTime.getTime() + 10 * 60000);

      // Debugging logs
      console.log('Current Time:', currentTime);
      console.log('Reservation Time:', reservationTime);
      console.log('Ten Minutes After:', tenMinutesAfter);

      // Check if the current time is between the reservation time and ten minutes after
      return currentTime >= reservationTime && currentTime <= tenMinutesAfter;
    });

    res.status(200).json(eligibleReservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});


// Endpoint to fetch all reservations
app.get('/api/all-reservations', authenticateUser, async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('reservedby', 'firstname lastname').populate('labID');
    const formattedReservations = reservations.map(reservation => ({
      labname: reservation.labID.labname,
      seatnum: reservation.seatnum,
      reservedby: reservation.anonymous ? 'Anonymous' : `${reservation.reservedby.firstname} ${reservation.reservedby.lastname}`,
      date: reservation.timeslot.date,
      time: reservation.timeslot.timestart,
    }));
    res.status(200).json(formattedReservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});


app.get('/api/student-reservations', authenticateUser, async (req, res) => {
  try {
    const reservations = await Reservation.find({ reservedby: req.user._id })
      .populate('labID', 'labname');
    const formattedReservations = reservations.map(reservation => ({
      labname: reservation.labID.labname,
      seatnum: reservation.seatnum,
      date: reservation.timeslot.date,
      time: reservation.timeslot.timestart,
    }));
    res.status(200).json(formattedReservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

app.get('/api/current-reservations', authenticateUser, async (req, res) => {
  try {
    const currentDate = new Date();

    const reservations = await Reservation.find({ reservedby: req.user._id, 'timeslot.date': { $gte: currentDate } })
      .populate('labID', 'labname');

    const formattedReservations = reservations.map(reservation => ({
      labname: reservation.labID.labname,
      seatnum: reservation.seatnum,
      date: reservation.timeslot.date,
      time: reservation.timeslot.timestart,
    }));

    res.status(200).json(formattedReservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

app.post('/api/update-reservation', authenticateUser, async (req, res) => {
  const { reservationId, lab, date, time, seats } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reservationId)) {
    return res.status(400).json({ error: 'Invalid reservation ID' });
  }

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    if (!time) {
      return res.status(400).json({ error: 'Invalid time' });
    }

    const laboratory = await Laboratory.findOne({ labname: lab });
    if (!laboratory) {
      return res.status(404).json({ error: 'Laboratory not found' });
    }

    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    for (const seat of seats) {
      const conflict = await Reservation.findOne({
        labID: laboratory._id,
        'timeslot.date': parsedDate,
        'timeslot.timestart': time,
        seatnum: seat,
        _id: { $ne: reservationId }  // Exclude the current reservation from the conflict check
      });

      if (conflict) {
        return res.status(400).json({ error: `Seat ${seat} is already reserved for the selected time slot.` });
      }
    }

    reservation.labID = laboratory._id;
    reservation.timeslot.date = parsedDate;
    reservation.timeslot.timestart = time;
    reservation.seatnum = seats;
    await reservation.save();

    res.status(200).json({ message: 'Reservation updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});



app.post('/api/update-profile', authenticateUser, upload.single('profilepic'), async (req, res) => {
  const { bio } = req.body;
  let profilepic = '';

  if (req.file) {
    profilepic = `/uploads/${req.file.filename}`;
  }

  try {
    const updateData = {
      profile: {
        bio,
      }
    };

    if (profilepic) {
      updateData.profile.profilepic = profilepic;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });

    // Redirect based on user role
    if (updatedUser.role === 'student') {
      res.redirect('/st_profile.html');
    } else if (updatedUser.role === 'technician') {
      res.redirect('/tech_profile.html');
    } else {
      res.status(500).send('Failed to determine user role');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update profile');
  }
});

app.get('/api/user-profile', authenticateUser, async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const user = await User.findById(userId, 'firstname lastname profile');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'An error occurred while fetching user profile' });
  }
});

app.get('/api/user-reservations', authenticateUser, async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const reservations = await Reservation.find({ reservedby: userId })
      .populate('labID', 'labname')
      .exec();

    res.status(200).json(reservations);
  } catch (err) {
    console.error('Error fetching user reservations:', err);
    res.status(500).json({ error: 'An error occurred while fetching user reservations' });
  }
});


app.get('/api/search-user', authenticateUser, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const users = await User.find({
      $or: [
        { email: new RegExp(query, 'i') },
        { firstname: new RegExp(query, 'i') },
        { lastname: new RegExp(query, 'i') }
      ]
    }, 'email firstname lastname role');

    console.log(`Search results: ${JSON.stringify(users)}`);
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while searching for users' });
  }
});





app.post('/api/delete-profile', authenticateUser, async (req, res) => {
  const { email, password } = req.body;
  const authenticatedUserEmail = req.user.email; // Assuming req.user is set by authenticateUser middleware

  if (email !== authenticatedUserEmail) {
      return res.status(403).json({ error: 'You can only delete your own profile' });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: 'Incorrect password' });
      }

      await User.deleteOne({ _id: user._id });
      res.clearCookie('sessionToken');
      res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: 'Error deleting profile: ' + err.message });
  }
});

app.get('/api/search-user', authenticateUser, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  app.get('/api/user', authenticateUser, async (req, res) => {
    const { userId } = req.query;
  
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
  
    try {
      const user = await User.findById(userId, 'firstname lastname email role');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching user profile' });
    }
  });
  


  try {
    const users = await User.find({
      $or: [
        { email: new RegExp(query, 'i') },
        { firstname: new RegExp(query, 'i') },
        { lastname: new RegExp(query, 'i') }
      ]
    }, 'email firstname lastname role');  // Include the role field

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while searching for users' });
  }
});

const updateExistingPasswords = async () => {
  try {
    const users = await User.find({});

    for (const user of users) {
      if (!user.password.startsWith('$2b$')) {  // Check if the password is not hashed
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        await user.save();
        console.log(`Password hashed for user: ${user.email}`);
      }
    }
    console.log('All user passwords hashed');
  } catch (err) {
    console.error('Error hashing passwords:', err.message);
  }
};

updateExistingPasswords();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});