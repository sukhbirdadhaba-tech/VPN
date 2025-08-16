import React, { useState, useMemo } from 'react';
import { 
  Globe, 
  MapPin, 
  Signal, 
  Wifi, 
  WifiOff, 
  Search, 
  Filter,
  Zap,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Wrench
} from 'lucide-react';

const ServerSelection = ({ servers, currentConnection, onConnect, onDisconnect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('load'); // load, name, country

  // Get unique countries
  const countries = useMemo(() => {
    const uniqueCountries = [...new Set(servers.map(s => s.country))];
    return uniqueCountries.sort();
  }, [servers]);

  // Filter and sort servers
  const filteredServers = useMemo(() => {
    let filtered = servers.filter(server => {
      const matchesSearch = server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           server.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           server.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = filterCountry === 'all' || server.country === filterCountry;
      const matchesStatus = filterStatus === 'all' || server.status === filterStatus;
      
      return matchesSearch && matchesCountry && matchesStatus;
    });

    // Sort servers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'load':
          return a.load - b.load;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'country':
          return a.country.localeCompare(b.country);
        default:
          return 0;
      }
    });

    return filtered;
  }, [servers, searchTerm, filterCountry, filterStatus, sortBy]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'maintenance':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">VPN Servers</h1>
        <p className="text-gray-300">Choose from our global network of secure servers</p>
      </div>

      {/* Current Connection Status */}
      {currentConnection && (
        <div className="mb-8 glass-strong p-6 border-l-4 border-green-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl">
                <Wifi className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Currently Connected</h3>
                <p className="text-green-300">
                  {currentConnection.server_name} • {currentConnection.server_country}
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
      )}

      {/* Filters and Search */}
      <div className="mb-8 glass p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search servers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Country Filter */}
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="input-field"
          >
            <option value="all">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="load">Sort by Load</option>
            <option value="name">Sort by Name</option>
            <option value="country">Sort by Country</option>
          </select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredServers.length} of {servers.length} servers
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Offline</span>
            </div>
          </div>
        </div>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServers.map((server) => (
          <div key={server.id} className="card hover:scale-105 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{server.name}</h3>
                  <p className="text-gray-400 text-sm">{server.city}, {server.country}</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-1 px-2 py-1 border rounded-lg text-xs font-medium ${getStatusColor(server.status)}`}>
                {getStatusIcon(server.status)}
                <span className="capitalize">{server.status}</span>
              </div>
            </div>

            {/* Server Stats */}
            <div className="space-y-4 mb-6">
              {/* Load */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm flex items-center space-x-1">
                    <Signal className="w-4 h-4" />
                    <span>Server Load</span>
                  </span>
                  <span className={`text-sm font-medium ${getLoadColor(server.load)}`}>
                    {server.load}%
                  </span>
                </div>
                <div className="load-bar">
                  <div 
                    className={`load-bar-fill ${
                      server.load < 30 ? 'load-low' : 
                      server.load < 70 ? 'load-medium' : 'load-high'
                    }`}
                    style={{ width: `${server.load}%` }}
                  ></div>
                </div>
              </div>

              {/* Connections */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>Connections</span>
                </span>
                <span className="text-white text-sm font-medium">
                  {server.current_connections}/{server.max_connections}
                </span>
              </div>

              {/* IP Address */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>IP Address</span>
                </span>
                <span className="text-white text-sm font-mono">
                  {server.ip_address}
                </span>
              </div>
            </div>

            {/* Connect Button */}
            <div className="flex space-x-2">
              {server.id === currentConnection?.server_id ? (
                <button
                  disabled
                  className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Connected</span>
                </button>
              ) : (
                <button
                  onClick={() => onConnect(server.id)}
                  disabled={server.status !== 'online'}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                    server.status === 'online'
                      ? 'btn-primary hover:scale-105'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {server.status === 'online' ? 'Connect' : 'Unavailable'}
                  </span>
                </button>
              )}
            </div>

            {/* Performance Indicator */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    {server.load < 30 ? 'Excellent' : 
                     server.load < 70 ? 'Good' : 'Busy'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    server.load < 30 ? 'bg-green-500' : 
                    server.load < 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span>Performance</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredServers.length === 0 && (
        <div className="text-center py-12">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-500/20 rounded-full mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No servers found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your search criteria or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterCountry('all');
              setFilterStatus('all');
            }}
            className="btn-secondary"
          >
            <Filter className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ServerSelection;