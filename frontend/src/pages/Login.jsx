import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (username.trim().length > 50) {
      newErrors.username = "Username must be less than 50 characters";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      newErrors.username = "Username can only contain letters, numbers, underscores, and hyphens";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const formData = new URLSearchParams();
      formData.append("username", username.trim());
      formData.append("password", password);

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        withCredentials: true // Allow cookies
      });

      console.log("Login response:", res.data);
      // Dispatch custom event to notify navbar of login success
      window.dispatchEvent(new Event('loginSuccess'));
      setTimeout(() => navigate("/account"), 100);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.detail || "Login failed. Please check your credentials.";
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') {
      setUsername(value);
    } else if (field === 'password') {
      setPassword(value);
    }
    
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
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
        
        {errors.general && (
          <div style={{ 
            color: "#ff6b6b", 
            backgroundColor: "rgba(255, 107, 107, 0.1)", 
            padding: "0.75rem", 
            borderRadius: "4px", 
            marginBottom: "1rem",
            fontSize: "0.9rem"
          }}>
            {errors.general}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            type="text"
            placeholder="Enter your username" 
            value={username} 
            onChange={(e) => handleInputChange('username', e.target.value)}
            style={{
              borderColor: errors.username ? "#ff6b6b" : undefined
            }}
          />
          {errors.username && (
            <div style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              {errors.username}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password"
            placeholder="Enter your password" 
            value={password} 
            onChange={(e) => handleInputChange('password', e.target.value)}
            style={{
              borderColor: errors.password ? "#ff6b6b" : undefined
            }}
          />
          {errors.password && (
            <div style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              {errors.password}
            </div>
          )}
        </div>
        
        <button 
          onClick={handleLogin} 
          disabled={isSubmitting}
          style={{ 
            width: "100%", 
            marginTop: "1rem",
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
        
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <span className="text-muted">Don't have an account? </span>
          <a href="/" className="text-accent">Sign up here</a>
        </div>
      </div>
    </div>
  );
}
