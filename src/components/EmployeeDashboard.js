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
  const [leaves, setLeaves] = useState([]); // New: store leaves with rejection info
  const [clockedIn, setClockedIn] = useState(false);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [loadingLeaves, setLoadingLeaves] = useState(false); // Loading state for leaves

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

  // Fetch leaves from backend
  const fetchLeaves = async () => {
    if (!auth?.token) return;
    setLoadingLeaves(true);
    try {
      const res = await axios.get('https://employeesapi.devopspedia.online/api/leaves', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setLeaves(res.data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
      setLeaves([]);
    }
    setLoadingLeaves(false);
  };

  // Fetch both attendance and leaves when auth changes
  useEffect(() => {
    fetchAttendance();
    fetchLeaves();
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
                leaves={leaves}               // pass leaves here too, you can show leave summary in Home if you want
                clockedIn={clockedIn}
                loadingAttendance={loadingAttendance}
                loadingLeaves={loadingLeaves}
                fetchAttendance={fetchAttendance}
                fetchLeaves={fetchLeaves}
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
          <Route
            path="apply-leave"
            element={
              <ApplyLeave
                leaves={leaves}             // pass leaves to ApplyLeave so you can display leave statuses and rejection reasons
                loadingLeaves={loadingLeaves}
                fetchLeaves={fetchLeaves}
              />
            }
          />
          <Route path="my-finance" element={<MyFinance />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
