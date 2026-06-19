import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  sendEmailVerification,
  signOut
} from "firebase/auth";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [verifyButtonHover, setVerifyButtonHover] = useState(false);
  const [backButtonHover, setBackButtonHover] = useState(false);
  const [cooldown, setCooldown] = useState(20);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const email = currentUser?.email || searchParams.get("email") || "";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setInitializing(false);

      if (!user) {
        setErrorMessage("Your session expired. Please sign in again.");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const resendVerificationEmail = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentUser) {
      setErrorMessage("No signed-in user found. Please log in again.");
      return;
    }

    if (cooldown > 0) {
      setErrorMessage(`Please wait ${cooldown}s before requesting another email.`);
      return;
    }

    try {
      setLoading(true);

      await sendEmailVerification(currentUser);

      setSuccessMessage(
        `Verification email sent to ${currentUser.email}. Check spam/promotions too.`
      );

      setCooldown(20);
    } catch (err) {
      console.error(err);

      if (err.code === "auth/too-many-requests") {
        setErrorMessage("Too many requests. Please wait before trying again.");
        setCooldown(30);
      } else {
        setErrorMessage(err.message || "Failed to resend verification email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="page">
      <div className="container">
        <div className="card" style={{ maxWidth: "500px", margin: "60px auto", textAlign: "center" }}>
          <h1>Verify your email</h1>

          {email && (
            <p>
              We sent a verification link to <strong>{email}</strong>.
            </p>
          )}

          <p>Please click the link in your inbox. </p>
          <p>Once verified, you can continue into the app.</p>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

          <button
            type="button"
            onClick={resendVerificationEmail}
            onMouseEnter = {() => setVerifyButtonHover(true)}
            onMouseLeave = {() => setVerifyButtonHover(false)}
            disabled = {loading || initializing || !currentUser || cooldown > 0}
            style = {{ 
              width: "100%", 
              height: '40px',
              marginTop: "1rem", 
              borderRadius: '10px',  
              fontSize: '1rem', 
              fontWeight: 'bold', 
              color: 'white',
              backgroundColor: verifyButtonHover ? '#3f4b5e' : '#2c3544',
              cursor: 'pointer', 
              border: 'none', 
              transition: 'background-color 0.2s ease'
            }}
          >
            {initializing
              ? "Checking session..."
              : loading
                ? "Sending..."
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend verification email"}
          </button>

          <button
            type="button"
            onClick={goToLogin}
            onMouseEnter = {() => setBackButtonHover(true)}
            onMouseLeave = {() => setBackButtonHover(false)}
            style = {{ 
              width: "100%", 
              height: '40px',
              marginTop: "1rem", 
              borderRadius: '10px',  
              fontSize: '1rem', 
              fontWeight: 'bold', 
              color: 'white',
              backgroundColor: backButtonHover ? 'gray' : 'rgba(0, 0, 0, 0.8)',
              cursor: 'pointer', 
              border: 'none', 
              transition: 'background-color 0.2s ease'
            }}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;