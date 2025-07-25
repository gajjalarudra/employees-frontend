import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background:
          'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
        padding: '0.5rem 2rem',
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold"
          to="/admin"  // Use React Router Link here
          style={{ letterSpacing: '2px', fontSize: '1.5rem' }}
        >
          AdminPanel
        </Link>

        <div className="d-flex align-items-center position-relative">
          <div
            className="nav-link dropdown-toggle d-flex align-items-center"
            role="button"
            onClick={toggleDropdown}
            style={{ cursor: 'pointer', color: 'white' }}
            aria-expanded={dropdownOpen}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${auth.user?.username || 'Admin'}&background=764ba2&color=fff&rounded=true&size=32`}
              alt="Admin"
              className="rounded-circle me-2"
              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
            />
            <span>{auth.user?.username || 'Admin'}</span>
          </div>

          {dropdownOpen && (
            <ul
              className="dropdown-menu dropdown-menu-end show"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: '160px',
                boxShadow: '0 6px 12px rgba(0,0,0,.175)',
                borderRadius: '0.3rem',
              }}
            >
              <li>
                <Link
                  className="dropdown-item"
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item text-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
