const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // Assuming it's a primary key
  },
  name: {
    type: String,
    maxlength: 64,
    default: null,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 128,
  },
  password: {
    type: String,
    maxlength: 64,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
