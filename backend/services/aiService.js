// AI service with optional external model providers and YouTube title retrieval
export const aiService = {
  // Try to fetch YouTube title using oEmbed (no API key required)
  fetchYouTubeTitle: async (videoUrl) => {
    try {
      if (!videoUrl) return null;
      const url = String(videoUrl).trim();

      // Extract YouTube video ID from common URL formats
      const idMatch =
        url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
        url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
        url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
      const videoId = idMatch ? idMatch[1] : null;

      // If we couldn't extract an ID, try to use the raw URL (oEmbed accepts full URLs too)
      const targetUrl = videoId
        ? `https://www.youtube.com/watch?v=${videoId}`
        : url;
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        targetUrl
      )}&format=json`;

      const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;
      const timeout = 5000;
      const timer = controller
        ? setTimeout(() => controller.abort(), timeout)
        : null;

      const res = await fetch(oembedUrl, {
        method: "GET",
        signal: controller?.signal,
      });
      if (timer) clearTimeout(timer);

      if (!res.ok) return null;
      const data = await res.json();
      return data.title || null;
    } catch (err) {
      // network or parsing error - include AbortError clarity
      if (err.name === "AbortError") {
        console.warn("fetchYouTubeTitle aborted due to timeout");
        return null;
      }
      console.warn("fetchYouTubeTitle error:", err.message || err);
      return null;
    }
  },

  // Helper to call Google Gemini API (expects GEMINI_API_KEY in env)
  callGemini: async (prompt) => {
    const key = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-pro";
    if (!key) throw new Error("GEMINI_API_KEY not configured");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Gemini error: ${resp.status} ${text}`);
    }

    const data = await resp.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  },

  // Generate title suggestions using Gemini AI or fallback to mock
  generateTitleSuggestions: async (videoUrl, currentTitle) => {
    // Attempt to enrich prompt with YouTube title when available
    const ytTitle = await aiService
      .fetchYouTubeTitle(videoUrl)
      .catch(() => null);
    const seedTitle = currentTitle || ytTitle || "Amazing Video";

    // Build prompt for Gemini
    const prompt = `You are a helpful assistant that suggests creative, SEO-friendly YouTube video titles.
Provide 3 short distinct title suggestions for the following seed title. Return each suggestion on a new line only.
Seed title: "${seedTitle}"
Include a short reason for each suggestion in parentheses after the title.`;

    // Try Gemini API, fallback to mock on error
    try {
      if (process.env.GEMINI_API_KEY) {
        const text = await aiService.callGemini(prompt);
        if (text) {
          const lines = text
            .split(/\n+/)
            .map((l) => l.trim())
            .filter(Boolean)
            .slice(0, 3);
          return lines.map((line, idx) => ({
            id: idx + 1,
            title: line,
            score: 8.0 - idx * 0.5,
            reason: "AI-generated suggestion",
            metrics: { clickPotential: 90 - idx * 2, seoScore: 88 - idx, engagementFactor: 92 - idx * 2 },
          }));
        }
      }
    } catch (err) {
      console.warn("Gemini API error (titles):", err.message || err);
      // fallthrough to mock
    }

    // Mock fallback suggestions
    const suggestions = [
      {
        id: 1,
        title: `${seedTitle} - Complete Guide 2025`,
        score: 9.2,
        reason: "High engagement keywords with year specificity",
        metrics: { clickPotential: 92, seoScore: 88, engagementFactor: 95 },
      },
      {
        id: 2,
        title: `How to ${seedTitle} | Step-by-Step Tutorial`,
        score: 8.8,
        reason: "Tutorial format with clear value proposition",
        metrics: { clickPotential: 87, seoScore: 90, engagementFactor: 86 },
      },
      {
        id: 3,
        title: `${seedTitle} - Everything You Need to Know`,
        score: 8.5,
        reason: "Comprehensive coverage indicator",
        metrics: { clickPotential: 85, seoScore: 83, engagementFactor: 88 },
      },
    ];

    return suggestions;
  },

  // Generate description suggestions using Gemini or fallback to mock
  generateDescriptionSuggestions: async (videoUrl, currentDescription) => {
    const ytTitle = await aiService
      .fetchYouTubeTitle(videoUrl)
      .catch(() => null);
    const seed =
      currentDescription ||
      `This video titled "${ytTitle || "Video"}" covers important topics.`;

    const prompt = `Write an engaging YouTube video description (approx 150-300 words) for the following seed. Include timestamps, hashtags, and a short call-to-action.\n\nSeed:\n${seed}`;

    try {
      if (process.env.GEMINI_API_KEY) {
        const text = await aiService.callGemini(prompt);
        if (text) {
          return {
            description: text,
            metrics: {
              keywordDensity: 7.5,
              readabilityScore: 80,
              seoScore: 85,
              characterCount: text.length,
            },
          };
        }
      }
    } catch (err) {
      console.warn("Gemini API error (description):", err.message || err);
    }

    // Mock fallback description
    const optimized = `Discover everything you need to know in this comprehensive video guide. \n\nIn this video, you'll learn:\n- Key concepts and fundamentals\n- Step-by-step practical demonstrations\n- Expert tips and best practices\n- Common mistakes to avoid\n\nWhether you're a beginner or looking to advance your skills, this tutorial covers all the essential information.\n\nTimestamps:\n0:00 - Introduction\n2:15 - Getting Started\n5:30 - Main Content\n12:45 - Advanced Techniques\n18:20 - Conclusion\n\nSubscribe for more helpful content!\n\n#tutorial #howto #guide #2025`;

    return {
      description: optimized,
      metrics: {
        keywordDensity: 8.5,
        readabilityScore: 82,
        seoScore: 88,
        characterCount: optimized.length,
      },
    };
  },

  // Generate tags using Gemini or fallback to mock
  generateTags: async (videoUrl, title) => {
    const seed =
      title ||
      (await aiService.fetchYouTubeTitle(videoUrl).catch(() => null)) ||
      "tutorial";
    const prompt = `Provide a comma-separated list of 10 short tags for the following video title:\n${seed}`;

    try {
      if (process.env.GEMINI_API_KEY) {
        const text = await aiService.callGemini(prompt);
        if (text)
          return String(text)
            .replace(/\n/g, ", ")
            .split(/,\s*/)
            .slice(0, 10)
            .map((t) => t.trim())
            .filter(Boolean);
      }
    } catch (err) {
      console.warn("Gemini API error (tags):", err.message || err);
    }

    return [
      "tutorial",
      "howto",
      "guide",
      "education",
      "2025",
      "tips",
      "tricks",
      "complete guide",
      "beginners",
      "step by step",
    ];
  },
};
