import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ProfessionalLanding = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      color: '#ffffff',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
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
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '3rem',
            marginBottom: '3rem',
            display: 'inline-block',
            border: '1px solid rgba(0, 212, 255, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 212, 255, 0.1)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              CF
            </div>
          </div>
          
          {/* Main Title */}
          <h1 style={{
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            lineHeight: '1.1'
          }}>
            CONTENTFLOW
          </h1>
          
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.75rem 2rem',
            background: 'rgba(0, 212, 255, 0.1)',
            border: '1px solid rgba(0, 212, 255, 0.3)',
            borderRadius: '50px',
            fontSize: '0.875rem',
            fontWeight: '600',
            marginBottom: '3rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#00D4FF'
          }}>
            Enterprise AI Platform
          </div>
          
          {/* Subtitle */}
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            marginBottom: '2rem',
            fontWeight: '300',
            lineHeight: '1.3',
            color: '#e0e0e0'
          }}>
            The World's Most Advanced
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: '600'
            }}>
              AI Content Orchestration Platform
            </span>
          </h2>
          
          {/* Description */}
          <p style={{
            fontSize: '1.25rem',
            color: '#a0a0a0',
            marginBottom: '4rem',
            maxWidth: '800px',
            margin: '0 auto 4rem auto',
            lineHeight: '1.6',
            fontWeight: '400'
          }}>
            Transform any content into optimized formats across 15+ platforms using our neural AI network. 
            Trusted by Fortune 500 companies and content creators worldwide.
          </p>
          
          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < 640 ? 'column' : 'row',
            gap: '1.5rem',
            justifyContent: 'center',
            marginBottom: '5rem'
          }}>
            <Link to="/auth" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '1.25rem 3rem',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(0, 212, 255, 0.3)',
                minWidth: '250px'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-3px)'
                e.target.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.4)'
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 10px 30px rgba(0, 212, 255, 0.3)'
              }}>
                Start Free Trial
              </button>
            </Link>
            
            <button style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '1.25rem 3rem',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
              minWidth: '250px'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)'
              e.target.style.transform = 'translateY(-3px)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)'
              e.target.style.transform = 'translateY(0)'
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
            }}>
              Watch Demo
            </button>
          </div>
          
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {[
              { value: "$10B+", label: "Platform Valuation" },
              { value: "2.3M+", label: "Content Pieces Generated" },
              { value: "99.9%", label: "Uptime Guarantee" },
              { value: "150+", label: "Enterprise Clients" }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  fontSize: '2.5rem',
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
                  color: '#a0a0a0',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
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
        padding: '8rem 2rem',
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '1.5rem',
          letterSpacing: '-0.02em'
        }}>
          Pricing Plans
        </h2>
        
        <p style={{
          fontSize: '1.25rem',
          color: '#a0a0a0',
          marginBottom: '5rem',
          maxWidth: '600px',
          margin: '0 auto 5rem auto',
          lineHeight: '1.6'
        }}>
          Choose your plan. All plans include our revolutionary AI orchestration technology 
          with enterprise-grade security and support.
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '3rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {[
            {
              name: "Starter",
              price: "$29",
              period: "/month",
              description: "Perfect for content creators and small teams",
              features: [
                "10 AI-powered content pieces per month",
                "5 platform formats",
                "Basic brand voice training",
                "Standard support",
                "API access"
              ],
              popular: false
            },
            {
              name: "Pro",
              price: "$59",
              period: "/month",
              description: "Advanced features for growing businesses",
              features: [
                "30 AI-powered content pieces per month",
                "15+ platform formats",
                "Advanced brand voice AI",
                "Priority support",
                "Team collaboration",
                "Custom integrations",
                "Analytics dashboard"
              ],
              popular: true
            }
          ].map((plan, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '3rem 2.5rem',
              border: plan.popular ? '2px solid #00D4FF' : '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              transition: 'all 0.3s ease',
              transform: plan.popular ? 'scale(1.05)' : 'scale(1)'
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
                  padding: '0.5rem 2rem',
                  borderRadius: '25px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: '600',
                  color: '#ffffff',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {plan.name}
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{
                    fontSize: '4rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {plan.price}
                  </span>
                  <span style={{ 
                    color: '#a0a0a0',
                    fontSize: '1.25rem',
                    fontWeight: '400'
                  }}>
                    {plan.period}
                  </span>
                </div>
                
                <p style={{ 
                  color: '#a0a0a0', 
                  fontSize: '1rem',
                  lineHeight: '1.5'
                }}>
                  {plan.description}
                </p>
              </div>
              
              <div style={{ marginBottom: '3rem' }}>
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '1rem',
                    padding: '0.5rem 0'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
                      marginRight: '1rem',
                      marginTop: '2px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: '#ffffff',
                        borderRadius: '50%'
                      }} />
                    </div>
                    <span style={{ 
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#e0e0e0'
                    }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
              
              <Link to="/auth" style={{ textDecoration: 'none' }}>
                <button style={{
                  width: '100%',
                  background: plan.popular 
                    ? 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: plan.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  color: 'white',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  if (!plan.popular) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  if (!plan.popular) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                  }
                }}>
                  Start Free Trial
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer */}
      <div style={{
        padding: '4rem 2rem',
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
          gap: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: '#ffffff'
            }}>
              CF
            </div>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              ContentFlow
            </span>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#00D4FF',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              SOC 2 Certified
            </span>
            <span style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#8B5CF6',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              99.9% Uptime
            </span>
            <span style={{
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#00D4FF',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Enterprise Ready
            </span>
          </div>
        </div>
        
        <div style={{
          marginTop: '3rem',
          color: '#666666',
          fontSize: '0.875rem',
          fontWeight: '400'
        }}>
          © 2024 ContentFlow. All rights reserved. Enterprise AI Content Platform.
        </div>
      </div>
    </div>
  )
}

export default ProfessionalLanding
