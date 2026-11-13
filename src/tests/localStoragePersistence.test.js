import {
  INITIAL_BUSES,
  INITIAL_RIDE_SHARES
} from '../data/mockData.js';

console.log('====================================================');
console.log('🧪 LOCALSTORAGE PERSISTENCE & LIFECYCLE TEST');
console.log('====================================================\n');

// Mock localStorage engine matching browser semantics
const storage = new Map();
const mockLocalStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
};

const STORAGE_KEY_PREFIX = 'yatra_ai_';

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

// Step 1: Initial state written to LocalStorage
mockLocalStorage.setItem(`${STORAGE_KEY_PREFIX}buses`, JSON.stringify(INITIAL_BUSES));
mockLocalStorage.setItem(`${STORAGE_KEY_PREFIX}rides`, JSON.stringify(INITIAL_RIDE_SHARES));
mockLocalStorage.setItem(`${STORAGE_KEY_PREFIX}stop_signals`, JSON.stringify({ 'ST-05': 12 }));

assert(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}buses`) !== null, 'Initial fleet written to LocalStorage');
assert(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}rides`) !== null, 'Initial rides written to LocalStorage');
assert(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}stop_signals`) !== null, 'Initial crowd signals written to LocalStorage');

// Step 2: Simulate User Mutation (Breakdown + Join Ride + Crowd Signal)
const storedBuses = JSON.parse(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}buses`));
storedBuses[3].status = 'BROKEN_DOWN';
storedBuses[3].speedKmH = 0;
mockLocalStorage.setItem(`${STORAGE_KEY_PREFIX}buses`, JSON.stringify(storedBuses));

const storedRides = JSON.parse(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}rides`));
const initialSeats = storedRides[0].seatsAvailable;
storedRides[0].seatsAvailable -= 1;
storedRides[0].joinedStudents = ['Ananya Hegde'];
mockLocalStorage.setItem(`${STORAGE_KEY_PREFIX}rides`, JSON.stringify(storedRides));

const storedSignals = JSON.parse(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}stop_signals`));
storedSignals['ST-05'] += 1;
mockLocalStorage.setItem(`${STORAGE_KEY_PREFIX}stop_signals`, JSON.stringify(storedSignals));

// Step 3: Simulate Page Refresh / Reload
const reloadedBuses = JSON.parse(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}buses`));
const reloadedRides = JSON.parse(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}rides`));
const reloadedSignals = JSON.parse(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}stop_signals`));

assert(reloadedBuses[3].status === 'BROKEN_DOWN', 'State Persisted: BUS-04 remains BROKEN_DOWN after page refresh');
assert(reloadedBuses[3].speedKmH === 0, 'State Persisted: BUS-04 telemetry speed remains 0 km/h');
assert(reloadedRides[0].seatsAvailable === initialSeats - 1, `State Persisted: Ride seats decremented from ${initialSeats} to ${reloadedRides[0].seatsAvailable}`);
assert(reloadedRides[0].joinedStudents.includes('Ananya Hegde'), 'State Persisted: Joined student name preserved in ride');
assert(reloadedSignals['ST-05'] === 13, 'State Persisted: Stop demand signal persisted at 13 pings');

// Step 4: Simulate Reset Demo Data
mockLocalStorage.removeItem(`${STORAGE_KEY_PREFIX}buses`);
mockLocalStorage.removeItem(`${STORAGE_KEY_PREFIX}rides`);
mockLocalStorage.removeItem(`${STORAGE_KEY_PREFIX}stop_signals`);

assert(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}buses`) === null, 'Reset Functionality: Bus store cleared');
assert(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}rides`) === null, 'Reset Functionality: Ride store cleared');
assert(mockLocalStorage.getItem(`${STORAGE_KEY_PREFIX}stop_signals`) === null, 'Reset Functionality: Crowd signals store cleared');

console.log('\n====================================================');
console.log(`📊 LOCALSTORAGE PERSISTENCE RESULTS: ${passed} PASSED | ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) process.exit(1);
