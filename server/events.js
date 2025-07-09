const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Event = require('./models/Events'); 

// Mongoose schem
// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'events',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, crop: 'limit' }],
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/events
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, club, description, startDate, endDate } = req.body;
    const imageurl = req.file.path;
    const public_id = req.file.filename || req.file.public_id; // may vary by multer-storage-cloudinary version

    const newEvent = new Event({ name, club, description, startDate, endDate, imageurl, public_id });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Event upload failed' });
  }
});

// GET /api/events/all
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error('Error fetching all events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});


// GET /api/events/:club
router.get('/:club', async (req, res) => {
  try {
    const events = await Event.find({ club: req.params.club }).sort({ startDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetching events failed' });
  }
});


// DELETE /api/events/by-name/:name
router.delete('/by-name/:name', async (req, res) => {
  try {
    const deleted = await Event.findOneAndDelete({
      name: { $regex: `^${req.params.name}$`, $options: 'i' }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete from Cloudinary if public_id exists
    if (deleted.public_id) {
      try {
        await cloudinary.uploader.destroy(deleted.public_id);
      } catch (err) {
        console.warn('Image deletion from Cloudinary failed:', err.message);
      }
    }

    res.json({ message: 'Event deleted successfully', deletedEvent: deleted });
  } catch (err) {
    console.error('Error deleting event:', err.message, err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.send('Events route working!');
});

module.exports = router;
