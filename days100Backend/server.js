import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import challengeRoutes from './routes/challenges.js';
import adminRoutes from './routes/admin.js';
import progressRoutes from './routes/progress.js'
import featuredRoutes from './routes/featured.js'

import { Challenge } from './models/challenges.js';

dotenv.config();

const app = express();

app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000', 
  process.env.FRONTEND_URL
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


app.use('/api', featuredRoutes);
app.use('/api', challengeRoutes);
app.use('/api', adminRoutes);
app.use('/api', progressRoutes);

app.use('*any', (req, res) => {
  res.status(404).json({ error: 'Endpoint path not found.' });
}); 

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    // Ping MongoDB every 5 minutes to prevent Atlas M0 pause
    const keepAlive = () => {
      Challenge.findOne().select('_id').lean()
        .then(() => console.log('Atlas keepalive'))
        .catch(err => console.error('Keepalive failed:', err.message))
    }
    keepAlive();
    setInterval(keepAlive, 5 * 60 * 1000)

    app.listen(PORT, () => {
      console.log(`🚀 API active and listening on port ${PORT}`);
    });
  } catch (error) {
    console.error(`❌ Bootstrap engine runtime failure: ${error.message}`);
    process.exit(1);
  }
};

startServer();
