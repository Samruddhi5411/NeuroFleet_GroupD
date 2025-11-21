import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChartIcon, RevenueIcon, TrendingUpIcon } from '../../components/Icons';

const Reports = () => {
  const [fleetReport, setFleetReport] = useState(null);
  const [financialReport, setFinancialReport] = useState(null);
  const [performanceReport, setPerformanceReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateFleetReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8083/api/manager/reports/fleet');
      setFleetReport(response.data);
      alert('✅ Fleet report generated!');
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const generateFinancialReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8083/api/manager/reports/financial');
      setFinancialReport(response.data);
      alert('✅ Financial report generated!');
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const generatePerformanceReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8083/api/manager/reports/performance');
      setPerformanceReport(response.data);
      alert('✅ Performance report generated!');
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (type) => {
    try {
      const response = await axios.get(`http://localhost:8083/api/manager/reports/${type}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      alert('✅ PDF downloaded!');
    } catch (error) {
      alert('❌ Error downloading PDF: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ChartIcon size="lg" className="text-accent-cyan" />
          Reports & Analytics
        </h2>
        <p className="text-white/50">Generate and view comprehensive reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Fleet Reports</p>
              <p className="text-3xl font-bold text-accent-cyan">
                {fleetReport ? fleetReport.totalVehicles : '--'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
              <ChartIcon size="md" className="text-white" />
            </div>
          </div>
          <button
            onClick={generateFleetReport}
            disabled={loading}
            className="w-full btn-primary text-sm py-2 mb-2"
          >
            {loading ? 'Generating...' : 'Generate New'}
          </button>
          {fleetReport && (
            <button
              onClick={() => downloadPDF('fleet')}
              className="w-full btn-secondary text-sm py-2"
            >
              Download PDF
            </button>
          )}
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Financial Reports</p>
              <p className="text-3xl font-bold text-accent-green">
                {financialReport ? `₹${financialReport.totalRevenue.toFixed(0)}` : '--'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <RevenueIcon size="md" className="text-white" />
            </div>
          </div>
          <button
            onClick={generateFinancialReport}
            disabled={loading}
            className="w-full btn-primary text-sm py-2 mb-2"
          >
            {loading ? 'Generating...' : 'Generate New'}
          </button>
          {financialReport && (
            <button
              onClick={() => downloadPDF('financial')}
              className="w-full btn-secondary text-sm py-2"
            >
              Download PDF
            </button>
          )}
        </div>

        <div className="glass-card p-6 group hover:scale-105 transition-transform">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm font-semibold mb-1">Performance Reports</p>
              <p className="text-3xl font-bold text-accent-purple">
                {performanceReport ? performanceReport.totalDrivers : '--'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center">
              <TrendingUpIcon size="md" className="text-white" />
            </div>
          </div>
          <button
            onClick={generatePerformanceReport}
            disabled={loading}
            className="w-full btn-primary text-sm py-2 mb-2"
          >
            {loading ? 'Generating...' : 'Generate New'}
          </button>
          {performanceReport && (
            <button
              onClick={() => downloadPDF('performance')}
              className="w-full btn-secondary text-sm py-2"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;