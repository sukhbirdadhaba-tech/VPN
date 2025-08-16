import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Activity, 
  Wifi, 
  Download,
  Filter,
  RefreshCw,
  Search,
  ChevronDown,
  Globe
} from 'lucide-react';

const ConnectionHistory = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all'); // all, today, week, month
  const [sortBy, setSortBy] = useState('recent'); // recent, duration, server

  useEffect(() => {
    loadConnectionHistory();
  }, []);

  const loadConnectionHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/connections/history');
      setConnections(response.data.connections);
    } catch (error) {
      console.error('Error loading connection history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'disconnected':
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const filterConnections = () => {
    let filtered = connections.filter(conn => {
      const matchesSearch = (conn.server_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (conn.server_country || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      const connDate = new Date(conn.connected_at);
      const now = new Date();
      
      switch (filterPeriod) {
        case 'today':
          return connDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return connDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return connDate >= monthAgo;
        default:
          return true;
      }
    });

    // Sort connections
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'server':
          return (a.server_name || '').localeCompare(b.server_name || '');
        default: // recent
          return new Date(b.connected_at) - new Date(a.connected_at);
      }
    });

    return filtered;
  };

  const filteredConnections = filterConnections();

  const getTotalStats = () => {
    const totalConnections = filteredConnections.length;
    const totalDuration = filteredConnections.reduce((sum, conn) => sum + (conn.duration || 0), 0);
    const uniqueServers = new Set(filteredConnections.map(conn => conn.server_id)).size;
    
    return {
      totalConnections,
      totalDuration,
      uniqueServers,
      averageDuration: totalConnections > 0 ? Math.round(totalDuration / totalConnections) : 0
    };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading connection history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Connection History</h1>
            <p className="text-gray-300">Track your VPN usage and connection statistics</p>
          </div>
          <button
            onClick={loadConnectionHistory}
            className="btn-secondary"
            title="Refresh history"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Sessions</p>
              <p className="text-2xl font-bold text-white">{stats.totalConnections}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Time</p>
              <p className="text-2xl font-bold text-white">{formatDuration(stats.totalDuration)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl">
              <Globe className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Unique Servers</p>
              <p className="text-2xl font-bold text-white">{stats.uniqueServers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-xl">
              <Download className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Avg. Session</p>
              <p className="text-2xl font-bold text-white">{formatDuration(stats.averageDuration)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8 glass p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by server or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Period Filter */}
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="input-field"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="recent">Most Recent</option>
            <option value="duration">Longest Duration</option>
            <option value="server">Server Name</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredConnections.length} of {connections.length} connections
        </div>
      </div>

      {/* Connection List */}
      {filteredConnections.length > 0 ? (
        <div className="space-y-4">
          {filteredConnections.map((connection, index) => (
            <div key={connection.id || index} className="card hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                    <Wifi className="w-6 h-6 text-purple-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold">
                      {connection.server_name || 'Unknown Server'}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{connection.server_country || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(connection.connected_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  {/* Duration */}
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {formatDuration(connection.duration)}
                    </p>
                    <p className="text-gray-400 text-sm">Duration</p>
                  </div>

                  {/* Status */}
                  <div className={`flex items-center space-x-2 px-3 py-1 border rounded-lg text-sm font-medium ${getStatusColor(connection.status)}`}>
                    <div className={`w-2 h-2 rounded-full ${
                      connection.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className="capitalize">{connection.status}</span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Connected At</p>
                  <p className="text-white">
                    {new Date(connection.connected_at).toLocaleString()}
                  </p>
                </div>
                
                {connection.disconnected_at && (
                  <div>
                    <p className="text-gray-400">Disconnected At</p>
                    <p className="text-white">
                      {new Date(connection.disconnected_at).toLocaleString()}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-400">Data Transferred</p>
                  <p className="text-white">
                    {connection.data_transferred ? 
                      `${(connection.data_transferred / 1024 / 1024).toFixed(2)} MB` : 
                      'N/A'
                    }
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-400">Connection ID</p>
                  <p className="text-white font-mono text-xs">
                    {connection.id?.slice(-8) || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-500/20 rounded-full mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No connection history</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterPeriod !== 'all' ? 
              'No connections match your current filters' :
              'Start connecting to VPN servers to see your history here'
            }
          </p>
          {(searchTerm || filterPeriod !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPeriod('all');
              }}
              className="btn-secondary"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionHistory;