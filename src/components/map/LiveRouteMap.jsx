import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { useTransit } from '../../context/TransitContext';
import { Bus, AlertTriangle, Users, ShieldAlert, PhoneCall } from 'lucide-react';

// Custom DivIcons with pure HTML/Tailwind to prevent Leaflet asset 404 bugs
const createBusIcon = (bus) => {
  let bgColor = 'bg-emerald-600 border-white';
  let pulseEffect = '';
  let iconText = '🚌';

  if (bus.status === 'BROKEN_DOWN') {
    bgColor = 'bg-rose-600 border-rose-200 animate-bounce';
    pulseEffect = 'ring-4 ring-rose-400 ring-opacity-75';
    iconText = '⚠️';
  } else if (bus.status === 'EMERGENCY_REROUTED') {
    bgColor = 'bg-indigo-600 border-indigo-200 animate-pulse';
    pulseEffect = 'ring-4 ring-indigo-400 ring-opacity-75';
    iconText = '🚑';
  } else if (bus.currentPassengers >= bus.capacity) {
    bgColor = 'bg-amber-600 border-white';
    iconText = '👥';
  }

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="w-10 h-10 rounded-full ${bgColor} ${pulseEffect} border-2 shadow-lg flex items-center justify-center text-white font-bold text-sm">
        <span>${iconText}</span>
      </div>
      <div class="absolute -bottom-5 whitespace-nowrap bg-slate-900/90 text-white text-[10px] px-1.5 py-0.5 rounded shadow font-semibold">
        ${bus.regNumber.split('-')[2] || bus.id}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bus-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const createStopIcon = (stop, demandBoost = 0) => {
  const totalDemand = stop.studentDemand + demandBoost;
  let badgeColor = 'bg-slate-700';
  if (totalDemand > 60) badgeColor = 'bg-rose-600 animate-pulse';
  else if (totalDemand > 35) badgeColor = 'bg-amber-600';

  const html = `
    <div class="relative flex flex-col items-center">
      <div class="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md"></div>
      <div class="absolute -top-4 whitespace-nowrap ${badgeColor} text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow">
        ${totalDemand} queued
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-stop-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

const createFloodIcon = () => {
  const html = `
    <div class="relative flex flex-col items-center animate-bounce">
      <div class="w-10 h-10 rounded-full bg-rose-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-lg">
        🌊
      </div>
      <div class="absolute -top-5 whitespace-nowrap bg-rose-700 text-white text-[10px] font-black px-2 py-0.5 rounded shadow border border-rose-400">
        ROAD BLOCKED: FLOOD
      </div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-flood-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

export default function LiveRouteMap() {
  const {
    buses,
    routes,
    selectedRouteId,
    setSelectedRouteId,
    stopDemandSignals,
    reportWaitingStudent,
    isExamCrisisActive,
    floodBlockedSegment
  } = useTransit();

  // Center around Sahyadri / Dakshina Kannada rural belt
  const centerPosition = [12.8252, 75.1000];

  // Filter routes based on selection
  const displayedRoutes = useMemo(() => {
    if (selectedRouteId === 'ALL') return routes;
    return routes.filter(r => r.id === selectedRouteId);
  }, [routes, selectedRouteId]);

  // Filter buses based on selection
  const displayedBuses = useMemo(() => {
    if (selectedRouteId === 'ALL') return buses;
    return buses.filter(b => b.routeId === selectedRouteId || b.routeId === 'STANDBY');
  }, [buses, selectedRouteId]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[560px]">
      {/* Map Control Bar */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base">Live Rural Transit Radar</h3>
            <p className="text-xs text-slate-500">Real-time bus tracking, stop crowd levels & breakdown alerts</p>
          </div>
        </div>

        {/* Route Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Filter Corridor:</label>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="text-xs md:text-sm bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          >
            <option value="ALL">All Active Rural Corridors ({routes.length})</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Legend */}
      <div className="px-4 py-2 bg-slate-100/80 border-b border-slate-200 text-xs flex flex-wrap items-center gap-4 text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span> Normal Route Bus
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-amber-600 inline-block"></span> Overcrowded (&gt;90%)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block"></span> Breakdown / Stalled
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span> Emergency Relief Shuttle
        </span>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="flex-1 w-full relative">
        <MapContainer
          center={centerPosition}
          zoom={11}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Route Polylines and Stop Markers */}
          {displayedRoutes.map(route => {
            const polylinePositions = route.stops.map(s => [s.lat, s.lng]);
            return (
              <React.Fragment key={route.id}>
                {/* Route Path Line */}
                <Polyline
                  positions={polylinePositions}
                  pathOptions={{
                    color: route.color || '#059669',
                    weight: 5,
                    opacity: 0.75,
                    dashArray: '8, 8'
                  }}
                />

                {/* Stop Markers */}
                {route.stops.map(stop => {
                  const studentBoost = stopDemandSignals[stop.id] || 0;
                  return (
                    <Marker
                      key={`${route.id}-${stop.id}`}
                      position={[stop.lat, stop.lng]}
                      icon={createStopIcon(stop, studentBoost)}
                    >
                      <Popup>
                        <div className="p-1 space-y-2 text-slate-800 min-w-[200px]">
                          <div className="border-b border-slate-100 pb-1">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{route.name}</span>
                            <h4 className="font-bold text-sm text-slate-900">{stop.name}</h4>
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Student Queue:</span>
                              <span className="font-bold text-rose-600">{stop.studentDemand + studentBoost} students</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Est. Wait Time:</span>
                              <span className="font-semibold">{stop.waitTimeMin} mins</span>
                            </div>
                          </div>

                          <button
                            onClick={() => reportWaitingStudent(stop.id)}
                            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition"
                          >
                            <Users className="w-3.5 h-3.5" />
                            <span>Signal "I am waiting here" (+1)</span>
                          </button>
                        </div>
                      </Popup>
                      <Tooltip direction="top" offset={[0, -10]}>
                        <span className="text-xs font-semibold">{stop.name}</span>
                      </Tooltip>
                    </Marker>
                  );
                })}
              </React.Fragment>
            );
          })}

          {/* Bus Markers */}
          {displayedBuses.map(bus => (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={createBusIcon(bus)}
            >
              <Popup>
                <div className="p-1 space-y-2 text-slate-800 min-w-[220px]">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <span className="font-mono text-xs font-bold text-slate-900">{bus.regNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      bus.status === 'BROKEN_DOWN'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : bus.status === 'EMERGENCY_REROUTED'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {bus.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{bus.name}</h4>
                    <p className="text-[11px] text-slate-500">{bus.routeName}</p>
                  </div>

                  <div className="bg-slate-50 p-2 rounded-lg space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Current Location:</span>
                      <span className="font-semibold text-slate-700">{bus.currentStop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Heading Towards:</span>
                      <span className="font-semibold text-slate-700">{bus.nextStop}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Occupancy:</span>
                      <span className={`font-bold ${bus.currentPassengers >= bus.capacity ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {bus.currentPassengers} / {bus.capacity} seats ({Math.round((bus.currentPassengers / bus.capacity) * 100)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Speed / Fuel:</span>
                      <span className="font-medium text-slate-700">{bus.speedKmH} km/h • {bus.fuelLevelPercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Driver: {bus.driverName}</span>
                    <a
                      href={`tel:${bus.driverPhone}`}
                      className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                    >
                      <PhoneCall className="w-3 h-3" /> Call
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Active Flood Blockage Marker during Exam Day Crisis */}
          {isExamCrisisActive && floodBlockedSegment && (
            <Marker
              position={[floodBlockedSegment.lat, floodBlockedSegment.lng]}
              icon={createFloodIcon()}
            >
              <Popup>
                <div className="p-1 space-y-1.5 text-xs min-w-[240px]">
                  <div className="flex items-center gap-1 text-rose-700 font-extrabold border-b border-rose-100 pb-1">
                    <span>🌊</span>
                    <span>ROAD BLOCKED: RIVER FLOODING</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{floodBlockedSegment.roadName}</h4>
                    <p className="text-[11px] text-slate-600">Between {floodBlockedSegment.betweenStopA.name} and {floodBlockedSegment.betweenStopB.name}</p>
                  </div>
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-1.5 rounded-lg text-[11px]">
                    <strong>Status:</strong> {floodBlockedSegment.hazardType}
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-1.5 rounded-lg text-[11px]">
                    <strong>Emergency Detour:</strong> {floodBlockedSegment.detourRouteName} (+18 mins delay)
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
