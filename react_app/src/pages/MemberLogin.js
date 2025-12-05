import React, { useState } from 'react';

function MemberLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://client-auth-api.clarencechow.workers.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });

      const text = await response.text(); 

      if (!response.ok) {
        alert(text); // shows "Invalid username or password"
      } else {
        alert("Login success: " + text); // shows "Welcome username!"
        // TODO: redirect to dashboard page here
        // e.g., window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to API");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // check password match
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(
        "https://client-auth-api.clarencechow.workers.dev/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: registerData.name,
            email: registerData.email,
            password: registerData.password
          })
        }
      );

      const text = await response.text(); // read response once

      if (!response.ok) {
        alert("Signup failed: " + text);
      } else {
        alert("Signup successful: " + text);
        // Optional: switch to login form after successful signup
        setIsRegistering(false);
        // Optionally clear form
        setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to API");
    }
  };


  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1>Member Portal</h1>
          <p>
            Access your personalized nutrition plans, track your progress, and connect 
            with your nutrition coach through our secure member portal.
          </p>
        </div>

        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="card">
            <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '2px solid #e0e0e0' }}>
              <button
                onClick={() => setIsRegistering(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '1.1rem',
                  fontWeight: isRegistering ? 'normal' : 'bold',
                  color: isRegistering ? '#666' : '#3d4d5c',
                  borderBottom: isRegistering ? 'none' : '3px solid #3d4d5c',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  background: 'none',
                  fontSize: '1.1rem',
                  fontWeight: isRegistering ? 'bold' : 'normal',
                  color: isRegistering ? '#3d4d5c' : '#666',
                  borderBottom: isRegistering ? '3px solid #3d4d5c' : 'none',
                  cursor: 'pointer'
                }}
              >
                Register
              </button>
            </div>

            {!isRegistering ? (
              <form onSubmit={handleLoginSubmit}>
                <h2>Member Login</h2>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleLoginChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleLoginChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <button type="submit" className="btn" style={{ width: '100%', margin: 0 }}>
                  Login
                </button>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <a href="#" style={{ color: '#3d4d5c', textDecoration: 'none' }}>
                    Forgot Password?
                  </a>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <h2>Create Account</h2>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="reg-name" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="reg-name"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="reg-email" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="reg-email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="reg-password" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="reg-password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="reg-confirm" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="reg-confirm"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <button type="submit" className="btn" style={{ width: '100%', margin: 0 }}>
                  Create Account
                </button>
              </form>
            )}
          </div>

          <div className="card">
            <h3>Member Benefits</h3>
            <ul>
              <li>Access to personalized nutrition plans</li>
              <li>Track your progress and goals</li>
              <li>Direct messaging with your nutrition coach</li>
              <li>Exclusive recipes and meal plans</li>
              <li>Priority booking for consultations</li>
              <li>Member-only workshops and webinars</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberLogin;