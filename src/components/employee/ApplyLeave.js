import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AuthContext } from '../../context/AuthContext';

const ApplyLeave = () => {
  const { auth } = useContext(AuthContext);
  const [totalCasualLeaves, setTotalCasualLeaves] = useState(12); // fallback values
  const [totalSickLeaves, setTotalSickLeaves] = useState(6);
  const [casualUsed, setCasualUsed] = useState(0);
  const [sickUsed, setSickUsed] = useState(0);

  const [leaveType, setLeaveType] = useState('casual');
  const [leaveDays, setLeaveDays] = useState(1);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const [leaveRequests, setLeaveRequests] = useState([]);

  // Fetch leaves from backend and calculate used leaves and leave requests
  useEffect(() => {
    const fetchLeaveUsage = async () => {
      try {
        const res = await axios.get('http://43.204.142.97:5000/api/leaves', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        // Count used casual and sick leaves (approved ones)
        const approvedLeaves = res.data.filter(l => l.approved);
        let casualCount = 0, sickCount = 0;
        approvedLeaves.forEach(l => {
          const start = new Date(l.start_date);
          const end = new Date(l.end_date);
          const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

          if (l.leave_type.toLowerCase().includes('casual')) casualCount += diffDays;
          else if (l.leave_type.toLowerCase().includes('sick')) sickCount += diffDays;
        });

        setCasualUsed(casualCount);
        setSickUsed(sickCount);

        // Set all leave requests to display in table
        setLeaveRequests(res.data);
      } catch (err) {
        console.error('Error fetching leave usage:', err);
      }
    };

    if (auth?.token) fetchLeaveUsage();
  }, [auth]);

  const handleApply = async () => {
    setMessage('');

    if (!reason.trim()) {
      setMessage('❌ Please provide a reason for leave.');
      return;
    }

    if (leaveType === 'casual' && leaveDays > totalCasualLeaves - casualUsed) {
      setMessage('❌ Not enough casual leaves left.');
      return;
    }
    if (leaveType === 'sick' && leaveDays > totalSickLeaves - sickUsed) {
      setMessage('❌ Not enough sick leaves left.');
      return;
    }

    try {
      const today = new Date();
      const start_date = today.toISOString().slice(0, 10);
      const endDateObj = new Date(today);
      endDateObj.setDate(endDateObj.getDate() + leaveDays - 1);
      const end_date = endDateObj.toISOString().slice(0, 10);

      await axios.post(
        'http://43.204.142.97:5000/api/leaves/apply',
        {
          leave_type: leaveType === 'casual' ? 'Casual Leave' : 'Sick Leave',
          start_date,
          end_date,
          reason: reason.trim(),
        },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setMessage(`✅ Leave applied for ${leaveDays} day(s) of ${leaveType} leave.`);
      setLeaveDays(1);
      setReason('');

      // Refresh usage and leave requests after apply
      const res = await axios.get('http://43.204.142.97:5000/api/leaves', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      const approvedLeaves = res.data.filter(l => l.approved);
      let casualCount = 0, sickCount = 0;
      approvedLeaves.forEach(l => {
        const start = new Date(l.start_date);
        const end = new Date(l.end_date);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (l.leave_type.toLowerCase().includes('casual')) casualCount += diffDays;
        else if (l.leave_type.toLowerCase().includes('sick')) sickCount += diffDays;
      });
      setCasualUsed(casualCount);
      setSickUsed(sickCount);

      setLeaveRequests(res.data);
    } catch (err) {
      setMessage('❌ Failed to apply leave. Please try again.');
      console.error(err);
    }
  };

  const casualPercent = ((totalCasualLeaves - casualUsed) / totalCasualLeaves) * 100;
  const sickPercent = ((totalSickLeaves - sickUsed) / totalSickLeaves) * 100;

  return (
    <div className="container py-4" style={{ maxWidth: '700px' }}>
      <h3 className="mb-4 fw-bold" style={{ color: '#2c3e50' }}>📝 Apply for Leave</h3>

      <div className="row g-4">
    {/* Leave Form */}
    <div className="col-12">
      <div className="card p-4 shadow-lg" style={{ borderRadius: '30px', background: '#fff' }}>
        {/* Change this to a subtitle or remove it */}
        <h5 className="fw-semibold mb-4" style={{ color: '#34495e' }}>Apply here</h5>
        
        {message && <div className="alert alert-info">{message}</div>}

            <div className="mb-3">
              <label htmlFor="leaveType" className="form-label fw-semibold">Leave Type</label>
              <select
                id="leaveType"
                className="form-select"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="leaveDays" className="form-label fw-semibold">Number of Days</label>
              <input
                type="number"
                id="leaveDays"
                className="form-control"
                min="1"
                max={leaveType === 'casual' ? totalCasualLeaves - casualUsed : totalSickLeaves - sickUsed}
                value={leaveDays}
                onChange={(e) =>
                  setLeaveDays(
                    Math.min(
                      Math.max(1, parseInt(e.target.value) || 1),
                      leaveType === 'casual' ? totalCasualLeaves - casualUsed : totalSickLeaves - sickUsed
                    )
                  )
                }
                style={{ width: '100%' }}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="reason" className="form-label fw-semibold">Reason for Leave</label>
              <textarea
                id="reason"
                className="form-control"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Write the reason for your leave"
                required
              />
            </div>

            <button
              className="btn btn-primary w-100 mt-3"
              onClick={handleApply}
              style={{ whiteSpace: 'nowrap' }}
            >
              Apply Leave
            </button>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="col-12">
          <div
            className="shadow-lg p-4 mt-4 d-flex flex-column justify-content-center"
            style={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
              color: '#2c3e50',
            }}
          >
            <h4 className="fw-bold mb-3">😌 Need a break?</h4>
            <p className="lead">
              Taking time off helps you recharge and perform your best. Plan your next vacation, staycation, or just relax.
            </p>
            <p className="mb-0" style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
              🌴 HR Tip: Your wellbeing matters!
            </p>
          </div>
        </div>
      </div>

      {/* Leave Balance Gauges */}
      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm text-center" style={{ backgroundColor: '#f0f8ff', borderRadius: '15px' }}>
            <h6 className="mb-2">🎯 Casual Leave</h6>
            <div style={{ width: 120, margin: '0 auto' }}>
              <CircularProgressbar
                value={casualPercent}
                text={`${totalCasualLeaves - casualUsed} left`}
                styles={buildStyles({
                  pathColor: '#1abc9c',
                  textColor: '#1abc9c',
                  trailColor: '#e0f7f1',
                  textSize: '14px',
                })}
              />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-4 shadow-sm text-center" style={{ backgroundColor: '#fef6f9', borderRadius: '15px' }}>
            <h6 className="mb-2">💊 Sick Leave</h6>
            <div style={{ width: 120, margin: '0 auto' }}>
              <CircularProgressbar
                value={sickPercent}
                text={`${totalSickLeaves - sickUsed} left`}
                styles={buildStyles({
                  pathColor: '#e74c3c',
                  textColor: '#e74c3c',
                  trailColor: '#fde9ea',
                  textSize: '14px',
                })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="mt-5">
        <h5 className="fw-bold mb-3" style={{ color: '#34495e' }}>🗂️ Your Leave Requests</h5>
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-striped table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Leave Type</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.length === 0 ? (
                <tr>
                  <td colSpan="5">No leave requests found.</td>
                </tr>
              ) : (
                leaveRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.start_date}</td>
                    <td>{req.end_date}</td>
                    <td>{req.leave_type}</td>
                    <td className="text-start" style={{ maxWidth: '300px', whiteSpace: 'normal', wordWrap: 'break-word' }}>
                      {req.reason}
                    </td>
                    <td>
                      {req.approved === true
                        ? <span className="badge bg-success">Approved</span>
                        : req.approved === false
                        ? <span className="badge bg-danger">Rejected</span>
                        : <span className="badge bg-warning text-dark">Pending</span>
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
