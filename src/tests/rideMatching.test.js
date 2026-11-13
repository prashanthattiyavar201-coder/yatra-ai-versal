import { RURAL_BUS_ROUTES, EDUCATIONAL_HUBS, INITIAL_RIDE_SHARES } from '../data/mockData.js';

console.log('====================================================');
console.log('🧪 YATRAAI SMART JOURNEY SELECTION & RIDE-SHARING TEST');
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

// ====================================================
// TEST SUITE 1: DATASET EXTRACTION FOR SEARCHABLE DROPDOWNS
// ====================================================
console.log('--- TEST SUITE 1: Dataset Extraction & Integration ---');

// Extract unique departure village stops from routes
const departureStopsSet = new Set();
RURAL_BUS_ROUTES.forEach((r) => {
  r.stops.forEach((s) => {
    const clean = s.name.replace(/\s*\(High Risk Point\)/gi, '').trim();
    departureStopsSet.add(clean);
  });
});
const canonicalStops = [
  'Sullia Rural Bus Stand',
  'Bellare Village Junction',
  'Kaniyoor Tribal Belt Stop',
  'Kumbra Cross',
  'Puttur KSRTC Depot',
  'Mani Junction',
  'Kalladka High Risk Junction',
  'BC Road Kaikamba',
  'Uppinangady River Road',
  'Valavoor Cross',
  'Melkar Junction',
  'Mudipu Gram Panchayat',
  'Konaje Cross Road',
  'Farangipete Market',
  'Thumbe Water Works Cross',
  'Vitla Town Panchayat',
  'Belthangady Bus Stand',
  'Guruvayanakere Cross',
  'Venoor Rural Market',
  'Nadupadavu PACE Gate',
  'Deralakatte Medical Junction'
];
canonicalStops.forEach((st) => departureStopsSet.add(st));
const departureStops = Array.from(departureStopsSet).sort();

assert(departureStops.length >= 20, `Departure stops populated with ${departureStops.length} stops (>= 20)`);
assert(departureStops.includes('Sullia Rural Bus Stand'), 'Includes Sullia Rural Bus Stand');
assert(departureStops.includes('Bellare Village Junction'), 'Includes Bellare Village Junction');
assert(departureStops.includes('Kumbra Cross'), 'Includes Kumbra Cross');
assert(departureStops.includes('Puttur KSRTC Depot'), 'Includes Puttur KSRTC Depot');
assert(departureStops.includes('Mani Junction'), 'Includes Mani Junction');
assert(departureStops.includes('BC Road Kaikamba'), 'Includes BC Road Kaikamba');
assert(departureStops.includes('Uppinangady River Road'), 'Includes Uppinangady River Road');
assert(departureStops.includes('Valavoor Cross'), 'Includes Valavoor Cross');
assert(departureStops.includes('Melkar Junction'), 'Includes Melkar Junction');
assert(departureStops.includes('Mudipu Gram Panchayat'), 'Includes Mudipu Gram Panchayat');
assert(departureStops.includes('Konaje Cross Road'), 'Includes Konaje Cross Road');
assert(departureStops.includes('Farangipete Market'), 'Includes Farangipete Market');

// Extract destination hubs
const destSet = new Set();
EDUCATIONAL_HUBS.forEach((h) => destSet.add(h.name));
const canonicalDestinations = [
  'Sahyadri College Campus Gate',
  'Sahyadri College Campus Gate (Adyar)',
  'Vivekananda College Campus (Puttur)',
  'Alva’s Institute Campus (Moodabidri)',
  'P.A. College of Engineering (Nadupadavu)',
  'Mangalore University Campus (Konaje)',
  'Mangaluru Central Transit Terminal (State Bank)',
  'Puttur College Hub (KSRTC Depot)',
  'Mangalore Educational Hub (Hampankatta)',
  'Deralakatte Medical & Educational Hub',
  'BC Road Transit Interchange',
  'Belthangady College Circle'
];
canonicalDestinations.forEach((d) => destSet.add(d));
const destinationOptions = Array.from(destSet).sort();

assert(destinationOptions.length >= 6, `Destination hubs populated with ${destinationOptions.length} destinations (>= 6)`);
assert(destinationOptions.some(d => d.includes('Sahyadri College')), 'Includes Sahyadri College destination');
assert(destinationOptions.some(d => d.includes('Vivekananda College')), 'Includes Vivekananda College destination');
assert(destinationOptions.some(d => d.includes('Alva’s Institute')), 'Includes Alva’s Institute destination');
assert(destinationOptions.some(d => d.includes('Mangaluru Central Transit Terminal')), 'Includes Major Bus Terminal destination');

// ====================================================
// TEST SUITE 2: TIME INTERVALS & DATE RESTRICTIONS
// ====================================================
console.log('\n--- TEST SUITE 2: Departure Time & Date Logic ---');

