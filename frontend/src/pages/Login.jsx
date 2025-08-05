import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true // Allow cookies
      });

      console.log("Login response:", res.data);
      setTimeout(() => navigate("/account"), 100);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message); 
      alert("Login failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: "2rem",
      zIndex: 1
    }}>
      <div className="form-container">
        <h1 className="form-title">Welcome Back</h1>
        <p className="form-subtitle">Sign in to your Emby account</p>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            type="text"
            placeholder="Enter your username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password"
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button onClick={handleLogin} style={{ width: "100%", marginTop: "1rem" }}>
          Sign In
        </button>
        
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <span className="text-muted">Don't have an account? </span>
          <a href="/" className="text-accent">Sign up here</a>
        </div>
      </div>
    </div>
  );
}
