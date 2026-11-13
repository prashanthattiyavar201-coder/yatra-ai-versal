import React, { useState } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import StudentDashboard from './components/student/StudentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import AIAssistantModal from './components/ai/AIAssistantModal';
import {
  Bus,
  Sparkles,
  AlertTriangle,
  Users,
  ShieldCheck,
  Bot,
  RotateCcw
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'admin'
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { buses, alerts, resetDemoData } = useTransit();

  const brokenBus = buses.find(b => b.status === 'BROKEN_DOWN');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Banner & Navigation */}
      <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl text-emerald-800 shadow-sm flex items-center justify-center">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight">YatraAI</span>
                <span className="bg-emerald-500/40 text-emerald-100 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Sahyadri Rural Pilot
                </span>
                {brokenBus && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> SOS ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-100 font-medium">Connecting Villages. Empowering Journeys.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center gap-1 bg-emerald-950/60 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'student'
                    ? 'bg-white text-emerald-900 shadow'
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                Student Portal
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'admin'
                    ? 'bg-white text-emerald-900 shadow'
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                Transit Authority (Admin)
              </button>
            </div>

            {/* AI Assistant Quick Pill */}
            <button
              onClick={() => setIsAIOpen(true)}
              className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">YatraAI Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'student' ? (
          <StudentDashboard onOpenAIAssistant={() => setIsAIOpen(true)} />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Floating AI Assistant FAB Button (Mobile & Desktop) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsAIOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold p-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-white/20 transition transform hover:scale-105"
        >
          <Bot className="w-5 h-5" />
          <span className="text-xs font-bold pr-1">Ask YatraAI</span>
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistantModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>YatraAI • <em>Connecting Villages. Empowering Journeys.</em> • Sahyadri Hackathon MVP</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>React + Vite + Leaflet + Tailwind</span>
            <span>•</span>
            <button onClick={resetDemoData} className="hover:text-emerald-700 underline text-slate-500">
              Reset Demo Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TransitProvider>
      <AppContent />
    </TransitProvider>
  );
}
