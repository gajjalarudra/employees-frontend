import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const AdminHome = () => {
  const { auth } = useContext(AuthContext);
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get('http://43.204.142.97:5000/api/employees', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setEmployeeCount(res.data.length);
      } catch (err) {
        console.error(err);
      }
    };
    if (auth?.token) fetchCount();
  }, [auth]);

  return (
    <div style={{ marginLeft: '240px', padding: '2rem' }}>
      <h1>Welcome to Admin Dashboard</h1>
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        <h3>Employee Summary</h3>
        <p>Total Employees: <strong>{employeeCount}</strong></p>

        <h3>HR Notes</h3>
        <ul>
          <li>Maintain employee records up to date.</li>
          <li>Review pending leave and clock-in requests regularly.</li>
          <li>Ensure payroll is processed on time.</li>
          <li>Conduct monthly performance reviews.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHome;
