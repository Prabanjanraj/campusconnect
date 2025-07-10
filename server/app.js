const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./auth');
const timelineRoutes = require('./timeline');
const followRoutes = require('./follow');
const snapRoutes = require('./snap');
const eventRoutes = require('./events');
const historyRoutes = require('./history');

app.use('/api/auth', authRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/user', followRoutes);
app.use('/api/snap', snapRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/history', historyRoutes);

// Connect to MongoDB using .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  admin1: String,
  admin2: String
}, {
  collection: 'Club'
});
const Club = mongoose.model('Club', clubSchema);

// Get all clubs
app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Listen on port from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
