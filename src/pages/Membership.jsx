import React from 'react';

function Membership() {
  const membershipTiers = [
    {
      name: "Basic Membership",
      price: "$49/month",
      features: [
        "Monthly nutrition consultation (30 min)",
        "Personalized meal plan",
        "Email support",
        "Access to member portal",
        "Monthly progress tracking",
        "Recipe library access"
      ],
      recommended: false
    },
    {
      name: "Premium Membership",
      price: "$99/month",
      features: [
        "Bi-weekly nutrition consultations (45 min)",
        "Customized meal and workout plans",
        "Priority email and chat support",
        "Access to member portal and mobile app",
        "Weekly progress tracking and adjustments",
        "Exclusive recipe library and meal prep guides",
        "Supplement recommendations",
        "Group workshop access"
      ],
      recommended: true
    },
    {
      name: "Elite Membership",
      price: "$199/month",
      features: [
        "Weekly 1-on-1 consultations (60 min)",
        "Fully customized nutrition and training plans",
        "24/7 coach support via phone, email, and chat",
        "Premium member portal with advanced analytics",
        "Daily check-ins and real-time adjustments",
        "Complete recipe and meal prep library",
        "Personalized supplement protocol",
        "Unlimited workshop and seminar access",
        "Body composition analysis (monthly)",
        "VIP event invitations"
      ],
      recommended: false
    }
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1>Become a Member</h1>
          <p>
            Join the Performance Nutrition community and gain access to expert guidance, 
            personalized nutrition plans, and ongoing support to help you achieve your 
            health and performance goals. Choose the membership tier that best fits your needs.
          </p>
        </div>

        <div className="services-grid">
          {membershipTiers.map((tier, index) => (
            <div 
              key={index} 
              className="card membership-card"
              style={{
                border: tier.recommended ? '3px solid #3d4d5c' : '1px solid #e0e0e0',
                position: 'relative'
              }}
            >
              {tier.recommended && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '20px',
                  background: '#3d4d5c',
                  color: 'white',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{ color: '#3d4d5c', marginBottom: '1rem' }}>{tier.name}</h3>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#3d4d5c',
                marginBottom: '1.5rem' 
              }}>
                {tier.price}
              </div>
              <h4>What's Included:</h4>
              <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
              <button 
                className="btn" 
                style={{ 
                  width: '100%', 
                  marginTop: '1.5rem',
                  backgroundColor: tier.recommended ? '#3d4d5c' : '#fff',
                  color: tier.recommended ? '#fff' : '#3d4d5c'
                }}
              >
                Choose Plan
              </button>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>Why Become a Member?</h2>
          <div className="services-grid">
            <div>
              <h3>🎯 Personalized Approach</h3>
              <p>
                Every member receives a customized nutrition plan tailored to their 
                unique goals, body type, and lifestyle.
              </p>
            </div>
            <div>
              <h3>👨‍⚕️ Expert Guidance</h3>
              <p>
                Work directly with certified nutritionists and performance specialists 
                who are dedicated to your success.
              </p>
            </div>
            <div>
              <h3>📊 Track Your Progress</h3>
              <p>
                Use our member portal to monitor your progress, adjust your plans, 
                and stay motivated throughout your journey.
              </p>
            </div>
            <div>
              <h3>🤝 Community Support</h3>
              <p>
                Join a community of like-minded individuals who are committed to 
                achieving their health and performance goals.
              </p>
            </div>
            <div>
              <h3>📚 Educational Resources</h3>
              <p>
                Access our extensive library of recipes, meal plans, guides, and 
                educational materials to enhance your knowledge.
              </p>
            </div>
            <div>
              <h3>🔄 Flexible Plans</h3>
              <p>
                Cancel or change your membership at any time. We're confident you'll 
                see the value and stay for the long term.
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h2>Ready to Get Started?</h2>
          <p>
            Have questions about which membership is right for you? We're here to help! 
            Contact us today for a free consultation to discuss your goals and find the 
            perfect membership plan.
          </p>
          <a href="/contact" className="btn" style={{ marginRight: '1rem' }}>
            Contact Us
          </a>
          <a href="/login" className="btn">
            Member Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Membership;