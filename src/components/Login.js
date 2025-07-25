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
    try {
      const res = await axios.post('http://43.204.142.97:5000/api/login', form);
      login(res.data.token, res.data.role);
      if (res.data.role === 'admin') navigate('/admin');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow w-100" style={{ maxWidth: '400px' }}>
        <h3 className="text-center text-primary mb-4">Employee Login</h3>
        <input type="text" name="username" placeholder="Username" value={form.username}
          onChange={handleChange} className="form-control mb-3" />
        <input type="password" name="password" placeholder="Password" value={form.password}
          onChange={handleChange} className="form-control mb-3" />
        {error && <div className="alert alert-danger py-1">{error}</div>}
        <button onClick={handleLogin} className="btn btn-primary w-100">Login</button>
      </div>
    </div>
  );
};

export default Login;
