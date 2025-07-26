import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="container text-center mt-5">
      <h2 className="mb-4">Welcome to Employee Management System</h2>
      <div className="row justify-content-center">
        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title mb-3">Admin Login</h4>
              <button className="btn btn-primary w-100" onClick={() => navigate('/login')}>
                Go to Admin Login
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title mb-3">Employee Login</h4>
              <button className="btn btn-success w-100" onClick={() => navigate('/employee-login')}>
                Go to Employee Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
