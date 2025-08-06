export default function SetupInfo() {
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
      zIndex: 1,
      overflow: "auto"
    }}>
      <div className="form-container" style={{ maxWidth: "800px", textAlign: "left" }}>
        <h1 className="form-title" style={{ textAlign: "center" }}>🌌 Emby Setup Guide</h1>
        <p className="form-subtitle" style={{ textAlign: "center" }}>Complete guide to setting up and using Emby</p>
        
        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--accent-pink)", marginBottom: "1rem", fontSize: "1.5rem" }}>
            📱 Getting Started with Emby
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            <p><strong>Step 1: Download the Emby App</strong></p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>📱 <strong>Mobile:</strong> Download from App Store (iOS) or Google Play Store (Android)</li>
              <li>💻 <strong>Desktop:</strong> Download from <a href="https://emby.media/download.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-pink)" }}>emby.media/download.html</a></li>
              <li>📺 <strong>TV/Streaming:</strong> Available on Roku, Fire TV, Apple TV, and more</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--accent-pink)", marginBottom: "1rem", fontSize: "1.5rem" }}>
            🔧 Initial Setup
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            <p><strong>Step 2: Configure Your Server Connection</strong></p>
            <ol style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>Open the Emby app on your device</li>
              <li>Tap "Add Server" or "Connect to Server"</li>
              <li>Enter your server details:
                <ul style={{ marginLeft: "1rem", marginTop: "0.5rem" }}>
                  <li><strong>Server Address:</strong> Your Emby server URL (e.g., http://192.168.1.100:8096)</li>
                  <li><strong>Port:</strong> Usually 8096 (HTTP) or 8920 (HTTPS)</li>
                </ul>
              </li>
              <li>Tap "Connect" to establish connection</li>
            </ol>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--accent-pink)", marginBottom: "1rem", fontSize: "1.5rem" }}>
            👤 Account Login
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            <p><strong>Step 3: Sign In to Your Account</strong></p>
            <ol style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li>After connecting to the server, you'll see the login screen</li>
              <li>Enter your username and password (created through this portal)</li>
              <li>If you have multiple users, select your profile</li>
              <li>Tap "Sign In" to access your media library</li>
            </ol>
            
            <div style={{ 
              background: "rgba(255, 119, 198, 0.1)", 
              border: "1px solid rgba(255, 119, 198, 0.3)",
              borderRadius: "8px",
              padding: "1rem",
              marginTop: "1rem"
            }}>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                <strong>💡 Tip:</strong> Use the same username and password you created when signing up through this Emby Portal.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--accent-pink)", marginBottom: "1rem", fontSize: "1.5rem" }}>
            🎬 Using Emby Features
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            <p><strong>Key Features & Navigation:</strong></p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li><strong>🏠 Home:</strong> Recently added content and continue watching</li>
              <li><strong>🎥 Movies:</strong> Browse your movie collection</li>
              <li><strong>📺 TV Shows:</strong> Access all your series and episodes</li>
              <li><strong>🎵 Music:</strong> Listen to your music library</li>
              <li><strong>📱 Sync:</strong> Download content for offline viewing</li>
              <li><strong>⚙️ Settings:</strong> Customize playback, quality, and preferences</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h2 style={{ color: "var(--accent-pink)", marginBottom: "1rem", fontSize: "1.5rem" }}>
            🔧 Troubleshooting
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            <p><strong>Common Issues & Solutions:</strong></p>
            <ul style={{ marginLeft: "1rem", marginBottom: "1rem" }}>
              <li><strong>Can't connect to server:</strong> Check your network connection and server address</li>
              <li><strong>Login failed:</strong> Verify your username/password or contact your administrator</li>
              <li><strong>Playback issues:</strong> Try lowering video quality in settings</li>
              <li><strong>Content not showing:</strong> Ensure your account has proper permissions</li>
            </ul>
            
            <div style={{ 
              background: "rgba(120, 119, 198, 0.1)", 
              border: "1px solid rgba(120, 119, 198, 0.3)",
              borderRadius: "8px",
              padding: "1rem",
              marginTop: "1rem"
            }}>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                <strong>🆘 Need Help?</strong> Contact your Emby server administrator or check the official Emby documentation at <a href="https://emby.media/support.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-pink)" }}>emby.media/support.html</a>
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem" }}>
            Ready to get started? <a href="/login" style={{ color: "var(--accent-pink)" }}>Sign in to your account</a> or <a href="/" style={{ color: "var(--accent-pink)" }}>create a new account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
