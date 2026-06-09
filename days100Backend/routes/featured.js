// routes/featured.js
import express from 'express';
import { Challenge } from '../models/challenges.js';

const router = express.Router();

// Public: Fetch the absolute latest challenge submitted
router.get('/challenges/featured', async (req, res) => {
  try {
    // Finds the document with the highest day tracker number
    const latestChallenge = await Challenge.findOne()
      .sort({ day: -1, createdAt: -1 }) 
      .lean();

    if (!latestChallenge) {
      return res.status(404).json({ error: 'No challenges logged in database yet.' });
    }

    res.json(latestChallenge);
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving spotlight challenge data.' });
  }
});

export default router;
