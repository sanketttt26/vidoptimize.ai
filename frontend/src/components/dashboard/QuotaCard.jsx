import React from 'react';

const QuotaCard = ({ used, limit, plan }) => {
  const percentage = (used / limit) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-lg font-semibold text-white mb-6">Usage Quota</h3>

      <div className="flex items-center justify-center mb-8">
        <svg className="transform -rotate-90" width="180" height="180">
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            stroke="#3b82f6"
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
            className="text-3xl font-bold fill-white transform rotate-90"
            style={{ transformOrigin: '90px 90px' }}
          >
            {used}/{limit}
          </text>
          <text
            x="90"
            y="105"
            textAnchor="middle"
            className="text-sm fill-gray-400 transform rotate-90"
            style={{ transformOrigin: '90px 90px' }}
          >
            Optimizations
          </text>
        </svg>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-gray-400">Current Plan</span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 capitalize">{plan}</span>
        </div>
        <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-gray-400">Usage</span>
          <span className="font-semibold text-white">{percentage.toFixed(0)}%</span>
        </div>
        {percentage >= 80 && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-3 rounded-lg text-sm flex items-start">
            <i className="fas fa-exclamation-triangle mr-2 mt-0.5"></i>
            <span>You're running low on quota. Consider upgrading your plan.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotaCard;
