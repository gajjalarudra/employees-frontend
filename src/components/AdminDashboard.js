// Updated AdminDashboard.js – modern layout, transparent sidebar, colorful home
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';
import './AdminDashboard.css'; // Include this new CSS file

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [page, setPage] = useState('home');

  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: '', username: '', email: '', salary: '',
    designation: '', joining_date: '',
  });
  const [editingId, setEditingId] = useState(null);

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [clockinRequests, setClockinRequests] = useState([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://43.204.142.97:5000/api/employees', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const fetchApprovals = async () => {
    setLoadingApprovals(true);
    try {
      const [leaveRes, clockinRes] = await Promise.all([
        axios.get('http://43.204.142.97:5000/api/leave-requests', {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
        axios.get('http://43.204.142.97:5000/api/clockin-requests', {
          headers: { Authorization: `Bearer ${auth.token}` },
        }),
      ]);
      setLeaveRequests(leaveRes.data);
      setClockinRequests(clockinRes.data);
    } catch (err) {
      console.error('Error fetching approvals:', err);
    }
    setLoadingApprovals(false);
  };

  useEffect(() => {
    if (auth?.token) {
      fetchEmployees();
      fetchApprovals();
    }
  }, [auth]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://43.204.142.97:5000/api/employees/${editingId}`, form, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setEditingId(null);
      } else {
        await axios.post('http://43.204.142.97:5000/api/employees', form, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
      }
      setForm({
        name: '', username: '', email: '', salary: '', designation: '', joining_date: '',
      });
      fetchEmployees();
      setPage('list');
    } catch (err) {
      console.error('Error saving employee:', err);
    }
  };

  const handleEdit = (emp) => {
    setForm({
      name: emp.name,
      username: emp.username,
      email: emp.email,
      salary: emp.salary,
      designation: emp.designation || '',
      joining_date: emp.joining_date ? emp.joining_date.substring(0, 10) : '',
    });
    setEditingId(emp.id);
    setPage('add');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await axios.delete(`http://43.204.142.97:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      fetchEmployees();
    }
  };

  const approveLeave = async (id) => {
    try {
      await axios.post(`http://43.204.142.97:5000/api/leave-requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setLeaveRequests((prev) => prev.filter((req) => req.id !== id));
      alert('Leave request approved!');
    } catch (err) {
      alert('Failed to approve leave request.');
    }
  };

  const approveClockin = async (id) => {
    try {
      await axios.post(`http://43.204.142.97:5000/api/clockin-requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setClockinRequests((prev) => prev.filter((req) => req.id !== id));
      alert('Clock-in request approved!');
    } catch (err) {
      alert('Failed to approve clock-in request.');
    }
  };

  return (
    <>
      <Navbar />

      {/* Sidebar */}
      <div className="sidebar">
        {[
          { key: 'home', label: '🏠 Home' },
          { key: 'add', label: '➕ Add Employee' },
          { key: 'list', label: '📋 Employee List' },
          { key: 'requests', label: '📨 Requests' },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`sidebar-btn ${page === key ? 'active' : ''}`}
            onClick={() => setPage(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
  {page === 'home' && (
    <div className="home-container">
      <h1>Welcome to Admin Dashboard</h1>
      <div className="summary-box">
        <h3>👥 Employee Summary</h3>
        <p>Total Employees: <strong>{employees.length}</strong></p>
      </div>
      <div className="grid">
        <div className="card note">
          <h4>📝 HR Notes</h4>
          <ul>
            <li>Keep employee info updated</li>
            <li>Approve leave/clock-in requests</li>
            <li>Manage onboarding & payroll</li>
          </ul>
        </div>
        <div className="card motivation">
          <h4>🚀 Motivation</h4>
          <p>"Your team is your power. Empower them to grow, and the company grows with them!"</p>
        </div>
        <div className="card policy">
          <h4>📚 Company Policy</h4>
          <p>Adhere to working hours, ethics, and security. Transparency and respect are our culture.</p>
        </div>
        <div className="card announcement">
          <h4>📢 Announcements</h4>
          <ul>
            <li>🏆 Monthly awards announced next Friday</li>
            <li>🎉 Team outing on August 10</li>
          </ul>
        </div>
      </div>
    </div>
  )}

  {page === 'add' && (
  <>
    <h2 className="page-title">Add / Edit Employee</h2>
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-grid">
        {[
          { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
          { name: 'username', type: 'text', placeholder: 'Username', required: true },
          { name: 'email', type: 'email', placeholder: 'Email', required: true },
          { name: 'salary', type: 'number', placeholder: 'Salary (₹)', required: true },
          { name: 'designation', type: 'text', placeholder: 'Designation', required: false },
          { name: 'joining_date', type: 'date', placeholder: '', required: false },
        ].map(({ name, type, placeholder, required }) => (
          <div key={name} className="form-group">
            <input
              id={name}
              name={name}
              type={type}
              value={form[name]}
              onChange={handleChange}
              required={required}
              className="form-input"
              placeholder=" "
            />
            <label htmlFor={name} className="form-label">
              {placeholder || (name === 'joining_date' ? 'Joining Date' : name.charAt(0).toUpperCase() + name.slice(1))}
            </label>
          </div>
        ))}
      </div>

      <button type="submit" className="btn-gradient">
        {editingId ? 'Update Employee' : 'Add Employee'}
      </button>
    </form>
  </>
)}

  {page === 'list' && (
    <>
      <h2>Employee List</h2>
      <div className="row g-4">
        {employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          employees.map((emp) => (
            <div key={emp.id} className="col-md-6 col-lg-4">
              <div className="card p-3 h-100 shadow" style={{ backgroundColor: 'white' }}>
                <h5 className="fw-bold text-primary">{emp.name}</h5>
                <p><strong>Username:</strong> {emp.username}</p>
                <p><strong>Email:</strong> {emp.email}</p>
                <p><strong>Salary:</strong> ₹{emp.salary}</p>
                <p><strong>Designation:</strong> {emp.designation || '-'}</p>
                <p><strong>Joining:</strong> {emp.joining_date?.substring(0, 10) || '-'}</p>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(emp)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )}

  {page === 'requests' && (
  <>
    <h2 className="page-title">Pending Requests</h2>

    <section className="request-section">
      <h4>📅 Leave Requests</h4>
      {loadingApprovals ? (
        <p>Loading leave requests...</p>
      ) : leaveRequests.length === 0 ? (
        <p>No pending leave requests.</p>
      ) : (
        <div className="request-grid">
          {leaveRequests.map((req) => (
            <div key={req.id} className="request-card leave-request">
              <div className="request-header">
                <span className="request-type">Leave</span>
                <button
                  className="btn-approve"
                  onClick={() => approveLeave(req.id)}
                  title="Approve Leave"
                >
                  ✓ Approve
                </button>
              </div>
              <p><strong>Employee:</strong> {req.employee_name || req.employee_username}</p>
              <p><strong>Type:</strong> {req.leave_type}</p>
              <p><strong>From:</strong> {req.start_date}</p>
              <p><strong>To:</strong> {req.end_date}</p>
              <p><strong>Reason:</strong> {req.reason}</p>
            </div>
          ))}
        </div>
      )}
    </section>

    <section className="request-section">
      <h4>🕒 Clock-In Requests</h4>
      {loadingApprovals ? (
        <p>Loading clock-in requests...</p>
      ) : clockinRequests.length === 0 ? (
        <p>No pending clock-in requests.</p>
      ) : (
        <div className="request-grid">
          {clockinRequests.map((req) => (
            <div key={req.id} className="request-card clockin-request">
              <div className="request-header">
                <span className="request-type">Clock-In</span>
                <button
                  className="btn-approve"
                  onClick={() => approveClockin(req.id)}
                  title="Approve Clock-In"
                >
                  ✓ Approve
                </button>
              </div>
              <p><strong>Employee:</strong> {req.employee_name || req.employee_username}</p>
              <p><strong>Date:</strong> {req.date}</p>
              <p><strong>Time:</strong> {req.clock_in}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  </>
)}
</div>

    </>
  );
};

export default AdminDashboard;
