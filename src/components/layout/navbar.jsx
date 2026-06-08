import React from "react";
import { Link , NavLink} from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import './navbar.css';


const Navbar = () => {
  return (
    <div className="navbarContainer">
      {/* Company Logo */}
      <NavLink to="/portal/Dashboard" className="CompanyLogo">
        <h1>Performance Nutrition</h1>
      </NavLink>

      {/* Profile tab */}
      <div className="userProfile">
        <h2 className="profileContainer">
          <Link to="/portal/Dashboard" className="profileTab">
            My Profile
            <FaUserCircle className="profileIcon" />
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default Navbar;