import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { db } from '../../firebase';
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import './navbar.css';

const AdminNavbar = () => {
  const [fireUser, setFireUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState('admin');
  const [profilePic, setProfilePic] = useState('');
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFireUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const getProfileDetails = async () => {
      if (!fireUser) return;

      try {
        const docRef = doc(db, "users", fireUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfilePic(data.photoURL || "");
          setUserName(data.displayName || "admin");
        }
      } catch (error) {
        console.error("Error fetching admin profile details:", error);
      }
    };

    getProfileDetails();
  }, [fireUser]);

  const toggleProfile = () => {
    setIsProfileOpen((prevValue) => !prevValue);
  };

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
  };

  return (
    <div className="navbarContainer adminNavbarContainer">
      <NavLink to="/admin" className="CompanyLogo">
        <div className="brandMark">
          <span className="brandKicker">Admin Portal</span>
          <h1>Performance Nutrition</h1>
        </div>
      </NavLink>

      <div className="userProfile" ref={profileRef}>
        <button className="profileContainer" onClick={toggleProfile}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="profileImage" />
          ) : (
            <FaUserCircle className="profileIcon" />
          )}
          <span className="profileName">{userName}</span>
          <span className="profileCaret">▾</span>
        </button>

        {isProfileOpen && (
          <div className="dropdown-container">
            <div className="dropdown-menu">
              <NavLink to="/admin/Home"> Home </NavLink>
              <button onClick={handleLogout}> Logout </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
