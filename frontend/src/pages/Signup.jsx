import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
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

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    } else if (email.trim().length > 254) {
      newErrors.email = "Email address is too long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Map the plan selection to the backend format
      const planMapping = {
        'quarterly': 'quarterly_plan',
        'monthly': 'monthly_plan'
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/signup`, {
        username: username.trim(), 
        email: email.trim(),
        plan_id: planMapping[selectedPlan] || 'monthly_plan'
      });
      
      if (res.data.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else if (res.status === 200) {
        navigate("/account");
      } else {
        const errorMessage = res.data.error || "Signup failed. Please try again.";
        setErrors({ general: errorMessage });
      }
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || "Signup failed. Please try again.";
      setErrors({ general: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'username') {
      setUsername(value);
    } else if (field === 'email') {
      setEmail(value);
    } else if (field === 'plan') {
      setSelectedPlan(value);
    }
    
    // Clear field-specific error when user makes changes
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear general error when user makes changes
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  // Plan selection visual feedback
  const handlePlanChange = (planValue) => {
    setSelectedPlan(planValue);
    handleInputChange('plan', planValue);
  };

  return (
    <>
      <style jsx>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .signup-body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1a0b2e 0%, #2d1b3d 50%, #4a2c5a 100%);
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
            overflow-y: auto;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        /* Background elements */
        .bg-stars {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(2px 2px at 20px 30px, #fff, transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                radial-gradient(2px 2px at 160px 30px, #fff, transparent);
            background-repeat: repeat;
            background-size: 200px 100px;
            animation: twinkle 6s ease-in-out infinite alternate;
            z-index: 0;
        }

        @keyframes twinkle {
            0% { opacity: 0.3; }
            100% { opacity: 0.8; }
        }

        /* Main Content */
        .signup-container {
            position: relative;
            z-index: 1;
            width: 100%;
            max-width: 450px;
            margin: 0 auto;
        }

        .signup-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 40px 30px;
            width: 100%;
            backdrop-filter: blur(20px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            position: relative;
            overflow: hidden;
            text-align: center;
        }

        .signup-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #a855f7, #e879f9, #3b82f6, #a855f7);
            background-size: 200% 100%;
            animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
            0%, 100% { background-position: 200% 0; }
            50% { background-position: -200% 0; }
        }

        .signup-header {
            text-align: center;
            margin-bottom: 30px;
        }

        .signup-header h1 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 8px;
            background: linear-gradient(135deg, #ffffff 0%, #e879f9 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .signup-header p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 15px;
            line-height: 1.4;
        }

        /* Form Styles */
        .form-group {
            margin-bottom: 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: center;
        }

        .form-input {
            width: 100%;
            max-width: 350px;
            margin: 0 auto;
            padding: 16px 18px;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: white;
            font-size: 16px;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            display: block;
            text-align: center;
        }

        .form-input:focus {
            outline: none;
            border-color: #a855f7;
            background: rgba(255, 255, 255, 0.08);
            box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
        }

        .form-input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .form-input.error {
            border-color: #ff6b6b;
        }

        .error-message {
            color: #ff6b6b;
            font-size: 12px;
            margin-top: 5px;
            text-align: center;
        }

        .general-error {
            color: #ff6b6b;
            background: rgba(255, 107, 107, 0.1);
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            text-align: center;
        }

        /* Plan Selection */
        .plans-container {
            margin-bottom: 25px;
            text-align: center;
        }

        .plans-grid {
            display: grid;
            gap: 12px;
        }

        .plan-option {
            position: relative;
            cursor: pointer;
        }

        .plan-option input[type="radio"] {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }

        .plan-card {
            background: rgba(255, 255, 255, 0.03);
            border: 2px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .plan-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
            transition: left 0.5s ease;
        }

        .plan-option:hover .plan-card::before {
            left: 100%;
        }

        .plan-option input[type="radio"]:checked + .plan-card {
            border-color: #a855f7;
            background: rgba(168, 85, 247, 0.1);
            box-shadow: 0 8px 25px rgba(168, 85, 247, 0.2);
            transform: scale(1.02);
        }

        .plan-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            text-align: center;
        }

        .plan-name {
            font-size: 16px;
            font-weight: 700;
            color: #e879f9;
        }

        .plan-badge {
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            color: #1a0b2e;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .plan-price {
            font-size: 24px;
            font-weight: 800;
            color: #fbbf24;
            margin-bottom: 6px;
            text-align: center;
        }

        .plan-price .period {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
        }

        .plan-description {
            color: rgba(255, 255, 255, 0.7);
            font-size: 13px;
            line-height: 1.4;
            margin-bottom: 12px;
            text-align: center;
        }

        .plan-features {
            padding-top: 12px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
        }

        .plan-features ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: inline-block;
            text-align: left;
        }

        .plan-features li {
            color: rgba(255, 255, 255, 0.8);
            font-size: 12px;
            margin-bottom: 5px;
            padding-left: 18px;
            position: relative;
        }

        .plan-features li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }

        /* Submit Button */
        .submit-btn {
            width: 100%;
            background: linear-gradient(135deg, #a855f7 0%, #e879f9 100%);
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
            margin-bottom: 20px;
        }

        .submit-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(168, 85, 247, 0.4);
        }

        .submit-btn:active:not(:disabled) {
            transform: translateY(-1px);
        }

        .submit-btn:disabled {
            background: rgba(168, 85, 247, 0.5);
            cursor: not-allowed;
            transform: none;
        }

        .submit-btn.loading::after {
            content: '';
            width: 18px;
            height: 18px;
            border: 2px solid transparent;
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-left: 10px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* Footer Links */
        .signup-footer {
            text-align: center;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .signup-footer p {
            color: rgba(255, 255, 255, 0.6);
            font-size: 13px;
            margin-bottom: 12px;
        }

        .signin-link {
            color: #e879f9;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        .signin-link:hover {
            color: #a855f7;
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.5);
        }

        .security-badges {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 16px;
            flex-wrap: wrap;
        }

        .security-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 11px;
        }

        /* Responsive */
        @media (max-width: 480px) {
            .signup-body {
                padding: 15px;
            }

            .signup-card {
                padding: 30px 25px;
                border-radius: 20px;
            }

            .signup-header h1 {
                font-size: 28px;
            }

            .plan-card {
                padding: 16px;
            }

            .security-badges {
                flex-direction: column;
                align-items: center;
                gap: 8px;
            }
        }

        @media (max-width: 360px) {
            .signup-card {
                padding: 25px 20px;
            }

            .signup-header h1 {
                font-size: 26px;
            }
        }
      `}</style>

      <div className="signup-body">
        <div className="bg-stars"></div>
        
        <div className="signup-container">
          <div className="signup-card">
            <div className="signup-header">
              <h1>Join the Galaxy</h1>
              <p>Create your account and start your entertainment journey</p>
            </div>

            <form onSubmit={handleSignup}>
              {errors.general && (
                <div className="general-error">
                  {errors.general}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  type="text" 
                  id="username" 
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Choose your unique username"
                  value={username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
                {errors.username && (
                  <div className="error-message">{errors.username}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
                {errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>

              <div className="form-group">
                <label>Choose Your Plan</label>
                <div className="plans-container">
                  <div className="plans-grid">
                    <div className="plan-option">
                      <input 
                        type="radio" 
                        id="quarterly" 
                        name="plan" 
                        value="quarterly"
                        checked={selectedPlan === "quarterly"}
                        onChange={(e) => handlePlanChange(e.target.value)}
                      />
                      <label htmlFor="quarterly" className="plan-card">
                        <div className="plan-header">
                          <span className="plan-name">3 Month Plan</span>
                          <span className="plan-badge">Save 20%</span>
                        </div>
                        <div className="plan-price">
                          $26.00 <span className="period">/ month</span>
                        </div>
                        <div className="plan-description">
                          Billed quarterly at $78.00. Best value for committed users.
                        </div>
                        <div className="plan-features">
                          <ul>
                            <li>Unlimited streaming on all devices</li>
                            <li>4K HDR content with Dolby Atmos</li>
                            <li>Priority content requests (&lt; 12 hours)</li>
                            <li>Premium support</li>
                          </ul>
                        </div>
                      </label>
                    </div>

                    <div className="plan-option">
                      <input 
                        type="radio" 
                        id="monthly" 
                        name="plan" 
                        value="monthly" 
                        checked={selectedPlan === "monthly"}
                        onChange={(e) => handlePlanChange(e.target.value)}
                      />
                      <label htmlFor="monthly" className="plan-card">
                        <div className="plan-header">
                          <span className="plan-name">Monthly Plan</span>
                        </div>
                        <div className="plan-price">
                          $10.00 <span className="period">/ month</span>
                        </div>
                        <div className="plan-description">
                          Flexible monthly billing. Cancel anytime with no commitment.
                        </div>
                        <div className="plan-features">
                          <ul>
                            <li>Unlimited streaming on all devices</li>
                            <li>HD &amp; 4K content library</li>
                            <li>Content requests (&lt; 24 hours)</li>
                            <li>Standard support</li>
                          </ul>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Your Account' : '⚡ START MY JOURNEY'}
              </button>
            </form>

            <div className="signup-footer">
              <p>Already have an account? <span className="signin-link" onClick={() => navigate('/login')}>Sign in here</span></p>
              
              <div className="security-badges">
                <div className="security-badge">
                  <span>🔒</span>
                  <span>SSL Encrypted</span>
                </div>
                <div className="security-badge">
                  <span>💳</span>
                  <span>Secure Payments</span>
                </div>
                <div className="security-badge">
                  <span>🛡️</span>
                  <span>Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
