import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Zap, 
  Activity,
  Globe
} from 'lucide-react';

const Header = ({ user, onLogout, currentConnection, onDisconnect }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/servers', label: 'Servers', icon: Globe },
    { path: '/history', label: 'History', icon: Zap },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: Settings });
  }

  return (
    <header className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                VPNShield
              </h1>
              <p className="text-xs text-purple-200">Management Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Connection Status & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            {currentConnection ? (
              <div className="hidden sm:flex items-center space-x-3 bg-green-500/20 border border-green-400/30 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Connected</span>
                <button
                  onClick={onDisconnect}
                  className="text-green-300 hover:text-white transition-colors"
                  title="Disconnect"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3 bg-gray-500/20 border border-gray-400/30 rounded-lg px-3 py-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">Disconnected</span>
              </div>
            )}

            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200"
              >
                <img
                  src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-purple-400/50"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-white font-medium text-sm">{user.name}</p>
                  <p className="text-purple-200 text-xs capitalize">{user.role}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 glass border border-white/20 rounded-xl shadow-xl z-50">
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-purple-200 text-sm">{user.email}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full capitalize">
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 w-full px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-3 py-2 text-left text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Connection Status */}
            <div className="mt-4 pt-4 border-t border-white/10">
              {currentConnection ? (
                <div className="flex items-center justify-between bg-green-500/20 border border-green-400/30 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-medium">Connected to VPN</span>
                  </div>
                  <button
                    onClick={onDisconnect}
                    className="text-green-300 hover:text-white transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 bg-gray-500/20 border border-gray-400/30 rounded-lg px-4 py-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span className="text-gray-300 font-medium">Not Connected</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(isProfileOpen || isMenuOpen) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;