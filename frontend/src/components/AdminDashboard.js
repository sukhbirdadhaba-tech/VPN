import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Server, 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Globe,
  Shield,
  UserCheck,
  UserX,
  Settings,
  MapPin,
  AlertCircle,
  CheckCircle,
  Wrench,
  Crown
} from 'lucide-react';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [servers, setServers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [editingServer, setEditingServer] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, serversRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/servers')
      ]);
      
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setServers(serversRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      await loadAdminData(); // Refresh data
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const createServer = async (serverData) => {
    try {
      await axios.post('/api/admin/servers', serverData);
      await loadAdminData(); // Refresh data
      setShowCreateServer(false);
      alert('Server created successfully');
    } catch (error) {
      console.error('Error creating server:', error);
      alert('Failed to create server');
    }
  };

  const updateServer = async (serverId, serverData) => {
    try {
      await axios.put(`/api/admin/servers/${serverId}`, serverData);
      await loadAdminData(); // Refresh data
      setEditingServer(null);
      alert('Server updated successfully');
    } catch (error) {
      console.error('Error updating server:', error);
      alert('Failed to update server');
    }
  };

  const deleteServer = async (serverId) => {
    if (!window.confirm('Are you sure you want to delete this server?')) return;
    
    try {
      await axios.delete(`/api/admin/servers/${serverId}`);
      await loadAdminData(); // Refresh data
      alert('Server deleted successfully');
    } catch (error) {
      console.error('Error deleting server:', error);
      alert('Failed to delete server');
    }
  };

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

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServers = servers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300">Loading admin dashboard...</p>
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
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center space-x-3">
              <Crown className="w-8 h-8 text-orange-400" />
              <span>Admin Dashboard</span>
            </h1>
            <p className="text-gray-300">Manage users, servers, and system settings</p>
          </div>
          <button
            onClick={loadAdminData}
            className="btn-secondary"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-white/5 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'servers', label: 'Servers', icon: Server }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.total_users || 0}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl">
                  <Server className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Servers</p>
                  <p className="text-2xl font-bold text-white">{stats.total_servers || 0}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Online Servers</p>
                  <p className="text-2xl font-bold text-white">{stats.online_servers || 0}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-xl">
                  <Globe className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Connections</p>
                  <p className="text-2xl font-bold text-white">{stats.active_connections || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">System Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-4">Server Status Distribution</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Online</span>
                    <span className="text-green-400 font-medium">{stats.online_servers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Total</span>
                    <span className="text-white font-medium">{stats.total_servers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Uptime</span>
                    <span className="text-purple-400 font-medium">
                      {stats.total_servers > 0 ? 
                        Math.round((stats.online_servers / stats.total_servers) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-4">Recent Activity (7 days)</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">New Connections</span>
                    <span className="text-blue-400 font-medium">{stats.recent_connections || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Active Users</span>
                    <span className="text-green-400 font-medium">{stats.total_users || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Avg. Session</span>
                    <span className="text-purple-400 font-medium">45m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Users Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 w-64"
              />
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((u) => (
              <div key={u.id} className="card hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={u.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=8b5cf6&color=fff`}
                      alt={u.name}
                      className="w-12 h-12 rounded-full ring-2 ring-purple-400/50"
                    />
                    <div>
                      <h3 className="text-white font-semibold">{u.name}</h3>
                      <p className="text-gray-400 text-sm">{u.email}</p>
                      <p className="text-gray-500 text-xs">
                        Joined {new Date(u.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 px-3 py-1 border rounded-lg text-sm font-medium ${
                      u.role === 'admin' 
                        ? 'text-orange-400 bg-orange-500/20 border-orange-500/30'
                        : 'text-blue-400 bg-blue-500/20 border-blue-500/30'
                    }`}>
                      {u.role === 'admin' ? <Crown className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      <span className="capitalize">{u.role}</span>
                    </div>
                    
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="input-field py-2 px-3 text-sm"
                      disabled={u.id === user.id} // Can't change own role
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
              <p className="text-gray-400">Try a different search term</p>
            </div>
          )}
        </div>
      )}

      {/* Servers Tab */}
      {activeTab === 'servers' && (
        <div className="space-y-6">
          {/* Servers Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Server Management</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search servers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-64"
                />
              </div>
              <button
                onClick={() => setShowCreateServer(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Add Server
              </button>
            </div>
          </div>

          {/* Servers List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredServers.map((server) => (
              <div key={server.id} className="card hover:bg-white/15 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                      <MapPin className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{server.name}</h3>
                      <p className="text-gray-400 text-sm">{server.city}, {server.country}</p>
                      <p className="text-gray-500 text-xs font-mono">{server.ip_address}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-1 px-2 py-1 border rounded-lg text-xs font-medium ${getStatusColor(server.status)}`}>
                    {getStatusIcon(server.status)}
                    <span className="capitalize">{server.status}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Load</span>
                    <span className="text-white font-medium">{server.load}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        server.load < 30 ? 'bg-green-500' : 
                        server.load < 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${server.load}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Connections</span>
                    <span className="text-white font-medium">
                      {server.current_connections}/{server.max_connections}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingServer(server)}
                    className="btn-secondary flex-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteServer(server.id)}
                    className="btn-danger flex-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredServers.length === 0 && (
            <div className="text-center py-12">
              <Server className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No servers found</h3>
              <p className="text-gray-400">Try a different search term or add a new server</p>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Server Modal */}
      {(showCreateServer || editingServer) && (
        <ServerModal
          server={editingServer}
          onSave={editingServer ? 
            (data) => updateServer(editingServer.id, data) : 
            createServer
          }
          onClose={() => {
            setShowCreateServer(false);
            setEditingServer(null);
          }}
        />
      )}
    </div>
  );
};

// Server Modal Component
const ServerModal = ({ server, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: server?.name || '',
    country: server?.country || '',
    city: server?.city || '',
    ip_address: server?.ip_address || '',
    status: server?.status || 'offline',
    max_connections: server?.max_connections || 1000
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-strong max-w-md w-full p-6">
        <h3 className="text-xl font-semibold text-white mb-6">
          {server ? 'Edit Server' : 'Create New Server'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Server Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="input-field"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="input-field"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">IP Address</label>
            <input
              type="text"
              value={formData.ip_address}
              onChange={(e) => setFormData({...formData, ip_address: e.target.value})}
              className="input-field"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="input-field"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Connections</label>
              <input
                type="number"
                value={formData.max_connections}
                onChange={(e) => setFormData({...formData, max_connections: parseInt(e.target.value)})}
                className="input-field"
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {server ? 'Update Server' : 'Create Server'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;