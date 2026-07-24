import { Outlet } from 'react-router-dom';
import AdminNavbar from './Navbar';
import AdminSidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <div className="App">
      <AdminNavbar />
      <AdminSidebar />
      <div className="AppContent">
        <Outlet />
      </div>
    </div>
  );
}
