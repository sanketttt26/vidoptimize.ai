import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    youtubeChannel: user?.youtubeChannel || '',
    bio: user?.bio || ''
  });
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      showProfile: true,
      showActivity: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/users/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.put('/users/profile', profileData);
      updateUser(response.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await api.put('/users/settings', settings);
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success'
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
            <i className={`fas fa-${message.type === 'success' ? 'check' : 'exclamation'}-circle mr-2`}></i>
            {message.text}
          </div>
        )}

        <div className="glass-panel overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-white/10">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <i className="fas fa-user mr-2"></i>
                Profile
              </button>
              <button
                onClick={() => setActiveTab('youtube')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'youtube'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <i className="fab fa-youtube mr-2"></i>
                YouTube
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'notifications'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                <i className="fas fa-bell mr-2"></i>
                Notifications
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="glass-input opacity-50 cursor-not-allowed"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={profileData.youtubeChannel}
                    onChange={(e) => setProfileData({ ...profileData, youtubeChannel: e.target.value })}
                    placeholder="https://youtube.com/@yourchannel"
                    className="glass-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows="4"
                    placeholder="Tell us about yourself..."
                    className="glass-input"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {activeTab === 'youtube' && (
              <div className="space-y-8 max-w-2xl">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-lg">YouTube Connection</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {profileData.youtubeChannel ? 'Connected' : 'Not connected'}
                      </p>
                    </div>
                    <button className="btn btn-primary">
                      <i className="fab fa-youtube mr-2"></i>
                      {profileData.youtubeChannel ? 'Reconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-4 text-lg">Connected Features</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                        <i className="fas fa-check text-green-400 text-sm"></i>
                      </div>
                      Auto-import video metadata
                    </li>
                    <li className="flex items-center text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                        <i className="fas fa-check text-green-400 text-sm"></i>
                      </div>
                      Track video performance
                    </li>
                    <li className="flex items-center text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                        <i className="fas fa-check text-green-400 text-sm"></i>
                      </div>
                      One-click optimization publishing
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 max-w-2xl">
                <div>
                  <h3 className="font-semibold text-white mb-6 text-lg">Notification Preferences</h3>
                  <div className="space-y-6">
                    <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-gray-300">Email notifications</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.email}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, email: e.target.checked }
                          })
                        }
                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-gray-700"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-gray-300">Push notifications</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.push}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, push: e.target.checked }
                          })
                        }
                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-gray-700"
                      />
                    </label>
                    <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <span className="text-gray-300">SMS notifications</span>
                      <input
                        type="checkbox"
                        checked={settings.notifications.sms}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            notifications: { ...settings.notifications, sms: e.target.checked }
                          })
                        }
                        className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary bg-gray-700"
                      />
                    </label>
                  </div>
                </div>
                <button onClick={handleSettingsUpdate} disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
