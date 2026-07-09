import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  // Don't show header on home page since it has its own hero navigation
  if (location.pathname === '/') {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Performance Nutrition
          </Link>
          <nav className="nav">
            <ul>
              <li>
                <Link 
                  to="/about" 
                  className={location.pathname === '/about' ? 'active' : ''}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/testimonials" 
                  className={location.pathname === '/testimonials' ? 'active' : ''}
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link 
                  to="/membership" 
                  className={location.pathname === '/membership' ? 'active' : ''}
                >
                  Be a Member
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={location.pathname === '/contact' ? 'active' : ''}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className={location.pathname === '/login' ? 'active' : ''}
                >
                  Member Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;