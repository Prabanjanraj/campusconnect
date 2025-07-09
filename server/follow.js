// follow.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'yourSecretKey'; // Or use process.env.JWT_SECRET
const mongoose = require('mongoose');
const User = require('./models/User'); // or adjust path like '../models/User'


// 🧠 Middleware to authenticate user using JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Follow a club
router.post('/follow', authenticate, async (req, res) => {
  const { clubId } = req.body;

  if (!clubId) return res.status(400).json({ message: 'clubId is required' });

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.followedClubs.includes(clubId)) {
      user.followedClubs.push(clubId);
      await user.save();
    }

    res.json({ message: 'Club followed', followedClubs: user.followedClubs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ❌ Unfollow a club
router.post('/unfollow', authenticate, async (req, res) => {
  const { clubId } = req.body;

  if (!clubId) return res.status(400).json({ message: 'clubId is required' });

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.followedClubs = user.followedClubs.filter(id => id !== clubId);
    await user.save();

    res.json({ message: 'Club unfollowed', followedClubs: user.followedClubs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
