import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/api';
import { AlertIcon, VehicleIcon } from '../../components/Icons';

const MaintenanceManagement = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [runningPredictive, setRunningPredictive] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [filterStatus]);

  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:8083/api/admin/maintenance');
      const data = await response.json();

      if (filterStatus === 'ALL') {
        setRecords(data);
      } else {
        setRecords(data.filter(r => r.status === filterStatus));
      }
    } catch (error) {
      console.error('Error fetching maintenance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunPredictiveMaintenance = async () => {
    if (!window.confirm('Run predictive maintenance scan for all vehicles?')) return;

    setRunningPredictive(true);
    try {
      const response = await fetch('http://localhost:8083/api/admin/maintenance/predictive/run', {
        method: 'POST'
      });
      const result = await response.json();

      alert(`✅ Scan complete!\n${result.totalVehiclesScanned} vehicles scanned\n${result.maintenanceRecordsCreated} new records created`);
      fetchRecords();
    } catch (error) {
      alert('Error running predictive maintenance');
    } finally {
      setRunningPredictive(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'CRITICAL': 'text-red-500',
      'HIGH': 'text-orange-500',
      'MEDIUM': 'text-yellow-500',
      'LOW': 'text-green-500'
    };
    return colors[priority] || 'text-gray-500';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'PENDING': 'status-maintenance',
      'IN_PROGRESS': 'status-in-use',
      'COMPLETED': 'status-available',
      'CANCELLED': 'status-critical'
    };
    return badges[status] || 'status-maintenance';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-cyan"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Maintenance Management</h2>
          <p className="text-white/50">Monitor and manage fleet maintenance</p>
        </div>
        <button
          onClick={handleRunPredictiveMaintenance}
          disabled={runningPredictive}
          className="btn-primary flex items-center gap-2"
        >
          {runningPredictive ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Scanning...
            </>
          ) : (
            <>
              <AlertIcon size="sm" />
              Run Predictive Scan
            </>
          )}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filterStatus === status
                ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white'
                : 'bg-dark-700/40 text-white/60 hover:text-white'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <p className="text-white/60 text-sm mb-1">Total Records</p>
          <p className="text-3xl font-bold text-accent-cyan">{records.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-white/60 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold text-yellow-400">
            {records.filter(r => r.status === 'PENDING').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-white/60 text-sm mb-1">In Progress</p>
          <p className="text-3xl font-bold text-orange-400">
            {records.filter(r => r.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="glass-card p-4">
          <p className="text-white/60 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-400">
            {records.filter(r => r.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Maintenance Records */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Maintenance Records</h3>
        <div className="space-y-3">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <AlertIcon size="xl" className="text-white/20 mx-auto mb-4" />
              <p className="text-white/50 text-lg">No maintenance records found</p>
            </div>
          ) : (
            records.map(record => (
              <div key={record.id} className="glass-card-hover p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <VehicleIcon size="md" className={getPriorityColor(record.priority)} />
                    <div>
                      <h4 className="font-bold text-white mb-1">
                        {record.vehicle?.vehicleNumber} - {record.issueType}
                      </h4>
                      <p className="text-sm text-white/60">{record.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`status-badge ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                    <p className="text-xs text-white/50 mt-1">
                      Priority: <span className={getPriorityColor(record.priority)}>{record.priority}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white/50">Estimated Cost</p>
                    <p className="text-white font-semibold">${record.estimatedCost?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Scheduled Date</p>
                    <p className="text-white font-semibold">
                      {record.scheduledDate ? new Date(record.scheduledDate).toLocaleDateString() : 'Not scheduled'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50">Mechanic</p>
                    <p className="text-white font-semibold">{record.mechanicAssigned || 'Not assigned'}</p>
                  </div>
                </div>

                {record.isPredictive && (
                  <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2">
                    <AlertIcon size="sm" className="text-blue-400" />
                    <p className="text-xs text-blue-400">
                      AI Predicted • Risk Score: {record.riskScore} • {record.predictedDaysToFailure} days to failure
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;