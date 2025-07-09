const express = require('express');
const router = express.Router();
const Snap = require('./models/Snap');
const Event = require('./models/Events');

router.get('/:userId', async (req, res) => {
  try {
    // Get all general snaps (no club associated)
    const snaps = await Snap.find({ club: null }).sort({ timestamp: -1 });

    // Get all events (from any club)
    const events = await Event.find({});

    // Tag snaps with type
    const snapsWithType = snaps.map(snap => ({
      ...snap._doc,
      type: 'snap',
      createdAt: snap.timestamp || snap.createdAt || null
    }));

    // Tag events with type
    const eventsWithType = events.map(event => ({
      ...event._doc,
      type: 'event',
      createdAt: event.startDate || event.createdAt || null
    }));

    // Merge and sort
    const merged = [...snapsWithType, ...eventsWithType].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(merged);
  } catch (err) {
    console.error('Timeline error:', err);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

module.exports = router;
