# 🔐 VPNShield - Enterprise VPN Management Platform

**Professional VPN Service Management Platform**

Enterprise-grade VPN management with comprehensive admin tools, global server network, and advanced security features.

**Navigation:** Features • Demo • Quick Start • API Docs • Contributing

---

## 🌟 Features

### 👥 **User Management**
- **Secure Authentication** - Emergent auth integration with social login
- **Role-Based Access** - User and Admin role management
- **Profile Management** - Comprehensive user profile system
- **Session Management** - Secure 7-day session tokens

### 🌐 **Global Server Network**
- **Multi-Region Support** - Servers across 6+ countries (US, UK, Germany, Japan, Singapore)
- **Real-Time Monitoring** - Live server status and load balancing
- **Smart Selection** - Automatic optimal server recommendations
- **Connection Tracking** - Detailed connection history and statistics

### 🎛️ **Admin Dashboard**
- **User Management** - Manage user roles and permissions
- **Server Administration** - Full CRUD operations for VPN servers
- **System Analytics** - Comprehensive statistics and monitoring
- **Real-Time Updates** - Live connection and server status

### 🎨 **Modern UI/UX**
- **Glass-Morphism Design** - Modern, professional interface
- **Fully Responsive** - Perfect on desktop, tablet, and mobile
- **Dark Theme** - Eye-friendly purple gradient design
- **Smooth Animations** - Polished user interactions

## 🚀 Demo

### Live Application
- **Frontend**: https://privateconnect-1.preview.emergentagent.com
- **Backend API**: Available at `/api` endpoints

### Key Screenshots
1. **🔐 Secure Login** - Professional authentication page
2. **📊 User Dashboard** - Comprehensive overview with server stats
3. **🌐 Server Selection** - Global server network with filtering
4. **👑 Admin Dashboard** - Complete management interface

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **MongoDB** - NoSQL database for flexible data storage
- **Pydantic** - Data validation and serialization
- **Python-Jose** - JSON Web Token implementation
- **Passlib** - Password hashing utilities

### Frontend
- **React 19** - Modern React with latest features
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Authentication
- **Emergent Auth** - Secure authentication platform
- **Session Management** - JWT-based session handling
- **Role-Based Access** - User and admin permissions

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.8+
- MongoDB
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/vpnshield-management.git
cd vpnshield-management
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your MongoDB URL and other settings

# Start the backend server
python server.py
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
yarn install

# Set environment variables
cp .env.example .env
# Edit .env with your backend URL

# Start the development server
yarn start
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

## 📁 Project Structure

```
vpnshield-management/
├── backend/                 # FastAPI backend
│   ├── server.py           # Main application server
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Header.js
│   │   │   ├── LoginPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── ServerSelection.js
│   │   │   └── ConnectionHistory.js
│   │   ├── App.js         # Main application component
│   │   └── App.css        # Application styles
│   ├── package.json       # Node.js dependencies
│   └── .env              # Environment variables
├── tests/                 # Test files
└── README.md             # This file
```

## 📚 API Documentation

### Authentication Endpoints
```http
POST /api/auth/profile      # Authenticate with session ID
GET  /api/auth/me          # Get current user
POST /api/auth/logout      # Logout user
```

### Server Management
```http
GET  /api/servers          # Get all servers
GET  /api/servers/countries # Get available countries
POST /api/servers/{id}/connect # Connect to server
POST /api/connections/disconnect # Disconnect from server
```

### Connection History
```http
GET /api/connections/history  # Get user connection history
GET /api/connections/current  # Get current connection
```

### Admin Endpoints (Admin Only)
```http
GET  /api/admin/users        # Get all users
GET  /api/admin/servers      # Get all servers
POST /api/admin/servers      # Create new server
PUT  /api/admin/servers/{id} # Update server
DELETE /api/admin/servers/{id} # Delete server
GET  /api/admin/stats        # Get system statistics
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017/
SECRET_KEY=your-secret-key-here
```

#### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Sample Server Data
The application includes pre-loaded sample servers:
- **US East** (New York) - Online
- **US West** (Los Angeles) - Online  
- **UK** (London) - Online
- **Germany** (Berlin) - Online
- **Japan** (Tokyo) - Maintenance
- **Singapore** - Online

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing  
```bash
cd frontend
yarn test
```

### API Testing
Use the included test script:
```bash
python backend_test.py
```

## 🚀 Deployment

### Using Docker
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. **Backend**: Deploy FastAPI app using Uvicorn + Nginx
2. **Frontend**: Build React app and serve with Nginx
3. **Database**: Set up MongoDB instance
4. **Environment**: Configure production environment variables

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow Python PEP 8 style guide for backend
- Use ESLint and Prettier for frontend code formatting
- Write tests for new features
- Update documentation as needed

## 📋 Roadmap

### v2.0 Planned Features
- [ ] **Real VPN Integration** - OpenVPN/WireGuard protocol support
- [ ] **Advanced Analytics** - Detailed bandwidth and usage statistics  
- [ ] **Multi-Factor Auth** - TOTP/SMS authentication
- [ ] **API Rate Limiting** - Enhanced security measures
- [ ] **Server Health Checks** - Automated monitoring system
- [ ] **Billing Integration** - Stripe payment processing
- [ ] **Mobile App** - React Native companion app

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨\u200d💻 Authors

- **Your Name** - *Initial work* - [YourGithub](https://github.com/yourusername)

## 🙏 Acknowledgments

- **Emergent Platform** - Authentication services
- **FastAPI** - Excellent Python web framework
- **React Team** - Amazing frontend library  
- **Tailwind CSS** - Beautiful utility-first styling
- **MongoDB** - Flexible database solution

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/vpnshield-management/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/vpnshield-management/discussions)
- **Email**: support@vpnshield.com

---

**⭐ Star this repository if you find it helpful!**
**Made with ❤️ for the open source community**"
