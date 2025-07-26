import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError('');
    try {
      const res = await axios.post('https://employeesapi.devopspedia.online/api/login', form);
      // pass single object
      login({ token: res.data.token, role: res.data.role });

      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access denied. Not an admin user.');
      }
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: '400px' }}>
        <h3 className="text-center text-primary mb-4">Admin Login</h3>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="form-control mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="form-control mb-3"
          required
        />
        {error && <div className="alert alert-danger py-1">{error}</div>}
        <button onClick={handleLogin} className="btn btn-primary w-100">
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
