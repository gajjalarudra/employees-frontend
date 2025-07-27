import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { AuthProvider, AuthContext } from './context/AuthContext';

import Landing from './components/Landing'; // Landing page with new banner design
import Login from './components/Login'; // Admin login
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';

import EmployeeLogin from './components/EmployeeLogin';
import SetPassword from './components/SetPassword';
import EmployeeDashboard from './components/EmployeeDashboard';

import './components/Landing.css';  // Import Landing.css globally or in Landing.js

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 👇 Use Landing as root / */}
          <Route path="/" element={<Landing />} />

          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute role="admin"><Profile /></PrivateRoute>} />

          {/* Employee Routes */}
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/employee/*" element={<PrivateRoute role="employee"><EmployeeDashboard /></PrivateRoute>} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
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
