import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const MyFinance = () => {
  const { auth } = useContext(AuthContext);
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSalary = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://43.204.142.97:5000/api/employees/me', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setSalary(res.data.salary);
    } catch (err) {
      setError('Failed to load salary data');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (auth?.token) {
      fetchSalary();
    }
  }, [auth]);

  return (
    <div className="container py-5">
      <div className="card shadow p-5 text-center" style={{ borderRadius: '12px', backgroundColor: '#eaf3ff' }}>
        <h3 className="fw-bold mb-3" style={{ color: '#3b3b98' }}>💰 My Finance</h3>
        {loading && <p>Loading finance info...</p>}
        {error && <p className="text-danger">{error}</p>}
        {salary !== null ? (
          <p className="lead">Your annual salary: <strong>₹{salary}</strong></p>
        ) : (
          !loading && <p className="text-muted">No finance data available.</p>
        )}
        <p style={{ fontStyle: 'italic' }}>Stay tuned for more payroll features soon! 🚀</p>
      </div>
    </div>
  );
};

export default MyFinance;
