import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  FaUserShield, FaAward, FaRunning, FaSmile, FaUsers
} from 'react-icons/fa';
import './AdminLogin.css';

// Royalty-free SVG for hero team banner
const TeamSVG = () => (
  <svg viewBox="0 0 600 340" width="100%" height="180" className="banner-svg" style={{ maxWidth: 370 }}>
    {/* Persons (simple avatars) */}
    <circle cx="130" cy="175" r="50" fill="#44e9b0" opacity="0.35" />
    <circle cx="180" cy="155" r="38" fill="#5b86e5" opacity="0.19" />
    <ellipse cx="370" cy="130" rx="54" ry="42" fill="#3699fd" opacity="0.16" />
    <ellipse cx="310" cy="170" rx="38" ry="56" fill="#f9cd74" opacity="0.22" />
    {/* Central team avatar */}
    <circle cx="245" cy="160" r="73" fill="#5be3af" />
    {/* Faces */}
    <ellipse cx="210" cy="155" rx="12" ry="25" fill="#ffe" opacity="0.53" />
    <ellipse cx="277" cy="165" rx="16" ry="28" fill="#fff" opacity="0.32" />
    {/* Happy icons */}
    <circle cx="220" cy="129" r="8" fill="#ffe56f" />
    <circle cx="260" cy="130" r="8" fill="#ffe56f" />
    <ellipse cx="240" cy="180" rx="13" ry="10" fill="#fff" opacity="0.92" />
    {/* Tiny floating dots for "animated" feel */}
    <circle cx="100" cy="110" r="6" fill="#5be3af" opacity="0.40">
      <animate attributeName="cy" values="110;100;110" dur="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="330" cy="100" r="6" fill="#36d1c4" opacity="0.40">
      <animate attributeName="cy" values="100;90;100" dur="2s" repeatCount="indefinite" begin="0.7s" />
    </circle>
    <circle cx="400" cy="220" r="9" fill="#ffd966" opacity="0.26">
      <animate attributeName="cy" values="220;210;225;220" dur="3s" repeatCount="indefinite" begin="0.41s" />
    </circle>
  </svg>
);

const HR_LEFT_CONTENT = [
  {
    icon: <FaUsers size={32} />,
    title: "Team at Your Fingertips",
    desc: "Manage all employees in one place. From onboarding to payroll."
  },
  {
    icon: <FaAward size={32} />,
    title: "Employee Recognition",
    desc: "Monthly and yearly awards to appreciate the stars 💫"
  },
  {
    icon: <FaSmile size={32} />,
    title: "Wellness Initiatives",
    desc: "Promote health, happiness & work-life balance for your team."
  },
  {
    icon: <FaRunning size={32} />,
    title: "Upcoming Events",
    desc: (
      <ul style={{ paddingLeft: 16, margin: 0 }}>
        <li>🎉 Team Outing - Aug 10</li>
        <li>🏆 Award Night - July 31</li>
      </ul>
    )
  }
];

const Login = () => {
  const { login, auth } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in as admin:
  if (auth?.token && auth?.role === 'admin') {
    window.location.href = '/admin';
    return null;
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        'https://employeesapi.devopspedia.online/api/login',
        form
      );
      login({ token: res.data.token, role: res.data.role });

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. Not an admin user.');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-outer">
      {/* Left HR Portal Info w/ banner */}
      <aside className="admin-login-left banner-side">
        <div className="banner-main">
          <div className="brand-top">
            <FaUserShield size={55} style={{ marginRight: 14, color: '#fff' }} />
            <span className="brand-title big-title">HR Portal</span>
          </div>
          <h2 className="left-welcome">Welcome, HR Leader!</h2>
          <TeamSVG />
          <div className="banner-description">
            <p>
              <span className="highlight-text">Empower teams.</span> Foster growth.<br />
              <b>Build a world-class workplace!</b>
            </p>
          </div>
        </div>
        <div className="hr-features">
          {HR_LEFT_CONTENT.map((obj, idx) => (
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
          <small>© {new Date().getFullYear()} DevOpsPedia HR Systems</small>
        </footer>
      </aside>

      {/* Right LOGIN */}
      <main className="admin-login-right">
        <form className="login-glass-card animate-pop-in" onSubmit={handleLogin} autoComplete="on">
          <h2>Admin Login</h2>
          <div className="login-input-group">
            <label htmlFor="username">Username / Email</label>
            <input
              autoFocus
              type="text"
              id="username"
              name="username"
              placeholder="Enter your admin username or email"
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
                id="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                tabIndex={-1}
                className="showpass-btn"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Hide Password' : 'Show Password'}
              >
                <span className="icon-eye">
                  {showPass ? (
                    <svg width="1.2em" height="1.2em" viewBox="0 0 20 20" fill="none"><path d="M16 16L4 4m0 12L16 4" stroke="#888" strokeWidth="1.6" strokeLinecap="round"/><ellipse cx="10" cy="10" rx="5.5" ry="5.5" stroke="#888" strokeWidth="1.4" /></svg>
                  ) : (
                    <svg width="1.2em" height="1.2em" viewBox="0 0 20 20" fill="none"><ellipse cx="10" cy="10" rx="5.5" ry="5.5" stroke="#888" strokeWidth="1.4"/><circle cx="10" cy="10" r="2.5" fill="#888" /></svg>
                  )}
                </span>
              </button>
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="btn-gradient-big" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="login-note">* Admin access only</div>
        </form>
      </main>
    </div>
  );
};

export default Login;
