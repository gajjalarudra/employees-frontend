// src/components/EmployeeDashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './employee/Home';
import Attendance from './employee/Attendance';
import ApplyLeave from './employee/ApplyLeave';
import MyFinance from './employee/MyFinance';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const EmployeeDashboard = () => {
  const { logout, auth } = useContext(AuthContext);

  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Fetch attendance records from backend
  const fetchAttendance = async () => {
    if (!auth?.token) return;
    setLoadingAttendance(true);
    try {
      const res = await axios.get('https://employeesapi.devopspedia.online/api/attendance', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setAttendanceLogs(res.data);
      const todayStr = new Date().toISOString().slice(0, 10);
      const todayRecord = res.data.find(r => r.date === todayStr);
      setClockedIn(todayRecord && !todayRecord.clock_out);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
      setAttendanceLogs([]);
      setClockedIn(false);
    }
    setLoadingAttendance(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, [auth]);

  // Handler to update attendance state after clock-in/out
  const updateAttendanceState = (logs, isClockedIn) => {
    setAttendanceLogs(logs);
    setClockedIn(isClockedIn);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar onLogout={logout} />
      <main style={{ marginLeft: '250px', flex: 1, padding: '20px', background: '#f9f9ff' }}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                attendanceLogs={attendanceLogs}
                clockedIn={clockedIn}
                loading={loadingAttendance}
                fetchAttendance={fetchAttendance}
                updateAttendanceState={updateAttendanceState}
              />
            }
          />
          <Route
            path="attendance"
            element={
              <Attendance
                attendanceLogs={attendanceLogs}
                clockedIn={clockedIn}
                loading={loadingAttendance}
                fetchAttendance={fetchAttendance}
                updateAttendanceState={updateAttendanceState}
              />
            }
          />
          <Route path="apply-leave" element={<ApplyLeave />} />
          <Route path="my-finance" element={<MyFinance />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
