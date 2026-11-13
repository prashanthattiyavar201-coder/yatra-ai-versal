import {
  RURAL_BUS_ROUTES,
  INITIAL_BUSES,
  INITIAL_RIDE_SHARES,
  FLOOD_BLOCKED_SEGMENT,
  EXAM_CRISIS_CONFIG,
  EXAM_STUDENTS_ROSTER
} from '../data/mockData.js';

import {
  computeExamCrisisSimulation,
  findOptimalRoute,
  computeFleetAllocation
} from '../services/intelligenceEngine.js';

console.log('====================================================');
console.log('🧪 YATRAAI PROMPTBATTLE EXAM DAY CRISIS TEST SUITE');
console.log('====================================================\n');

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

// ---------------------------------------------------------------------------
// TEST 1: Baseline Inactive Simulation Verification
// ---------------------------------------------------------------------------
console.log('--- TEST 1: Baseline State Before Emergency Activation ---');
const baselineCrisis = computeExamCrisisSimulation({
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: {},
  rideShares: INITIAL_RIDE_SHARES,
  isCrisisActive: false
});

assert(!baselineCrisis.isCrisisActive, 'Emergency mode is initially inactive');
assert(baselineCrisis.demandMultiplier === 1.0, 'Baseline demand multiplier is exactly 1.00');
assert(baselineCrisis.totalBaselineDemand === 2816, `Baseline network demand is exactly 2,816 students (Actual: ${baselineCrisis.totalBaselineDemand})`);
assert(baselineCrisis.twoBrokenGovtBuses.every(b => b.status === 'ACTIVE'), 'All Government KSRTC buses are active in baseline state');

// ---------------------------------------------------------------------------
// TEST 2: Emergency Activation & Two Government Bus Breakdowns (TASK 2)
// ---------------------------------------------------------------------------
console.log('\n--- TEST 2: Emergency Activation & Two Government Bus Breakdowns ---');
const activeCrisis = computeExamCrisisSimulation({
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: {},
  rideShares: INITIAL_RIDE_SHARES,
  isCrisisActive: true
});

assert(activeCrisis.isCrisisActive, 'Emergency mode is successfully marked active');
assert(activeCrisis.twoBrokenGovtBuses.length === 2, 'Exactly two Government buses selected for breakdown');
assert(activeCrisis.twoBrokenGovtBuses.some(b => b.id === 'BUS-01'), 'BUS-01 (KA-21-F-1402) is selected and marked BROKEN_DOWN');
assert(activeCrisis.twoBrokenGovtBuses.some(b => b.id === 'BUS-04'), 'BUS-04 (KA-19-F-3044) is selected and marked BROKEN_DOWN');
assert(activeCrisis.twoBrokenGovtBuses.every(b => b.status === 'BROKEN_DOWN'), 'Both target government buses are marked as BROKEN_DOWN');
assert(activeCrisis.totalCapacityLost === 105, `Total broken capacity is exactly 105 seats (55 + 50 = 105, Actual: ${activeCrisis.totalCapacityLost})`);
assert(activeCrisis.totalStrandedOnboard === 100, `Total stranded onboard passengers identified: 100 students (48 + 52 = 100, Actual: ${activeCrisis.totalStrandedOnboard})`);

// ---------------------------------------------------------------------------
// TEST 3: Replacement Buses Deployed from Standby Fleet (TASK 2 & TASK 6)
// ---------------------------------------------------------------------------
console.log('\n--- TEST 3: Standby Fleet Relief Deployment ---');
assert(activeCrisis.replacementsList.length === 2, 'Exactly two standby reserve shuttles deployed');
assert(activeCrisis.replacementsList.some(b => b.id === 'BUS-RESERVE-01'), 'Sahyadri Standby Shuttle (BUS-RESERVE-01, 40 seats) deployed');
assert(activeCrisis.replacementsList.some(b => b.id === 'BUS-RESERVE-02'), 'Puttur Depot Standby Shuttle (BUS-RESERVE-02, 45 seats) deployed');
assert(activeCrisis.totalReplacementCapacity === 85, `Total standby relief capacity restored: 85 seats (40 + 45 = 85, Actual: ${activeCrisis.totalReplacementCapacity})`);
assert(activeCrisis.replacementsList.every(b => b.assignedRouteId === 'R-101'), 'All relief shuttles assigned to affected Corridor R-101 without duplicate conflict');

