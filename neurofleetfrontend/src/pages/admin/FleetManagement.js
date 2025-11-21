import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/api';

const FleetManagement = () => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    const response = await vehicleService.getAll();
    setVehicles(response.data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Fleet Management</h2>
      {/* Vehicle list with CRUD operations */}
    </div>
  );
};

export default FleetManagement;