import React from 'react';

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Professional Athlete",
      text: "Performance Nutrition completely transformed my training and competition results. The personalized meal plans helped me reach peak performance levels I never thought possible.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Fitness Enthusiast",
      text: "After struggling with my weight for years, the team at Performance Nutrition created a sustainable plan that actually works. I've lost 30 pounds and feel amazing!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Marathon Runner",
      text: "The nutrition strategies I learned here helped me shave 15 minutes off my marathon time. The support and expertise are unmatched.",
      rating: 5
    },
    {
      name: "David Thompson",
      role: "Corporate Executive",
      text: "As a busy executive, I needed a nutrition plan that fit my lifestyle. Performance Nutrition delivered exactly that, plus my energy levels have never been better.",
      rating: 5
    },
    {
      name: "Lisa Martinez",
      role: "Yoga Instructor",
      text: "The holistic approach to nutrition here aligns perfectly with my wellness philosophy. I recommend Performance Nutrition to all my students.",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "CrossFit Competitor",
      text: "The sports nutrition guidance and supplement recommendations have been game-changers for my performance. Highly professional and knowledgeable team!",
      rating: 5
    }
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1>Client Testimonials</h1>
          <p>
            Don't just take our word for it - hear what our clients have to say about 
            their experiences with Performance Nutrition. These success stories represent 
            the dedication of our clients and the effectiveness of our personalized approach.
          </p>
        </div>

        <div className="services-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card testimonial-card">
              <div className="testimonial-rating">
                {"★".repeat(testimonial.rating)}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <br />
                <span className="testimonial-role">{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>Join Our Success Stories</h2>
          <p>
            Ready to write your own success story? Our team is here to help you achieve 
            your nutrition and performance goals with personalized guidance and support.
          </p>
          <a href="/contact" className="btn">
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;