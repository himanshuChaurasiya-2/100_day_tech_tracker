import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
  day: { type: Number, required: true},
  title: { type: String, required: true },
  tech: { type: String, required: true, enum: ['DSA', 'DevOps', 'AWS'] },
  diff: { type: Number, required: true, enum: [1, 2, 3] }, // 1: Easy, 2: Medium, 3: Hard
  code: { type: String, default: '' },
  pro_statement: { type: String, default: '' },
  tags: [{ type: String }]
}, { timestamps: true });


// ── INDUSTRY STANDARD COMPOSITE INDEX ──
// This permits Day 1 DSA, Day 1 DevOps, and Day 1 AWS to coexist, 
// but prevents duplicating Day 1 DSA twice.
challengeSchema.index({ day: 1, tech: 1 }, { unique: true });

// Optimise search and filter performance
challengeSchema.index({ tech: 1, diff: 1 });
challengeSchema.index({ title: 'text' }); 

export const Challenge = mongoose.model('Challenge', challengeSchema);
