import React from 'react';
import { formatNumber } from '../../utils/helpers';

const StatsCard = ({ title, value, trend, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    green: 'bg-green-500/20 text-green-400 border-green-500/30',
    purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
  };

  return (
    <div className="glass-card p-6 hover:border-primary/30 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{formatNumber(value)}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              <i className={`fas fa-arrow-${trend.startsWith('+') ? 'up' : 'down'} mr-1`}></i>
              {trend} from last month
            </p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-2xl ${colorClasses[color]} border flex items-center justify-center`}>
          <i className={`fas ${icon} text-xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
