// src/components/Sidebar.js
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css'; // We'll add styles here

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/employee-login');
  };

  return (
    <div className="sidebar">
      <h4 className="sidebar-title">Employee Panel</h4>
      <nav className="nav flex-column">
        <NavLink to="/employee" className="sidebar-link">🏠 Home</NavLink>
        <NavLink to="/employee/attendance" className="sidebar-link">🕒 Attendance</NavLink>
        <NavLink to="/employee/apply-leave" className="sidebar-link">📆 Apply Leave</NavLink>
        <NavLink to="/employee/my-finance" className="sidebar-link">💰 My Finance</NavLink>
        <button className="btn btn-outline-light logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </nav>
    </div>
  );
};

export default Sidebar;
