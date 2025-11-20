import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { formatDate, getStatusColor, debounce } from '../utils/helpers';

const History = () => {
  const [optimizations, setOptimizations] = useState([]);
  const [filteredOptimizations, setFilteredOptimizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOptimization, setSelectedOptimization] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterOptimizations();
  }, [searchTerm, statusFilter, optimizations]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/optimizations/history');
      setOptimizations(response.data.optimizations);
      setFilteredOptimizations(response.data.optimizations);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOptimizations = () => {
    let filtered = [...optimizations];

    if (searchTerm) {
      filtered = filtered.filter(opt =>
        opt.videoTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(opt => opt.status === statusFilter);
    }

    setFilteredOptimizations(filtered);
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/optimizations/export', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'optimizations.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to export history');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-primary"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Optimization History</h1>
            <p className="text-gray-400 mt-2">View and manage your past optimizations</p>
          </div>
          <button onClick={handleExport} className="btn bg-white/10 hover:bg-white/20 text-white border border-white/10">
            <i className="fas fa-download mr-2"></i>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by video title..."
                className="glass-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass-input"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {filteredOptimizations.length === 0 ? (
          <div className="glass-card text-center py-12">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-gray-500 text-4xl"></i>
            </div>
            <p className="text-gray-400 mb-4 text-lg">No optimizations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOptimizations.map((opt) => (
              <div
                key={opt.id}
                className="glass-card p-6 cursor-pointer transition-all duration-300 group"
                onClick={() => setSelectedOptimization(opt)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${opt.status === 'completed'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : opt.status === 'processing'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                    {opt.status}
                  </span>
                  <span className="text-sm text-gray-500">{formatDate(opt.createdAt)}</span>
                </div>
                <h3 className="font-semibold text-white mb-3 line-clamp-2 transition-colors">{opt.videoTitle}</h3>
                <div className="space-y-2 text-sm border-t border-white/5 pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Views</span>
                    <span className="font-medium text-gray-300">{opt.metrics?.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Engagement</span>
                    <span className="font-medium text-gray-300">{opt.metrics?.engagement || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedOptimization && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                  <h2 className="text-2xl font-bold text-white pr-8">{selectedOptimization.videoTitle}</h2>
                  <button
                    onClick={() => setSelectedOptimization(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-gray-400 mb-2 text-sm uppercase tracking-wider">Original Title</h3>
                    <p className="text-gray-300 bg-white/5 p-4 rounded-lg border border-white/5">{selectedOptimization.originalTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wider">Optimized Title</h3>
                    <p className="text-white font-medium bg-primary/10 p-4 rounded-lg border border-primary/20">{selectedOptimization.optimizedTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400 mb-2 text-sm uppercase tracking-wider">Description</h3>
                    <p className="text-gray-300 whitespace-pre-wrap bg-white/5 p-4 rounded-lg border border-white/5 font-mono text-sm leading-relaxed">{selectedOptimization.optimizedDescription || 'N/A'}</p>
                  </div>
                  {selectedOptimization.tags && (
                    <div>
                      <h3 className="font-semibold text-gray-400 mb-3 text-sm uppercase tracking-wider">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOptimization.tags.map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-sm bg-white/5 text-gray-300 border border-white/10">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
