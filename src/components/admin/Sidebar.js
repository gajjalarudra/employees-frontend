import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div
      style={{
        width: '220px',
        minHeight: '100vh',
        background: '#2a2d3e',
        color: 'white',
        paddingTop: '2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h2 className="text-center mb-4" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Admin Panel
      </h2>

      {[
        { to: '/admin/home', label: 'Home' },
        { to: '/admin/add-employee', label: 'Add Employee' },
        { to: '/admin/employees', label: 'Employee List' },
        { to: '/admin/requests', label: 'Requests' },
      ].map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          style={({ isActive }) => ({
            padding: '0.75rem 1.5rem',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '600',
            backgroundColor: isActive ? '#667eea' : 'transparent',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease',
          })}
          className="sidebar-link"
        >
          {label}
        </NavLink>
      ))}

      <style>{`
        .sidebar-link:hover {
          background-color: #4a52a0;
          cursor: pointer;
          color: #e0e0ff;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
