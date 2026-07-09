import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';

function MemberLogin() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredGoogle, setRegisteredGoogle] = useState(false);
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
      const userCredentials = await signInWithEmailAndPassword(
        auth, 
        formData.email,
        formData.password
      )

      const user = userCredentials.user;

      if (!user.emailVerified) {
        alert("Please verify your email before logging in.");
        navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);
        return;
      }

      await setDoc(
        doc(db, "users", user.uid),
        {
          emailVerified: true,
          lastLoginAt: serverTimestamp()
        },
        { merge: true }
      );

      const token = await user.getIdToken();

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("loginTime", Date.now().toString());

      alert("Login successful!");
      navigate("/portal/AIcoach");
    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        alert("Invalid email or password");
      } else if (err.code === "auth/invalid-email") {
        alert("Invalid email format");
      } else {
        alert("Login failed: " + err.message);
      }
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerData.email,
        registerData.password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: registerData.name
      });

      await setDoc(
        doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          username: registerData.name,
          displayName: registerData.name,
          createdAt: serverTimestamp()
        }, { merge: true }
      )

      await sendEmailVerification(user);

      alert("Signup successful! Please verify your email.");
      navigate(`/verify-email?email=${encodeURIComponent(user.email)}`);

      setIsRegistering(false);

      setRegisterData({
        name: "",
        email: "", 
        password: "",
        confirmPassword: ""
      });

    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        alert("This email is already registered.");
      } else if (err.code === "auth/invalid-email") {
        alert("invalid email format.");
      } else if (err.code === "auth/weak-password") {
        alert("Password should be at least 6 characters.");
      } else {
        alert("Signup failed: " + err.message);
      }
    }
  };

  // TODO: Case where account already created same for handleRegisterSubmit
  const handleGoogleRegister = async() => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const token = await user.getIdToken();

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          username: user.displayName,
          photoURL: user.photoURL,
          updatedAt: serverTimestamp()
        }, { merge: true }
      )

      setRegisteredGoogle(true);

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("loginTime", Date.now().toString());

      setTimeout(() => {
        navigate("/portal/AIcoach");
      }, 2000);

    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  const handleGoogleLogin = async() => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      const token = await user.getIdToken();

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          username: user.displayName,
          photoURL: user.photoURL,
          updatedAt: serverTimestamp()
        }, { merge: true }
      )

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("loginTime", Date.now().toString());

      navigate("/portal/AIcoach");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <h1>Member Portal</h1>
          <p>
            Access your personalised nutrition plans, track your progress, and connect 
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

                <button 
                  type = "button"
                  onClick = {handleGoogleLogin}
                  style = {{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    style={{ width: '20px', height: '20px' }}
                  />
                  Sign in with Google
                </button>
                
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
                  <span
                    style={{
                      padding: '0 1rem',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}
                  >
                    OR
                  </span>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
                </div>

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
                  <Link 
                    to="/password-reset" 
                    className={location.pathname === '/password-reset' ? 'active' : ''}
                    style={{ color: '#3d4d5c', textDecoration: 'none' }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <h2>Create Account</h2>

                {registeredGoogle && 
                  <div style={{ marginBottom: '1.5rem' , width: '100%', color: 'white',
                    padding: '0.75rem', backgroundColor: '#047857', fontWeight: 'bold',
                    borderRadius: '4px', alignItems: 'center', justifyContent: 'center',
                    display: 'flex'
                  }}>
                    Account created successfully! Logging in... 
                  </div>
                }

                <button 
                  type = "button"
                  onClick = {handleGoogleRegister}
                  style = {{
                    width: '100%',
                    padding: '0.75rem',
                    marginBottom: '1.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    style={{ width: '20px', height: '20px' }}
                  />
                  Sign up with Google
                </button>
                
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '1.5rem'
                  }}
                >
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
                  <span
                    style={{
                      padding: '0 1rem',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}
                  >
                    OR
                  </span>
                  <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ddd' }} />
                </div>
                
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