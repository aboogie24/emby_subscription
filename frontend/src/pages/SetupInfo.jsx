export default function SetupInfo() {
  return (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100vh",
      display: "flex", 
      alignItems: "flex-start", 
      justifyContent: "center", 
      padding: "2rem",
      paddingTop: "1rem",
      zIndex: 1,
      overflow: "auto"
    }}>
      <div className="form-container" style={{ 
        maxWidth: "900px", 
        textAlign: "left",
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "2.5rem",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="form-title" style={{ 
            fontSize: "2.5rem", 
            marginBottom: "0.5rem",
            background: "linear-gradient(135deg, var(--accent-pink), var(--light-purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            🌌 Emby Setup Guide
          </h1>
          <p className="form-subtitle" style={{ 
            fontSize: "1.1rem", 
            color: "rgba(255, 255, 255, 0.8)",
            margin: 0
          }}>
            Your complete guide to getting started with Emby
          </p>
        </div>
        
        <div style={{ 
          marginBottom: "3rem",
          background: "rgba(255, 119, 198, 0.05)",
          border: "1px solid rgba(255, 119, 198, 0.2)",
          borderRadius: "12px",
          padding: "2rem"
        }}>
          <h2 style={{ 
            color: "var(--accent-pink)", 
            marginBottom: "1.5rem", 
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            📱 Step 1: Download the Emby App
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.8" }}>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Choose your platform and download the official Emby app:
            </p>
            <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <strong>📱 Mobile Devices</strong>
                <p style={{ margin: "0.5rem 0 0 0", color: "rgba(255, 255, 255, 0.8)" }}>
                  Download from App Store (iOS) or Google Play Store (Android)
                </p>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <strong>💻 Desktop/Laptop</strong>
                <p style={{ margin: "0.5rem 0 0 0", color: "rgba(255, 255, 255, 0.8)" }}>
                  Download from <a href="https://emby.media/download.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-pink)", textDecoration: "underline" }}>emby.media/download.html</a>
                </p>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <strong>📺 TV & Streaming Devices</strong>
                <p style={{ margin: "0.5rem 0 0 0", color: "rgba(255, 255, 255, 0.8)" }}>
                  Available on Roku, Fire TV, Apple TV, Android TV, and more
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginBottom: "3rem",
          background: "rgba(120, 119, 198, 0.05)",
          border: "1px solid rgba(120, 119, 198, 0.2)",
          borderRadius: "12px",
          padding: "2rem"
        }}>
          <h2 style={{ 
            color: "var(--light-purple)", 
            marginBottom: "1.5rem", 
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            🔧 Step 2: Configure Your Server Connection
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.8" }}>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Connect your Emby app to the server:
            </p>
            <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}>
                <div style={{ 
                  background: "var(--light-purple)",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>1</div>
                <span>Open the Emby app on your device</span>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}>
                <div style={{ 
                  background: "var(--light-purple)",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>2</div>
                <span>Tap "Add Server" or "Connect to Server"</span>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                  <div style={{ 
                    background: "var(--light-purple)",
                    color: "white",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: "bold"
                  }}>3</div>
                  <span>Enter your server details:</span>
                </div>
                <div style={{ marginLeft: "2.5rem", color: "rgba(255, 255, 255, 0.8)" }}>
                  <p style={{ margin: "0.25rem 0" }}>• <strong>Server Address:</strong> https://emby.justpurple.org</p>
                  <p style={{ margin: "0.25rem 0" }}>• <strong>Port:</strong> 443</p>
                </div>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}>
                <div style={{ 
                  background: "var(--light-purple)",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>4</div>
                <span>Tap "Connect" to establish connection</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginBottom: "3rem",
          background: "rgba(255, 119, 198, 0.05)",
          border: "1px solid rgba(255, 119, 198, 0.2)",
          borderRadius: "12px",
          padding: "2rem"
        }}>
          <h2 style={{ 
            color: "var(--accent-pink)", 
            marginBottom: "1.5rem", 
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            👤 Step 3: Sign In to Your Account
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.8" }}>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Access your personal media library:
            </p>
            <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}>
                <div style={{ 
                  background: "var(--accent-pink)",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>1</div>
                <span>After connecting to the server, you'll see the login screen</span>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}>
                <div style={{ 
                  background: "var(--accent-pink)",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>2</div>
                <span>Enter your username and password (created through this portal)</span>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}>
                <div style={{ 
                  background: "var(--accent-pink)",
                  color: "white",
                  borderRadius: "50%",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: "bold"
                }}>3</div>
                <span>Tap "Sign In" to access your media library</span>
              </div>
            </div>
            
            <div style={{ 
              background: "rgba(255, 119, 198, 0.1)", 
              border: "1px solid rgba(255, 119, 198, 0.3)",
              borderRadius: "10px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}>
              <div style={{ fontSize: "1.5rem" }}>💡</div>
              <div>
                <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold" }}>
                  Important Tip
                </p>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.9)" }}>
                  Use the same username and password you created when signing up through this Emby Portal.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginBottom: "3rem",
          background: "rgba(120, 119, 198, 0.05)",
          border: "1px solid rgba(120, 119, 198, 0.2)",
          borderRadius: "12px",
          padding: "2rem"
        }}>
          <h2 style={{ 
            color: "var(--light-purple)", 
            marginBottom: "1.5rem", 
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            🎬 Exploring Emby Features
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.8" }}>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Discover what you can do with Emby:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏠</div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1.1rem" }}>Home Dashboard</h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Recently added content and continue watching your favorites
                </p>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎥</div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1.1rem" }}>Movies</h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Browse and stream your complete movie collection
                </p>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📺</div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1.1rem" }}>TV Shows</h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Access all your series and episodes with progress tracking
                </p>
              </div>
              {/* <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎵</div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1.1rem" }}>Music</h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Listen to your music library with playlists and lyrics
                </p>
              </div> */}
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📱</div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1.1rem" }}>Offline Sync</h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Download content for offline viewing on mobile devices
                </p>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚙️</div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1.1rem" }}>Settings</h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Customize playback quality, subtitles, and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          marginBottom: "3rem",
          background: "rgba(255, 119, 198, 0.05)",
          border: "1px solid rgba(255, 119, 198, 0.2)",
          borderRadius: "12px",
          padding: "2rem"
        }}>
          <h2 style={{ 
            color: "var(--accent-pink)", 
            marginBottom: "1.5rem", 
            fontSize: "1.8rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            🔧 Troubleshooting Guide
          </h2>
          <div style={{ color: "var(--light-purple)", lineHeight: "1.8" }}>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
              Common issues and their solutions:
            </p>
            <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1rem" }}>
                  🚫 Can't connect to server
                </h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Check your network connection and verify the server address is correct
                </p>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1rem" }}>
                  🔐 Login failed
                </h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Double-check your username and password, or contact your administrator
                </p>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1rem" }}>
                  ⏯️ Playback issues
                </h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Try lowering the video quality in settings or check your internet speed
                </p>
              </div>
              <div style={{ 
                background: "rgba(255, 255, 255, 0.05)",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "white", fontSize: "1rem" }}>
                  📂 Content not showing
                </h3>
                <p style={{ margin: 0, color: "rgba(255, 255, 255, 0.8)", fontSize: "0.9rem" }}>
                  Ensure your account has proper permissions for the content library
                </p>
              </div>
            </div>
            
            <div style={{ 
              background: "rgba(120, 119, 198, 0.1)", 
              border: "1px solid rgba(120, 119, 198, 0.3)",
              borderRadius: "10px",
              padding: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem"
            }}>
              <div style={{ fontSize: "1.5rem" }}>🆘</div>
              <div>
                <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold" }}>
                  Still Need Help?
                </p>
                <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.9)" }}>
                  Contact your Emby server administrator or visit the official documentation at{" "}
                  <a href="https://emby.media/support.html" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-pink)", textDecoration: "underline" }}>
                    emby.media/support.html
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ 
          textAlign: "center", 
          marginTop: "3rem",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "12px",
          padding: "2rem",
          border: "1px solid rgba(255, 255, 255, 0.1)"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚀</div>
          <h3 style={{ margin: "0 0 1rem 0", color: "white", fontSize: "1.3rem" }}>
            Ready to Get Started?
          </h3>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1rem", marginBottom: "1.5rem" }}>
            Choose your next step to begin your Emby experience
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a 
              href="/login" 
              style={{ 
                color: "white",
                background: "var(--accent-pink)",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease"
              }}
            >
              Sign In to Account
            </a>
            <a 
              href="/" 
              style={{ 
                color: "var(--accent-pink)",
                background: "transparent",
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                border: "2px solid var(--accent-pink)",
                transition: "all 0.3s ease"
              }}
            >
              Create New Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
