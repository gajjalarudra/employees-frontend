import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserTie, FaUsers } from 'react-icons/fa';
import './Landing.css';

// Simple illustration of HR team working together (SVG)
const HRTeamIllustration = () => (
  <svg
    width="100%"
    height="250"
    viewBox="0 0 600 350"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="hrteam-svg"
  >
    {/* Simplified team icons */}
    <circle cx="150" cy="140" r="50" fill="#5be3af" opacity="0.8" />
    <circle cx="220" cy="110" r="35" fill="#36d1c4" opacity="0.6" />
    <circle cx="400" cy="130" r="48" fill="#2065c3" opacity="0.85" />
    <circle cx="320" cy="185" r="38" fill="#36d1c4" opacity="0.5" />
    <circle cx="480" cy="170" r="40" fill="#5be3af" opacity="0.65" />
    {/* Faces */}
    <ellipse cx="150" cy="140" rx="12" ry="18" fill="#ffffffcc" />
    <ellipse cx="220" cy="110" rx="9" ry="14" fill="#ffffffcc" />
    <ellipse cx="400" cy="130" rx="15" ry="22" fill="#ffffffcc" />
    <ellipse cx="320" cy="185" rx="11" ry="16" fill="#ffffffcc" />
    <ellipse cx="480" cy="170" rx="12" ry="17" fill="#ffffffcc" />
  </svg>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-outer">
      {/* LEFT SIDE - banner */}
      <aside className="landing-left">
        <div className="landing-brand">
          <FaUsers size={48} color="#5be3af" />
          <h1 className="landing-title">HR Management Portal</h1>
        </div>
        <p className="landing-text">
          Welcome to the Employee Management System,
          <br />
          your all-in-one platform for seamless HR and Employee management.
        </p>
        <HRTeamIllustration />
        <div className="landing-features">
          <div className="feature-item">
            <FaUserShield size={28} color="#36d1c4" />
            <span>Admin Controls & Payroll</span>
          </div>
          <div className="feature-item">
            <FaUserTie size={28} color="#36d1c4" />
            <span>Employee Self-Service</span>
          </div>
          <div className="feature-item">
            <FaUsers size={28} color="#36d1c4" />
            <span>Team Collaboration & Leave Management</span>
          </div>
        </div>
        <footer className="landing-footer">
          © {new Date().getFullYear()} DevOpsPedia HR Systems
        </footer>
      </aside>

      {/* RIGHT SIDE - login options */}
      <main className="landing-right">
        <h2 className="landing-welcome">Select Login Portal</h2>
        <div className="login-cards-container">
          <div className="login-card admin-card" onClick={() => navigate('/login')} tabIndex={0} role="button" aria-label="Go to Admin Login">
            <FaUserShield size={50} color="#fff" />
            <h3>Admin Login</h3>
            <p>Manage employees, approvals, and payroll</p>
            <button className="btn btn-primary">Go to Admin Login</button>
          </div>
          <div className="login-card employee-card" onClick={() => navigate('/employee-login')} tabIndex={0} role="button" aria-label="Go to Employee Login">
            <FaUserTie size={50} color="#fff" />
            <h3>Employee Login</h3>
            <p>Access attendance, leaves, and personal info</p>
            <button className="btn btn-success">Go to Employee Login</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
