// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  followedClubs: [{ type: String }], // storing club IDs
}, { collection: 'Users' });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
