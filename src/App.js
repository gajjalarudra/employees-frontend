import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './components/Login'; // Admin login
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';

import EmployeeLogin from './components/EmployeeLogin';
import SetPassword from './components/SetPassword';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 👇 Login selection directly here */}
          <Route path="/" element={<LoginSelector />} />

          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute role="admin"><Profile /></PrivateRoute>} />

          {/* Employee Routes */}
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/employee/*" element={<PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>}
/>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// 👇 Login Selector UI inside App.js
function LoginSelector() {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">Welcome to Employee Management System</h2>
      <div className="row justify-content-center">
        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h4>Admin</h4>
              <button className="btn btn-primary w-100 mt-3" onClick={() => navigate('/login')}>
                Admin Login
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h4>Employee</h4>
              <button className="btn btn-success w-100 mt-3" onClick={() => navigate('/employee-login')}>
                Employee Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 👇 Private route check
function PrivateRoute({ children, role }) {
  const { auth } = React.useContext(AuthContext);

  if (!auth || !auth.token) {
    return <Navigate to={role === 'admin' ? '/login' : '/employee-login'} />;
  }

  if (role && auth.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
}

export default App;
