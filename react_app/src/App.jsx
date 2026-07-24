import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import PortalLayout from './components/layout/PortalLayout';
import RequireAuth from './components/auth/RequireAuth';

// Public pages
import Home from './pages/Home';
import About from './pages/About';
import Testimonials from './pages/Testimonials';
import Membership from './pages/Membership';
import Contact from './pages/Contact';
import MemberLogin from './pages/MemberLogin';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';

// Membership portal pages
import Dashboard from './pages/Portal/Dashboard';
import Coach from './pages/Portal/AICoach';
import Appointment from './pages/Portal/Appointments';
import Events from './pages/Portal/Events';
import DataInput from './pages/Portal/DataInput';

// Admin portal pages
import AdminLayout from './admin/layout/AdminLayout';
import AdminHome from './admin/pages/Home';
import Members from './admin/pages/Members';
import AdminEvents from './admin/pages/Events';
import BlankPage from './admin/pages/BlankPage';

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<MemberLogin />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/password-reset" element = {<ForgotPassword />} />
        </Route>

        {/* MEMBER PORTAL (requires login) */}
        <Route element={<RequireAuth />}>
          <Route element={<PortalLayout />}>
            <Route path="/portal" element={<Navigate to="/portal/Dashboard" replace />} />
            <Route path="/portal/Dashboard" element={<Dashboard />} />
            <Route path="/portal/AIcoach" element={<Coach />} />
            <Route path="/portal/Appointments" element={<Appointment />} />
            <Route path="/portal/Events" element={<Events />} />
            <Route path="/portal/DataInput" element = {<DataInput />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/Home" replace />} />
            <Route path="/admin/Home" element={<AdminHome />} />
            <Route path="/admin/Members" element={<Members />} />
            <Route path="/admin/Users" element={<Navigate to="/admin/Members" replace />} />
            <Route path="/admin/Events" element={<AdminEvents />} />
            <Route path="/admin/Approvals" element={<BlankPage />} />
            <Route path="/admin/Reports" element={<BlankPage />} />
            <Route path="/admin/Settings" element={<BlankPage />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
