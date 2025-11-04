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
        <i className="fas fa-spinner fa-spin text-4xl text-[#4F46E5]"></i>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Optimization History</h1>
            <p className="text-gray-600 mt-2">View and manage your past optimizations</p>
          </div>
          <button onClick={handleExport} className="btn btn-secondary">
            <i className="fas fa-download mr-2"></i>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by video title..."
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
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
          <div className="card text-center py-12">
            <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
            <p className="text-gray-600 mb-4">No optimizations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOptimizations.map((opt) => (
              <div
                key={opt.id}
                className="card cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setSelectedOptimization(opt)}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`badge badge-${getStatusColor(opt.status)}`}>
                    {opt.status}
                  </span>
                  <span className="text-sm text-gray-600">{formatDate(opt.createdAt)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{opt.videoTitle}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Views</span>
                    <span className="font-medium">{opt.metrics?.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-medium">{opt.metrics?.engagement || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedOptimization && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedOptimization.videoTitle}</h2>
                  <button
                    onClick={() => setSelectedOptimization(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Original Title</h3>
                    <p className="text-gray-600">{selectedOptimization.originalTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Optimized Title</h3>
                    <p className="text-[#4F46E5] font-medium">{selectedOptimization.optimizedTitle || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedOptimization.optimizedDescription || 'N/A'}</p>
                  </div>
                  {selectedOptimization.tags && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedOptimization.tags.map((tag, i) => (
                          <span key={i} className="badge badge-info">{tag}</span>
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
