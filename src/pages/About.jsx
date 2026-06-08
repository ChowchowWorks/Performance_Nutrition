import React from 'react';

function About() {
  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1>About Performance Nutrition</h1>
          <p>
            At Performance Nutrition, we are passionate about helping individuals 
            achieve their health and performance goals through the power of proper 
            nutrition. Our team of certified nutritionists and performance specialists 
            brings years of experience in working with athletes, fitness enthusiasts, 
            and health-conscious individuals.
          </p>
        </div>

        <div className="card">
          <h2>Our Mission</h2>
          <p>
            To empower individuals with the knowledge, tools, and personalized 
            guidance they need to optimize their nutrition for peak performance 
            and optimal health. We believe that everyone deserves access to 
            science-based nutrition advice that fits their unique lifestyle and goals.
          </p>
        </div>

        <div className="card">
          <h2>Our Approach</h2>
          <p>
            We take a holistic, evidence-based approach to nutrition that considers 
            your individual needs, preferences, and circumstances. Our methodology 
            combines the latest nutritional science with practical, sustainable 
            strategies that you can implement in your daily life.
          </p>
          
          <h3>Key Principles:</h3>
          <ul>
            <li>Personalized nutrition plans based on individual assessment</li>
            <li>Evidence-based recommendations backed by scientific research</li>
            <li>Sustainable lifestyle changes rather than quick fixes</li>
            <li>Continuous support and monitoring for long-term success</li>
            <li>Education and empowerment for informed decision-making</li>
          </ul>
        </div>

        <div className="card">
          <h2>Our Team</h2>
          <p>
            Our team consists of registered dietitians, sports nutritionists, 
            and wellness coaches who are dedicated to helping you succeed. 
            We stay current with the latest research and continuously update 
            our knowledge to provide you with the most effective nutrition strategies.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;