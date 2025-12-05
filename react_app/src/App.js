import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Membership portal pages
{/*import DashboardPage from './pages/DashboardPage';
import AICoachPage from './pages/AICoachPage';
import AppointmentPage from './pages/AppointmentPage';
import EventsPage from './pages/EventsPage';
import DataInputPage from './pages/DataInputPage';*/}

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
        </Route>

        {/* MEMBER PORTAL (requires login) */}
        {/*<Route element={<RequireAuth />}>
          <Route element={<PortalLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/coach" element={<AICoachPage />} />
            <Route path="/appointments" element={<AppointmentPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/input" element={<DataInputPage />} />
          </Route>
        </Route>
        */}

      </Routes>
    </Router>
  );
}

export default App;
