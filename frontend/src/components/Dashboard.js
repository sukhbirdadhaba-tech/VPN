import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  Globe, 
  Zap, 
  Users, 
  Server,
  Clock,
  Wifi,
  WifiOff,
  RefreshCw,
  ChevronRight,
  MapPin,
  Signal
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user, currentConnection, servers, onConnect, onDisconnect, onRefresh }) => {
  const [stats, setStats] = useState({
    totalServers: 0,
    onlineServers: 0,
    averageLoad: 0,
    connectedTime: 0
  });

  useEffect(() => {
    if (servers.length > 0) {
      const onlineServers = servers.filter(s => s.status === 'online');
      const totalLoad = onlineServers.reduce((sum, s) => sum + s.load, 0);
      const averageLoad = onlineServers.length > 0 ? Math.round(totalLoad / onlineServers.length) : 0;

      setStats({
        totalServers: servers.length,
        onlineServers: onlineServers.length,
        averageLoad,
        connectedTime: currentConnection ? 
          Math.floor((new Date() - new Date(currentConnection.connected_at)) / 1000 / 60) : 0
      });
    }
  }, [servers, currentConnection]);

  const getLoadColor = (load) => {
    if (load < 30) return 'text-green-400';
    if (load < 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLoadBgColor = (load) => {
    if (load < 30) return 'bg-green-500';
    if (load < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const topServers = servers
    .filter(s => s.status === 'online')
    .sort((a, b) => a.load - b.load)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-gray-300">
              Manage your VPN connections and monitor server performance
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="btn-secondary"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Connection Status Card */}
      <div className="mb-8">
        {currentConnection ? (
          <div className="glass-strong p-6 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl">
                  <Wifi className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Connected to VPN</h3>
                  <p className="text-green-300">
                    {currentConnection.server_name} • {currentConnection.server_country}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Connected for {stats.connectedTime} minutes
                  </p>
                </div>
              </div>
              <button
                onClick={onDisconnect}
                className="btn-danger"
              >
                <WifiOff className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-strong p-6 border-l-4 border-gray-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-500/20 rounded-xl">
                  <WifiOff className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Not Connected</h3>
                  <p className="text-gray-300">Choose a server to establish VPN connection</p>
                </div>
              </div>
              <Link to="/servers" className="btn-primary">
                <Globe className="w-4 h-4" />
                Browse Servers
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl">
              <Server className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Servers</p>
              <p className="text-2xl font-bold text-white">{stats.totalServers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Online Servers</p>
              <p className="text-2xl font-bold text-white">{stats.onlineServers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-xl">
              <Signal className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Average Load</p>
              <p className={`text-2xl font-bold ${getLoadColor(stats.averageLoad)}`}>
                {stats.averageLoad}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Session Time</p>
              <p className="text-2xl font-bold text-white">{stats.connectedTime}m</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Performing Servers */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Best Servers</h2>
            <Link to="/servers" className="text-purple-400 hover:text-purple-300 flex items-center space-x-1">
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {topServers.map((server) => (
              <div key={server.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{server.name}</p>
                    <p className="text-gray-400 text-sm">{server.country}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getLoadColor(server.load)}`}>
                      {server.load}% load
                    </p>
                    <p className="text-gray-400 text-xs">
                      {server.current_connections}/{server.max_connections}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onConnect(server.id)}
                    disabled={server.id === currentConnection?.server_id}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                      server.id === currentConnection?.server_id
                        ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                        : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                    }`}
                  >
                    {server.id === currentConnection?.server_id ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4">
            <Link
              to="/servers"
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-all duration-200">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Browse All Servers</p>
                <p className="text-gray-400 text-sm">View and connect to available servers</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/history"
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-all duration-200">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Connection History</p>
                <p className="text-gray-400 text-sm">View your past connections and usage</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>

            <Link
              to="/profile"
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-all duration-200">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Account Settings</p>
                <p className="text-gray-400 text-sm">Manage your profile and preferences</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </Link>

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 transition-all duration-200 group"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-orange-500/20 rounded-lg group-hover:bg-orange-500/30 transition-all duration-200">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Admin Dashboard</p>
                  <p className="text-gray-400 text-sm">Manage users and servers</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;