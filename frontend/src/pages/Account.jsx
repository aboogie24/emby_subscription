import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Account() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/account`, {
      withCredentials: true 
    })
    .then(res => setAccount(res.data))
    .catch(() => {
      alert("Failed to fetch account");
      navigate("/login");
    }); 
  }, [navigate]);

  const handleLogout = async () => {
    await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, { withCredentials: true });
    setIsLoggedIn(false);
    navigate("/login");
  };

  if (!account) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="loading-spinner"></div>
        <span style={{ marginLeft: "1rem", color: "var(--light-purple)" }}>Loading...</span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="form-container">
        <h1 className="form-title">Account Dashboard</h1>
        <p className="form-subtitle">Manage your Emby subscription</p>
        
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ color: "var(--light-purple)", marginBottom: "0.5rem" }}>Username</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem" }}>{account.username}</p>
          </div>
          
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ color: "var(--light-purple)", marginBottom: "0.5rem" }}>Status</h3>
            <p style={{ 
              color: account.status === 'active' ? "var(--accent-pink)" : 
                     account.status === 'pending' ? "#fbbf24" : "rgba(255, 255, 255, 0.7)", 
              fontSize: "1.1rem",
              textTransform: "capitalize"
            }}>
              {account.status}
            </p>
            {account.status === 'pending' && (
              <p style={{ 
                color: "rgba(255, 255, 255, 0.8)", 
                fontSize: "0.9rem", 
                marginTop: "0.5rem",
                fontStyle: "italic"
              }}>
                Your account is created! Complete payment to activate your subscription.
              </p>
            )}
          </div>

          {account.plan_name && (
            <div style={{ marginBottom: "1rem" }}>
              <h3 style={{ color: "var(--light-purple)", marginBottom: "0.5rem" }}>Current Plan</h3>
              <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem" }}>
                {account.plan_name}
              </p>
            </div>
          )}
          
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ color: "var(--light-purple)", marginBottom: "0.5rem" }}>Next Renewal</h3>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "1.1rem" }}>
              {account.expiry_date ? new Date(account.expiry_date).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
        
        {account.billing_portal_url && (
          <button 
            onClick={() => window.location.href = account.billing_portal_url}
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            Manage Billing
          </button>
        )}
        
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a href="/login" onClick={handleLogout} className="text-muted" style={{ textDecoration: "none" }}>
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}
