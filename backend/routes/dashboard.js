import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { dataService } from '../services/dataService.js';

const router = express.Router();

// Get dashboard stats
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const user = await dataService.getUserById(req.user.userId);
    const optimizations = await dataService.getOptimizationsByUser(req.user.userId);

    const totalViews = optimizations.reduce((sum, opt) => sum + (opt.metrics?.views || 0), 0);
    const avgEngagement = optimizations.length > 0
      ? optimizations.reduce((sum, opt) => sum + (opt.metrics?.engagement || 0), 0) / optimizations.length
      : 0;
    
    const stats = {
      totalOptimizations: optimizations.length,
      totalViews,
      avgEngagement: Math.round(avgEngagement),
      activeVideos: optimizations.filter(opt => opt.status === 'completed').length,
      trends: {
        optimizations: '+12%',
        views: '+24%',
        engagement: '+8%',
        activeVideos: '+15%'
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
});

// Get quota information
router.get("/quota", authenticateToken, async (req, res) => {
  try {
    const user = await dataService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      used: user.quota_used || 0,
      limit: user.quota_limit || 10,
      percentage: ((user.quota_used || 0) / (user.quota_limit || 10)) * 100,
      plan: user.plan || 'free'
    });
  } catch (error) {
    console.error('Get quota error:', error);
    res.status(500).json({ error: 'Failed to get quota' });
  }
});

// Get recent optimizations
router.get("/recent", authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const optimizations = await dataService.getRecentOptimizations(req.user.userId, limit);

    res.json({ optimizations });
  } catch (error) {
    console.error('Get recent error:', error);
    res.status(500).json({ error: 'Failed to get recent optimizations' });
  }
});

// Get performance chart data
router.get("/performance", authenticateToken, async (req, res) => {
  try {
    const period = req.query.period || 'week'; // week, month, year

    // Generate mock performance data
    const dataPoints = period === 'week' ? 7 : period === 'month' ? 30 : 365;
    const labels = [];
    const views = [];
    const engagement = [];

    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      views.push(Math.floor(Math.random() * 1000) + 500);
      engagement.push(Math.floor(Math.random() * 100) + 50);
    }

    res.json({
      labels,
      datasets: [
        {
          label: 'Views',
          data: views
        },
        {
          label: 'Engagement',
          data: engagement
        }
      ]
    });
  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({ error: 'Failed to get performance data' });
  }
});

export default router;
