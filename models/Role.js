const mongoose = require('mongoose');
// const {User}  = require('../models/User')
// const {Community}  = require('../models/Community')
const RoleSchema = new mongoose.Schema({
  id: {
    type: String, 
    required: true,
    unique: true, 
  },
  name: {
    type: String,  
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Role = mongoose.model('Role', RoleSchema);

module.exports = Role;
