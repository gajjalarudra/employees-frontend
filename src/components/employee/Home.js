import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { auth } = useContext(AuthContext);

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTodayAttendance = async () => {
    if (!auth?.token) return;

    setLoading(true);
    setError('');

    try {
      const res = await axios.get('http://43.204.142.97:5000/api/attendance', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      console.log('Attendance API response:', res.data);

      const todayStr = new Date().toISOString().slice(0, 10);

      // Try to find today's record. If date format has time, use startsWith
      const todayRecord = res.data.find((record) => record.date.startsWith(todayStr));

      console.log("Today's attendance record:", todayRecord);

      if (todayRecord) {
        setIsClockedIn(!!todayRecord.clock_in && !todayRecord.clock_out);
        setClockInTime(todayRecord.clock_in ? new Date(todayRecord.clock_in).toLocaleTimeString() : null);
        setClockOutTime(todayRecord.clock_out ? new Date(todayRecord.clock_out).toLocaleTimeString() : null);
      } else {
        setIsClockedIn(false);
        setClockInTime(null);
        setClockOutTime(null);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError('Failed to fetch attendance status');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, [auth]);

  const handleClockIn = async () => {
    setError('');
    try {
      const res = await axios.post(
        'http://43.204.142.97:5000/api/clock-in',
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      console.log('Clock-in response:', res.data);
      fetchTodayAttendance();
    } catch (err) {
      console.error('Clock-in error:', err.response || err);
      setError(err.response?.data?.error || 'Clock-in failed');
    }
  };

  const handleClockOut = async () => {
    setError('');
    try {
      const res = await axios.post(
        'http://43.204.142.97:5000/api/clock-out',
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      console.log('Clock-out response:', res.data);
      fetchTodayAttendance();
    } catch (err) {
      console.error('Clock-out error:', err.response || err);
      setError(err.response?.data?.error || 'Clock-out failed');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center fw-bold" style={{ color: '#364f6b' }}>
        Welcome Back, Employee 👋
      </h2>

      {error && (
        <div className="alert alert-danger text-center">
          {error}
        </div>
      )}

      <div className="row g-4">

        {/* Clock In / Clock Out */}
        <div className="col-md-6">
          <div
            className="card shadow border-0"
            style={{ background: 'linear-gradient(135deg, #b8f2e6 0%, #aed9e0 100%)', color: '#222' }}
          >
            <div className="card-body">
              <h5 className="card-title fw-bold">🕒 Clock In / Clock Out</h5>
              <p>Status: 
                <span className={`badge ms-2 ${isClockedIn ? 'bg-success' : clockOutTime ? 'bg-secondary' : 'bg-warning text-dark'}`}>
                  {isClockedIn ? 'Clocked In' : clockOutTime ? 'Clocked Out' : 'Not Clocked In'}
                </span>
              </p>

              {!isClockedIn && (
                <button
                  className="btn btn-outline-success me-2 fw-semibold"
                  onClick={handleClockIn}
                  disabled={loading}
                >
                  Clock In
                </button>
              )}

              {isClockedIn && (
                <button
                  className="btn btn-outline-danger fw-semibold"
                  onClick={handleClockOut}
                  disabled={loading}
                >
                  Clock Out
                </button>
              )}

              {clockInTime && <p className="mt-2">Clocked in at: {clockInTime}</p>}
              {clockOutTime && <p>Clocked out at: {clockOutTime}</p>}
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="col-md-6">
          <div
            className="card shadow border-0"
            style={{ background: 'linear-gradient(135deg, #ffd3b6 0%, #ffaaa5 100%)', color: '#222' }}
          >
            <div className="card-body">
              <h5 className="card-title fw-bold">📣 Announcements</h5>
              <ul className="mb-0">
                <li>Company Meetup – Aug 30</li>
                <li>New Leave Policy starts in Sep</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="col-md-4">
          <div
            className="card shadow border-0"
            style={{ background: 'linear-gradient(135deg, #e4c1f9 0%, #c1cefe 100%)', color: '#222' }}
          >
            <div className="card-body">
              <h6 className="fw-bold">📅 Attendance Summary</h6>
              <p>This Month: <strong>20/22 Days</strong></p>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="col-md-4">
          <div
            className="card shadow border-0"
            style={{ background: 'linear-gradient(135deg, #d0f4de 0%, #a9def9 100%)', color: '#222' }}
          >
            <div className="card-body">
              <h6 className="fw-bold">📆 Leaves Left</h6>
              <p>Casual: <strong>8</strong> | Sick: <strong>4</strong></p>
            </div>
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="col-md-4">
          <div
            className="card shadow border-0"
            style={{ background: 'linear-gradient(135deg, #fcf6bd 0%, #fcd5ce 100%)', color: '#222' }}
          >
            <div className="card-body">
              <h6 className="fw-bold">🏖️ Upcoming Holidays</h6>
              <ul className="mb-0">
                <li>Independence Day – Aug 15</li>
                <li>Ganesh Chaturthi – Sep 7</li>
              </ul>
            </div>
          </div>
        </div>

        {/* HR Contact */}
        <div className="col-12">
          <div
            className="card shadow border-0"
            style={{ background: 'linear-gradient(135deg, #b5ead7 0%, #c7ceea 100%)', color: '#222' }}
          >
            <div className="card-body">
              <h6 className="fw-bold">👩‍💼 HR Contact</h6>
              <p>Name: Varalakshmi</p>
              <p>Email: hr@devospedia.online</p>
              <p>Phone: +91-9876543210</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
