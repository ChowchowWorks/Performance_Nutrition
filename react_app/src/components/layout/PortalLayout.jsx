import Sidebar from './sidebar';
import Navbar from './navbar';
import { Outlet } from "react-router-dom";

export default function PortalLayout() {
  return (
    <div className="App">
      <Navbar />
      <Sidebar />
      <div className="AppContent">
        <Outlet />  {/* child route renders here */}
      </div>
    </div>
  );
}
