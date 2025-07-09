const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Mongoose model
const History = mongoose.model('History', new mongoose.Schema({
  club: String,
  imageurl: String,
  public_id: String, // For Cloudinary deletion
  description: String,
}));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'club-history',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage });

/**
 * @route POST /api/history
 * @desc Upload history image and data
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { club, description } = req.body;
    const imageurl = req.file.path;
    const public_id = req.file.filename; // Cloudinary's public ID

    const newHistory = new History({ club, description, imageurl, public_id });
    await newHistory.save();

    res.status(201).json(newHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving history' });
  }
});

/**
 * @route GET /api/history/:club
 * @desc Get all history for a club
 */
router.get('/:club', async (req, res) => {
  try {
    const history = await History.find({ club: req.params.club }).sort({ _id: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching history' });
  }
});

/**
 * @route DELETE /api/history/des/:id
 * @desc Delete a history entry and its image from Cloudinary
 */
router.delete('/des/:id', async (req, res) => {
  try {
    console.log('Requested ID:', req.params.id);

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const historyEntry = await History.findById(req.params.id);

    if (!historyEntry) {
      return res.status(404).json({ message: 'History entry not found' });
    }

    // Delete image from Cloudinary
    if (historyEntry.public_id) {
      await cloudinary.uploader.destroy(historyEntry.public_id);
      console.log(`Deleted image from Cloudinary: ${historyEntry.public_id}`);
    }

    // Delete from MongoDB
    await historyEntry.deleteOne();

    res.json({ message: 'History entry and image deleted successfully' });
  } catch (error) {
    console.error('Error deleting history:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
