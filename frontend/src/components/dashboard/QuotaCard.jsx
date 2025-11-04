import React from 'react';

const QuotaCard = ({ used, limit, plan }) => {
  const percentage = (used / limit) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Quota</h3>
      
      <div className="flex items-center justify-center mb-6">
        <svg className="transform -rotate-90" width="180" height="180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#E5E7EB"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#4F46E5"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <text
            x="90"
            y="85"
            textAnchor="middle"
            className="text-3xl font-bold fill-gray-900 transform rotate-90"
            style={{ transformOrigin: '90px 90px' }}
          >
            {used}/{limit}
          </text>
          <text
            x="90"
            y="105"
            textAnchor="middle"
            className="text-sm fill-gray-600 transform rotate-90"
            style={{ transformOrigin: '90px 90px' }}
          >
            Optimizations
          </text>
        </svg>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Plan</span>
          <span className="badge badge-info capitalize">{plan}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Usage</span>
          <span className="font-semibold text-gray-900">{percentage.toFixed(0)}%</span>
        </div>
        {percentage >= 80 && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            You're running low on quota. Consider upgrading your plan.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotaCard;
