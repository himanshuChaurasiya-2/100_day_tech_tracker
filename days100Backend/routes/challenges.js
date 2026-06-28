import express from 'express';
import { Challenge } from '../models/challenges.js';

const router = express.Router();

router.get('/challenges', async (req, res) => {
  try {
    const { tech, diff, query, limit = 8 } = req.query;
    const mongoQuery = {};

    if (tech && tech !== 'all') mongoQuery.tech = tech;
    if (diff && diff !== 'all') mongoQuery.diff = parseInt(diff, 10);

    if (query) {
      const cleanQuery = query.trim();
      const dayMatch = cleanQuery.match(/^day\s+(\d+)$/i) || cleanQuery.match(/^(\d+)$/);
      
      if (dayMatch) {
        mongoQuery.day = parseInt(dayMatch, 10);
      } else {
        mongoQuery.$text = { $search: cleanQuery };
      }
    }

    const maxLimit = parseInt(limit, 10);
    const challenges = await Challenge.find(mongoQuery)
      .select('-code')
      .sort({ day: 1 })
      .limit(maxLimit)
      .lean();
    const totalCount = await Challenge.countDocuments(mongoQuery);

    res.json({
      challenges,
      hasMore: maxLimit < totalCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error retrieving challenges.' });
  }
});

router.get('/challenges/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const challenge = await Challenge.findById(id).lean();
    
    if (!challenge) {
      return res.status(404).json({ error: 'Tech challenge record not found.' });
    }
    
    res.json(challenge);
  } catch (error) {
    console.error("Single Fetch Error:", error);
    res.status(500).json({ error: 'Server error parsing resource payload.' });
  }
});

export default router;