// ---------------------------------------------------------------------------
// TEST 4: Exactly +40% Student Demand Surge (TASK 3)
// ---------------------------------------------------------------------------
console.log('\n--- TEST 4: Exactly +40% Student Demand Surge ---');
assert(activeCrisis.demandMultiplier === 1.40, 'Demand surge multiplier is exactly 1.40 (40% increase)');
const expectedSurgedDemand = Math.round(2816 * 1.40); // 3942
assert(activeCrisis.totalCrisisDemand === expectedSurgedDemand, `Total demand scaled from 2,816 to exactly ${expectedSurgedDemand} students (+40%, Actual: ${activeCrisis.totalCrisisDemand})`);
assert(activeCrisis.totalDemandSurge === (expectedSurgedDemand - 2816), `Net student surge calculated accurately (+${activeCrisis.totalDemandSurge} students)`);

// ---------------------------------------------------------------------------
// TEST 5: Flood Road Blockage & Dynamic Detour Routing (TASK 4)
// ---------------------------------------------------------------------------
console.log('\n--- TEST 5: Flood Road Blockage & Dynamic Detours ---');
assert(activeCrisis.floodBlockage.isActive, 'Flood blockage is marked ACTIVE on Corridor R-201');
assert(activeCrisis.floodBlockage.betweenStopA.id === 'ST-08', 'Blocked segment originates at Uppinangady River Road (ST-08)');
assert(activeCrisis.floodBlockage.betweenStopB.id === 'ST-09', 'Blocked segment terminates at Valavoor Cross (ST-09)');
assert(activeCrisis.floodBlockage.affectedRouteIds.includes('R-201'), 'Identified Route R-201 as severed by the flood');
assert(activeCrisis.floodBlockage.detourRouteDistanceKm === 54, 'Detour route distance calculated as 54 km (+12 km)');
assert(activeCrisis.floodBlockage.detourTravelMinutes === 76, 'Detour route travel time calculated as 76 mins (+18 mins)');

// Test findOptimalRoute with flood blockage active
// Test 5A: Journey from Uppinangady River Road (ST-08) to Sahyadri Campus Gate (ST-07)
// Algorithm must select non-flooded corridor (ROUTE-203) and reject flooded corridor (ROUTE-201)
const routeOptSafe = findOptimalRoute({
  originStopId: 'ST-08',
  destinationStopId: 'ST-07',
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: {},
  isCrisisActive: true,
  blockedSegment: FLOOD_BLOCKED_SEGMENT
});

assert(routeOptSafe !== null && routeOptSafe.success, 'Route optimization solves journey during active flood crisis');
assert(!routeOptSafe.bestOption.isBlockedByFlood, 'Algorithm prioritizes safe, non-flooded corridor (ROUTE-203) as top recommendation');
assert(routeOptSafe.alternativeOptions.some(a => a.routeCode === 'ROUTE-201'), 'Flooded Route R-201 is rejected from top recommendation');
assert(routeOptSafe.alternativeOptions.find(a => a.routeCode === 'ROUTE-201').reason.includes('flooding'), 'Rejection explanation explicitly notes Netravati River flooding');

// Test 5B: Direct journey between Uppinangady River Road (ST-08) and Valavoor Cross (ST-09)
// Must activate dynamic detour routing
const routeOptDetour = findOptimalRoute({
  originStopId: 'ST-08',
  destinationStopId: 'ST-09',
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: {},
  isCrisisActive: true,
  blockedSegment: FLOOD_BLOCKED_SEGMENT
});

assert(routeOptDetour !== null && routeOptDetour.success, 'Direct road query recognizes flood blockage');
assert(routeOptDetour.bestOption.isBlockedByFlood, 'Identifies route as traversing flooded river causeway');
assert(routeOptDetour.bestOption.detourAlternative !== null, 'Generates dynamic alternative detour via Bellare-Puttur Bypass');
assert(routeOptDetour.bestOption.detourAlternative.delayMinutes === 18, 'Detour delay accurately calculated as +18 minutes');
assert(routeOptDetour.whySelected.some(w => w.includes('Detour Active') || w.includes('flooding')), 'AI explanation alerts commuter of active flood detour');

