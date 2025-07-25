import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';  // Correct import for default export

const AdminDashboard = () => {
  const { auth } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    salary: '',
    designation: '',
    joining_date: '',
  });
  const [editingId, setEditingId] = useState(null);

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

  useEffect(() => {
    if (auth?.token) fetchEmployees();
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
        name: '',
        username: '',
        email: '',
        salary: '',
        designation: '',
        joining_date: '',
      });
      fetchEmployees();
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      await axios.delete(`http://43.204.142.97:5000/api/employees/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      fetchEmployees();
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="min-vh-100 p-4 pt-5" // add pt-5 to avoid navbar overlap
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div className="container">
          <h1
            className="mb-4 text-center fw-bold"
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }}
          >
            Admin Dashboard - Employee Management
          </h1>

          {/* Form Card */}
          <div
            className="card p-4 mb-5 shadow-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}
          >
            <h3 className="mb-4 text-center text-primary">
              {editingId ? 'Edit Employee' : 'Add New Employee'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="number"
                    name="salary"
                    className="form-control"
                    placeholder="Salary (₹)"
                    value={form.salary}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <input
                    type="text"
                    name="designation"
                    className="form-control"
                    placeholder="Designation"
                    value={form.designation}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="date"
                    name="joining_date"
                    className="form-control"
                    value={form.joining_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gradient btn-lg mt-4 w-100 fw-semibold"
                style={{
                  backgroundImage: 'linear-gradient(to right, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.6)',
                  transition: 'background-image 0.3s ease',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #5a6edc, #693f91)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #667eea, #764ba2)')
                }
              >
                {editingId ? 'Update Employee' : 'Add Employee'}
              </button>
            </form>
          </div>

          {/* Employees List */}
          <h3 className="mb-4 text-center text-white text-shadow">Employee List</h3>
          <div className="row gy-4">
            {employees.length === 0 ? (
              <div className="col-12">
                <div
                  className="p-5 text-center rounded shadow"
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
                >
                  No employees found
                </div>
              </div>
            ) : (
              employees.map((emp) => (
                <div key={emp.id} className="col-sm-12 col-md-6 col-lg-4">
                  <div
                    className="card h-100 shadow"
                    style={{
                      borderRadius: '15px',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      color: '#333',
                      transition: 'transform 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <div className="card-body">
                      <h5 className="card-title fw-bold text-primary">{emp.name}</h5>
                      <p className="card-text mb-1">
                        <strong>Username:</strong> {emp.username}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Email:</strong> {emp.email}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Salary:</strong> ₹{emp.salary}
                      </p>
                      <p className="card-text mb-1">
                        <strong>Designation:</strong> {emp.designation || '-'}
                      </p>
                      <p className="card-text mb-3">
                        <strong>Joining Date:</strong> {emp.joining_date ? emp.joining_date.substring(0, 10) : '-'}
                      </p>

                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEdit(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
