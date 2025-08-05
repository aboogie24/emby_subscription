import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/debug-token`, { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  console.log(isLoggedIn);

  // const checkDebugToken = async () => {
  //   try {
  //     const res = await axios.get(`${import.meta.env.VITE_API_URL}/debug-token`, {
  //       withCredentials: true
  //     });
  //     alert(`Decoded user: ${res.data.decoded_username || "No token"}`);
  //     console.log("Debug Token Response:", res.data);
  //   } catch (err) {
  //     alert("Debug failed");
  //     console.error("Debug Token Error:", err.response?.data || err.message);
  //   }
  // };

  // const handleLogout = async () => {
  //   await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, { withCredentials: true });
  //   setIsLoggedIn(false);
  //   navigate("/login");
  // };

  return (
    <nav className="nav-container" style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      zIndex: 1000,
      padding: "1rem 2rem"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <h2 style={{ 
          color: "var(--accent-pink)", 
          margin: 0,
          textShadow: "0 0 15px rgba(255, 119, 198, 0.4)",
          fontSize: "1.5rem"
        }}>
          🌌 Emby Portal
        </h2>
        
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {!isLoggedIn ? (
            <>
              <RouterLink to="/" className="nav-link">
                Signup
              </RouterLink>
              <RouterLink to="/login" className="nav-link">
                Login
              </RouterLink>
            </>
          ) : (
            <>
              <RouterLink to="/account" className="nav-link">
                Account
              </RouterLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
