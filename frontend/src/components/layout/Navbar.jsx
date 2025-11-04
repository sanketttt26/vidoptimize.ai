import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <i className="fas fa-video text-[#4F46E5] text-2xl"></i>
            <span className="font-bold text-xl text-gray-900">VidOptimize AI</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <Link to="/" className={`${isActive('/') ? 'text-[#4F46E5]' : 'text-gray-600 hover:text-[#4F46E5]'} transition-colors`}>
                  Home
                </Link>
                <Link to="/pricing" className={`${isActive('/pricing') ? 'text-[#4F46E5]' : 'text-gray-600 hover:text-[#4F46E5]'} transition-colors`}>
                  Pricing
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-[#4F46E5] transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={`${isActive('/dashboard') ? 'text-[#4F46E5]' : 'text-gray-600 hover:text-[#4F46E5]'} transition-colors`}>
                  Dashboard
                </Link>
                <Link to="/optimize" className={`${isActive('/optimize') ? 'text-[#4F46E5]' : 'text-gray-600 hover:text-[#4F46E5]'} transition-colors`}>
                  Optimize
                </Link>
                <Link to="/history" className={`${isActive('/history') ? 'text-[#4F46E5]' : 'text-gray-600 hover:text-[#4F46E5]'} transition-colors`}>
                  History
                </Link>
                <Link to="/pricing" className={`${isActive('/pricing') ? 'text-[#4F46E5]' : 'text-gray-600 hover:text-[#4F46E5]'} transition-colors`}>
                  Pricing
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-[#4F46E5] transition-colors">
                    <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white flex items-center justify-center">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-cog mr-2"></i> Settings
                    </Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-600">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
