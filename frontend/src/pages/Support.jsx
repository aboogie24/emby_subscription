import { useState } from "react";

export default function Support() {
  const [selectedFaq, setSelectedFaq] = useState(null);

  const faqs = [
    {
      question: "How do I request movies or TV shows?",
      answer: "Once you have an active subscription, you can request content through your Emby server interface. Simply search for the title you want, and if it's not available, click the request button. Most requests are fulfilled within 24 hours."
    },
    {
      question: "What devices are supported?",
      answer: "Emby Galaxy works on virtually any device including iOS, Android, Apple TV, Roku, Fire TV, Smart TVs, web browsers, and more. You can stream on up to 5 devices simultaneously depending on your plan."
    },
    {
      question: "How do I access my Emby server?",
      answer: "After your subscription is activated, you'll receive your server details and login credentials via email. You can then download the Emby app on your preferred device and connect using the provided server address."
    },
    {
      question: "Can I share my account with family?",
      answer: "Yes! You can create multiple user profiles for family members with individual watch histories and parental controls. The number of simultaneous streams depends on your subscription plan."
    },
    {
      question: "What video quality is available?",
      answer: "We support up to 4K HDR streaming with Dolby Vision and Atmos audio. The actual quality depends on your internet connection and the source material available."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime through your account dashboard by clicking 'Manage Billing'. Your access will continue until the end of your current billing period."
    },
    {
      question: "Is my data secure and private?",
      answer: "Absolutely. Your personal media server is completely private with military-grade encryption. We don't track your viewing habits or share any data with third parties."
    },
    {
      question: "What if I'm having technical issues?",
      answer: "Our support team is available 24/7. You can reach us through the contact form below, email us directly, or join our Discord community for real-time help."
    }
  ];

  const toggleFaq = (index) => {
    setSelectedFaq(selectedFaq === index ? null : index);
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
            Support Center
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
            Get help with your Emby Galaxy subscription. Our support team is here 24/7 to ensure you have the best streaming experience.
          </p>
        </section>

        {/* Quick Help Cards */}
        <section style={{ padding: '0 0 60px' }}>
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
              cursor: 'pointer'
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
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>📧</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Email Support
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px', marginBottom: '20px' }}>
                Get personalized help from our support team. We typically respond within 2 hours.
              </p>
              <a href="mailto:support@embygalaxy.com" style={{
                color: '#a855f7',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '16px'
              }}>
                support@embygalaxy.com
              </a>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer'
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
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>💬</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Live Chat
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px', marginBottom: '20px' }}>
                Join our Discord community for real-time support and chat with other users.
              </p>
              <a href="https://discord.gg/embygalaxy" target="_blank" rel="noopener noreferrer" style={{
                color: '#a855f7',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '16px'
              }}>
                Join Discord
              </a>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '40px 30px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer'
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
              <span style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}>📚</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '15px', color: '#e879f9' }}>
                Knowledge Base
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6, fontSize: '16px', marginBottom: '20px' }}>
                Browse our comprehensive guides and tutorials for common questions.
              </p>
              <a href="#faq" style={{
                color: '#a855f7',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '16px'
              }}>
                View FAQ Below
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" style={{ padding: '60px 0' }}>
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
            Frequently Asked Questions
          </h2>

          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                marginBottom: '15px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}>
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '25px 30px',
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 600,
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span>{faq.question}</span>
                  <span style={{
                    fontSize: '24px',
                    transform: selectedFaq === index ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}>
                    +
                  </span>
                </button>
                
                {selectedFaq === index && (
                  <div style={{
                    padding: '0 30px 25px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '25px'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section style={{
          padding: '80px 0',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
          borderRadius: '30px',
          margin: '60px 0',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 30px' }}>
            <h2 style={{
              textAlign: 'center',
              fontSize: '36px',
              fontWeight: 800,
              marginBottom: '20px'
            }}>
              Still Need Help?
            </h2>
            <p style={{
              textAlign: 'center',
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '40px'
            }}>
              Send us a message and we'll get back to you within 2 hours.
            </p>

            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  style={{
                    padding: '15px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  style={{
                    padding: '15px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '16px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </div>
              
              <input
                type="text"
                placeholder="Subject"
                style={{
                  padding: '15px 20px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '16px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              
              <textarea
                placeholder="Describe your issue or question..."
                rows="6"
                style={{
                  padding: '15px 20px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '16px',
                  backdropFilter: 'blur(10px)',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              
              <button
                type="submit"
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
                Send Message
              </button>
            </form>
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
