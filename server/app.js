const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./auth');
app.use('/api/auth', authRoutes);

const timelineRoutes = require('./timeline');
app.use('/api/timeline', timelineRoutes);

const followRoutes = require('./follow');
app.use('/api/user', followRoutes);


const snapRoutes = require('./snap');
app.use('/api/snap', snapRoutes);

const eventRoutes = require('./events');
app.use('/api/events', eventRoutes);

const historyRoutes = require('./history');
app.use('/api/history', historyRoutes);

// Connect to MongoDB (correct DB: clubDB)
mongoose.connect('mongodb://localhost:27017/clubDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  admin1: String,
  admin2: String
}, {
  collection: 'Club'  // Force Mongoose to use correct collection
});

const Club = mongoose.model('Club', clubSchema);


// ✅ Route to get all clubs (full object)
app.get('/api/clubs', async (req, res) => {
  try {
    const clubs = await Club.find(); // return all fields
    res.json(clubs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
