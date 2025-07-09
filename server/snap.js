const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');
const SnapModel = require('./models/Snap'); 


// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'snaps',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});
const upload = multer({ storage });

router.post('/snaps', upload.single('image'), async (req, res) => {
  try {
    const { caption, user } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image not uploaded' });
    }
    console.log('File uploaded to:', req.file.path);
console.log('Cloudinary file:', req.file);


    const snap = await SnapModel.create({
      user,
      imageUrl: req.file.path, // Cloudinary URL
      caption,
    });
    res.status(201).json(snap);
  } catch (err) {
    console.error('Upload Error:', err); // 🔥 Add this line
    res.status(500).json({ error: 'Failed to upload snap' });
  }
});


router.get('/snaps', async (req, res) => {
  try {
    const snaps = await SnapModel.find().sort({ timestamp: -1 });
    res.json(snaps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch snaps' });
  }
});

module.exports = router;
