import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import challengeRoutes from './routes/challenges.js';
import adminRoutes from './routes/admin.js';
import progressRoutes from './routes/progress.js'
import featuredRoutes from './routes/featured.js'

dotenv.config();

const app = express();

app.use(express.json());

// Look for this block inside your backend server.js / app.js file
const allowedOrigins = [
  'http://localhost:3000', 
  process.env.FRONTEND_URL // 🌟 IT IS LOCATED RIGHT HERE!
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));



// API Base Routes
// app.use(challengeRoutes);
// app.use(adminRoutes);
// app.use(progressRoutes);
// app.use(featuredRoutes);
app.use('/api', featuredRoutes);   // Handles '/api/challenges/featured' safely first!
app.use('/api', challengeRoutes);  // Handles '/api/challenges' and '/api/challenges/:id'
app.use('/api', adminRoutes);
app.use('/api', progressRoutes);

// Catch-All 404 Route handler
app.use('*any', (req, res) => {
  res.status(404).json({ error: 'Endpoint path not found.' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 API active and listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Bootstrap engine runtime failure: ${error.message}`);
    process.exit(1);
  }
};

startServer();
