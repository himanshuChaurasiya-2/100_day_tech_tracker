import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Challenge } from '../models/challenges.js';
import { verifyAdminToken } from '../middleware/auth.js';

const router = express.Router();

// Password-only login endpoint
router.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password field is required.' });
    }

    const hashedMaster = process.env.ADMIN_PASSWORD_HASH;
    if (!hashedMaster) {
      return res.status(500).json({ error: 'Master security keys are unconfigured in backend.' });
    }

    const isPasswordValid = await bcrypt.compare(password, hashedMaster);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid console access password.' });
    }

    // Issue standard authorization token valid for 4 hours
    const token = jwt.sign({ role: 'sole_admin' }, process.env.JWT_SECRET, { expiresIn: '4h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal server verification error.' });
  }
});

// Get all challenges for admin list view
router.get('/api/admin/challenges', verifyAdminToken, async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ day: 1 });
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve challenges.' });
  }
});

// Create new challenge from pop-up form
router.post('/api/admin/challenges', verifyAdminToken, async (req, res) => {
  try {
    const { day, tech, title, diff, code, pro_statement, tags } = req.body;

    if (!day || !tech || !title) {
      return res.status(400).json({ error: 'Missing core identity keys (day, tech, or title).' });
    }

    const existing = await Challenge.findOne({ day,tech });
    if (existing) {
      return res.status(400).json({ error: `Day ${day} already has a registered ${tech} track challenge.` });
    }

    const newChallenge = new Challenge(req.body);
    await newChallenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(400).json({ error: 'Validation failed. Check field formats.' });
  }
});

// Update existing challenge from pop-up form
router.put('/api/admin/challenges/:id', verifyAdminToken, async (req, res) => {
  try {
    const updated = await Challenge.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Target challenge reference missing.' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to apply update parameters.' });
  }
});

// Delete challenge
router.delete('/api/admin/challenges/:id', verifyAdminToken, async (req, res) => {
  try {
    const deleted = await Challenge.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Target challenge reference missing.' });
    res.json({ success: true, message: 'Challenge cleanly removed.' });
  } catch (error) {
    res.status(500).json({ error: 'Deletion request pipeline failed.' });
  }
});

export default router;
