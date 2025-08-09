import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState('monthly');
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

  const getFilteredPlans = () => {
    // Map billing cycle to interval values
    const intervalMap = {
      'monthly': 'month',
      'yearly': 'year'
    };
    
    const targetInterval = intervalMap[billingCycle] || billingCycle;
    return plans.filter(plan => plan.interval === targetInterval);
  };

  const getPlanFeatures = (planName) => {
    const name = planName.toLowerCase();
    
    if (name.includes('basic')) {
      return [
        '50,000+ Movies & TV Shows',
        '1080p HD Streaming',
        '2 Simultaneous Streams',
        '24/7 Content Requests',
        'Mobile & TV Apps',
        'Email Support'
      ];
    } else if (name.includes('premium') || name.includes('pro')) {
      return [
        '50,000+ Movies & TV Shows',
        '4K HDR + Dolby Vision',
        '5 Simultaneous Streams',
        'Priority Content Requests',
        'All Device Support',
        'Family Profiles',
        'Priority Support'
      ];
    } else if (name.includes('ultimate') || name.includes('enterprise')) {
      return [
        '50,000+ Movies & TV Shows',
        '4K HDR + Dolby Atmos',
        'Unlimited Streams',
        'Instant Content Requests',
        'All Device Support',
        'Unlimited Family Profiles',
        'Dedicated Support',
        'Custom Server Options'
      ];
    }
    
    // Default features
    return [
      '50,000+ Movies & TV Shows',
      'HD Streaming',
      'Multiple Device Support',
      'Content Requests',
      'Email Support'
    ];
  };

  const getMostPopular = () => {
    const filteredPlans = getFilteredPlans();
    if (filteredPlans.length === 0) return null;
    
    // Find the middle-priced plan or the one with "premium" in the name
    const premiumPlan = filteredPlans.find(plan => 
      plan.name.toLowerCase().includes('premium') || 
      plan.name.toLowerCase().includes('pro')
    );
    
    if (premiumPlan) return premiumPlan.plan_id;
    
    // If no premium plan, return the middle one
    const sortedPlans = filteredPlans.sort((a, b) => a.price - b.price);
    return sortedPlans[Math.floor(sortedPlans.length / 2)]?.plan_id;
  };

  const handleSelectPlan = (planId) => {
    navigate(`/signup?plan=${planId}`);
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
          padding: '140px 0 60px',
          position: 'relative'
        }}>
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
            Choose Your Plan
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
            Start your personal cinema universe today. All plans include unlimited content requests and 24/7 support.
          </p>

          {/* Billing Toggle */}
          <div style={{
            display: 'inline-flex',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50px',
            padding: '4px',
            marginBottom: '60px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                padding: '12px 24px',
                borderRadius: '50px',
                border: 'none',
                background: billingCycle === 'monthly' ? 'linear-gradient(135deg, #a855f7 0%, #e879f9 100%)' : 'transparent',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                padding: '12px 24px',
                borderRadius: '50px',
                border: 'none',
                background: billingCycle === 'yearly' ? 'linear-gradient(135deg, #a855f7 0%, #e879f9 100%)' : 'transparent',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              Yearly
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#fbbf24',
                color: '#1a0b2e',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                SAVE
              </span>
            </button>
          </div>
        </section>

        {/* Pricing Cards */}
        <section style={{ padding: '0 0 80px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '20px' }}>
                Loading pricing plans...
              </p>
            </div>
          ) : getFilteredPlans().length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px' }}>
                No {billingCycle} plans available at the moment.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {getFilteredPlans()
                .sort((a, b) => a.price - b.price)
                .map((plan) => {
                  const isPopular = plan.plan_id === getMostPopular();
                  const features = getPlanFeatures(plan.name);
                  
                  return (
                    <div
                      key={plan.plan_id}
                      style={{
                        background: isPopular 
                          ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isPopular 
                          ? '2px solid rgba(168, 85, 247, 0.5)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '25px',
                        padding: '40px 30px',
                        textAlign: 'center',
                        position: 'relative',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        transform: isPopular ? 'scale(1.05)' : 'scale(1)'
                      }}
                      onMouseOver={(e) => {
                        if (!isPopular) {
                          e.currentTarget.style.transform = 'translateY(-10px)';
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(168, 85, 247, 0.2)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isPopular) {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {isPopular && (
                        <div style={{
                          position: 'absolute',
                          top: '-15px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          color: '#1a0b2e',
                          padding: '8px 20px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: 700
                        }}>
                          MOST POPULAR
                        </div>
                      )}

                      <h3 style={{
                        fontSize: '28px',
                        fontWeight: 800,
                        marginBottom: '10px',
                        color: isPopular ? '#fbbf24' : '#e879f9'
                      }}>
                        {plan.name}
                      </h3>

                      <div style={{ marginBottom: '30px' }}>
                        <span style={{
                          fontSize: '48px',
                          fontWeight: 900,
                          color: 'white'
                        }}>
                          {formatPrice(plan.price, plan.currency)}
                        </span>
                        <span style={{
                          fontSize: '18px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginLeft: '5px'
                        }}>
                          /{plan.interval}
                        </span>
                      </div>

                      <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 40px 0',
                        textAlign: 'left'
                      }}>
                        {features.map((feature, index) => (
                          <li key={index} style={{
                            padding: '10px 0',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleSelectPlan(plan.plan_id)}
                        style={{
                          width: '100%',
                          background: isPopular 
                            ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                            : 'linear-gradient(135deg, #a855f7 0%, #e879f9 100%)',
                          color: isPopular ? '#1a0b2e' : 'white',
                          border: 'none',
                          padding: '16px 32px',
                          borderRadius: '50px',
                          fontSize: '18px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: isPopular 
                            ? '0 10px 30px rgba(251, 191, 36, 0.3)'
                            : '0 10px 30px rgba(168, 85, 247, 0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'translateY(-3px)';
                          e.target.style.boxShadow = isPopular 
                            ? '0 15px 40px rgba(251, 191, 36, 0.4)'
                            : '0 15px 40px rgba(168, 85, 247, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = isPopular 
                            ? '0 10px 30px rgba(251, 191, 36, 0.3)'
                            : '0 10px 30px rgba(168, 85, 247, 0.3)';
                        }}
                      >
                        Get Started
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        {/* Features Comparison */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '30px',
          padding: '60px 40px',
          margin: '60px 0',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: 800,
            marginBottom: '40px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            All Plans Include
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>🎬</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#e879f9' }}>
                Unlimited Requests
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Request any movie or TV show and we'll add it within 24 hours
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>🔒</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#e879f9' }}>
                Private & Secure
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Your personal server with military-grade encryption
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>📱</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#e879f9' }}>
                All Devices
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Stream on phones, tablets, computers, and smart TVs
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>🌍</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#e879f9' }}>
                Global Access
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Access your content from anywhere in the world
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>⚡</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#e879f9' }}>
                99.9% Uptime
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                Reliable streaming with enterprise-grade infrastructure
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '15px' }}>🎯</span>
              <h4 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#e879f9' }}>
                Cancel Anytime
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
                No contracts or cancellation fees. Cancel with one click
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ padding: '60px 0' }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: 800,
            marginBottom: '40px',
            background: 'linear-gradient(135deg, #ffffff 0%, #e879f9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Pricing FAQ
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Can I change plans later?
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', lineHeight: 1.6 }}>
                Yes! You can upgrade or downgrade your plan anytime through your account dashboard. Changes take effect immediately.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Is there a free trial?
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', lineHeight: 1.6 }}>
                We offer a 7-day money-back guarantee. If you're not satisfied, we'll refund your first payment in full.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                What payment methods do you accept?
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', lineHeight: 1.6 }}>
                We accept all major credit cards, PayPal, and various local payment methods through our secure Stripe integration.
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '30px'
            }}>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                How does billing work?
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', lineHeight: 1.6 }}>
                You're billed automatically based on your chosen plan. Monthly plans renew every month, yearly plans save you money with annual billing.
              </p>
            </div>
          </div>
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
