const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  profile: {
    profilepic: { type: String, default: '' },
    bio: { type: String, default: '' }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
