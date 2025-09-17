import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const SimpleViralLanding = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(45deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s ease-out'
        }}>
          {/* Logo */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'inline-block',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 'bold'
            }}>
              🧠
            </div>
          </div>
          
          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            fontWeight: '900',
            background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em'
          }}>
            CONTENTFLOW
          </h1>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '2rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            👑 $10 BILLION AI PLATFORM
          </div>
          
          {/* Subtitle */}
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            marginBottom: '2rem',
            fontWeight: '400'
          }}>
            The World's Most Advanced
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              AI CONTENT ORCHESTRATION
            </span>
            <br />
            Platform
          </h2>
          
          {/* Description */}
          <p style={{
            fontSize: '1.125rem',
            color: '#a0a0a0',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.6'
          }}>
            Transform any content into viral masterpieces across 15+ platforms using our neural AI network. 
            Trusted by Fortune 500 companies and used by over 2.3 million content creators worldwide.
          </p>
          
          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '4rem'
          }}>
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #00FF88 0%, #00D4FF 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 25px rgba(0, 255, 136, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 15px 35px rgba(0, 255, 136, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 10px 25px rgba(0, 255, 136, 0.3)'
              }}>
                🚀 START NEURAL TRANSFORMATION
              </button>
            </Link>
            
            <button style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '1rem 2rem',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              e.target.style.transform = 'translateY(0)'
            }}>
              ▶️ WATCH QUANTUM DEMO
            </button>
          </div>
          
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              { value: "$10B+", label: "Platform Valuation", icon: "💰" },
              { value: "2.3M+", label: "Content Pieces Generated", icon: "🧠" },
              { value: "99.9%", label: "Uptime Guarantee", icon: "🛡️" },
              { value: "150+", label: "Enterprise Clients", icon: "👑" }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#a0a0a0'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div style={{
        padding: '6rem 2rem',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}>
          QUANTUM PRICING MATRIX
        </h2>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#a0a0a0',
          marginBottom: '4rem',
          maxWidth: '600px',
          margin: '0 auto 4rem auto'
        }}>
          Choose your neural enhancement level. All plans include our revolutionary AI orchestration technology.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '3rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {[
            {
              name: "NEURAL STARTER",
              price: "$29",
              period: "/month",
              description: "Perfect for content creators and small teams",
              features: [
                "10 AI-powered content pieces/month",
                "5 platform formats",
                "Basic brand voice training",
                "Standard support",
                "API access"
              ],
              popular: false
            },
            {
              name: "QUANTUM PRO",
              price: "$59",
              period: "/month",
              description: "Advanced features for growing businesses",
              features: [
                "30 AI-powered content pieces/month",
                "15+ platform formats",
                "Advanced brand voice AI",
                "Priority support",
                "Team collaboration",
                "Custom integrations",
                "Analytics dashboard"
              ],
              popular: true
            },

          ].map((plan, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '2rem',
              border: plan.popular ? '2px solid #00D4FF' : '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              transition: 'all 0.3s ease',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #00FF88 0%, #00D4FF 100%)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  👑 MOST POPULAR
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem',
                  textTransform: 'uppercase'
                }}>
                  {plan.name}
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '3rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {plan.price}
                  </span>
                  <span style={{ color: '#a0a0a0' }}>
                    {plan.period}
                  </span>
                </div>
                
                <p style={{ color: '#a0a0a0', fontSize: '0.875rem' }}>
                  {plan.description}
                </p>
              </div>
              
              <div style={{ marginBottom: '2rem' }}>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                  }}>
                    <span style={{
                      color: '#00FF88',
                      marginRight: '0.75rem',
                      fontSize: '1rem'
                    }}>
                      ✅
                    </span>
                    <span style={{ fontSize: '0.875rem' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  background: plan.popular 
                    ? 'linear-gradient(135deg, #00FF88 0%, #00D4FF 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: plan.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                }}>
                  {plan.price === 'Custom' ? 'CONTACT SALES' : 'START NEURAL TRIAL'}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div style={{
        padding: '3rem 2rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <span style={{ fontSize: '2rem' }}>🧠</span>
            <span style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textTransform: 'uppercase'
            }}>
              CONTENTFLOW
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              🛡️ SOC 2 CERTIFIED
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #00FF88 0%, #00D4FF 100%)',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              ✅ 99.9% UPTIME
            </span>
            <span style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              👑 ENTERPRISE READY
            </span>
          </div>
        </div>
        
        <div style={{
          marginTop: '2rem',
          color: '#a0a0a0',
          fontSize: '0.875rem'
        }}>
          © 2024 ContentFlow Neural Systems. All rights reserved. Powered by quantum AI technology.
        </div>
      </div>
    </div>
  )
}

export default SimpleViralLanding
