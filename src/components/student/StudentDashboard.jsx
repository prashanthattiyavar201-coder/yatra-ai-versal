import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import {
  Bus,
  Clock,
  MapPin,
  AlertOctagon,
  Users,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';
import LiveRouteMap from '../map/LiveRouteMap';
import RideMatching from './RideMatching';
import SmartRoutePlanner from '../planner/SmartRoutePlanner';
import EmergencyRecoveryModal from '../admin/EmergencyRecoveryModal';

export default function StudentDashboard({ onOpenAIAssistant }) {
  const {
    buses,
    routes,
    alerts,
    studentProfile,
    stopDemandSignals,
    reportWaitingStudent
  } = useTransit();

  const [activeSubTab, setActiveSubTab] = useState('planner'); // 'planner', 'liveMap', 'timetable', 'carpool'
  const [reportedSuccess, setReportedSuccess] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // Active breakdown?
  const brokenBus = buses.find(b => b.status === 'BROKEN_DOWN');
  const reliefBus = buses.find(b => b.status === 'EMERGENCY_REROUTED');

  // Find next incoming bus for the student's home stop (Mani Junction)
  const incomingBus = buses.find(b => b.status === 'ACTIVE' && b.routeId === studentProfile.preferredRouteId) || buses[0];

  const handleQuickSignal = () => {
    reportWaitingStudent('ST-05'); // Mani Junction
    setReportedSuccess(true);
    setTimeout(() => setReportedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Emergency Alert Banner (Shown when breakdown exists) */}
      {brokenBus && (
        <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 text-white rounded-2xl p-4 md:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-rose-300 animate-pulse">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white text-rose-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Transit SOS Alert
                </span>
                <span className="text-xs font-semibold text-rose-100">Mani - Puttur Corridor</span>
              </div>
              <h3 className="text-base md:text-lg font-bold mt-0.5">
                Bus {brokenBus.regNumber} Stalled near {brokenBus.currentStop}
              </h3>
              <p className="text-xs md:text-sm text-rose-100 mt-1">
                {reliefBus
                  ? `✅ Relief Shuttle (KA-19-F-9999) is en route to ${brokenBus.currentStop}. Expected arrival: 10 mins.`
                  : 'Transit Authority has been notified. Alternate shared auto pools activated below.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowRecoveryModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-2.5 rounded-xl text-xs md:text-sm border border-white/40 shadow-sm transition"
            >
              View Recovery Plan
            </button>
            <button
              onClick={() => setActiveSubTab('carpool')}
              className="flex-1 md:flex-initial bg-white hover:bg-rose-50 text-rose-700 font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm shadow-md transition"
            >
              Find Student Ride Match
            </button>
            <button
              onClick={onOpenAIAssistant}
              className="bg-rose-900/40 hover:bg-rose-900/60 text-white font-semibold px-3 py-2.5 rounded-xl text-xs flex items-center gap-1 transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ask AI
            </button>
          </div>
        </div>
      )}

      {/* Student Commute Status & Digital Pass Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Next Bus Arrival Card */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Next Scheduled Service
              </span>
              <span className="bg-emerald-500/40 text-emerald-100 text-[11px] px-2.5 py-0.5 rounded-full font-medium">
                Live ETA
              </span>
            </div>

            <div>
              <div className="text-3xl font-black tracking-tight">
                {reliefBus
                  ? '10 mins'
                  : brokenBus?.id === incomingBus.id
                  ? 'STALLED'
                  : '8 mins'}
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                {reliefBus
                  ? `Relief Shuttle (${reliefBus.regNumber})`
                  : `${incomingBus.name} (${incomingBus.regNumber})`}
              </p>
            </div>

            <div className="bg-emerald-900/60 rounded-xl p-3 text-xs space-y-1.5 backdrop-blur-sm border border-emerald-600/30">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Boarding Stop:</span>
                <span className="font-semibold text-white truncate max-w-[150px]">{studentProfile.homeStop}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Destination:</span>
                <span className="font-semibold text-white">{studentProfile.destinationStop}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-300">Bus Occupancy:</span>
                <span className={`font-bold ${incomingBus.currentPassengers >= incomingBus.capacity ? 'text-amber-300' : 'text-emerald-200'}`}>
                  {incomingBus.currentPassengers}/{incomingBus.capacity} ({Math.round((incomingBus.currentPassengers/incomingBus.capacity)*100)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Crowd Signal Button */}
          <div className="mt-4 pt-3 border-t border-emerald-600/40">
            <button
              onClick={handleQuickSignal}
              className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                reportedSuccess
                  ? 'bg-emerald-400 text-emerald-950 shadow-inner'
                  : 'bg-white hover:bg-emerald-50 text-emerald-800 shadow'
              }`}
            >
              <Users className="w-4 h-4" />
              {reportedSuccess ? '✓ Signal Logged at Mani Junction!' : 'Tap if Waiting at Stop (+1 to Crowd Radar)'}
            </button>
          </div>
        </div>

        {/* Card 2: Student Verified Digital Pass */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-slate-800 text-sm">Karnataka Student Transit Pass</h4>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> VERIFIED
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-800">{studentProfile.name}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">College:</span>
                <span className="font-semibold text-slate-700 truncate max-w-[170px]">{studentProfile.college}</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-100">
                <span className="text-slate-500">Pass Serial ID:</span>
                <span className="font-mono font-bold text-slate-900">{studentProfile.passNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Validity:</span>
                <span className="font-medium text-emerald-700">Valid till {studentProfile.passExpiry}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 mt-3 text-[11px] text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Accepted across all KSRTC Express & Rural Shuttle feeder lines.</span>
          </div>
        </div>

        {/* Card 3: Live Transit Alerts & Guidance */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Live Corridor Alerts
              </h4>
              <span className="text-[10px] text-slate-400 font-semibold">{alerts.length} updates</span>
            </div>

            <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
              {alerts.slice(0, 3).map(alert => (
                <div
                  key={alert.id}
                  className={`p-2.5 rounded-xl text-xs border ${
                    alert.type === 'EMERGENCY'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : alert.type === 'RECOVERY'
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{alert.title}</span>
                    <span className="text-[10px] opacity-75">{alert.timestamp}</span>
                  </div>
                  <p className="mt-1 text-[11px] opacity-90 line-clamp-2">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenAIAssistant}
            className="w-full mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chat with YatraAI Commute Guide</span>
          </button>
        </div>
      </div>

      {/* Sub Navigation: Planner vs Map vs Carpool vs Timetable */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('planner')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeSubTab === 'planner'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Smart Route Optimizer</span>
          <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
            AI Engine
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('liveMap')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeSubTab === 'liveMap'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Interactive Live Transit Map</span>
        </button>

        <button
          onClick={() => setActiveSubTab('carpool')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeSubTab === 'carpool'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Sankalpa Rural Ride-Share</span>
          <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
            3 Active
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('timetable')}
          className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition ${
            activeSubTab === 'timetable'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Offline Rural Timetable</span>
        </button>
      </div>

      {/* Active SubTab View */}
      {activeSubTab === 'planner' && (
        <SmartRoutePlanner onRouteSelected={() => setActiveSubTab('liveMap')} />
      )}

      {activeSubTab === 'liveMap' && <LiveRouteMap />}

      {activeSubTab === 'carpool' && <RideMatching />}

      {activeSubTab === 'timetable' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Rural Educational Bus Timetables</h3>
              <p className="text-xs text-slate-500">Synchronized with Dakshina Kannada KSRTC rural schedules & college hours</p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 text-xs px-3 py-1 rounded-lg font-semibold border border-emerald-200">
              Pass Holder Friendly
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {routes.map(route => (
              <div key={route.id} className="border border-slate-200 rounded-xl p-4 space-y-3 hover:border-emerald-300 transition">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {route.code}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold">{route.totalDistanceKm} km • ~{route.estimatedMinutes}m</span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{route.name}</h4>
                <p className="text-xs text-slate-500 leading-relaxed"><span className="font-medium text-slate-700">Via:</span> {route.via}</p>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Major Stops & ETAs:</span>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {route.stops.map((stop, i) => (
                      <li key={stop.id} className="flex items-center justify-between text-[11px]">
                        <span>{i + 1}. {stop.name}</span>
                        <span className="text-slate-500 font-mono">+{i * 12}m</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Emergency Recovery Decision Modal */}
      <EmergencyRecoveryModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        brokenBusId={brokenBus?.id}
      />
    </div>
  );
}
