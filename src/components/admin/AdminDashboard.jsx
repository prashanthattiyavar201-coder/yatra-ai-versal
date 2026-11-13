import React, { useState, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { computeFleetAllocation, computeDemandAnalytics } from '../../services/intelligenceEngine';
import {
  Bus,
  AlertTriangle,
  RotateCcw,
  Zap,
  BarChart3,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Filter,
  Layers,
  FileText,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import LiveRouteMap from '../map/LiveRouteMap';
import EmergencyRecoveryModal from './EmergencyRecoveryModal';
import SmartRoutePlanner from '../planner/SmartRoutePlanner';
import ExamCrisisDashboard from './ExamCrisisDashboard';

export default function AdminDashboard() {
  const {
    buses,
    routes,
    alerts,
    hourlyDemand,
    highStressVillages,
    stopDemandSignals,
    emergencyScenarios,
    activeScenarioId,
    triggerScenario,
    simulateBreakdown,
    resolveBreakdown,
    dispatchEmergencyBackup,
    reallocateBus,
    resetDemoData,
    isExamCrisisActive,
    activateExamCrisis,
    deactivateExamCrisis
  } = useTransit();

  const [simulationCandidate, setSimulationCandidate] = useState('BUS-04');
  const [allocationSourceBus, setAllocationSourceBus] = useState('BUS-13'); // Low occupancy feeder
  const [allocationTargetRoute, setAllocationTargetRoute] = useState('R-101');
  const [actionNotice, setActionNotice] = useState('');
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('operations'); // 'operations', 'allocation', 'analytics', 'fleet', 'planner'

  // Filters for fleet & routes
  const [busTypeFilter, setBusTypeFilter] = useState('ALL');
  const [busStatusFilter, setBusStatusFilter] = useState('ALL');
  const [routeTypeFilter, setRouteTypeFilter] = useState('ALL');

  const brokenBus = buses.find(b => b.status === 'BROKEN_DOWN');
  const reserveBus = buses.find(b => b.id === 'BUS-RESERVE-01');

  // Compute live algorithmic fleet allocation
  const fleetAllocation = useMemo(() => {
    return computeFleetAllocation({ routes, buses, stopSignals: stopDemandSignals });
  }, [routes, buses, stopDemandSignals]);

  // Compute live demand analytics
  const demandAnalytics = useMemo(() => {
    return computeDemandAnalytics({
      routes,
      buses,
      stopSignals: stopDemandSignals,
      highStressVillages
    });
  }, [routes, buses, stopDemandSignals, highStressVillages]);

  // Filtered buses list
  const filteredBuses = useMemo(() => {
    return buses.filter(b => {
      const matchType = busTypeFilter === 'ALL' || b.type === busTypeFilter;
      const matchStatus = busStatusFilter === 'ALL' || b.status === busStatusFilter;
      return matchType && matchStatus;
    });
  }, [buses, busTypeFilter, busStatusFilter]);

  // Filtered routes list
  const filteredRoutes = useMemo(() => {
    return fleetAllocation.routeAllocations.filter(r => {
      return routeTypeFilter === 'ALL' || r.routeType === routeTypeFilter;
    });
  }, [fleetAllocation, routeTypeFilter]);

  const handleTriggerBreakdown = () => {
    simulateBreakdown(simulationCandidate);
    setActionNotice(`🚨 Breakdown simulated on ${simulationCandidate}. Alert broadcasted to all students.`);
    setShowRecoveryModal(true);
    setTimeout(() => setActionNotice(''), 6000);
  };

  const handleResolveBreakdown = () => {
    if (brokenBus) {
      resolveBreakdown(brokenBus.id);
      setActionNotice(`🛠️ Bus ${brokenBus.regNumber} repaired and restored to regular service.`);
      setTimeout(() => setActionNotice(''), 6000);
    }
  };

  const handleDispatchRelief = () => {
    dispatchEmergencyBackup(brokenBus?.id || 'BUS-04', 'BUS-RESERVE-01');
    setActionNotice('✅ Standby Reserve Bus (KA-19-F-9999) dispatched for emergency student evacuation.');
    setTimeout(() => setActionNotice(''), 6000);
  };

  const handleReallocate = () => {
    reallocateBus(allocationSourceBus, allocationTargetRoute);
    setActionNotice(`🔄 Bus ${allocationSourceBus} reallocated to Route ${allocationTargetRoute} for crowd relief.`);
    setTimeout(() => setActionNotice(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice('')} className="text-slate-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Advanced Fleet KPI Overview (TASK 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Fleet</span>
          <div className="text-xl font-black text-slate-900 mt-1">{demandAnalytics.fleetSummary.totalBuses} Units</div>
          <span className="text-[11px] text-emerald-700 font-semibold">{demandAnalytics.fleetSummary.activeBuses} Active on Road</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Standby Reserves</span>
          <div className="text-xl font-black text-slate-900 mt-1">{demandAnalytics.fleetSummary.standbyBuses} Ready</div>
          <span className="text-[11px] text-blue-600 font-semibold">3 Strategic Bays</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Fleet Health</span>
          <div className={`text-xl font-black mt-1 ${brokenBus ? 'text-rose-600 animate-pulse' : 'text-emerald-700'}`}>
            {brokenBus ? '1 Breakdown' : 'All Clear'}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            {brokenBus ? 'SOS Protocol Active' : 'Zero Active Faults'}
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Network Demand</span>
          <div className="text-xl font-black text-slate-900 mt-1">{fleetAllocation.totalNetworkDemand} Students</div>
          <span className="text-[11px] text-slate-500 font-medium">{demandAnalytics.totalRoutes} Corridors</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Available Seats</span>
          <div className="text-xl font-black text-emerald-700 mt-1">{demandAnalytics.seatInventory.totalAvailableSeats} Free</div>
          <span className="text-[11px] text-slate-500 font-medium">{demandAnalytics.seatInventory.occupancyPercent}% Fleet Load</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Extra Buses Needed</span>
          <div className="text-xl font-black text-purple-700 mt-1">+{demandAnalytics.recommendedAdditionalBuses} Shuttles</div>
          <span className="text-[11px] text-rose-600 font-semibold">{fleetAllocation.criticalRoutesCount} Critical Lines</span>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveAdminTab('exam_crisis')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition ${
            activeAdminTab === 'exam_crisis'
              ? 'bg-rose-900 text-white shadow-md ring-2 ring-rose-400'
              : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>Exam Day Crisis Mode</span>
          {isExamCrisisActive ? (
            <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase animate-pulse">
              Active
            </span>
          ) : (
            <span className="bg-rose-200 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
              Drill
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('operations')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeAdminTab === 'operations'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Incident Simulator & Radar</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('allocation')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeAdminTab === 'allocation'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Intelligent Bus Allocation</span>
          <span className="bg-emerald-400 text-emerald-950 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
            {routes.length} Corridors
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('fleet')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeAdminTab === 'fleet'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Fleet Directory ({buses.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeAdminTab === 'analytics'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Demand Analytics</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('planner')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeAdminTab === 'planner'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Route Solver</span>
        </button>
      </div>

      {/* PROMPTBATTLE SURPRISE HURDLE: EXAM DAY CRISIS DASHBOARD */}
      {(activeAdminTab === 'exam_crisis' || isExamCrisisActive) && (
        <div className="space-y-4 animate-fade-in">
          <ExamCrisisDashboard />
        </div>
      )}

      {/* VIEW 1: OPERATIONS & ADVANCED EMERGENCY SCENARIOS */}
      {activeAdminTab === 'operations' && !isExamCrisisActive && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Breakdown & Scenario Simulation Module */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base">Advanced Incident Simulator</h3>
                    <p className="text-xs text-slate-500">Test breakdowns, landslides, exam surges, and depot exhaustion</p>
                  </div>
                </div>
                {brokenBus && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    INCIDENT ACTIVE
                  </span>
                )}
              </div>

              {/* Scenario Quick Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Choose Emergency Test Scenario:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {emergencyScenarios?.map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        triggerScenario(sc.id);
                        setShowRecoveryModal(true);
                      }}
                      className="text-left bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 p-2.5 rounded-xl transition text-xs"
                    >
                      <span className="font-bold text-slate-900 block truncate">{sc.name}</span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{sc.description}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stalled Bus Action Bar */}
              {brokenBus && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950">Active Stalled Bus: {brokenBus.name} ({brokenBus.regNumber})</span>
                    <span className="text-[10px] font-mono text-rose-800">{brokenBus.currentStop}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowRecoveryModal(true)}
                      className="bg-rose-800 hover:bg-rose-900 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                    >
                      Open Recovery Decision Center
                    </button>
                    <button
                      onClick={handleResolveBreakdown}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition"
                    >
                      Resolve & Restore
                    </button>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>Multi-tier reallocation covers adjacent buses, carpools, and standby reserves.</span>
                <button
                  onClick={resetDemoData}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Everything
                </button>
              </div>
            </div>

            {/* Dynamic Bus Reallocation & Before/After Simulator (TASK 4) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm md:text-base">Dynamic Fleet Shift & Rebalance</h3>
                      <p className="text-xs text-slate-500">Reassign underutilized buses to bottleneck corridors</p>
                    </div>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ZERO OVERLOAD
                  </span>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 space-y-3 mt-3">
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    💡 <strong>Solver Recommendation:</strong> Minibus <strong>BUS-13</strong> (PACE Connect) is operating at only <strong>68% capacity</strong>, while Corridor <strong>R-101 (Sullia Express)</strong> has a <strong>35-student queue deficit</strong> at Mani.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Source Underutilized Bus:</label>
                      <select
                        value={allocationSourceBus}
                        onChange={(e) => setAllocationSourceBus(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {buses.filter(b => b.status === 'ACTIVE').map(b => (
                          <option key={b.id} value={b.id}>
                            {b.regNumber} ({b.name.slice(0, 18)}...) - {Math.round((b.currentPassengers/b.capacity)*100)}% load
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target High-Demand Route:</label>
                      <select
                        value={allocationTargetRoute}
                        onChange={(e) => setAllocationTargetRoute(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        {routes.map(r => (
                          <option key={r.id} value={r.id}>
                            {r.code} - {r.name.slice(0, 20)}...
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleReallocate}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Execute Reallocation Plan</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Safe passenger capacity limits are strictly enforced.</span>
                <button
                  onClick={() => setActiveAdminTab('allocation')}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  View Full Allocation Matrix ➔
                </button>
              </div>
            </div>
          </div>

          {/* Live Radar Map */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-700" /> Rural Corridor Radar (Live Admin Telemetry)
            </h3>
            <LiveRouteMap />
          </div>
        </div>
      )}

      {/* VIEW 2: ADVANCED BUS ALLOCATION MATRIX */}
      {activeAdminTab === 'allocation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">Intelligent Corridor Allocation Solver</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Capacity Enforced
                </span>
              </div>
              <p className="text-xs text-slate-500">
                12 rural lines analyzed. Student allocation is strictly capped by bus seat availability.
              </p>
            </div>

            {/* Corridor Type Filter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={routeTypeFilter}
                onChange={(e) => setRouteTypeFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
              >
                <option value="ALL">All Route Types ({routes.length})</option>
                <option value="Express Corridor">Express Corridors</option>
                <option value="Student Special">Student Specials</option>
                <option value="Feeder Route">Feeder Routes</option>
                <option value="Village-to-College">Village-to-College</option>
                <option value="Village-to-Village">Village-to-Village</option>
              </select>
            </div>
          </div>

          {/* Route Allocation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-3">Route / Corridor</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Active Units</th>
                  <th className="py-3 px-3">Student Demand</th>
                  <th className="py-3 px-3">Allocated Students</th>
                  <th className="py-3 px-3">Capacity & Free</th>
                  <th className="py-3 px-3">Shortage</th>
                  <th className="py-3 px-3">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoutes.map(ra => (
                  <tr key={ra.routeId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900 block">{ra.routeCode}</span>
                      <span className="text-slate-500 font-medium">{ra.routeName}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-[10px]">
                        {ra.routeType || 'Standard'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      {ra.activeBusesCount} Units
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {ra.totalStudentDemand}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {ra.allocatedStudents} / {ra.totalCapacity}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800">{ra.occupancyPercentage}%</span>
                        <span className="text-[10px] text-slate-400">({ra.availableSeats} free)</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {ra.unservicedStudents > 0 ? (
                        <span className="font-extrabold text-rose-600">+{ra.unservicedStudents} unserviced</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">0 (Serviced)</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full block w-fit mb-0.5 ${
                        ra.status === 'CRITICAL_SHORTAGE'
                          ? 'bg-rose-100 text-rose-800'
                          : ra.status === 'OVERCROWDED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {ra.status}
                      </span>
                      <p className="text-[10px] text-slate-500 max-w-xs truncate">{ra.recommendedAction}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: FLEET DIRECTORY & FILTERABLE INVENTORY (TASK 1 & 6) */}
      {activeAdminTab === 'fleet' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Rural Bus Fleet Inventory ({buses.length} Vehicles)</h3>
              <p className="text-xs text-slate-500">Government KSRTC, Student Specials, Rural Feeders, Express, and Standbys</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <select
                value={busTypeFilter}
                onChange={(e) => setBusTypeFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
              >
                <option value="ALL">All Vehicle Types</option>
                <option value="Government KSRTC Bus">Government KSRTC</option>
                <option value="Student Special Bus">Student Specials</option>
                <option value="Rural Feeder Minibus">Rural Feeders</option>
                <option value="Express Bus">Express Buses</option>
                <option value="Emergency Relief Bus">Standby Relief</option>
              </select>

              <select
                value={busStatusFilter}
                onChange={(e) => setBusStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="IDLE">IDLE / Standby</option>
                <option value="BROKEN_DOWN">BROKEN_DOWN</option>
                <option value="EMERGENCY_REROUTED">EMERGENCY_REROUTED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBuses.map(bus => (
              <div key={bus.id} className="border border-slate-200 rounded-xl p-3.5 space-y-2 hover:border-emerald-300 transition bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">{bus.regNumber}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    bus.status === 'BROKEN_DOWN'
                      ? 'bg-rose-100 text-rose-800'
                      : bus.status === 'EMERGENCY_REROUTED'
                      ? 'bg-indigo-100 text-indigo-800'
                      : bus.status === 'IDLE'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {bus.status}
                  </span>
                </div>

                <h5 className="font-bold text-xs text-slate-900">{bus.name}</h5>
                <p className="text-[11px] text-slate-500">{bus.type} • {bus.routeName}</p>

                <div className="bg-white p-2 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Capacity / Load:</span>
                    <span className="font-bold text-slate-800">{bus.currentPassengers} / {bus.capacity} seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current Position:</span>
                    <span className="font-medium text-slate-700 truncate max-w-[150px]">{bus.currentStop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Driver & Contact:</span>
                    <span className="font-medium text-slate-700">{bus.driverName} ({bus.driverPhone.slice(0, 10)}...)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: DEMAND ANALYTICS */}
      {activeAdminTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Crowded Routes */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-rose-600" /> Most Crowded Rural Corridors
              </h4>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {demandAnalytics.mostCrowdedRoutes.slice(0, 8).map(item => (
                  <div key={item.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-900">{item.code} - {item.name}</span>
                      <span className={item.occupancyRate >= 88 ? 'text-rose-600' : 'text-emerald-700'}>
                        {item.occupancyRate}% load
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Cap: {item.totalCapacity} seats</span>
                      <span>Free: {item.availableSeats}</span>
                      {item.deficit > 0 && <span className="text-rose-600 font-bold">Deficit: +{item.deficit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highest Demand Village Stops */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" /> Highest-Demand Village Queues ({demandAnalytics.highestDemandVillages.length} Stops)
              </h4>

              <div className="divide-y divide-slate-100 text-xs max-h-[380px] overflow-y-auto pr-1">
                {demandAnalytics.highestDemandVillages.slice(0, 8).map(village => (
                  <div key={village.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-800">{village.name}</h5>
                      <p className="text-[11px] text-slate-500">Wait: ~{village.waitTimeMin} mins {village.pings > 0 && `• ${village.pings} live student pings`}</p>
                    </div>
                    <span className="font-black text-rose-600 text-base">{village.demand} waiting</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: ROUTE SOLVER */}
      {activeAdminTab === 'planner' && (
        <SmartRoutePlanner onRouteSelected={() => setActiveAdminTab('operations')} />
      )}

      {/* Emergency Recovery Decision Center Modal */}
      <EmergencyRecoveryModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        brokenBusId={brokenBus?.id || simulationCandidate}
      />
    </div>
  );
}
