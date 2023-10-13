const mongoose = require('mongoose');
const {User}  = require('../models/User')// const {Member}  = require('../models/Member')
const {Role}  = require('../models/Role')
const {Community}  = require('../models/Community')


const MemberSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  community: {
    type: String,
    ref: 'Community',
    required: true,
  },
  user: {
    type: String,
    ref: 'User', 
    required: true,
  },
  role: {
    type: String,
    ref: 'Role',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
