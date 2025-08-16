import React from 'react';
import { User, Mail, Calendar, Shield, Clock, Award, ChevronRight } from 'lucide-react';

const ProfilePage = ({ user }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border border-orange-500/30';
      case 'user':
        return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-500/30';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Account Profile</h1>
        <p className="text-gray-300">Manage your account information and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="glass-strong p-6 text-center">
            <div className="relative inline-block mb-6">
              <img
                src={user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8b5cf6&color=fff&size=120`}
                alt={user.name}
                className="w-24 h-24 rounded-full ring-4 ring-purple-400/50 mx-auto"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>
            
            <h2 className="text-xl font-semibold text-white mb-1">{user.name}</h2>
            <p className="text-gray-300 mb-4">{user.email}</p>
            
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
              <Shield className="w-4 h-4" />
              <span className="capitalize">{user.role}</span>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Member since</span>
                </div>
              </div>
              <p className="text-white font-medium mt-1">
                {formatDate(user.created_at).split(' at')[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="glass p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <User className="w-5 h-5 text-purple-400" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-white">{user.name}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-white">{user.email}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <p className="text-white font-mono text-sm">{user.id}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Account Role</label>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                    <Shield className="w-4 h-4" />
                    <span className="capitalize">{user.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Activity */}
          <div className="glass p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>Account Activity</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Account Created</p>
                    <p className="text-gray-400 text-sm">Your account registration date</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{formatDate(user.created_at).split(' at')[0]}</p>
                  <p className="text-gray-400 text-sm">{formatDate(user.created_at).split(' at')[1]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Last Login</p>
                    <p className="text-gray-400 text-sm">Your most recent session</p>
                  </div>
                </div>
                <div className="text-right">
                  {user.last_login ? (
                    <>
                      <p className="text-white font-medium">{formatDate(user.last_login).split(' at')[0]}</p>
                      <p className="text-gray-400 text-sm">{formatDate(user.last_login).split(' at')[1]}</p>
                    </>
                  ) : (
                    <p className="text-gray-400">Never</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Account Status</p>
                    <p className="text-gray-400 text-sm">Current account standing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Privileges */}
          {user.role === 'admin' && (
            <div className="glass p-6 border-l-4 border-orange-400">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Award className="w-5 h-5 text-orange-400" />
                <span>Administrator Privileges</span>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-orange-400" />
                  <span className="text-white">User Management</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-orange-400" />
                  <span className="text-white">Server Management</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-orange-400" />
                  <span className="text-white">System Analytics</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-500/10 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-orange-400" />
                  <span className="text-white">Configuration Access</span>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="glass p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Security Information</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your account is secured through Emergent's authentication system. 
                  Profile information is automatically synced and cannot be modified directly. 
                  For account changes, please contact support or update your Emergent profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;