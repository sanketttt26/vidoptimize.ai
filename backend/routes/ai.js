import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { aiService } from "../services/aiService.js";

const router = express.Router();

// Title suggestions (uses AI providers or fallback)
router.post("/title", authenticateToken, async (req, res) => {
  try {
    const { videoUrl, currentTitle } = req.body;
    if (!videoUrl)
      return res.status(400).json({ error: "videoUrl is required" });

    // attempt to fetch YouTube title to help seed suggestions
    const ytTitle = await aiService
      .fetchYouTubeTitle(videoUrl)
      .catch(() => null);

    const titles = await aiService.generateTitleSuggestions(
      videoUrl,
      currentTitle || ytTitle
    );
    res.json({ titles, ytTitle });
  } catch (err) {
    console.error("AI title error:", err);
    res.status(500).json({ error: "Failed to generate title suggestions" });
  }
});

export default router;
