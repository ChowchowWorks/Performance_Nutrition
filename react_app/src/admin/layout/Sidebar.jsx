import { NavLink } from "react-router-dom";
import './sidebar.css';

const AdminSidebar = () => {
  return (
    <nav className="sidebar adminSidebar">
      <div className="nav-links">
        <h2 className="Nav-header">Segments</h2>
        <NavLink to="/admin/Home" className={({ isActive }) => isActive ? "active-link" : undefined}>
          Home
        </NavLink>
        <NavLink to="/admin/Members" className={({ isActive }) => isActive ? "active-link" : undefined}>
          Members
        </NavLink>
        <NavLink to="/admin/Events" className={({ isActive }) => isActive ? "active-link" : undefined}>
          Events
        </NavLink>
        <NavLink to="/admin/Approvals" className={({ isActive }) => isActive ? "active-link" : undefined}>
          Approvals
        </NavLink>
        <NavLink to="/admin/Reports" className={({ isActive }) => isActive ? "active-link" : undefined}>
          Reports
        </NavLink>
        <NavLink to="/admin/Settings" className={({ isActive }) => isActive ? "active-link" : undefined}>
          Settings
        </NavLink>
      </div>
    </nav>
  );
};

export default AdminSidebar;
