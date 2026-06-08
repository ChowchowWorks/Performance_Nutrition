import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1>Contact Us</h1>
          <p>
            Ready to start your nutrition journey? We'd love to hear from you! 
            Fill out the form below or use our contact information to get in touch.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div className="card">
            <h2>Get In Touch</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="service" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Service of Interest
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Select a service</option>
                  <option value="consultation">Individual Nutrition Consultation</option>
                  <option value="performance">Performance Nutrition for Athletes</option>
                  <option value="weight-management">Weight Management Program</option>
                  <option value="corporate">Corporate Wellness Program</option>
                  <option value="meal-prep">Meal Prep and Planning</option>
                  <option value="workshops">Nutrition Education Workshops</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about your goals, current situation, or any questions you have..."
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button type="submit" className="btn" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>

          <div className="card">
            <h2>Contact Information</h2>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Office Address</h3>
              <p>
                123 Nutrition Street<br />
                Health District<br />
                Wellness City, WC 12345
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Phone & Email</h3>
              <p>
                Phone: (555) 123-4567<br />
                Email: info@performancenutrition.com
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Business Hours</h3>
              <p>
                Monday - Friday: 8:00 AM - 6:00 PM<br />
                Saturday: 9:00 AM - 3:00 PM<br />
                Sunday: Closed
              </p>
            </div>

            <div>
              <h3>Emergency Contact</h3>
              <p>
                For urgent nutrition-related questions:<br />
                Emergency Line: (555) 123-HELP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;