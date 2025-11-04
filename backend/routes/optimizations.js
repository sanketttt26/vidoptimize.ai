import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { dataService } from '../services/dataService.js';
import { aiService } from '../services/aiService.js';

const router = express.Router();

// Generate AI suggestions
router.post("/suggest", authenticateToken, async (req, res) => {
  try {
    const { videoUrl, currentTitle, currentDescription, type } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    // Check user quota
    const user = await dataService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.quota_used >= user.quota_limit) {
      return res.status(403).json({ 
        error: 'Quota exceeded',
        message: 'You have reached your optimization limit. Please upgrade your plan.'
      });
    }

    let suggestions;
    if (type === 'title') {
      suggestions = await aiService.generateTitleSuggestions(videoUrl, currentTitle);
    } else if (type === 'description') {
      suggestions = await aiService.generateDescriptionSuggestions(videoUrl, currentDescription);
    } else if (type === 'tags') {
      suggestions = await aiService.generateTags(videoUrl, currentTitle);
    } else {
      // Generate all
      const [titles, description, tags] = await Promise.all([
        aiService.generateTitleSuggestions(videoUrl, currentTitle),
        aiService.generateDescriptionSuggestions(videoUrl, currentDescription),
        aiService.generateTags(videoUrl, currentTitle)
      ]);
      suggestions = { titles, description, tags };
    }

    res.json({ suggestions });
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

// Save optimization
router.post("/save", authenticateToken, async (req, res) => {
  try {
    const { videoUrl, videoTitle, originalTitle, optimizedTitle, originalDescription, optimizedDescription, tags, status } = req.body;

    if (!videoUrl || !videoTitle) {
      return res.status(400).json({ error: 'Video URL and title are required' });
    }

    const optimization = await dataService.createOptimization(req.user.userId, {
      videoUrl,
      videoTitle,
      originalTitle,
      optimizedTitle,
      originalDescription,
      optimizedDescription,
      tags,
      status: status || 'completed',
      metrics: {
        views: Math.floor(Math.random() * 10000),
        engagement: Math.floor(Math.random() * 100),
        clickRate: (Math.random() * 10).toFixed(2)
      }
    });

    res.status(201).json({
      message: 'Optimization saved successfully',
      optimization
    });
  } catch (error) {
    console.error('Save optimization error:', error);
    res.status(500).json({ error: 'Failed to save optimization' });
  }
});

// Get optimization history
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const { search, status } = req.query;
    
    const filters = {};
    if (search) filters.search = search;
    if (status) filters.status = status;

    const optimizations = await dataService.getOptimizationsByUser(req.user.userId, filters);

    res.json({ optimizations });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to get history' });
  }
});

// Export history (CSV format)
router.get("/export", authenticateToken, async (req, res) => {
  try {
    const optimizations = await dataService.getOptimizationsByUser(req.user.userId);

    // Generate CSV
    const headers = ['Date', 'Video Title', 'Original Title', 'Optimized Title', 'Status', 'Views', 'Engagement'];
    const rows = optimizations.map(opt => [
      new Date(opt.createdAt).toLocaleDateString(),
      opt.videoTitle,
      opt.originalTitle || '',
      opt.optimizedTitle || '',
      opt.status,
      opt.metrics?.views || 0,
      opt.metrics?.engagement || 0
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=optimizations.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export history' });
  }
});

export default router;
