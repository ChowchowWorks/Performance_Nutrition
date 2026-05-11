import React from "react";
import { NavLink } from "react-router-dom";
import './sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">

      {/* Navigation Links */}
      <div className="nav-links">
        <h2 className="Nav-header">Segments</h2>
        <NavLink
          to="/portal/Dashboard"
          className={({ isActive }) =>
            isActive ? "active-link" : undefined
          }
        >
          My Statistics
        </NavLink>
        <NavLink
          to="/portal/AIcoach"
          className={({ isActive }) =>
            isActive ? "active-link" : undefined
          }
        >
          AI Coach
        </NavLink>
        <NavLink
          to="/portal/Appointments"
          className={({ isActive }) =>
            isActive ? "active-link" : undefined
          }
        >
          Book Appointment
        </NavLink>
        <NavLink
          to="/portal/Events"
          className={({ isActive }) =>
            isActive ? "active-link" : undefined
          }
        >
          Upcoming Events
        </NavLink>
        <NavLink
          to="/portal/DataInput"
          className={({ isActive }) =>
            isActive ? "active-link" : undefined
          }
        >
          Data Input
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
