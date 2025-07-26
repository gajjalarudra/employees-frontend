import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const employeeId = location.state?.employeeId;

  useEffect(() => {
    if (!employeeId) {
      navigate('/employee-login');
    }
  }, [employeeId, navigate]);

  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://43.204.142.97:5000/api/set-password', {
        employeeId,
        password: form.password,
      });

      setSuccess('Password set successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/employee-login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set password');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h3 className="mb-4 text-center">Set Your Password</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <input
          type="password"
          name="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <input
          type="password"
          name="confirmPassword"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />
        <button type="submit" className="btn btn-success w-100">
          Set Password
        </button>
      </form>
    </div>
  );
};

export default SetPassword;
