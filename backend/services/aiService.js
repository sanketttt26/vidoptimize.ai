// Mock AI service for generating title and description suggestions

export const aiService = {
  generateTitleSuggestions: async (videoUrl, currentTitle) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const suggestions = [
      {
        id: 1,
        title: `${currentTitle || 'Amazing Video'} - Complete Guide 2025`,
        score: 9.2,
        reason: 'High engagement keywords with year specificity',
        metrics: {
          clickPotential: 92,
          seoScore: 88,
          engagementFactor: 95
        }
      },
      {
        id: 2,
        title: `How to ${currentTitle || 'Master This'} | Step-by-Step Tutorial`,
        score: 8.8,
        reason: 'Tutorial format with clear value proposition',
        metrics: {
          clickPotential: 87,
          seoScore: 90,
          engagementFactor: 86
        }
      },
      {
        id: 3,
        title: `${currentTitle || 'Ultimate Video'} - Everything You Need to Know`,
        score: 8.5,
        reason: 'Comprehensive coverage indicator',
        metrics: {
          clickPotential: 85,
          seoScore: 83,
          engagementFactor: 88
        }
      }
    ];

    return suggestions;
  },

  generateDescriptionSuggestions: async (videoUrl, currentDescription) => {
    await new Promise(resolve => setTimeout(resolve, 2500));

    const optimized = `Discover everything you need to know in this comprehensive video guide. 

In this video, you'll learn:
- Key concepts and fundamentals
- Step-by-step practical demonstrations
- Expert tips and best practices
- Common mistakes to avoid

Whether you're a beginner or looking to advance your skills, this tutorial covers all the essential information.

Timestamps:
0:00 - Introduction
2:15 - Getting Started
5:30 - Main Content
12:45 - Advanced Techniques
18:20 - Conclusion

Subscribe for more helpful content!

#tutorial #howto #guide #2025`;

    return {
      description: optimized,
      metrics: {
        keywordDensity: 8.5,
        readabilityScore: 82,
        seoScore: 88,
        characterCount: optimized.length
      }
    };
  },

  generateTags: async (videoUrl, title) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    return [
      'tutorial',
      'howto',
      'guide',
      'education',
      '2025',
      'tips',
      'tricks',
      'complete guide',
      'beginners',
      'step by step'
    ];
  }
};
