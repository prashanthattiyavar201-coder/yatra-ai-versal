import React, { useState, useMemo } from 'react';
import { useTransit } from '../../context/TransitContext';
import { computeExamCrisisSimulation } from '../../services/intelligenceEngine';
import {
  AlertTriangle,
  Zap,
  RotateCcw,
  CheckCircle2,
  Users,
  Bus,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Waves,
  TrendingUp,
  FileText,
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function ExamCrisisDashboard() {
  const {
    routes,
    buses,
    stopDemandSignals,
    rideShares,
    isExamCrisisActive,
    activateExamCrisis,
    deactivateExamCrisis
  } = useTransit();

  // Active sub-tab inside the Emergency Dashboard
  const [emergencyTab, setEmergencyTab] = useState('overview'); // 'overview', 'allocation', 'detours', 'manifest'

  // Compute live algorithmic crisis state
  const crisisData = useMemo(() => {
    return computeExamCrisisSimulation({
      routes,
      buses,
      stopSignals: stopDemandSignals,
      rideShares,
      isCrisisActive: isExamCrisisActive
    });
  }, [routes, buses, stopDemandSignals, rideShares, isExamCrisisActive]);

  return (
    <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-md overflow-hidden space-y-0 transition-all">
      {/* 1. Header Bar: Emergency Status & Primary Controls (TASK 1 & TASK 8) */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-amber-900 text-white p-4 md:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />
                PromptBattle Surprise Hurdle
              </span>
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Simulated Drill Scenario
              </span>
              {isExamCrisisActive ? (
                <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  🚨 EXAM DAY CRISIS ACTIVE
                </span>
              ) : (
                <span className="bg-emerald-600/80 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  Standby • Normal Operations
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Exam Day Crisis Decision Engine</span>
            </h2>
            <p className="text-xs text-rose-100 max-w-3xl leading-relaxed">
              Automated crisis mitigation protocol: Coordinates dual KSRTC breakdowns, a +40% university demand surge,
              Netravati River flood road severance, and prioritized time-critical exam arrivals within 2 hours.
            </p>
          </div>

          {/* Primary Action Controls */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {!isExamCrisisActive ? (
              <button
                onClick={activateExamCrisis}
                className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-2 transform active:scale-95"
              >
                <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
                <span>Activate Exam Day Crisis</span>
              </button>
            ) : (
              <button
                onClick={deactivateExamCrisis}
                className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs md:text-sm px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 border border-slate-200"
              >
                <RotateCcw className="w-4 h-4 text-emerald-600" />
                <span>Reset to Normal Operations</span>
              </button>
            )}
          </div>
        </div>

        {/* Crisis Event Summary Pills (TASK 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-rose-700/60 text-xs">
          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-1.5 font-bold text-rose-200 mb-1">
              <Bus className="w-3.5 h-3.5 text-rose-300" />
              <span>1. Dual Bus Breakdowns</span>
            </div>
            <p className="text-[11px] text-rose-100">
              {isExamCrisisActive ? 'BUS-01 & BUS-04 broken down. 2 Relief Shuttles deployed.' : 'All Govt KSRTC buses operating nominally.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-1.5 font-bold text-amber-200 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
              <span>2. +40% Student Surge</span>
            </div>
            <p className="text-[11px] text-rose-100">
              {isExamCrisisActive ? `Demand surged to ${crisisData.totalCrisisDemand} students (1.40x multiplier).` : 'Standard morning schedule (1.00x demand).'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-1.5 font-bold text-sky-200 mb-1">
              <Waves className="w-3.5 h-3.5 text-sky-300" />
              <span>3. Flood Road Severance</span>
            </div>
            <p className="text-[11px] text-rose-100">
              {isExamCrisisActive ? 'Netravati Causeway flooded on R-201. Puttur Detour active (+18m).' : 'All rural river causeways clear.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-2.5 rounded-xl border border-white/10">
            <div className="flex items-center gap-1.5 font-bold text-emerald-200 mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-300" />
              <span>4. Imminent Exam Priority</span>
            </div>
            <p className="text-[11px] text-rose-100">
              {isExamCrisisActive ? `${crisisData.examStudentsPrioritizedCount} students prioritized (< 2 hours to exam hall).` : 'General commuter FIFO boarding.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Simulation Navigation Sub-tabs (TASK 8) */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 sm:px-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setEmergencyTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              emergencyTab === 'overview'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Crisis Overview & Impact</span>
          </button>

          <button
            onClick={() => setEmergencyTab('allocation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              emergencyTab === 'allocation'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Bus Breakdown & Allocation</span>
          </button>

          <button
            onClick={() => setEmergencyTab('detours')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              emergencyTab === 'detours'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Flood Blockage & Alternative Detours</span>
          </button>

          <button
            onClick={() => setEmergencyTab('manifest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              emergencyTab === 'manifest'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Exam Priority Manifest ({crisisData.examStudentsPrioritizedCount})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-500 font-semibold px-2">
          {isExamCrisisActive ? '⚡ Live Emergency Calculations' : 'Standard Operations Baseline'}
        </span>
      </div>

      {/* 3. Tab Content View Body */}
      <div className="p-4 md:p-6 space-y-6">
        {/* TAB 1: CRISIS OVERVIEW & BEFORE/AFTER KPIS (TASK 3 & TASK 7) */}
        {emergencyTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Before vs After KPI Metric Cards */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                Live Before & After Crisis Metrics (Mathematical Verification)
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Student Demand</span>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {crisisData.totalCrisisDemand}
                  </div>
                  <div className="text-[11px] font-semibold text-rose-600 mt-0.5">
                    {isExamCrisisActive ? `+40% Surge (+${crisisData.totalDemandSurge})` : 'Normal: 2,816'}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Fleet</span>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    16 Units
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                    {isExamCrisisActive ? '2 Down, 2 Standby Out' : '16 on Road, 3 Idle'}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Active Capacity</span>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {crisisData.totalCrisisCapacity} Seats
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                    {isExamCrisisActive ? '-105 lost, +85 restored' : '890 standard seats'}
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Exam Students On-Time</span>
                  <div className="text-lg font-black text-emerald-700 mt-1">
                    {crisisData.examStudentsOnTimeCount} / {crisisData.examStudentsPrioritizedCount}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                    100% Boarding Guaranteed
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Allocated Passengers</span>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {crisisData.totalAllocated}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                    0 Capacity Breaches
                  </div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Unserved Queues</span>
                  <div className="text-lg font-black text-amber-700 mt-1">
                    {crisisData.netUnservicedAfterCarpool}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                    Municipal Aid Required
                  </div>
                </div>
              </div>
            </div>

            {/* AI Decision Reasoning Explanations (TASK 6) */}
            <div className="bg-gradient-to-br from-slate-900 to-rose-950 text-white p-5 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 border-b border-rose-700/50 pb-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-sm text-white">
                  Intelligent Emergency Decision Rationale & Allocation Engine
                </h4>
              </div>

              <div className="space-y-2.5 text-xs text-rose-100/90">
                {crisisData.aiDecisionExplanations.map((exp, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-white/5 p-2.5 rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{exp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUS BREAKDOWN & REPLACEMENT ALLOCATION (TASK 2 & TASK 6) */}
        {emergencyTab === 'allocation' && (
          <div className="space-y-5 animate-fade-in">
            {/* Dual Breakdown Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Two Government Buses Broken Down (Simulated)
                  </h4>
                  <span className="bg-rose-200 text-rose-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    -105 Seats Lost
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-rose-800">
                  {crisisData.twoBrokenGovtBuses.map(bus => (
                    <div key={bus.id} className="bg-white p-2 rounded-lg border border-rose-200 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900">{bus.name}</strong> ({bus.regNumber})
                        <p className="text-[11px] text-slate-500">{bus.routeName} • Driver: {bus.driverName}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-rose-600 block">{bus.currentPassengers} Stranded</span>
                        <span className="text-[10px] text-slate-400">{bus.capacity} seats cap</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Emergency Relief Replacements Deployed
                  </h4>
                  <span className="bg-emerald-200 text-emerald-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    +{crisisData.totalReplacementCapacity} Seats Restored
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-emerald-800">
                  {crisisData.replacementsList.map(bus => (
                    <div key={bus.id} className="bg-white p-2 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900">{bus.name}</strong> ({bus.regNumber})
                        <p className="text-[11px] text-slate-500">Reassigned to Corridor R-101 on SOS Priority</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700 block">+{bus.capacity} Relief Seats</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Active Dispatch</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Before-and-After Route Allocation Table (TASK 2) */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Bus className="w-3.5 h-3.5 text-rose-600" />
                  Route-by-Route Allocation Impact (Before vs After Crisis)
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">12 Rural Corridors Indexed</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-600 uppercase font-bold text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Corridor</th>
                      <th className="p-2.5">Normal Demand</th>
                      <th className="p-2.5 text-rose-700">Crisis Demand (+40%)</th>
                      <th className="p-2.5">Normal Seats</th>
                      <th className="p-2.5 text-emerald-700">Crisis Seats</th>
                      <th className="p-2.5">Allocated (Safe)</th>
                      <th className="p-2.5 text-rose-600">Unserved Queue</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {crisisData.routeComparisons.map(r => (
                      <tr key={r.routeId} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-800">
                          <div>{r.routeCode}</div>
                          <div className="text-[10px] text-slate-400 font-normal truncate max-w-[160px]">{r.routeName}</div>
                        </td>
                        <td className="p-2.5 text-slate-600">{r.baselineDemand}</td>
                        <td className="p-2.5 font-bold text-rose-700">{r.crisisDemand}</td>
                        <td className="p-2.5 text-slate-600">{r.baselineCapacity}</td>
                        <td className="p-2.5 font-bold text-emerald-700">{r.crisisCapacity}</td>
                        <td className="p-2.5 font-bold text-slate-900">{r.allocatedStudents}</td>
                        <td className="p-2.5 font-semibold text-rose-600">
                          {r.unservicedStudents > 0 ? `+${r.unservicedStudents}` : '0'}
                        </td>
                        <td className="p-2.5">
                          {r.isFloodBlocked ? (
                            <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                              🌊 FLOOD BLOCKED
                            </span>
                          ) : r.replacementsDeployedCount > 0 ? (
                            <span className="bg-emerald-100 text-emerald-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                              RELIEF DEPLOYED
                            </span>
                          ) : r.routeStatus === 'CRITICAL_SHORTAGE' ? (
                            <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                              CRITICAL
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                              {r.routeStatus}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FLOOD BLOCKAGE & ALTERNATIVE DETOUR ROUTES (TASK 4) */}
        {emergencyTab === 'detours' && (
          <div className="space-y-5 animate-fade-in">
            {/* Flood Hazard Alert Card */}
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-600 text-white rounded-xl shadow-sm">
                    <Waves className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-rose-950 text-base">
                      {crisisData.floodBlockage.roadName} – Severed by Monsoon Flooding
                    </h4>
                    <p className="text-xs text-rose-700">
                      Hazard: {crisisData.floodBlockage.hazardType}
                    </p>
                  </div>
                </div>

                <span className="bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                  ROAD CLOSED TO ALL TRANSIT
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-rose-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Severed Road Coordinates</span>
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>Point A: {crisisData.floodBlockage.betweenStopA.name}</span>
                    <span className="text-rose-600 font-bold">➔ BLOCKED ➔</span>
                    <span>Point B: {crisisData.floodBlockage.betweenStopB.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Direct Corridor R-201 crossing Netravati causeway is completely underwater.
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Dynamic Alternative Detour Activated</span>
                  <div className="font-bold text-emerald-900">
                    {crisisData.floodBlockage.detourRouteName}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {crisisData.floodBlockage.detourCorridorSummary}
                  </p>
                </div>
              </div>

              {/* Distance and Travel Time Penalty Calculation (TASK 4) */}
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
                  Detour Travel Duration & Distance Calculations
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border">
                    <span className="text-[10px] text-slate-500 font-bold block">Normal Distance</span>
                    <span className="text-base font-black text-slate-800">{crisisData.floodBlockage.baselineRouteDistanceKm} km</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border">
                    <span className="text-[10px] text-slate-500 font-bold block">Normal Travel Time</span>
                    <span className="text-base font-black text-slate-800">{crisisData.floodBlockage.baselineTravelMinutes} mins</span>
                  </div>
                  <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    <span className="text-[10px] text-rose-700 font-bold block">Detour Distance</span>
                    <span className="text-base font-black text-rose-700">{crisisData.floodBlockage.detourRouteDistanceKm} km (+{crisisData.floodBlockage.distanceDelayKm} km)</span>
                  </div>
                  <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    <span className="text-[10px] text-rose-700 font-bold block">Detour Travel Time</span>
                    <span className="text-base font-black text-rose-700">{crisisData.floodBlockage.detourTravelMinutes} mins (+{crisisData.floodBlockage.timeDelayMinutes} mins)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXAMINATION PRIORITY MANIFEST (TASK 5) */}
        {emergencyTab === 'manifest' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl">
              <div>
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  Examination Priority Student Roster (Next 2 Hours)
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Prioritized by remaining time, travel duration with flood detour, and absence of private transport.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-2xs">
                  {crisisData.examStudentsOnTimeCount} of {crisisData.examStudentsPrioritizedCount} Arriving On Time
                </span>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2.5">Student / Roll No</th>
                      <th className="p-2.5">Pickup Location</th>
                      <th className="p-2.5">Examination Centre</th>
                      <th className="p-2.5">Exam Start</th>
                      <th className="p-2.5">Flood Detour?</th>
                      <th className="p-2.5">Assigned Transit</th>
                      <th className="p-2.5">Projected Arrival</th>
                      <th className="p-2.5">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {crisisData.examStudentsManifest.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">
                          <div>{s.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-normal">{s.rollNumber} • {s.department}</div>
                        </td>
                        <td className="p-2.5 text-slate-700 font-medium">{s.pickupLocation}</td>
                        <td className="p-2.5 text-slate-700 font-medium truncate max-w-[160px]">{s.college}</td>
                        <td className="p-2.5 font-bold text-rose-700">{s.examStartTime}</td>
                        <td className="p-2.5">
                          {s.affectedByFlood ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Yes (+18m Detour)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Direct Route</span>
                          )}
                        </td>
                        <td className="p-2.5 font-semibold text-emerald-800">{s.assignedTransport}</td>
                        <td className="p-2.5 font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                          <span>{s.projectedArrivalTime}</span>
                        </td>
                        <td className="p-2.5">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            s.priorityRank === 'CRITICAL_URGENT'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {s.priorityScore} Pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
