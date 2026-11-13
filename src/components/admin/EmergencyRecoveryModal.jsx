import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { simulateEmergencyRecovery } from '../../services/intelligenceEngine';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  Bus,
  Users,
  ShieldAlert,
  Sparkles,
  Zap,
  RotateCcw,
  Sliders
} from 'lucide-react';

export default function EmergencyRecoveryModal({ isOpen, onClose, brokenBusId }) {
  const {
    buses,
    routes,
    rideShares,
    emergencyScenarios,
    activeScenarioId,
    triggerScenario,
    resetScenario,
    dispatchEmergencyBackup,
    resolveBreakdown
  } = useTransit();

  const [selectedScenarioId, setSelectedScenarioId] = useState(
    activeScenarioId || 'SCENARIO_BREAKDOWN'
  );

  if (!isOpen) return null;

  const currentScenario = emergencyScenarios?.find(s => s.id === selectedScenarioId);

  const recoveryReport = simulateEmergencyRecovery({
    brokenBusId: currentScenario?.brokenBusId || brokenBusId || 'BUS-04',
    scenarioId: selectedScenarioId,
    buses,
    routes,
    rideShares
  });

  const {
    brokenBus,
    affectedRoute,
    onboardStudents,
    downstreamWaitingStudents,
    totalAffectedStudents,
    reallocationSummary,
    recoveryExplanations,
    reserveBusToDeploy
  } = recoveryReport;

  const isReliefEnRoute = reserveBusToDeploy?.status === 'EMERGENCY_REROUTED';

  const handleApplyScenario = (scId) => {
    setSelectedScenarioId(scId);
    triggerScenario(scId);
  };

  const handleDispatch = () => {
    dispatchEmergencyBackup(brokenBus.id, reserveBusToDeploy?.id || 'BUS-RESERVE-01');
  };

  const handleResolve = () => {
    resolveBreakdown(brokenBus.id);
    resetScenario();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-amber-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base md:text-lg">Emergency Transit Recovery Center</h3>
                <span className="bg-white text-rose-800 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Solver
                </span>
              </div>
              <p className="text-xs text-rose-100">
                Multi-scenario rural contingency & automated student reallocation protocol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-rose-200 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario Selector Bar */}
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1 whitespace-nowrap">
            <Sliders className="w-3.5 h-3.5" /> Test Scenario:
          </span>
          {emergencyScenarios?.map(sc => (
            <button
              key={sc.id}
              onClick={() => handleApplyScenario(sc.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                selectedScenarioId === sc.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {sc.name.split('.')[1] || sc.name}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50">
          {/* Active Scenario Banner */}
          {currentScenario && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-950">{currentScenario.name}</p>
                <p className="text-amber-800 mt-0.5">{currentScenario.description}</p>
              </div>
            </div>
          )}

          {/* Incident Overview Card */}
          <div className="bg-white rounded-2xl border border-rose-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Affected Vehicle & Corridor</span>
              <h4 className="text-base font-black text-slate-900">
                {brokenBus.name} ({brokenBus.regNumber})
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Location: <strong>{brokenBus.currentStop}</strong> • Assigned Line: <strong>{affectedRoute.name} ({affectedRoute.code})</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-center bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                <span className="text-[10px] text-rose-700 font-bold block">Onboard Students</span>
                <span className="text-lg font-black text-rose-900">{onboardStudents}</span>
              </div>
              <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <span className="text-[10px] text-amber-700 font-bold block">Downstream Waiting</span>
                <span className="text-lg font-black text-amber-900">{downstreamWaitingStudents}</span>
              </div>
              <div className="text-center bg-slate-900 text-white rounded-xl px-3 py-2">
                <span className="text-[10px] text-slate-300 font-bold block">Total Affected</span>
                <span className="text-lg font-black text-white">{totalAffectedStudents}</span>
              </div>
            </div>
          </div>

          {/* Multi-Tier Reallocation Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                Multi-Tier Passenger Reallocation Protocol
              </h5>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {reallocationSummary.onboardRescuePercentage}% Onboard Passengers Rescued
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Tier 1 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Tier 1: Regular Buses</span>
                  <Bus className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-xl font-black text-slate-900">
                  {reallocationSummary.absorbedByOtherBuses} Students
                </div>
                <p className="text-[11px] text-slate-500">
                  Absorbed into passing fleet on corridor without exceeding capacity.
                </p>
              </div>

              {/* Tier 2 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Tier 2: Student Carpools</span>
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div className="text-xl font-black text-slate-900">
                  {reallocationSummary.absorbedByCarpools} Students
                </div>
                <p className="text-[11px] text-slate-500">
                  Diverted to verified Sankalpa shared auto-rickshaws and peer pools.
                </p>
              </div>

              {/* Tier 3 */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-800">Tier 3: Relief Shuttle</span>
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="text-xl font-black text-emerald-950">
                  {reallocationSummary.absorbedByReliefShuttle} Students
                </div>
                <p className="text-[11px] text-emerald-700">
                  {reserveBusToDeploy ? `${reserveBusToDeploy.name} (${reserveBusToDeploy.capacity} seats) mobilized.` : 'Standby reserve deployment.'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Decision Explanation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Incident Recovery Log & Explanations
            </h5>
            <ul className="space-y-2 text-xs text-slate-700">
              {recoveryExplanations.map((exp, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleResolve}
            className="text-xs text-slate-600 hover:text-emerald-700 font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear Incident & Restore Fleet</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Close
            </button>

            <button
              onClick={handleDispatch}
              disabled={isReliefEnRoute}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 ${
                isReliefEnRoute
                  ? 'bg-indigo-100 text-indigo-700 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isReliefEnRoute ? '✓ Relief Shuttle En Route' : 'Dispatch Relief Shuttle Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
