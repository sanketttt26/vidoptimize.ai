import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import StatsCard from '../components/dashboard/StatsCard';
import QuotaCard from '../components/dashboard/QuotaCard';
import PerformanceChart from '../components/dashboard/PerformanceChart';
import RecentOptimizations from '../components/dashboard/RecentOptimizations';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [quota, setQuota] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [recentOptimizations, setRecentOptimizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, quotaRes, performanceRes, recentRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/quota'),
        api.get('/dashboard/performance'),
        api.get('/dashboard/recent')
      ]);

      setStats(statsRes.data);
      setQuota(quotaRes.data);
      setPerformanceData(performanceRes.data);
      setRecentOptimizations(recentRes.data.optimizations);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back, {user?.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Optimizations"
            value={stats?.totalOptimizations || 0}
            trend={stats?.trends?.optimizations}
            icon="fa-video"
            color="blue"
          />
          <StatsCard
            title="Total Views"
            value={stats?.totalViews || 0}
            trend={stats?.trends?.views}
            icon="fa-eye"
            color="green"
          />
          <StatsCard
            title="Avg. Engagement"
            value={stats?.avgEngagement || 0}
            trend={stats?.trends?.engagement}
            icon="fa-heart"
            color="purple"
          />
          <StatsCard
            title="Active Videos"
            value={stats?.activeVideos || 0}
            trend={stats?.trends?.activeVideos}
            icon="fa-play-circle"
            color="amber"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <PerformanceChart data={performanceData} />
          </div>
          <div>
            <QuotaCard
              used={quota?.used || 0}
              limit={quota?.limit || 10}
              plan={quota?.plan || 'free'}
            />
          </div>
        </div>

        {/* Recent Optimizations */}
        <RecentOptimizations optimizations={recentOptimizations} />
      </div>
    </div>
  );
};

export default Dashboard;
