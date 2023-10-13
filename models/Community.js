const mongoose = require('mongoose');
const CommunitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    maxlength: 64,
    default: null,
  },
  slug: {
    type: String,
    unique: true,
    maxlength: 128,
  },
  owner: {
    type: String,
    ref: 'User',
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now
  },
});

const Community = mongoose.model('Community', CommunitySchema);

module.exports = Community;
