import {
  findOptimalRoute,
  computeFleetAllocation,
  simulateEmergencyRecovery,
  computeDemandAnalytics
} from '../services/intelligenceEngine.js';
import {
  RURAL_BUS_ROUTES,
  INITIAL_BUSES,
  INITIAL_RIDE_SHARES,
  HIGH_STRESS_VILLAGES,
  EMERGENCY_SCENARIOS,
  EDUCATIONAL_HUBS
} from '../data/mockData.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  [PASS] ${message}`);
  } else {
    failed++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('========================================================');
console.log('🧪 ADVANCED YATRAAI EXPANDED NETWORK TEST RUNNER');
console.log('========================================================\n');

// ----------------------------------------------------
// TEST 1: EXPANDED DATASET CONSTRAINTS
// ----------------------------------------------------
console.log('--- TEST 1: EXPANDED DATASET CONSTRAINTS ---');
assert(INITIAL_BUSES.length >= 20, `At least 20 buses defined (Actual: ${INITIAL_BUSES.length})`);
assert(RURAL_BUS_ROUTES.length >= 12, `At least 12 routes defined (Actual: ${RURAL_BUS_ROUTES.length})`);
assert(EDUCATIONAL_HUBS.length >= 6, `At least 6 college hubs defined (Actual: ${EDUCATIONAL_HUBS.length})`);

// Count unique stops
const uniqueStops = new Set();
RURAL_BUS_ROUTES.forEach(r => r.stops.forEach(s => uniqueStops.add(s.id)));
assert(uniqueStops.size >= 20, `At least 20 unique village stops defined (Actual: ${uniqueStops.size})`);

// ----------------------------------------------------
// TEST 2: ADVANCED ROUTE OPTIMIZATION (UP TO 3 ALTERNATIVES)
// ----------------------------------------------------
console.log('\n--- TEST 2: ADVANCED ROUTE OPTIMIZATION ---');

// Mani Junction (ST-05) to Sahyadri Campus (ST-07)
const r1 = findOptimalRoute({
  originStopId: 'ST-05',
  destinationStopId: 'ST-07',
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: {}
});
assert(r1.success === true, 'Mani Junction to Sahyadri Campus optimization solved');
assert(r1.bestOption !== null, `Top route identified: ${r1.bestOption.route.code}`);
assert(r1.alternativeOptions.length >= 1, `Displays alternative routes (Count: ${r1.alternativeOptions.length})`);
assert(r1.whySelected.length >= 3, 'Generates comprehensive why-selected explanations');
assert(r1.alternativeOptions.every(alt => alt.reason.length > 0), 'Every alternative route includes why-rejected explanation');

// Belthangady (ST-11) to Moodabidri Alva's (ST-14)
const r2 = findOptimalRoute({
  originStopId: 'ST-11',
  destinationStopId: 'ST-14',
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: {}
});
assert(r2.success === true, 'Belthangady to Moodabidri solved');
assert(r2.bestOption.route.code === 'ROUTE-202', 'Recommended Route 202 for Belthangady-Alva’s link');

// ----------------------------------------------------
// TEST 3: CAPACITY-SAFE BUS ALLOCATION
// ----------------------------------------------------
console.log('\n--- TEST 3: CAPACITY-SAFE BUS ALLOCATION ---');

const alloc = computeFleetAllocation({
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: {}
});
assert(alloc.routeAllocations.length === RURAL_BUS_ROUTES.length, 'All 12 corridors analyzed in allocation');
assert(alloc.totalNetworkDemand > 1000, `Total network demand calculated: ${alloc.totalNetworkDemand} students`);
assert(alloc.totalNetworkCapacity > 800, `Total network capacity calculated: ${alloc.totalNetworkCapacity} seats`);
assert(alloc.underutilizedBuses.length > 0, `Identified underutilized buses for reallocation: ${alloc.underutilizedBuses.length}`);
assert(alloc.standbyBuses.length >= 3, `Identified 3 standby reserve buses: ${alloc.standbyBuses.length}`);

// Zero capacity breach verification
alloc.routeAllocations.forEach(ra => {
  assert(ra.allocatedStudents <= ra.totalCapacity, `Corridor ${ra.routeCode}: Zero capacity breach (${ra.allocatedStudents} <= ${ra.totalCapacity})`);
});

// ----------------------------------------------------
// TEST 4: MULTI-SCENARIO EMERGENCY RECOVERY
// ----------------------------------------------------
console.log('\n--- TEST 4: MULTI-SCENARIO EMERGENCY RECOVERY ---');

// Scenario 1: Breakdown
const s1 = simulateEmergencyRecovery({
  brokenBusId: 'BUS-04',
  scenarioId: 'SCENARIO_BREAKDOWN',
  buses: INITIAL_BUSES,
  routes: RURAL_BUS_ROUTES,
  rideShares: INITIAL_RIDE_SHARES
});
assert(s1.brokenBus.id === 'BUS-04', 'Scenario 1: Targets BUS-04');
assert(s1.onboardStudents === 52, 'Scenario 1: Identifies 52 onboard students');

// Scenario 2: Landslide
const s2 = simulateEmergencyRecovery({
  brokenBusId: 'BUS-07',
  scenarioId: 'SCENARIO_LANDSLIDE',
  buses: INITIAL_BUSES,
  routes: RURAL_BUS_ROUTES,
  rideShares: INITIAL_RIDE_SHARES
});
assert(s2.brokenBus.id === 'BUS-07', 'Scenario 2: Landslide on Route 201 identified');

// Scenario 3: Exam Demand Surge
const s3 = simulateEmergencyRecovery({
  scenarioId: 'SCENARIO_EXAM_SURGE',
  buses: INITIAL_BUSES,
  routes: RURAL_BUS_ROUTES,
  rideShares: INITIAL_RIDE_SHARES
});
assert(s3.totalAffectedStudents > s1.totalAffectedStudents, 'Scenario 3: Exam surge multiplies waiting students');

// Scenario 4: Overcrowding
const s4 = simulateEmergencyRecovery({
  scenarioId: 'SCENARIO_OVERCROWDING',
  buses: INITIAL_BUSES,
  routes: RURAL_BUS_ROUTES,
  rideShares: INITIAL_RIDE_SHARES
});
assert(s4.onboardStudents > 55, 'Scenario 4: Overcrowding triggers capacity breach accounting');

// Scenario 5: Standby Depletion / Mutual Aid
const s5 = simulateEmergencyRecovery({
  scenarioId: 'SCENARIO_DEPOT_DEPLETION',
  buses: INITIAL_BUSES,
  routes: RURAL_BUS_ROUTES,
  rideShares: INITIAL_RIDE_SHARES
});
assert(s5.recoveryExplanations.length >= 4, 'Scenario 5: Generates mutual aid recovery explanation');

// ----------------------------------------------------
// TEST 5: ADVANCED DEMAND ANALYTICS
// ----------------------------------------------------
console.log('\n--- TEST 5: ADVANCED DEMAND ANALYTICS ---');

const analytics = computeDemandAnalytics({
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: { 'ST-05': 20, 'ST-06': 15 },
  highStressVillages: HIGH_STRESS_VILLAGES
});

assert(analytics.fleetSummary.totalBuses >= 20, 'Analytics reports >= 20 total buses');
assert(analytics.fleetSummary.activeBuses >= 16, 'Analytics reports >= 16 active road buses');
assert(analytics.fleetSummary.standbyBuses >= 3, 'Analytics reports 3 standby reserve buses');
assert(analytics.overcrowdedRoutes.length > 0, 'Identifies overcrowded routes');
assert(analytics.highestDemandVillages.length >= 20, 'Aggregates queues across >= 20 village stops');

console.log('\n========================================================');
console.log(`📊 FINAL ADVANCED SUITE RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('========================================================');

if (failed > 0) process.exit(1);
