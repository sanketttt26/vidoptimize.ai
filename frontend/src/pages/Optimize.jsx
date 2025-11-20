import React, { useState } from 'react';
import { validateYouTubeUrl } from '../utils/validation';
import api from '../utils/api';
import useApi from '../hooks/useApi';

const Optimize = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [optimizedDescription, setOptimizedDescription] = useState('');
  const [fetchedYouTubeTitle, setFetchedYouTubeTitle] = useState('');
  const apiHooks = useApi();

  const handleAnalyze = async () => {
    setError('');

    if (!validateYouTubeUrl(videoUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setLoading(true);
    try {
      // Get title suggestions and youtube title (let backend fetch the actual YouTube title)
      const { titles, ytTitle } = await apiHooks.getTitleSuggestions(videoUrl);

      // Store the fetched YouTube title
      setFetchedYouTubeTitle(ytTitle || '');
      setSuggestions({ titles });
      if (titles && titles[0]) setSelectedTitle(titles[0]);

      // Fetch full suggestions using ytTitle to seed description/tags
      apiHooks.getAllSuggestions(videoUrl, ytTitle || 'Sample Video Title', ytTitle).then(sugg => {
        setSuggestions(prev => ({ ...prev, description: sugg.description, tags: sugg.tags, titles: prev?.titles || sugg.titles }));
        setOptimizedDescription(sugg.description.description);
      }).catch(e => console.warn('Background suggest failed', e));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedTitle) {
      alert('Please select a title suggestion');
      return;
    }

    try {
      await api.post('/optimizations/save', {
        videoUrl,
        videoTitle: fetchedYouTubeTitle || 'Unknown Video',
        originalTitle: fetchedYouTubeTitle || 'Sample Video Title',
        optimizedTitle: selectedTitle.title,
        originalDescription: '',
        optimizedDescription,
        tags: suggestions?.tags || [],
        status: 'completed'
      });

      alert('Optimization saved successfully!');
      setVideoUrl('');
      setSuggestions(null);
      setSelectedTitle(null);
      setFetchedYouTubeTitle('');
    } catch (err) {
      alert('Failed to save optimization');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">AI Video Optimization</h1>
          <p className="text-gray-400 mt-2">Get AI-powered suggestions for your YouTube videos</p>
        </div>

        {/* URL Input */}
        <div className="glass-card p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Enter Video URL</h2>
          {fetchedYouTubeTitle && (
            <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm text-primary mb-1">Detected Video:</p>
              <p className="font-semibold text-white">{fetchedYouTubeTitle}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="glass-input flex-1"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn btn-primary px-8 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-magic mr-2"></i>
                  Analyze
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-3 flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </p>
          )}
        </div>

        {/* Title Suggestions */}
        {suggestions?.titles && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Title Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestions.titles.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => setSelectedTitle(suggestion)}
                  className={`p-6 border rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${selectedTitle?.id === suggestion.id
                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    : 'border-white/10 bg-white/5'
                    }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-3xl font-bold ${selectedTitle?.id === suggestion.id ? 'text-primary' : 'text-gray-500 group-hover:text-gray-400'}`}>
                      {suggestion.score}
                    </span>
                    {selectedTitle?.id === suggestion.id && (
                      <i className="fas fa-check-circle text-primary text-xl"></i>
                    )}
                  </div>
                  <h3 className="font-semibold text-white mb-3 text-lg leading-snug">{suggestion.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{suggestion.reason}</p>
                  <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Click Potential</span>
                      <span className="font-medium text-gray-300">{suggestion.metrics.clickPotential}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">SEO Score</span>
                      <span className="font-medium text-gray-300">{suggestion.metrics.seoScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Editor */}
        {suggestions?.description && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Optimized Description</h2>
            <textarea
              value={optimizedDescription}
              onChange={(e) => setOptimizedDescription(e.target.value)}
              className="glass-input min-h-[300px] font-mono text-sm leading-relaxed"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Keyword Density</p>
                <p className="text-2xl font-bold text-white">{suggestions.description.metrics.keywordDensity}%</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Readability</p>
                <p className="text-2xl font-bold text-white">{suggestions.description.metrics.readabilityScore}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">SEO Score</p>
                <p className="text-2xl font-bold text-white">{suggestions.description.metrics.seoScore}</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-sm text-gray-400 mb-1">Characters</p>
                <p className="text-2xl font-bold text-white">{optimizedDescription.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {suggestions?.tags && (
          <div className="glass-card p-8 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Suggested Tags</h2>
            <div className="flex flex-wrap gap-3">
              {suggestions.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        {suggestions && (
          <div className="flex justify-end">
            <button onClick={handleSave} className="btn btn-primary px-8 py-3 text-lg shadow-lg shadow-primary/25">
              <i className="fas fa-save mr-2"></i>
              Save Optimization
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Optimize;
