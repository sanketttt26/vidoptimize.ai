import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { dataService } from '../services/dataService.js';

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await dataService.getUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { name, youtubeChannel, bio, avatar } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (youtubeChannel !== undefined) updates.youtubeChannel = youtubeChannel;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const updatedUser = await dataService.updateUser(req.user.userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user settings
router.get("/settings", authenticateToken, async (req, res) => {
  try {
    const settings = await dataService.getUserSettings(req.user.userId);
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

// Update user settings
router.put("/settings", authenticateToken, async (req, res) => {
  try {
    const settings = req.body;
    
    const updatedSettings = await dataService.updateUserSettings(req.user.userId, settings);
    if (!updatedSettings) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
