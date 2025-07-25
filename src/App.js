import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute role="admin">
                <Profile />
              </PrivateRoute>
            }
          />
          {/* Optional: catch-all 404 redirect */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute({ children, role }) {
  const { auth } = React.useContext(AuthContext);

  if (!auth || !auth.token) {
    // Not logged in
    return <Navigate to="/" />;
  }
  if (role && auth.role !== role) {
    // Role does not match
    return <Navigate to="/" />;
  }
  return children;
}

export default App;
