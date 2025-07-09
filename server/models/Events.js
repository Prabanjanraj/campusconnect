const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  club: { type: String, required: true }, // Club organizing the event
  description: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  imageurl: { type: String, required: true },     // Cloudinary image URL
  public_id: { type: String, required: true },     // For Cloudinary deletion
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
