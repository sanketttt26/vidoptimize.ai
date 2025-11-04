import React from 'react';
import { formatNumber } from '../../utils/helpers';

const StatsCard = ({ title, value, trend, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{formatNumber(value)}</h3>
          {trend && (
            <p className={`text-sm mt-2 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              <i className={`fas fa-arrow-${trend.startsWith('+') ? 'up' : 'down'} mr-1`}></i>
              {trend} from last month
            </p>
          )}
        </div>
        <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <i className={`fas ${icon} text-white text-2xl`}></i>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
