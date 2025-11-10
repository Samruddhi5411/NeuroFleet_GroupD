import React, { useEffect, useRef, useState } from 'react';

const FleetHeatmap = ({ data }) => {
  const canvasRef = useRef(null);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#0A0F0D';
    ctx.fillRect(0, 0, width, height);

    drawGrid(ctx, width, height);

    drawCityOverlay(ctx, width, height);

    if (data.vehicleLocations) {
      data.vehicleLocations.forEach((point) => {
        const x = mapLongitudeToX(point.longitude, width);
        const y = mapLatitudeToY(point.latitude, height);
        drawVehicleMarker(ctx, x, y, point.intensity);
      });
    }

    if (data.tripDensity) {
      data.tripDensity.forEach((point) => {
        const x = mapLongitudeToX(point.longitude, width);
        const y = mapLatitudeToY(point.latitude, height);
        drawHeatmapPoint(ctx, x, y, point.intensity);
      });
    }

  }, [data]);

  const drawGrid = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 50;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCityOverlay = (ctx, width, height) => {
    ctx.strokeStyle = 'rgba(0, 255, 156, 0.3)';
    ctx.lineWidth = 2;

    const cityBlocks = [
      { x: width * 0.2, y: height * 0.2, w: width * 0.15, h: height * 0.1 },
      { x: width * 0.4, y: height * 0.3, w: width * 0.2, h: height * 0.15 },
      { x: width * 0.65, y: height * 0.25, w: width * 0.15, h: height * 0.12 },
      { x: width * 0.3, y: height * 0.5, w: width * 0.25, h: height * 0.2 },
      { x: width * 0.6, y: height * 0.55, w: width * 0.2, h: height * 0.15 },
    ];

    cityBlocks.forEach((block) => {
      ctx.strokeRect(block.x, block.y, block.w, block.h);
      ctx.fillStyle = 'rgba(6, 78, 59, 0.2)';
      ctx.fillRect(block.x, block.y, block.w, block.h);
    });

    const roads = [
      { x1: 0, y1: height * 0.3, x2: width, y2: height * 0.3 },
      { x1: 0, y1: height * 0.6, x2: width, y2: height * 0.6 },
      { x1: width * 0.35, y1: 0, x2: width * 0.35, y2: height },
      { x1: width * 0.7, y1: 0, x2: width * 0.7, y2: height },
    ];

    ctx.strokeStyle = 'rgba(0, 255, 156, 0.2)';
    ctx.lineWidth = 3;
    roads.forEach((road) => {
      ctx.beginPath();
      ctx.moveTo(road.x1, road.y1);
      ctx.lineTo(road.x2, road.y2);
      ctx.stroke();
    });
  };

  const drawHeatmapPoint = (ctx, x, y, intensity) => {
    const radius = 30;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);

    const alpha = intensity / 100;
    gradient.addColorStop(0, `rgba(255, 82, 82, ${alpha * 0.8})`);
    gradient.addColorStop(0.5, `rgba(255, 215, 64, ${alpha * 0.4})`);
    gradient.addColorStop(1, 'rgba(255, 215, 64, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawVehicleMarker = (ctx, x, y, intensity) => {
    ctx.save();

    const size = 8;
    ctx.shadowColor = 'rgba(0, 255, 156, 0.8)';
    ctx.shadowBlur = 10;

    if (intensity >= 80) {
      ctx.fillStyle = '#00FF9C';
    } else if (intensity >= 50) {
      ctx.fillStyle = '#FFD740';
    } else {
      ctx.fillStyle = '#FF5252';
    }

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  const mapLongitudeToX = (lng, width) => {
    const minLng = -74.1;
    const maxLng = -73.9;
    return ((lng - minLng) / (maxLng - minLng)) * width;
  };

  const mapLatitudeToY = (lat, height) => {
    const minLat = 40.65;
    const maxLat = 40.85;
    return height - ((lat - minLat) / (maxLat - minLat)) * height;
  };

  const handleCanvasClick = (event) => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let foundPoint = null;
    const clickRadius = 15;

    if (data.vehicleLocations) {
      for (const point of data.vehicleLocations) {
        const px = mapLongitudeToX(point.longitude, canvas.width);
        const py = mapLatitudeToY(point.latitude, canvas.height);
        const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);

        if (distance <= clickRadius) {
          foundPoint = point;
          break;
        }
      }
    }

    setSelectedPoint(foundPoint);
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent-green shadow-neon-cyan"></div>
            <span className="text-white/70">Active Vehicles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent-yellow"></div>
            <span className="text-white/70">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-accent-pink"></div>
            <span className="text-white/70">Maintenance</span>
          </div>
        </div>
        <div className="text-sm text-white/50">
          Total Vehicles: {data.vehicleLocations?.length || 0}
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-accent-cyan/30">
        <canvas
          ref={canvasRef}
          width={900}
          height={500}
          className="w-full cursor-crosshair"
          onClick={handleCanvasClick}
          style={{ display: 'block' }}
        />
      </div>

      {selectedPoint && (
        <div className="mt-4 glass-card p-4 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-white mb-1">
                {selectedPoint.vehicleId || 'Location'}
              </p>
              <p className="text-sm text-white/60">{selectedPoint.location}</p>
              <p className="text-xs text-accent-cyan mt-1">
                Lat: {selectedPoint.latitude.toFixed(4)}, Lng: {selectedPoint.longitude.toFixed(4)}
              </p>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="btn-icon"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {data.typeDistribution && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(data.typeDistribution).map(([type, count]) => (
            <div key={type} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-accent-cyan">{count}</p>
              <p className="text-sm text-white/60">{type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FleetHeatmap;