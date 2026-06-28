// routes/progress.js
import express from 'express';
import { Challenge } from '../models/challenges.js';

const router = express.Router();

router.get('/progress', async (req, res) => {
  try {
    const TOTAL_DAYS = 100;

    const [stats] = await Challenge.aggregate([
      {
        $facet: {
          completedDaysList: [
            { $group: { _id: "$day" } },
            { $project: { _id: 1 } }
          ],
          
          techCounts: [
            { $group: { _id: "$tech", count: { $sum: 1 } } }
          ],
          
          heatmapMetrics: [
            { $group: { _id: "$day", maxDiff: { $max: "$diff" } } }
          ]
        }
      }
    ]);

    const uniqueDaysDone = stats.completedDaysList?.length || 0;

    const techMap = {};
    stats.techCounts.forEach(item => { techMap[item._id] = item.count; });

    const miniCards = [
      { value: techMap['DSA'] || 0, label: 'DSA Days', color: '#00e5ff' },
      { value: techMap['DevOps'] || 0, label: 'DevOps Days', color: '#ff3d6b' },
      { value: techMap['AWS'] || 0, label: 'AWS Days', color: '#ffb800' },
    ];

    const heatmap = Array.from({ length: TOTAL_DAYS }, (_, idx) => {
      const currentDay = idx + 1;
      const dayRecord = stats.heatmapMetrics.find(item => item._id === currentDay);
      
      return {
        day: currentDay,
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
