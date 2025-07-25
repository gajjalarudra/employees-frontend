import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Username & role from auth or localStorage fallback
  const username = auth.user?.username || localStorage.getItem('username') || 'Admin';
  const role = auth.user?.role || localStorage.getItem('role') || 'admin';

  // Profile pic stored as base64 string in localStorage under 'profilePic'
  const storedPic = localStorage.getItem('profilePic');

  // State for image preview & file input
  const [profilePic, setProfilePic] = useState(storedPic || null);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // to reset input

  // Handle image file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result);       // base64 string
      localStorage.setItem('profilePic', reader.result);
    };
    reader.readAsDataURL(file);
    setFileInputKey(Date.now()); // reset file input for same file re-upload
  };

  return (
    <div
      className="container my-5 p-4 rounded shadow"
      style={{
        maxWidth: '400px',
        backgroundColor: 'white',
        color: '#333',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <button
        className="btn btn-outline-primary mb-4"
        onClick={() => navigate('/admin')}
      >
        &larr; Back to Dashboard
      </button>

      <div className="text-center mb-4">
        <img
          src={
            profilePic ||
            `https://ui-avatars.com/api/?name=${username}&background=764ba2&color=fff&rounded=true&size=120`
          }
          alt="Profile"
          className="rounded-circle"
          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
      </div>

      <div className="mb-3 text-center">
        <input
          key={fileInputKey} // reset input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          id="profilePicInput"
          style={{ display: 'none' }}
        />
        <label
          htmlFor="profilePicInput"
          className="btn btn-primary"
          style={{ cursor: 'pointer' }}
        >
          Change Profile Picture
        </label>
      </div>

      <h3 className="text-center mb-3" style={{ color: '#764ba2' }}>
        {username}
      </h3>
      <p className="text-center text-muted mb-4" style={{ fontWeight: '600' }}>
        Role: {role.charAt(0).toUpperCase() + role.slice(1)}
      </p>

      <div className="text-center">
        <button
          className="btn btn-gradient"
          style={{
            backgroundImage: 'linear-gradient(to right, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontWeight: '600',
            borderRadius: '25px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.6)',
            cursor: 'default',
          }}
          disabled
        >
          Profile Info
        </button>
      </div>
    </div>
  );
};

export default Profile;
