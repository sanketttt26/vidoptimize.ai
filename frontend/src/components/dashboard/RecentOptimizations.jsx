import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getStatusColor } from '../../utils/helpers';

const RecentOptimizations = ({ optimizations = [] }) => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Optimizations</h3>
        <Link to="/history" className="text-[#4F46E5] hover:underline text-sm font-medium">
          View All <i className="fas fa-arrow-right ml-1"></i>
        </Link>
      </div>

      {optimizations.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-inbox text-gray-300 text-5xl mb-4"></i>
          <p className="text-gray-600 mb-4">No optimizations yet</p>
          <Link to="/optimize" className="btn btn-primary">
            <i className="fas fa-plus mr-2"></i>
            Create Your First Optimization
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Video</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Views</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {optimizations.map((opt, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 truncate max-w-xs">{opt.videoTitle}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(opt.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`badge badge-${getStatusColor(opt.status)}`}>
                      {opt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {opt.metrics?.views || 0}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-[#4F46E5] hover:text-[#4338CA] text-sm">
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
