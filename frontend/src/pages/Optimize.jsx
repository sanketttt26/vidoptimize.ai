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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Video Optimization</h1>
          <p className="text-gray-600 mt-2">Get AI-powered suggestions for your YouTube videos</p>
        </div>

        {/* URL Input */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter Video URL</h2>
          {fetchedYouTubeTitle && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Detected Video:</p>
              <p className="font-semibold text-gray-900">{fetchedYouTubeTitle}</p>
            </div>
          )}
          <div className="flex gap-4">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="input flex-1"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="btn btn-primary px-8"
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
            <p className="text-red-600 text-sm mt-2">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {error}
            </p>
          )}
        </div>

        {/* Title Suggestions */}
        {suggestions?.titles && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Title Suggestions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestions.titles.map((suggestion) => (
                <div
                  key={suggestion.id}
                  onClick={() => setSelectedTitle(suggestion)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedTitle?.id === suggestion.id
                      ? 'border-[#4F46E5] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl font-bold text-[#4F46E5]">{suggestion.score}</span>
                    {selectedTitle?.id === suggestion.id && (
                      <i className="fas fa-check-circle text-[#4F46E5]"></i>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{suggestion.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.reason}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Click Potential</span>
                      <span className="font-medium">{suggestion.metrics.clickPotential}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SEO Score</span>
                      <span className="font-medium">{suggestion.metrics.seoScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description Editor */}
        {suggestions?.description && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Optimized Description</h2>
            <textarea
              value={optimizedDescription}
              onChange={(e) => setOptimizedDescription(e.target.value)}
              className="input min-h-[300px] font-mono text-sm"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Keyword Density</p>
                <p className="text-xl font-bold text-gray-900">{suggestions.description.metrics.keywordDensity}%</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Readability</p>
                <p className="text-xl font-bold text-gray-900">{suggestions.description.metrics.readabilityScore}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">SEO Score</p>
                <p className="text-xl font-bold text-gray-900">{suggestions.description.metrics.seoScore}</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Characters</p>
                <p className="text-xl font-bold text-gray-900">{optimizedDescription.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {suggestions?.tags && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Suggested Tags</h2>
            <div className="flex flex-wrap gap-2">
              {suggestions.tags.map((tag, index) => (
                <span key={index} className="badge badge-info">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        {suggestions && (
          <div className="flex justify-end">
            <button onClick={handleSave} className="btn btn-primary px-8">
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
