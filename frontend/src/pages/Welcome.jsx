import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Welcome() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/subscription-plans`);
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(price / 100);
  };

  const getLowestPrice = () => {
    if (plans.length === 0) return null;
    const lowestPlan = plans.reduce((min, plan) => 
      plan.price < min.price ? plan : min
    );
    return lowestPlan;
  };

  return (
    <>
      {/* Background stars */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          radial-gradient(2px 2px at 20px 30px, #fff, transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 90px 40px, #fff, transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
          radial-gradient(2px 2px at 160px 30px, #fff, transparent)
        `,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 100px',
        animation: 'twinkle 6s ease-in-out infinite alternate',
        zIndex: 0
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Hero Section */}
        <section style={{
          textAlign: 'center',
          padding: '140px 0 60px', // Extra padding top for navbar
          position: 'relative'
        }}>
          {/* Glow effect behind title */}
          <div style={{
            position: 'absolute',
            top: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            zIndex: -1
          }} />

          <h1 style={{
            fontSize: 'clamp(48px, 6vw, 72px)',
            fontWeight: 900,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1.1
          }}>
            The JustPurple Movie Experience
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6
          }}>
            Stream unlimited movies and TV shows on your private, secure media server. Request content, watch anywhere, and enjoy the ultimate entertainment experience.
          </p>

          {/* Pricing highlight */}
          {!loading && plans.length > 0 && (
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#1a0b2e',
              padding: '8px 20px',
              borderRadius: '25px',
              fontWeight: 700,
              fontSize: '24px',
              marginBottom: '10px',
              boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)'
            }}>
              Starting at {getLowestPrice() && formatPrice(getLowestPrice().price, getLowestPrice().currency)}/month
            </div>
          )}

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '80px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate("/signup")}
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #e879f9 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 40px rgba(168, 85, 247, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.3)';
              }}
            >
              🚀 Start Your Journey
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                padding: '14px 30px',
                borderRadius: '50px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textDecoration: 'none',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Sign In
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '60px 0' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '42px',
            fontWeight: 800,
            marginBottom: '60px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Why Choose Emby Galaxy?
          </h2>

          {/* Features Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginBottom: '60px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}>
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>🔒</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Private & Secure
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px' }}>
                Your personal media server with military-grade encryption. Complete privacy with no data tracking or third-party access.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}>
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>🎬</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Request Movies & TV
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px' }}>
                Can't find what you want? Simply request any movie or TV show and we'll add it to your library within 24 hours.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}>
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>🌍</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Watch Anywhere
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px' }}>
                Access your content from any device, anywhere in the world. Seamless streaming on phones, tablets, computers, and smart TVs.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}>
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>📱</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Multi-Device Support
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px' }}>
                Native apps for iOS, Android, Apple TV, Roku, and more. Your entertainment follows you everywhere.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}>
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>⚡</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                4K HDR Streaming
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px' }}>
                Crystal clear quality with support for 4K HDR, Dolby Vision, and Atmos audio for the ultimate viewing experience.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}>
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>👥</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Family Sharing
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px' }}>
                Create multiple user profiles with parental controls and personalized recommendations for each family member.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '40px',
            margin: '60px 0',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '30px',
              textAlign: 'center'
            }}>
              <div>
                <h4 style={{ fontSize: '36px', fontWeight: 800, color: '#fbbf24', marginBottom: '10px' }}>
                  50,000+
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                  Movies & Shows
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '36px', fontWeight: 800, color: '#fbbf24', marginBottom: '10px' }}>
                  99.9%
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                  Uptime
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '36px', fontWeight: 800, color: '#fbbf24', marginBottom: '10px' }}>
                  24/7
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                  Support
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: '36px', fontWeight: 800, color: '#fbbf24', marginBottom: '10px' }}>
                  &lt; 24hrs
                </h4>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
                  Request Fulfillment
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{
          textAlign: 'center',
          padding: '80px 0',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderRadius: '30px',
          margin: '60px 0',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '20px' }}>
            Ready to Transform Your Entertainment?
          </h2>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '40px',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Join thousands of users who've already discovered their personal cinema universe. Cancel anytime, no contracts.
          </p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #e879f9 100%)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 15px 40px rgba(168, 85, 247, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.3)';
            }}
          >
            🎯 Get Started Today
          </button>
        </section>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          100% { opacity: 0.8; }
        }
      `}</style>
    </>
  );
}
