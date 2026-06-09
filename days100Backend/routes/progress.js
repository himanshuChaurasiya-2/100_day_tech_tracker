// routes/progress.js
import express from 'express';
import { Challenge } from '../models/challenges.js';

const router = express.Router();

router.get('/progress', async (req, res) => {
  try {
    const TOTAL_DAYS = 100;

    // Run parallel aggregation sub-pipelines
    const [stats] = await Challenge.aggregate([
      {
        $facet: {
          // Get list of unique days that have at least one challenge submitted
          completedDaysList: [
            { $group: { _id: "$day" } },
            { $project: { _id: 1 } }
          ],
          // Count total entries independently per tech track
          techCounts: [
            { $group: { _id: "$tech", count: { $sum: 1 } } }
          ],
          // Group challenges by day to find the highest difficulty level per day for heatmap colors
          heatmapMetrics: [
            { $group: { _id: "$day", maxDiff: { $max: "$diff" } } }
          ]
        }
      }
    ]);

    // Calculate unique days complete
    const uniqueDaysDone = stats.completedDaysList?.length || 0;

    // Format mini card tracking parameters
    const techMap = {};
    stats.techCounts.forEach(item => { techMap[item._id] = item.count; });

    const miniCards = [
      { value: techMap['DSA'] || 0, label: 'DSA Days', color: '#00e5ff' },
      { value: techMap['DevOps'] || 0, label: 'DevOps Days', color: '#ff3d6b' },
      { value: techMap['AWS'] || 0, label: 'AWS Days', color: '#ffb800' },
    ];

    // Map out the 100-day activity matrix smoothly
    const heatmap = Array.from({ length: TOTAL_DAYS }, (_, idx) => {
      const currentDay = idx + 1;
      const dayRecord = stats.heatmapMetrics.find(item => item._id === currentDay);
      
      return {
        day: currentDay,
        // level scale: 0 if unsubmitted, or difficulty level 1, 2, 3
        level: dayRecord ? dayRecord.maxDiff : 0
      };
    });

    res.json({
      daysDone: uniqueDaysDone,
      total: TOTAL_DAYS,
      miniCards,
      heatmap
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed compiling aggregation metric streams.' });
  }
});

export default router;
