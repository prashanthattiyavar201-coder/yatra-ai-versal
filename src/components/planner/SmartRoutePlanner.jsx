import React, { useState, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { findOptimalRoute } from '../../services/intelligenceEngine';
import {
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Users,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Bus,
  Layers
} from 'lucide-react';

export default function SmartRoutePlanner({ onRouteSelected }) {
  const {
    routes,
    buses,
    stopSignals,
    setSelectedRouteId,
    isExamCrisisActive,
    floodBlockedSegment
  } = useTransit();

  // Extract all unique stops across all rural routes
  const availableStops = useMemo(() => {
    const map = new Map();
    routes.forEach(r => {
      r.stops.forEach(s => {
        if (!map.has(s.id)) {
          map.set(s.id, { id: s.id, name: s.name });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [routes]);

  // Default origin: Mani Junction (ST-05), Destination: Sahyadri College Campus Gate (ST-07)
  const [originStopId, setOriginStopId] = useState('ST-05');
  const [destinationStopId, setDestinationStopId] = useState('ST-07');

  // Compute recommendation dynamically using real JavaScript algorithm
  const optimizationResult = useMemo(() => {
    return findOptimalRoute({
      originStopId,
      destinationStopId,
      routes,
      buses,
      stopSignals,
      isCrisisActive: isExamCrisisActive,
      blockedSegment: floodBlockedSegment
    });
  }, [originStopId, destinationStopId, routes, buses, stopSignals, isExamCrisisActive, floodBlockedSegment]);

  const handleApplyRoute = (routeId) => {
    setSelectedRouteId(routeId);
    if (onRouteSelected) onRouteSelected(routeId);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-sm">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-base md:text-lg">
                Smart Route Optimization Engine
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Multi-Route Solver
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluates travel time, bus capacities, student demand, punctuality, and intermediate village stops.
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
          {routes.length} Corridors • {availableStops.length} Stops Indexed
        </span>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Starting Village / Bus Stop ({availableStops.length} Available):
          </label>
          <select
            value={originStopId}
            onChange={(e) => setOriginStopId(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs md:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
          >
            {availableStops.map(stop => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            Destination College / Major Hub:
          </label>
          <select
            value={destinationStopId}
            onChange={(e) => setDestinationStopId(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs md:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-sm"
          >
            {availableStops.map(stop => (
              <option key={stop.id} value={stop.id}>
                {stop.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Optimization Results */}
      {optimizationResult && !optimizationResult.success && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs md:text-sm text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">No Direct Scheduled Bus Between These Two Specific Stops</p>
            <p className="text-xs text-amber-800 mt-1">{optimizationResult.message}</p>
          </div>
        </div>
      )}

      {optimizationResult && optimizationResult.success && (
        <div className="space-y-6">
          {/* Winner Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 shadow-sm space-y-4">
            {/* Active Flood Detour Alert (if applicable) */}
            {optimizationResult.bestOption.isBlockedByFlood && (
              <div className="bg-amber-100 border border-amber-300 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">⚠️ Road Blockage Detected – Emergency Alternative Detour Active</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    {optimizationResult.bestOption.detourAlternative?.notice || 'Direct road segment flooded. Rerouted via safe bypass corridor.'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Top Recommended Option
                </span>
                <span className="font-mono text-xs font-bold bg-white text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                  {optimizationResult.bestOption.route.code}
                </span>
                <span className="text-[11px] font-semibold text-emerald-800">
                  {optimizationResult.bestOption.route.type}
                </span>
              </div>

              <button
                onClick={() => handleApplyRoute(optimizationResult.bestOption.route.id)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <span>Focus on Live Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-base md:text-lg font-bold text-slate-900">
                  {optimizationResult.bestOption.route.name}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  <span className="font-medium">Direct Segment:</span> {optimizationResult.bestOption.originStop.name} ➔ {optimizationResult.bestOption.destStop.name} ({optimizationResult.bestOption.stopsCount} stops traversed)
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs text-center min-w-[85px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Travel Time</span>
                  <span className="text-base font-black text-emerald-800">
                    ~{optimizationResult.bestOption.segmentTravelTimeMin} mins
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs text-center min-w-[85px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Distance</span>
                  <span className="text-base font-black text-slate-800">
                    {optimizationResult.bestOption.segmentDistanceKm} km
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs text-center min-w-[85px]">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Free Seats</span>
                  <span className="text-base font-black text-emerald-700">
                    {optimizationResult.bestOption.availableSeats} / {optimizationResult.bestOption.totalCapacity}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Explanations for Winner */}
            <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-2xs space-y-2">
              <h5 className="font-bold text-xs text-emerald-950 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Algorithmic Decision Rationale
              </h5>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
                {optimizationResult.whySelected.map((reason, i) => (
                  <li key={i} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] font-medium text-slate-600 gap-2">
                <span>Students accommodated from queue: <strong className="text-emerald-700">{optimizationResult.studentsBenefited}</strong></span>
                <span>Remaining corridor seats: <strong className="text-slate-800">{optimizationResult.remainingCapacity} seats</strong></span>
              </div>
            </div>
          </div>

          {/* Alternative Routes Section (Up to 3 Options) */}
          {optimizationResult.alternativeOptions && optimizationResult.alternativeOptions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-slate-600" />
                  Available Alternative Corridors ({optimizationResult.alternativeOptions.length} Options Found)
                </h4>
                <span className="text-xs text-slate-500 font-medium">Ranked by algorithmic suitability</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {optimizationResult.alternativeOptions.map((alt, idx) => (
                  <div
                    key={alt.routeId || idx}
                    className="bg-white rounded-xl border border-slate-200 p-4 space-y-2.5 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {alt.routeCode}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Alternative #{idx + 1}
                        </span>
                      </div>

                      <h5 className="font-bold text-xs text-slate-900 leading-tight">
                        {alt.routeName}
                      </h5>

                      <div className="bg-slate-50 p-2 rounded-lg text-xs space-y-1 text-slate-600">
                        <div className="flex justify-between">
                          <span>Travel Time:</span>
                          <span className="font-bold text-slate-800">~{alt.segmentTravelTimeMin} mins</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span className="font-medium">{alt.segmentDistanceKm} km ({alt.stopsCount} stops)</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Free Seats:</span>
                          <span className={`font-bold ${alt.availableSeats <= 2 ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {alt.availableSeats} / {alt.totalCapacity} ({alt.occupancyRate}%)
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 italic bg-amber-50/50 p-1.5 rounded border border-amber-100">
                        <strong>Why ranked lower:</strong> {alt.reason}
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyRoute(alt.routeId)}
                      className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 px-2 rounded-lg text-xs transition"
                    >
                      Select This Route
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
