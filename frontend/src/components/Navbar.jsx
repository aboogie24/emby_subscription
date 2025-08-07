import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuthStatus = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/debug-token`, { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  };

  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage events (when login happens in another tab/window)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check auth status when the window gains focus
    const handleFocus = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Listen for custom login events
  useEffect(() => {
    const handleLoginSuccess = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('loginSuccess', handleLoginSuccess);
    
    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess);
    };
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
      padding: "0.5rem 2rem",
      height: "60px"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        <RouterLink 
          to="/" 
          style={{ 
            fontSize: "28px",
            fontWeight: 800,
            background: "linear-gradient(45deg, #e879f9, #a855f7, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textDecoration: "none",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          EMBY GALAXY
        </RouterLink>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "30px",
          flexWrap: "wrap"
        }}>
          <a 
            href="#features"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#e879f9";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Features
          </a>
          <a 
            href="#pricing"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#e879f9";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Pricing
          </a>
          <a 
            href="#support"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#e879f9";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Support
          </a>
          <RouterLink 
            to="/setup" 
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              textDecoration: "none",
              fontWeight: 500,
              transition: "all 0.3s ease"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#e879f9";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Setup Guide
          </RouterLink>
          {!isLoggedIn ? (
            <>
              <RouterLink 
                to="/signup"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#e879f9";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Signup
              </RouterLink>
              <RouterLink 
                to="/login"
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#e879f9";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Login
              </RouterLink>
            </>
          ) : (
            <RouterLink 
              to="/account"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textDecoration: "none",
                fontWeight: 500,
                transition: "all 0.3s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "#e879f9";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Account
            </RouterLink>
          )}
        </div>
      </div>
    </nav>
  );
}