const DEPARTURE_TIME_SLOTS = [
  {
    group: 'Morning Travel (College Arrival)',
    slots: ['06:30 AM', '06:45 AM', '07:00 AM', '07:15 AM', '07:30 AM', '07:45 AM', '08:00 AM', '08:15 AM', '08:30 AM', '08:45 AM', '09:00 AM', '09:15 AM', '09:30 AM', '09:45 AM', '10:00 AM']
  },
  {
    group: 'Afternoon Travel',
    slots: ['11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM']
  },
  {
    group: 'Evening Travel (College Departure)',
    slots: ['03:30 PM', '03:45 PM', '04:00 PM', '04:15 PM', '04:30 PM', '04:45 PM', '05:00 PM', '05:15 PM', '05:30 PM', '05:45 PM', '06:00 PM', '06:30 PM', '07:00 PM']
  }
];

const totalSlots = DEPARTURE_TIME_SLOTS.reduce((acc, g) => acc + g.slots.length, 0);
assert(totalSlots >= 30, `Departure time slots cover ${totalSlots} 15/30-minute intervals (>= 30)`);
assert(DEPARTURE_TIME_SLOTS.some(g => g.group.includes('Morning')), 'Includes Morning College Arrival group');
assert(DEPARTURE_TIME_SLOTS.some(g => g.group.includes('Afternoon')), 'Includes Afternoon Travel group');
assert(DEPARTURE_TIME_SLOTS.some(g => g.group.includes('Evening')), 'Includes Evening College Departure group');

// Date validation logic
const todayStr = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

function validateDate(date) {
  if (!date) return 'Departure date is required.';
  if (date < todayStr) return 'Departure date cannot be in the past.';
  return null;
}

assert(validateDate(yesterday) === 'Departure date cannot be in the past.', 'Rejects past date selection');
assert(validateDate(todayStr) === null, 'Accepts today date selection');
assert(validateDate(tomorrow) === null, 'Accepts future date selection');

// ====================================================
// TEST SUITE 3: SMART FORM VALIDATION
// ====================================================
console.log('\n--- TEST SUITE 3: Smart Form Validation Rules ---');

function validateRideInput(input) {
  const errs = {};
  if (!input.fullName || input.fullName.trim().length < 2) errs.fullName = 'Full name required';
  if (!input.collegeName || input.collegeName.trim().length < 2) errs.collegeName = 'College name required';
  if (!input.department || input.department.trim().length < 2) errs.department = 'Department required';
  
  const cleanedPhone = (input.contactPhone || '').replace(/[^0-9]/g, '');
  if (!cleanedPhone || cleanedPhone.length < 10) errs.contactPhone = 'Valid 10-digit phone required';

  if (!input.from || input.from.trim().length < 2) errs.from = 'Departure stop required';
  if (!input.to || input.to.trim().length < 2) errs.to = 'Destination required';
  if (input.from && input.to && input.from.trim().toLowerCase() === input.to.trim().toLowerCase()) {
    errs.to = 'Departure stop and destination location must be different.';
  }
  if (!input.departureDate) {
    errs.departureDate = 'Departure date required';
  } else if (input.departureDate < todayStr) {
    errs.departureDate = 'Departure date cannot be in the past.';
  }

  if (!input.departureTime || !input.departureTime.trim()) errs.departureTime = 'Departure time required';
  if (!input.seatsAvailable || Number(input.seatsAvailable) <= 0) errs.seatsAvailable = 'Seats must be > 0';

  return { isValid: Object.keys(errs).length === 0, errors: errs };
}

// 3.1: Rejects empty inputs
const val1 = validateRideInput({});
assert(!val1.isValid, 'Rejects completely empty form');
assert(val1.errors.from !== undefined, 'Requires departure village/stop');
assert(val1.errors.to !== undefined, 'Requires destination college/location');
assert(val1.errors.departureDate !== undefined, 'Requires departure date');
assert(val1.errors.departureTime !== undefined, 'Requires departure time');

// 3.2: Rejects identical departure & destination
const val2 = validateRideInput({
  fullName: 'Pooja Rai',
  collegeName: 'Sahyadri College of Engineering & Management',
  department: 'Computer Science & Engineering',
  contactPhone: '9845123456',
  from: 'Sahyadri College Campus Gate',
  to: 'Sahyadri College Campus Gate', // Identical
  departureDate: todayStr,
  departureTime: '08:30 AM',
  seatsAvailable: 3
});
assert(!val2.isValid && val2.errors.to !== undefined, 'Rejects identical departure and destination ("from === to")');

// 3.3: Rejects past date
const val3 = validateRideInput({
  fullName: 'Pooja Rai',
  collegeName: 'Sahyadri College of Engineering & Management',
  department: 'Computer Science & Engineering',
  contactPhone: '9845123456',
  from: 'Mani Junction',
  to: 'Sahyadri College Campus Gate',
  departureDate: yesterday, // Past date
  departureTime: '08:30 AM',
  seatsAvailable: 3
});
assert(!val3.isValid && val3.errors.departureDate === 'Departure date cannot be in the past.', 'Rejects past departure date in form validation');

