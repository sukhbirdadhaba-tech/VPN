import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ProfilePage from './components/ProfilePage';
import ServerSelection from './components/ServerSelection';
import ConnectionHistory from './components/ConnectionHistory';

// Axios configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [servers, setServers] = useState([]);

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
    loadServers();
  }, []);

  // Handle URL fragment authentication (from Emergent auth redirect)
  useEffect(() => {
    const handleAuthFragment = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('session_id=')) {
        const sessionId = hash.split('session_id=')[1].split('&')[0];
        
        try {
          const response = await axios.post('/api/auth/profile', {}, {
            headers: {
              'X-Session-ID': sessionId
            }
          });
          
          setUser(response.data.user);
          window.location.hash = '';
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          console.error('Auth error:', error);
          setLoading(false);
        }
      }
    };

    handleAuthFragment();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data);
      loadCurrentConnection();
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const loadServers = async () => {
    try {
      if (user) {
        const response = await axios.get('/api/servers');
        setServers(response.data);
      }
    } catch (error) {
      console.error('Error loading servers:', error);
    }
  };

  const loadCurrentConnection = async () => {
    try {
      const response = await axios.get('/api/connections/current');
      setCurrentConnection(response.data.connection);
    } catch (error) {
      console.error('Error loading current connection:', error);
    }
  };

  const handleLogin = () => {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/profile`);
    window.location.href = `https://auth.emergentagent.com/?redirect=${redirectUrl}`;
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      setCurrentConnection(null);
      setServers([]);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const connectToServer = async (serverId) => {
    try {
      await axios.post(`/api/servers/${serverId}/connect`);
      loadCurrentConnection();
      loadServers(); // Refresh server data
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect to server');
    }
  };

  const disconnectFromServer = async () => {
    try {
      await axios.post('/api/connections/disconnect');
      setCurrentConnection(null);
      loadServers(); // Refresh server data
    } catch (error) {
      console.error('Disconnect error:', error);
      alert('Failed to disconnect');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {user && (
          <Header 
            user={user} 
            onLogout={handleLogout}
            currentConnection={currentConnection}
            onDisconnect={disconnectFromServer}
          />
        )}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/dashboard" /> : 
              <LoginPage onLogin={handleLogin} />
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              user ? <ProfilePage user={user} /> : 
              <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard 
                  user={user}
                  currentConnection={currentConnection}
                  servers={servers}
                  onConnect={connectToServer}
                  onDisconnect={disconnectFromServer}
                  onRefresh={() => {
                    loadServers();
                    loadCurrentConnection();
                  }}
                />
              ) : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/servers" 
            element={
              user ? (
                <ServerSelection 
                  servers={servers}
                  currentConnection={currentConnection}
                  onConnect={connectToServer}
                  onDisconnect={disconnectFromServer}
                />
              ) : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/history" 
            element={
              user ? <ConnectionHistory /> : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              user && user.role === 'admin' ? (
                <AdminDashboard user={user} />
              ) : user ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/" 
            element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;