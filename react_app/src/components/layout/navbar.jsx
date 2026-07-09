import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import './navbar.css';
import { db } from '../../firebase';
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {

  const [fireUser, setFireUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState('user');
  const [profilePic, setProfilePic] = useState('');

  const navigate = useNavigate();

  const profileRef = useRef(null)

  const auth = getAuth();

  useEffect(() => {
    // stores the current user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFireUser(user);
    });

    return () => unsubscribe();
  }, []);

  // closes dropdown even when user clicks outside of dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // obtains the photoURL and displayName
  useEffect(() => {
    const getProfileDetails = async () => {
      if (!fireUser) return;
      try {
        const docRef = doc(db, "users", fireUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setProfilePic(data.photoURL || "");
          setUserName(data.displayName || "user");
        } 
      } catch (error) {
        console.error("Error fetching profile details:", error);
      } 
    };

    getProfileDetails();
  }, [fireUser]);

  // opens and closes the dropdown
  const toggleProfile = () => {
    setIsProfileOpen(prevValue => !prevValue);
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("loginTime");

      navigate("/login");
      alert("Logged out successfully! See you again!");
    } catch (err) {
      alert("Logout failed: " + err.message + ". Please try again.");
    }
  }
  
  return (
    <div className="navbarContainer">
      {/* Company Logo */}
      <NavLink to="/portal/Dashboard" className="CompanyLogo">
        <h1>Performance Nutrition</h1>
      </NavLink>

      {/* Profile tab */}

      <div className="userProfile" ref = {profileRef}>
        <button className="profileContainer" onClick = {toggleProfile}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" class = "profileImage"/>
          ) : (
            <FaUserCircle className="profileIcon" />
          )}

          {userName}     ▾
        </button>
        
        {isProfileOpen && 
          <div className = "dropdown-container">
            <div className = "dropdown-menu">
              <NavLink to="/portal/Dashboard"> Edit Profile </NavLink>
              <button onClick = {handleLogout}> Logout </button>
            </div>
          </div>
        }

      </div>
    </div>
  );
};

export default Navbar;