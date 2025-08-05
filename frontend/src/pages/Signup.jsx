import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
        username, email
      });
      print(res.data.checkout_url)
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else if (res.status === 200) {
        navigate("/account");
      } else {
        alert("Error: " + (res.data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Signup failed");
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
        <h1 className="form-title">Sign Up for Emby</h1>
        <p className="form-subtitle">Join the galaxy of entertainment</p>
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input 
            id="username"
            type="text"
            placeholder="Create your username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-group">Email:</label>
          <input 
            id="email"
            type="email"
            placeholder="Enter your email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <button onClick={handleSignup} style={{ width: "100%", marginTop: "1rem" }}>
          Sign Up & Subscribe
        </button>
        
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <span className="text-muted">Already have an account? </span>
          <a href="/login" className="text-accent">Sign in here</a>
        </div>
      </div>
    </div>
  );
}
