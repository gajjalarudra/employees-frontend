// src/components/employee/Attendance.js
import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Attendance = ({ attendanceLogs, clockedIn, loading, fetchAttendance, updateAttendanceState }) => {
  const { auth } = useContext(AuthContext);

  const handleClockIn = async () => {
    try {
      await axios.post(
        'https://employeesapi.devopspedia.online/api/clock-in',
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert('Clock-in successful');
      const res = await axios.get('https://employeesapi.devopspedia.online/api/attendance', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const logs = res.data;
      const todayStr = new Date().toISOString().slice(0, 10);
      const todayRecord = logs.find(r => r.date === todayStr);
      updateAttendanceState(logs, todayRecord && !todayRecord.clock_out);
    } catch (err) {
      alert(err.response?.data?.error || 'Clock-in failed');
    }
  };

  const handleClockOut = async () => {
    try {
      await axios.post(
        'https://employeesapi.devopspedia.online/api/clock-out',
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      alert('Clock-out successful');
      const res = await axios.get('https://employeesapi.devopspedia.online/api/attendance', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const logs = res.data;
      const todayStr = new Date().toISOString().slice(0, 10);
      const todayRecord = logs.find(r => r.date === todayStr);
      updateAttendanceState(logs, todayRecord && !todayRecord.clock_out);
    } catch (err) {
      alert(err.response?.data?.error || 'Clock-out failed');
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold" style={{ color: '#3b3b98' }}>🕒 Attendance Logs</h3>

      {loading && <p>Loading attendance...</p>}

      <div className="row g-4">
        {/* Attendance Actions and History */}
        <div className="col-md-7">
          <div className="card p-4 shadow-lg" style={{ borderRadius: '18px', backgroundColor: '#f4f7fb' }}>
            <h5 className="mb-3 fw-semibold">Today's Action</h5>
            {!clockedIn ? (
              <button className="btn btn-success me-3" onClick={handleClockIn} disabled={loading}>
                Clock In
              </button>
            ) : (
              <button className="btn btn-danger me-3" onClick={handleClockOut} disabled={loading}>
                Clock Out
              </button>
            )}

            <hr className="my-4" />

            <h5 className="mb-3 fw-semibold">📋 History</h5>
            <div style={{ overflowX: 'auto' }}>
              <table className="table table-striped table-bordered text-center mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.length === 0 ? (
                    <tr>
                      <td colSpan="4">No records found</td>
                    </tr>
                  ) : (
                    attendanceLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{log.date}</td>
                        <td>{log.clock_in ? new Date(log.clock_in).toLocaleTimeString() : '-'}</td>
                        <td>{log.clock_out ? new Date(log.clock_out).toLocaleTimeString() : '-'}</td>
                        <td>{log.clockin_approved ? 'Yes' : 'Pending'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Motivational & Note Section */}
        <div
          className="col-md-5 d-flex flex-column justify-content-center shadow-lg p-4"
          style={{
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
            color: '#2c3e50',
            minHeight: '300px',
          }}
        >
          <h4 className="fw-bold mb-3">💡 Attendance Tips & Motivation</h4>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            Consistent attendance shows dedication and reliability — traits that make you stand out.
            Remember to take short breaks to stay refreshed and productive throughout the day.
          </p>
          <p style={{ fontSize: '1rem', fontStyle: 'italic', marginTop: 'auto' }}>
            🌟 "Success is the sum of small efforts, repeated day in and day out." – Robert Collier
          </p>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