// ---------------------------------------------------------------------------
// TEST 6: Examination Priority Algorithm (< 2 Hours) (TASK 5)
// ---------------------------------------------------------------------------
console.log('\n--- TEST 6: Examination Priority Algorithm ---');
assert(activeCrisis.examStudentsManifest.length === 14, `Indexed 14 student commuters with exams scheduled within 2 hours (Actual: ${activeCrisis.examStudentsManifest.length})`);

// Check sorting: highest priority first
const firstStudent = activeCrisis.examStudentsManifest[0];
const lastStudent = activeCrisis.examStudentsManifest[activeCrisis.examStudentsManifest.length - 1];
assert(firstStudent.priorityScore >= lastStudent.priorityScore, 'Exam manifest sorted descending by algorithmic priority score');

// Check flood-affected students received priority bump
const floodAffectedExamStudents = activeCrisis.examStudentsManifest.filter(s => s.affectedByFlood);
assert(floodAffectedExamStudents.length >= 4, `Identified ${floodAffectedExamStudents.length} exam students whose commute is blocked by the flood`);
assert(floodAffectedExamStudents.every(s => s.priorityRank === 'CRITICAL_URGENT' || s.priorityScore >= 90), 'Flood-stranded exam students elevated to CRITICAL_URGENT priority');

// Verify 100% of exam students arrive on time
assert(activeCrisis.examStudentsOnTimeCount === 14, 'All 14 prioritized exam students projected to arrive before exams start');
assert(activeCrisis.examStudentsManifest.every(s => s.onTimeForExam), 'Zero exam students fail to reach exam halls on time');

// ---------------------------------------------------------------------------
// TEST 7: Capacity Safety Enforcement (TASK 6)
// ---------------------------------------------------------------------------
console.log('\n--- TEST 7: Capacity Safety Enforcement (Zero Breaches) ---');
let anyCapacityBreached = false;
activeCrisis.routeComparisons.forEach(r => {
  if (r.allocatedStudents > r.crisisCapacity) {
    anyCapacityBreached = true;
  }
});
assert(!anyCapacityBreached, 'Capacity safety rule strictly enforced: Zero corridors exceed vehicle capacity');
assert(activeCrisis.totalAllocated <= activeCrisis.totalCrisisCapacity, `Total allocated students (${activeCrisis.totalAllocated}) <= active capacity (${activeCrisis.totalCrisisCapacity})`);

// ---------------------------------------------------------------------------
// TEST 8: Accurate Reporting of Unserved Queues (TASK 7)
// ---------------------------------------------------------------------------
console.log('\n--- TEST 8: Truthful Unserved Queue Accounting ---');
assert(activeCrisis.totalUnserviced > 0, `Unserved general commuter queues reported truthfully (${activeCrisis.totalUnserviced} unserved, no false 100% claims)`);
assert(activeCrisis.netUnservicedAfterCarpool <= activeCrisis.totalUnserviced, 'Verified Sankalpa carpools absorb partial residual queue');
assert(activeCrisis.aiDecisionExplanations.length === 4, 'Provides 4 comprehensive AI decision rationale explanations');

// ---------------------------------------------------------------------------
// TEST 9: Reset Simulation to Normal Operations (TASK 8)
// ---------------------------------------------------------------------------
console.log('\n--- TEST 9: Reset Simulation to Normal Operations ---');
const resetCrisis = computeExamCrisisSimulation({
  routes: RURAL_BUS_ROUTES,
  buses: INITIAL_BUSES,
  stopSignals: {},
  rideShares: INITIAL_RIDE_SHARES,
  isCrisisActive: false
});

assert(!resetCrisis.isCrisisActive, 'Crisis status cleanly toggled back to inactive');
assert(resetCrisis.demandMultiplier === 1.0, 'Demand multiplier cleanly restored to 1.00');
assert(resetCrisis.totalCrisisDemand === 2816, 'Total demand restored to baseline 2,816 students');
assert(!resetCrisis.floodBlockage.isActive, 'Flood blockage marked inactive after reset');
assert(resetCrisis.twoBrokenGovtBuses.every(b => b.status === 'ACTIVE'), 'Government buses restored to nominal operational status');

console.log('\n====================================================');
console.log(`📊 EXAM DAY CRISIS SUITE: ${passed} PASSED | ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL EXAM DAY CRISIS TESTS PASSED PERFECTLY!\n');
}
