import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="glass-panel sticky top-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-primary rounded-full opacity-25 group-hover:opacity-50 blur transition duration-200"></div>
                            <i className="fas fa-video text-primary text-2xl relative z-10"></i>
                        </div>
                        <span className="font-bold text-xl text-white tracking-tight">VidOptimize AI</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {isAuthenticated ? (
                            <>
                                <Link to="/dashboard" className={`${isActive('/dashboard') ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors font-medium`}>
                                    Dashboard
                                </Link>
                                <Link to="/optimize" className={`${isActive('/optimize') ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors font-medium`}>
                                    Optimize
                                </Link>
                                <Link to="/history" className={`${isActive('/history') ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors font-medium`}>
                                    History
                                </Link>
                                <Link to="/pricing" className={`${isActive('/pricing') ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors font-medium`}>
                                    Pricing
                                </Link>
                                <div className="flex items-center space-x-4 ml-4 border-l border-gray-700 pl-4">
                                    <div className="relative group">
                                        <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium">{user?.name}</span>
                                            <i className="fas fa-chevron-down text-xs ml-1"></i>
                                        </button>
                                        <div className="absolute right-0 mt-2 w-48 glass-panel rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                                            <Link to="/settings" className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                                <i className="fas fa-cog mr-2"></i> Settings
                                            </Link>
                                            <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                                                <i className="fas fa-sign-out-alt mr-2"></i> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/" className={`${isActive('/') ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors font-medium`}>
                                    Features
                                </Link>
                                <Link to="/pricing" className={`${isActive('/pricing') ? 'text-primary' : 'text-gray-300 hover:text-white'} transition-colors font-medium`}>
                                    Pricing
                                </Link>
                                <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <button className="md:hidden text-gray-300 hover:text-white">
                        <i className="fas fa-bars text-xl"></i>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
