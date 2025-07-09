const mongoose = require('mongoose');

const snapSchema = new mongoose.Schema({
  user: { type: String, required: true },         // Optional: can use ObjectId ref if needed
  imageUrl: { type: String, required: true },
  caption: { type: String, default: '' },
  club: { type: String, default: null },          // Optional: for personalization
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto delete after 24 hours (TTL index)
  }
});

const Snap = mongoose.model('Snap', snapSchema);
module.exports = Snap;
