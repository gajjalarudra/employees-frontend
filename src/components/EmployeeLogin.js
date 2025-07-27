import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaUserTie, FaCalendarCheck, FaClock, FaStickyNote, FaSmileBeam
} from 'react-icons/fa';
import './EmployeeLogin.css';

// Simple, friendly SVG for employee login banner
const TeamEmployeeSVG = () => (
  <svg viewBox="0 0 600 320" width="100%" height="170" className="banner-svg" style={{ maxWidth: 330 }}>
    {/* Background shapes */}
    <ellipse cx="180" cy="140" rx="58" ry="48" fill="#36d1c4" opacity="0.19" />
    <ellipse cx="360" cy="125" rx="52" ry="38" fill="#ffd966" opacity="0.13" />
    {/* Central avatar */}
    <circle cx="240" cy="160" r="70" fill="#5be3af" />
    {/* Smaller avatars */}
    <circle cx="130" cy="170" r="37" fill="#5b86e5" opacity="0.23" />
    <circle cx="350" cy="180" r="40" fill="#f9cd74" opacity="0.16" />
    {/* Faces */}
    <circle cx="235" cy="133" r="8" fill="#ffe56f" />
    <circle cx="260" cy="130" r="8" fill="#ffe56f" />
    <ellipse cx="244" cy="185" rx="14" ry="9" fill="#fff" opacity="0.78" />
    {/* Floating happy dot */}
    <circle cx="140" cy="110" r="7" fill="#5be3af" opacity="0.33">
      <animate attributeName="cy" values="110;100;110" dur="2.4s" repeatCount="indefinite" />
    </circle>
  </svg>
);

const EMPLOYEE_FEATURES = [
  {
    icon: <FaCalendarCheck size={30} />,
    title: "My Attendance",
    desc: "Clock in & out, view your work timings and history.",
  },
  {
    icon: <FaStickyNote size={30} />,
    title: "Leave Requests",
    desc: "Apply for leave, track approval status, and plan time-off.",
  },
  {
    icon: <FaClock size={30} />,
    title: "Timesheets",
    desc: "View & update your timesheets for each day.",
  },
  {
    icon: <FaSmileBeam size={30} />,
    title: "Employee Wellbeing",
    desc: "Get wellness updates and motivational reminders 🌞",
  },
];

const EmployeeLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://employeesapi.devopspedia.online/api/employee-login', form);
      login(res.data); // { token: "...", role: "employee" }
      navigate('/employee');
    } catch (err) {
      if (err.response?.data?.setPassword) {
        navigate('/set-password', { state: { employeeId: err.response.data.employeeId } });
      } else {
        setError(err.response?.data?.error || 'Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <div className="employee-login-outer">
      {/* LEFT: Employee banner & features */}
      <aside className="employee-login-left banner-side">
        <div className="banner-main">
          <div className="brand-top">
            <FaUserTie size={48} style={{ marginRight: 12, color: '#fff' }} />
            <span className="brand-title big-title">Welcome Employee</span>
          </div>
          <h2 className="left-welcome">Employee Self-Service</h2>
          <TeamEmployeeSVG />
          <div className="banner-description">
            <p>
              <span className="highlight-text">Empower</span> your workday.<br />
              <b>Log in to manage your work!</b>
            </p>
          </div>
        </div>
        <div className="employee-features">
          {EMPLOYEE_FEATURES.map((obj, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feat-icon">{obj.icon}</div>
              <div>
                <h4>{obj.title}</h4>
                <div className="feature-desc">{obj.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <footer className="login-footer">
          <small>© {new Date().getFullYear()} DevOpsPedia Employee Portal</small>
        </footer>
      </aside>

      {/* RIGHT: Login box */}
      <main className="employee-login-right">
        <form className="login-glass-card animate-pop-in" onSubmit={handleSubmit} autoComplete="on">
          <h2>Employee Login</h2>
          <div className="login-input-group">
            <label htmlFor="username">Username</label>
            <input
              autoFocus
              type="text"
              name="username"
              id="username"
              className="form-control"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="password">Password</label>
            <div className="input-pass-wrapper">
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="showpass-btn"
                tabIndex={-1}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Hide Password' : 'Show Password'}
              >
                <span className="icon-eye">
                  {showPass ? (
                    // Closed "hide" eye SVG
                    <svg width="1.2em" height="1.2em" viewBox="0 0 20 20" fill="none"><path d="M16 16L4 4m0 12L16 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round"/><ellipse cx="10" cy="10" rx="5.5" ry="5.5" stroke="#888" strokeWidth="1.3" /></svg>
                  ) : (
                    // Open "show" eye SVG
                    <svg width="1.2em" height="1.2em" viewBox="0 0 20 20" fill="none"><ellipse cx="10" cy="10" rx="5.5" ry="5.5" stroke="#888" strokeWidth="1.3"/><circle cx="10" cy="10" r="2.3" fill="#888" /></svg>
                  )}
                </span>
              </button>
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn-gradient-big" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="login-note">For registered employees only.</div>
        </form>
      </main>
    </div>
  );
};

export default EmployeeLogin;