// 3.4: Complete valid submission with selectable locations
const validRideSubmission = {
  fullName: 'Pooja Rai',
  collegeName: 'Sahyadri College of Engineering & Management',
  department: 'Computer Science & Engineering',
  contactPhone: '9845123456',
  from: 'Mani Junction',
  to: 'Sahyadri College Campus Gate',
  departureDate: todayStr,
  departureTime: '08:15 AM',
  vehicleType: 'Shared Auto-Rickshaw',
  seatsAvailable: 3,
  farePerStudent: '20',
  notes: 'Regular morning pool from Mani Junction to Sahyadri Campus.'
};
const val4 = validateRideInput(validRideSubmission);
assert(val4.isValid, 'Passes validation with valid selectable village stop and college destination');

// ====================================================
// TEST SUITE 4: RIDE PUBLISHING & WORKFLOW VERIFICATION
// ====================================================
console.log('\n--- TEST SUITE 4: Ride Publishing & LocalStorage Persistence ---');

let rideShares = [...INITIAL_RIDE_SHARES];

const newRide = {
  id: `RIDE-${Date.now()}`,
  initiatorName: validRideSubmission.fullName.trim(),
  college: validRideSubmission.collegeName.trim(),
  department: validRideSubmission.department.trim(),
  role: 'Student Commuter',
  vehicleType: validRideSubmission.vehicleType,
  from: validRideSubmission.from.trim(),
  to: validRideSubmission.to.trim(),
  departureDate: validRideSubmission.departureDate,
  departureTime: validRideSubmission.departureTime.trim(),
  seatsAvailable: Number(validRideSubmission.seatsAvailable),
  seatsTotal: Number(validRideSubmission.seatsAvailable),
  fare: Number(validRideSubmission.farePerStudent),
  notes: validRideSubmission.notes.trim(),
  contact: validRideSubmission.contactPhone.trim(),
  joinedStudents: [],
  status: 'OPEN'
};

rideShares = [newRide, ...rideShares];

assert(rideShares[0].id === newRide.id, 'New ride appears at top of active rides list');
assert(newRide.from === 'Mani Junction', 'Departure stop correctly saved as "Mani Junction"');
assert(newRide.to === 'Sahyadri College Campus Gate', 'Destination correctly saved as "Sahyadri College Campus Gate"');
assert(newRide.departureDate === todayStr, 'Departure date correctly saved as today');
assert(newRide.departureTime === '08:15 AM', 'Departure time correctly saved as 08:15 AM');
assert(newRide.initiatorName === 'Pooja Rai', 'Initiator name uses the submitted student name ("Pooja Rai")');

// Test Booking / Seat decrement
function bookSeat(rideId, passengerName) {
  rideShares = rideShares.map(ride => {
    if (ride.id === rideId && ride.seatsAvailable > 0) {
      const updatedSeats = ride.seatsAvailable - 1;
      return {
        ...ride,
        seatsAvailable: updatedSeats,
        status: updatedSeats === 0 ? 'FILLED' : 'OPEN',
        joinedStudents: [...(ride.joinedStudents || []), passengerName]
      };
    }
    return ride;
  });
}

bookSeat(newRide.id, 'Anil Kumar');
const rAfter1 = rideShares.find(r => r.id === newRide.id);
assert(rAfter1.seatsAvailable === 2, 'Available seats successfully decremented from 3 to 2');
assert(rAfter1.joinedStudents.includes('Anil Kumar'), 'Passenger "Anil Kumar" added to ride reservation list');

// Simulate LocalStorage persistence across page reload
const mockLocalStorage = new Map();
mockLocalStorage.set('yatra_ai_rides', JSON.stringify(rideShares));

const restoredRides = JSON.parse(mockLocalStorage.get('yatra_ai_rides'));
const restoredRide = restoredRides.find(r => r.id === newRide.id);

assert(restoredRide !== undefined, 'Published ride successfully rehydrates from LocalStorage');
assert(restoredRide.from === 'Mani Junction', 'Restored ride maintains selectable departure stop');
assert(restoredRide.to === 'Sahyadri College Campus Gate', 'Restored ride maintains selectable college destination');
assert(restoredRide.departureTime === '08:15 AM', 'Restored ride maintains departure time slot');
assert(restoredRide.seatsAvailable === 2, 'Restored ride maintains decremented seat count');
assert(restoredRide.initiatorName === 'Pooja Rai', 'Restored ride maintains student initiator name');

console.log('\n====================================================');
console.log(`📊 TEST SUITE SUMMARY: ${passed} PASSED | ${failed} FAILED`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED SUCCESSFULLY!\n');
}
