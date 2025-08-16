from fastapi import FastAPI, HTTPException, Depends, Cookie, Response, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
import os
import uuid
import requests
import json
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="VPN Service Management API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client.vpn_service
users_collection = db.users
sessions_collection = db.sessions
servers_collection = db.servers
connections_collection = db.connections

# Security
security = HTTPBearer(auto_error=False)

# Pydantic models
class User(BaseModel):
    id: str
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "user"  # user or admin
    created_at: datetime
    last_login: Optional[datetime] = None

class Server(BaseModel):
    id: str
    name: str
    country: str
    city: str
    ip_address: str
    status: str = "online"  # online, offline, maintenance
    load: int = 0  # 0-100 percentage
    max_connections: int = 1000
    current_connections: int = 0
    created_at: datetime

class Connection(BaseModel):
    id: str
    user_id: str
    server_id: str
    connected_at: datetime
    disconnected_at: Optional[datetime] = None
    duration: Optional[int] = None  # in seconds
    data_transferred: Optional[int] = None  # in bytes
    status: str = "active"  # active, disconnected

class AuthResponse(BaseModel):
    user: User
    session_token: str

# Authentication functions
async def get_current_user(
    session_token: Optional[str] = Cookie(None),
    authorization: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> User:
    """Get current authenticated user from session token"""
    token = None
    
    # Try to get token from cookie first, then from Authorization header
    if session_token:
        token = session_token
    elif authorization:
        token = authorization.credentials
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Find session in database
    session = sessions_collection.find_one({"session_token": token})
    if not session or session["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    # Get user
    user = users_collection.find_one({"id": session["user_id"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Ensure current user is an admin"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Initialize sample data
def init_sample_data():
    """Initialize sample servers if none exist"""
    if servers_collection.count_documents({}) == 0:
        sample_servers = [
            {
                "id": str(uuid.uuid4()),
                "name": "US East (New York)",
                "country": "United States",
                "city": "New York",
                "ip_address": "198.51.100.10",
                "status": "online",
                "load": 25,
                "max_connections": 1000,
                "current_connections": 250,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "US West (Los Angeles)",
                "country": "United States",
                "city": "Los Angeles",
                "ip_address": "198.51.100.20",
                "status": "online",
                "load": 45,
                "max_connections": 1000,
                "current_connections": 450,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "UK (London)",
                "country": "United Kingdom",
                "city": "London",
                "ip_address": "198.51.100.30",
                "status": "online",
                "load": 60,
                "max_connections": 800,
                "current_connections": 480,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Germany (Berlin)",
                "country": "Germany",
                "city": "Berlin",
                "ip_address": "198.51.100.40",
                "status": "online",
                "load": 35,
                "max_connections": 1200,
                "current_connections": 420,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Japan (Tokyo)",
                "country": "Japan",
                "city": "Tokyo",
                "ip_address": "198.51.100.50",
                "status": "maintenance",
                "load": 0,
                "max_connections": 600,
                "current_connections": 0,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Singapore",
                "country": "Singapore",
                "city": "Singapore",
                "ip_address": "198.51.100.60",
                "status": "online",
                "load": 80,
                "max_connections": 500,
                "current_connections": 400,
                "created_at": datetime.utcnow()
            }
        ]
        servers_collection.insert_many(sample_servers)

# API Routes

@app.get("/")
async def root():
    return {"message": "VPN Service Management API", "status": "running"}

@app.post("/api/auth/profile", response_model=AuthResponse)
async def auth_profile(response: Response, x_session_id: str = Header(...)):
    """Authenticate user with Emergent auth and create session"""
    try:
        # Call Emergent auth API
        auth_response = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": x_session_id}
        )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        auth_data = auth_response.json()
        
        # Create or get user
        user_data = {
            "id": auth_data["id"],
            "email": auth_data["email"],
            "name": auth_data["name"],
            "picture": auth_data.get("picture"),
            "role": "user",
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow()
        }
        
        # Check if user exists
        existing_user = users_collection.find_one({"email": auth_data["email"]})
        if existing_user:
            # Update last login
            users_collection.update_one(
                {"email": auth_data["email"]},
                {"$set": {"last_login": datetime.utcnow()}}
            )
            user_data = existing_user
            user_data["last_login"] = datetime.utcnow()
        else:
            # Create new user
            users_collection.insert_one(user_data)
        
        # Create session
        session_token = auth_data["session_token"]
        session_data = {
            "session_token": session_token,
            "user_id": user_data["id"],
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=7)
        }
        
        # Remove existing sessions for this user
        sessions_collection.delete_many({"user_id": user_data["id"]})
        sessions_collection.insert_one(session_data)
        
        # Set cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            max_age=7 * 24 * 60 * 60,  # 7 days
            httponly=True,
            secure=True,
            samesite="none",
            path="/"
        )
        
        return AuthResponse(
            user=User(**user_data),
            session_token=session_token
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

@app.get("/api/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user

@app.post("/api/auth/logout")
async def logout(response: Response, current_user: User = Depends(get_current_user)):
    """Logout user and clear session"""
    sessions_collection.delete_many({"user_id": current_user.id})
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

@app.get("/api/servers", response_model=List[Server])
async def get_servers(current_user: User = Depends(get_current_user)):
    """Get all available VPN servers"""
    servers = list(servers_collection.find({}, {"_id": 0}))
    return [Server(**server) for server in servers]

@app.get("/api/servers/countries")
async def get_countries(current_user: User = Depends(get_current_user)):
    """Get list of available countries"""
    countries = servers_collection.distinct("country")
    return {"countries": countries}

@app.post("/api/servers/{server_id}/connect")
async def connect_to_server(server_id: str, current_user: User = Depends(get_current_user)):
    """Connect to a VPN server"""
    server = servers_collection.find_one({"id": server_id})
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    
    if server["status"] != "online":
        raise HTTPException(status_code=400, detail="Server is not available")
    
    # Disconnect from any existing connections
    connections_collection.update_many(
        {"user_id": current_user.id, "status": "active"},
        {
            "$set": {
                "status": "disconnected",
                "disconnected_at": datetime.utcnow()
            }
        }
    )
    
    # Create new connection
    connection_data = {
        "id": str(uuid.uuid4()),
        "user_id": current_user.id,
        "server_id": server_id,
        "connected_at": datetime.utcnow(),
        "status": "active"
    }
    connections_collection.insert_one(connection_data)
    
    # Update server connection count
    servers_collection.update_one(
        {"id": server_id},
        {"$inc": {"current_connections": 1}}
    )
    
    return {"message": f"Connected to {server['name']}", "connection_id": connection_data["id"]}

@app.post("/api/connections/disconnect")
async def disconnect(current_user: User = Depends(get_current_user)):
    """Disconnect from current VPN server"""
    active_connection = connections_collection.find_one({
        "user_id": current_user.id,
        "status": "active"
    })
    
    if not active_connection:
        raise HTTPException(status_code=400, detail="No active connection found")
    
    # Update connection
    disconnect_time = datetime.utcnow()
    duration = int((disconnect_time - active_connection["connected_at"]).total_seconds())
    
    connections_collection.update_one(
        {"id": active_connection["id"]},
        {
            "$set": {
                "status": "disconnected",
                "disconnected_at": disconnect_time,
                "duration": duration
            }
        }
    )
    
    # Update server connection count
    servers_collection.update_one(
        {"id": active_connection["server_id"]},
        {"$inc": {"current_connections": -1}}
    )
    
    return {"message": "Disconnected successfully"}

@app.get("/api/connections/history")
async def get_connection_history(current_user: User = Depends(get_current_user)):
    """Get user's connection history"""
    connections = list(connections_collection.find(
        {"user_id": current_user.id},
        {"_id": 0}
    ).sort("connected_at", -1).limit(50))
    
    # Add server info to connections
    for connection in connections:
        server = servers_collection.find_one({"id": connection["server_id"]})
        if server:
            connection["server_name"] = server["name"]
            connection["server_country"] = server["country"]
    
    return {"connections": connections}

@app.get("/api/connections/current")
async def get_current_connection(current_user: User = Depends(get_current_user)):
    """Get current active connection"""
    connection = connections_collection.find_one({
        "user_id": current_user.id,
        "status": "active"
    })
    
    if not connection:
        return {"connection": None}
    
    server = servers_collection.find_one({"id": connection["server_id"]})
    connection["server_name"] = server["name"] if server else "Unknown"
    connection["server_country"] = server["country"] if server else "Unknown"
    
    return {"connection": connection}

# Admin routes
@app.get("/api/admin/users")
async def get_all_users(admin_user: User = Depends(get_admin_user)):
    """Get all users (admin only)"""
    users = list(users_collection.find({}, {"_id": 0}))
    return {"users": users}

@app.get("/api/admin/servers", response_model=List[Server])
async def get_all_servers_admin(admin_user: User = Depends(get_admin_user)):
    """Get all servers with admin details"""
    servers = list(servers_collection.find({}, {"_id": 0}))
    return [Server(**server) for server in servers]

@app.post("/api/admin/servers")
async def create_server(server_data: dict, admin_user: User = Depends(get_admin_user)):
    """Create new VPN server"""
    server = {
        "id": str(uuid.uuid4()),
        "name": server_data["name"],
        "country": server_data["country"],
        "city": server_data["city"],
        "ip_address": server_data["ip_address"],
        "status": server_data.get("status", "offline"),
        "load": 0,
        "max_connections": server_data.get("max_connections", 1000),
        "current_connections": 0,
        "created_at": datetime.utcnow()
    }
    servers_collection.insert_one(server)
    return {"message": "Server created successfully", "server_id": server["id"]}

@app.put("/api/admin/servers/{server_id}")
async def update_server(server_id: str, server_data: dict, admin_user: User = Depends(get_admin_user)):
    """Update VPN server"""
    result = servers_collection.update_one(
        {"id": server_id},
        {"$set": server_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Server not found")
    
    return {"message": "Server updated successfully"}

@app.delete("/api/admin/servers/{server_id}")
async def delete_server(server_id: str, admin_user: User = Depends(get_admin_user)):
    """Delete VPN server"""
    result = servers_collection.delete_one({"id": server_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Server not found")
    
    return {"message": "Server deleted successfully"}

@app.get("/api/admin/stats")
async def get_admin_stats(admin_user: User = Depends(get_admin_user)):
    """Get admin dashboard statistics"""
    total_users = users_collection.count_documents({})
    total_servers = servers_collection.count_documents({})
    online_servers = servers_collection.count_documents({"status": "online"})
    active_connections = connections_collection.count_documents({"status": "active"})
    
    # Get connection stats for last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_connections = connections_collection.count_documents({
        "connected_at": {"$gte": week_ago}
    })
    
    return {
        "total_users": total_users,
        "total_servers": total_servers,
        "online_servers": online_servers,
        "active_connections": active_connections,
        "recent_connections": recent_connections
    }

@app.put("/api/admin/users/{user_id}/role")
async def update_user_role(user_id: str, role_data: dict, admin_user: User = Depends(get_admin_user)):
    """Update user role"""
    if role_data["role"] not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    result = users_collection.update_one(
        {"id": user_id},
        {"$set": {"role": role_data["role"]}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "User role updated successfully"}

# Initialize sample data on startup
@app.on_event("startup")
async def startup_event():
    init_sample_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)