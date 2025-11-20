import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getStatusColor } from '../../utils/helpers';

const RecentOptimizations = ({ optimizations = [] }) => {
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Optimizations</h3>
        <Link to="/history" className="text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors">
          View All <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>

      {optimizations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-inbox text-gray-500 text-3xl"></i>
          </div>
          <p className="text-gray-400 mb-6">No optimizations yet</p>
          <Link to="/optimize" className="btn btn-primary">
            <i className="fas fa-plus mr-2"></i>
            Create Your First Optimization
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Video</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Views</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {optimizations.map((opt, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-white truncate max-w-xs">{opt.videoTitle}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {formatDate(opt.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${opt.status === 'completed'
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : opt.status === 'processing'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                      {opt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-400">
                    {opt.metrics?.views || 0}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-gray-400 hover:text-primary transition-colors text-sm">
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentOptimizations;
