import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RURAL_BUS_ROUTES,
  INITIAL_BUSES,
  INITIAL_RIDE_SHARES,
  HOURLY_DEMAND_ANALYTICS,
  HIGH_STRESS_VILLAGES,
  EMERGENCY_SCENARIOS,
  FLOOD_BLOCKED_SEGMENT,
  EXAM_CRISIS_CONFIG,
  EXAM_STUDENTS_ROSTER
} from '../data/mockData';

const TransitContext = createContext();

const STORAGE_KEY_PREFIX = 'yatra_ai_';

export function TransitProvider({ children }) {
  // 1. Buses state
  const [buses, setBuses] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}buses`);
    return saved ? JSON.parse(saved) : INITIAL_BUSES;
  });

  // 2. Routes state
  const [routes] = useState(RURAL_BUS_ROUTES);

  // 3. Active selected route for filtering
  const [selectedRouteId, setSelectedRouteId] = useState('ALL');

  // 4. Ride Sharing / Carpool list
  const [rideShares, setRideShares] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}rides`);
    return saved ? JSON.parse(saved) : INITIAL_RIDE_SHARES;
  });

  // 5. Emergency alerts list
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}alerts`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'ALT-1',
        type: 'INFO',
        title: 'Morning Rural Fleet Operational',
        message: 'All 5 regular KSRTC rural student shuttles are on track. Mani Junction crowd monitoring active.',
        timestamp: '07:45 AM',
        routeId: 'ALL'
      }
    ];
  });

  // 6. Student profile
  const [studentProfile, setStudentProfile] = useState(() => {
    return {
      name: 'Ananya Hegde',
      college: 'Sahyadri College of Engineering & Management',
      rollNo: '4SF21CS042',
      homeStop: 'Mani Junction (High Risk Point)',
      destinationStop: 'Sahyadri College Campus Gate',
      preferredRouteId: 'R-101',
      passNumber: 'KA-KSRTC-STU-88219',
      passExpiry: '31 May 2027',
      isPassValid: true
    };
  });

  // 7. Student crowd signals (students reporting they are waiting at a stop)
  const [stopDemandSignals, setStopDemandSignals] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}stop_signals`);
    return saved ? JSON.parse(saved) : {};
  });

  // 8. Gemini API Key (stored in localStorage or from env, optional)
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    return (
      localStorage.getItem(`${STORAGE_KEY_PREFIX}gemini_key`) ||
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) ||
      ''
    );
  });

  // 9. Active Emergency Scenario
  const [activeScenarioId, setActiveScenarioId] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}buses`, JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}rides`, JSON.stringify(rideShares));
  }, [rideShares]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}alerts`, JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}stop_signals`, JSON.stringify(stopDemandSignals));
  }, [stopDemandSignals]);

  useEffect(() => {
    if (geminiApiKey) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}gemini_key`, geminiApiKey);
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}gemini_key`);
    }
  }, [geminiApiKey]);

  // Actions
  // 1b. Resolve Breakdown / Restore Bus
  const resolveBreakdown = (busId) => {
    setBuses(prev => prev.map(bus => {
      if (bus.id === busId) {
        return {
          ...bus,
          status: 'ACTIVE',
          speedKmH: 38
        };
      }
      return bus;
    }));

    const restoredBus = buses.find(b => b.id === busId) || { regNumber: 'KA-19-F-3044' };

    const restoreAlert = {
      id: `ALT-RES-${Date.now()}`,
      type: 'INFO',
      title: `🛠️ Bus Repaired & Resumed (${restoredBus.regNumber})`,
      message: `Mechanic team cleared the issue. ${restoredBus.name || restoredBus.regNumber} has resumed normal scheduled service.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      routeId: restoredBus.routeId || 'ALL'
    };

    setAlerts(prev => [restoreAlert, ...prev]);
  };

  // 1. Simulate Breakdown
  const simulateBreakdown = (busId = 'BUS-04') => {
    setBuses(prev => prev.map(bus => {
      if (bus.id === busId) {
        return {
          ...bus,
          status: 'BROKEN_DOWN',
          speedKmH: 0,
          currentPassengers: bus.currentPassengers
        };
      }
      return bus;
    }));

    const targetBus = buses.find(b => b.id === busId) || { regNumber: 'KA-19-F-3044', routeName: 'Sullia - Puttur - Sahyadri', currentStop: 'Mani Junction' };

    const newAlert = {
      id: `ALT-SOS-${Date.now()}`,
      type: 'EMERGENCY',
      title: `🚨 EMERGENCY: Bus Breakdown Reported (${targetBus.regNumber})`,
      message: `${targetBus.name} broke down near ${targetBus.currentStop}. 52 students affected. Emergency backup dispatch requested.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      routeId: targetBus.routeId,
      busId: targetBus.id
    };

    setAlerts(prev => [newAlert, ...prev]);
  };

  // 2. Dispatch Emergency Backup Shuttle
  const dispatchEmergencyBackup = (brokenBusId = 'BUS-04', backupBusId = 'BUS-RESERVE-01') => {
    const brokenBus = buses.find(b => b.id === brokenBusId);
    
    setBuses(prev => prev.map(bus => {
      if (bus.id === backupBusId) {
        return {
          ...bus,
          status: 'EMERGENCY_REROUTED',
          speedKmH: 48,
          currentStop: 'En Route to ' + (brokenBus ? brokenBus.currentStop : 'Mani Junction'),
          nextStop: brokenBus ? brokenBus.currentStop : 'Mani Junction',
          routeId: brokenBus ? brokenBus.routeId : 'R-101',
          routeName: `EMERGENCY RELIEF: ${brokenBus ? brokenBus.routeName : 'Sahyadri Corridor'}`
        };
      }
      return bus;
    }));

    const reliefAlert = {
      id: `ALT-RELIEF-${Date.now()}`,
      type: 'RECOVERY',
      title: '✅ RELIEF SHUTTLE DISPATCHED',
      message: `Reserve Bus (KA-19-F-9999) has been mobilized from Sahyadri Bay to ${brokenBus ? brokenBus.currentStop : 'Mani Junction'}. ETA: 12 minutes. Stranded students will be accommodated.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      routeId: brokenBus ? brokenBus.routeId : 'R-101'
    };

    setAlerts(prev => [reliefAlert, ...prev]);
  };

  // 2b. Trigger Emergency Scenario
  const triggerScenario = (scenarioId) => {
    setActiveScenarioId(scenarioId);
    const scenario = EMERGENCY_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;

    if (scenario.brokenBusId) {
      setBuses(prev => prev.map(bus => {
        if (bus.id === scenario.brokenBusId) {
          return {
            ...bus,
            status: 'BROKEN_DOWN',
            speedKmH: 0
          };
        }
        return bus;
      }));
    }

    if (scenarioId === 'SCENARIO_EXAM_SURGE') {
      setStopDemandSignals(prev => ({
        ...prev,
        'ST-05': (prev['ST-05'] || 0) + 120,
        'ST-06': (prev['ST-06'] || 0) + 95
      }));
    }

    if (scenarioId === 'SCENARIO_OVERCROWDING') {
      setBuses(prev => prev.map(bus => {
        if (['BUS-01', 'BUS-02', 'BUS-04'].includes(bus.id)) {
          return {
            ...bus,
            currentPassengers: bus.capacity + 4 // Breach
          };
        }
        return bus;
      }));
    }

    const alert = {
      id: `ALT-SCENARIO-${Date.now()}`,
      type: 'EMERGENCY',
      title: `⚠️ SCENARIO ACTIVATED: ${scenario.name}`,
      message: `${scenario.description} Incident impact: ${scenario.impactSummary}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      routeId: 'ALL'
    };

    setAlerts(prev => [alert, ...prev]);
  };

  // 2c. Reset Emergency Scenario
  const resetScenario = () => {
    setActiveScenarioId(null);
    resetDemoData();
  };

  // 3. Intelligent Reallocation of Bus
  const reallocateBus = (busId, targetRouteId) => {
    const targetRoute = routes.find(r => r.id === targetRouteId);
    setBuses(prev => prev.map(bus => {
      if (bus.id === busId) {
        return {
          ...bus,
          routeId: targetRouteId,
          routeName: targetRoute ? targetRoute.name : bus.routeName,
          status: 'ACTIVE'
        };
      }
      return bus;
    }));

    const allocAlert = {
      id: `ALT-ALLOC-${Date.now()}`,
      type: 'INFO',
      title: '🔄 Fleet Reallocation Implemented',
      message: `Bus ${busId} reassigned to ${targetRoute ? targetRoute.name : targetRouteId} to alleviate student overcrowding.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      routeId: targetRouteId
    };

    setAlerts(prev => [allocAlert, ...prev]);
  };

  // 4. Student Waiting Signal (one-tap crowd report)
  const reportWaitingStudent = (stopId) => {
    setStopDemandSignals(prev => ({
      ...prev,
      [stopId]: (prev[stopId] || 0) + 1
    }));
  };

  // 5. Add new Student Ride-Share / Carpool
  const addRideShare = (newRide) => {
    const created = {
      ...newRide,
      id: `RIDE-${Date.now()}`,
      status: 'OPEN'
    };
    setRideShares(prev => [created, ...prev]);
  };

  // 6. Join Ride-Share
  const joinRideShare = (rideId, studentName = 'Student Passenger') => {
    setRideShares(prev => prev.map(ride => {
      if (ride.id === rideId && ride.seatsAvailable > 0) {
        const updatedSeats = ride.seatsAvailable - 1;
        return {
          ...ride,
          seatsAvailable: updatedSeats,
          status: updatedSeats === 0 ? 'FILLED' : 'OPEN',
          joinedStudents: [...(ride.joinedStudents || []), studentName]
        };
      }
      return ride;
    }));
  };

  // 7. Exam Day Crisis State (PromptBattle Surprise Hurdle)
  const [isExamCrisisActive, setIsExamCrisisActive] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}exam_crisis_active`);
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}exam_crisis_active`, isExamCrisisActive ? 'true' : 'false');
  }, [isExamCrisisActive]);

  // Activate Exam Day Crisis (All 4 simultaneous events)
  const activateExamCrisis = () => {
    if (isExamCrisisActive) return; // Prevent repeated activation from applying 40% multiple times
    setIsExamCrisisActive(true);

    // 1. Two Government buses breakdown (BUS-01 and BUS-04)
    // 2. Replacements deployed from Standby Bays (BUS-RESERVE-01 and BUS-RESERVE-02)
    setBuses(prev => prev.map(bus => {
      if (EXAM_CRISIS_CONFIG.brokenBusIds.includes(bus.id)) {
        return {
          ...bus,
          status: 'BROKEN_DOWN',
          speedKmH: 0
        };
      }
      if (EXAM_CRISIS_CONFIG.replacementBusIds.includes(bus.id)) {
        return {
          ...bus,
          status: 'ACTIVE',
          routeId: 'R-101',
          routeName: 'Sullia - Puttur - Sahyadri Campus Express',
          speedKmH: 38
        };
      }
      return bus;
    }));

    const crisisAlert = {
      id: `ALT-CRISIS-${Date.now()}`,
      type: 'EMERGENCY',
      title: '🚨 EXAM DAY EMERGENCY MODE ACTIVATED (SIMULATION)',
      message: '4 Simultaneous Events Active: 2 Govt buses down (BUS-01, BUS-04), +40% student demand surge, Netravati River causeway flood closure (R-201 detour active), and 14 students prioritized for VTU semester exams.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      routeId: 'ALL'
    };

    setAlerts(prev => [crisisAlert, ...prev]);
  };

  // Deactivate Exam Day Crisis (Reset to normal operations)
  const deactivateExamCrisis = () => {
    setIsExamCrisisActive(false);
    resetDemoData();
  };

  // 8. Reset Demo Data to initial state
  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}buses`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}rides`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}alerts`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}stop_signals`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}exam_crisis_active`);
    setIsExamCrisisActive(false);
    setBuses(INITIAL_BUSES);
    setRideShares(INITIAL_RIDE_SHARES);
    setStopDemandSignals({});
    setAlerts([
      {
        id: 'ALT-1',
        type: 'INFO',
        title: 'Morning Rural Fleet Operational',
        message: 'All 5 regular KSRTC rural student shuttles are on track. Mani Junction crowd monitoring active.',
        timestamp: '07:45 AM',
        routeId: 'ALL'
      }
    ]);
  };

  return (
    <TransitContext.Provider
      value={{
        buses,
        routes,
        selectedRouteId,
        setSelectedRouteId,
        rideShares,
        alerts,
        studentProfile,
        setStudentProfile,
        stopDemandSignals,
        hourlyDemand: HOURLY_DEMAND_ANALYTICS,
        highStressVillages: HIGH_STRESS_VILLAGES,
        emergencyScenarios: EMERGENCY_SCENARIOS,
        activeScenarioId,
        triggerScenario,
        resetScenario,
        geminiApiKey,
        setGeminiApiKey,
        simulateBreakdown,
        resolveBreakdown,
        dispatchEmergencyBackup,
        reallocateBus,
        reportWaitingStudent,
        addRideShare,
        joinRideShare,
        resetDemoData,
        isExamCrisisActive,
        activateExamCrisis,
        deactivateExamCrisis,
        floodBlockedSegment: FLOOD_BLOCKED_SEGMENT,
        examStudentsRoster: EXAM_STUDENTS_ROSTER
      }}
    >
      {children}
    </TransitContext.Provider>
  );
}

export function useTransit() {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
}
