import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const EmployeeLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const res = await axios.post('https://employeesapi.devopspedia.online/api/employee-login', form);
    login(res.data);  // res.data must be { token: "...", role: "employee" }
    navigate('/employee');
  } catch (err) {
    if (err.response?.data?.setPassword) {
      navigate('/set-password', { state: { employeeId: err.response.data.employeeId } });
    } else {
      setError(err.response?.data?.error || 'Login failed');
    }
  }
};


  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4 text-center">Employee Login</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        <input
          type="text"
          name="username"
          className="form-control mb-3"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default EmployeeLogin;
