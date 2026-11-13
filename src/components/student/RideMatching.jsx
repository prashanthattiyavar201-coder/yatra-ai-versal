import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import { EDUCATIONAL_HUBS } from '../../data/mockData';
import {
  Users,
  Car,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle,
  Phone,
  Shield,
  AlertCircle,
  X,
  IndianRupee,
  GraduationCap,
  Calendar,
  Building2,
  ChevronDown,
  Check,
  Search
} from 'lucide-react';

// Curated 15/30-minute interval departure time slots covering morning, afternoon, and evening travel
export const DEPARTURE_TIME_SLOTS = [
  {
    group: 'Morning Travel (College Arrival)',
    slots: [
      '06:30 AM',
      '06:45 AM',
      '07:00 AM',
      '07:15 AM',
      '07:30 AM',
      '07:45 AM',
      '08:00 AM',
      '08:15 AM',
      '08:30 AM',
      '08:45 AM',
      '09:00 AM',
      '09:15 AM',
      '09:30 AM',
      '09:45 AM',
      '10:00 AM'
    ]
  },
  {
    group: 'Afternoon Travel',
    slots: [
      '11:30 AM',
      '12:00 PM',
      '12:30 PM',
      '01:00 PM',
      '01:30 PM',
      '02:00 PM',
      '02:30 PM',
      '03:00 PM'
    ]
  },
  {
    group: 'Evening Travel (College Departure)',
    slots: [
      '03:30 PM',
      '03:45 PM',
      '04:00 PM',
      '04:15 PM',
      '04:30 PM',
      '04:45 PM',
      '05:00 PM',
      '05:15 PM',
      '05:30 PM',
      '05:45 PM',
      '06:00 PM',
      '06:30 PM',
      '07:00 PM'
    ]
  }
];

// Reusable Searchable Dropdown Component with Instant Filter & Quick Chips
function SearchableLocationSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Type to search or choose...',
  error,
  icon: Icon,
  required = true,
  popularChips = []
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setFilterText('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on user typing
  const filteredOptions = useMemo(() => {
    if (!filterText.trim()) return options;
    const q = filterText.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, filterText]);

  const handleSelect = (opt) => {
    onChange(opt);
    setFilterText('');
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setFilterText('');
  };

  return (
    <div className="relative space-y-1" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-slate-700 font-semibold text-xs flex items-center gap-1">
          {Icon && <Icon className="w-3.5 h-3.5 text-slate-500" />}
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
            Selected
          </span>
        )}
      </div>

      <div className="relative">
        <input
          type="text"
          value={isOpen && filterText !== '' ? filterText : value}
          onChange={(e) => {
            const val = e.target.value;
            setFilterText(val);
            onChange(val);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full border rounded-lg p-2 pr-14 text-xs font-medium focus:ring-2 focus:outline-none transition ${
            error
              ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30 text-rose-900'
              : 'border-slate-300 focus:ring-emerald-500 bg-white text-slate-800'
          }`}
        />

        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {value && (
            <button
              type="button"
              tabIndex={-1}
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition"
              title="Clear selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => {
              setFilterText('');
              setIsOpen(!isOpen);
            }}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
            title="Toggle dropdown list"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {error && <p className="text-[10px] text-rose-600 font-medium mt-0.5">{error}</p>}

      {/* Quick selection chips for 1-click convenience */}
      {popularChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          <span className="text-[10px] text-slate-400 font-medium mr-0.5">Quick:</span>
          {popularChips.map((chip) => {
            const isChipSelected = value === chip;
            return (
              <button
                type="button"
                key={chip}
                onClick={() => handleSelect(chip)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                  isChipSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
                }`}
              >
                {chip.split(' (')[0]}
              </button>
            );
          })}
        </div>
      )}

      {/* Dropdown Options List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-52 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs divide-y divide-slate-100">
          <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 flex items-center justify-between sticky top-0 z-10 border-b border-slate-200">
            <span>{filteredOptions.length} available locations</span>
            {filterText && (
              <button
                type="button"
                onClick={() => setFilterText('')}
                className="text-emerald-700 hover:underline normal-case text-[10px] font-semibold"
              >
                Show all ({options.length})
              </button>
            )}
          </div>

          <div className="py-0.5">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-slate-500 italic">
                <p>No exact match for "{filterText}".</p>
                <button
                  type="button"
                  onClick={() => handleSelect(filterText)}
                  className="mt-1 text-emerald-600 hover:underline font-semibold text-[11px]"
                >
                  Use "{filterText}" anyway
                </button>
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = value === opt;
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 transition flex items-center justify-between group ${
                      isSelected ? 'bg-emerald-100/70 text-emerald-950 font-bold' : 'text-slate-700 hover:text-emerald-900'
                    }`}
                  >
                    <span className="truncate pr-2">{opt}</span>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <span className="text-[10px] text-slate-300 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition">
                        Select
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RideMatching() {
  const { rideShares, addRideShare, joinRideShare, routes } = useTransit();
  const [showModal, setShowModal] = useState(false);
  const [joinedSuccessMessage, setJoinedSuccessMessage] = useState('');

  // Booking Modal State (When someone clicks "Request Seat")
  const [bookingRide, setBookingRide] = useState(null);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Form State for "Post a Ride / Auto Pool"
  const todayStr = new Date().toISOString().split('T')[0];
  const [fullName, setFullName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState(todayStr);
  const [departureTime, setDepartureTime] = useState('08:30 AM');

  const [vehicleType, setVehicleType] = useState('Shared Auto-Rickshaw');
  const [seatsAvailable, setSeatsAvailable] = useState(2);
  const [farePerStudent, setFarePerStudent] = useState('20');
  const [notes, setNotes] = useState('');

  // Form Validation Errors State
  const [errors, setErrors] = useState({});

  // Extract unique departure village stops from the YatraAI dataset
  const departureStopOptions = useMemo(() => {
    const stopsSet = new Set();
    if (routes && Array.isArray(routes)) {
      routes.forEach((r) => {
        if (r.stops && Array.isArray(r.stops)) {
          r.stops.forEach((s) => {
            if (s.name) {
              const clean = s.name.replace(/\s*\(High Risk Point\)/gi, '').trim();
              stopsSet.add(clean);
            }
          });
        }
      });
    }
    // Ensure all canonical rural stops from project specification are indexed
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
    canonicalStops.forEach((st) => stopsSet.add(st));
    return Array.from(stopsSet).sort((a, b) => a.localeCompare(b));
  }, [routes]);

  // Extract destination colleges, educational hubs and transit interchanges
  const destinationOptions = useMemo(() => {
    const destSet = new Set();
    if (EDUCATIONAL_HUBS && Array.isArray(EDUCATIONAL_HUBS)) {
      EDUCATIONAL_HUBS.forEach((h) => {
        if (h.name) destSet.add(h.name);
      });
    }
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
    return Array.from(destSet).sort((a, b) => a.localeCompare(b));
  }, []);

  // Reset Form
  const resetForm = () => {
    setFullName('');
    setCollegeName('');
    setDepartment('');
    setContactPhone('');
    setFrom('');
    setTo('');
    setDepartureDate(todayStr);
    setDepartureTime('08:30 AM');
    setVehicleType('Shared Auto-Rickshaw');
    setSeatsAvailable(2);
    setFarePerStudent('20');
    setNotes('');
    setErrors({});
  };

  // Validate Form
  const validateForm = () => {
    const errs = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errs.fullName = 'Full name is required (at least 2 characters).';
    }

    if (!collegeName.trim() || collegeName.trim().length < 2) {
      errs.collegeName = 'College name is required.';
    }

    if (!department.trim() || department.trim().length < 2) {
      errs.department = 'Department is required (e.g. Computer Science, MBA).';
    }

    // Phone format: Indian 10 digits
    const cleanedPhone = contactPhone.replace(/[^0-9]/g, '');
    if (!cleanedPhone || cleanedPhone.length < 10) {
      errs.contactPhone = 'Please enter a valid 10-digit contact phone number.';
    }

    if (!from.trim() || from.trim().length < 2) {
      errs.from = 'Departure village or bus stop is required.';
    }

    if (!to.trim() || to.trim().length < 2) {
      errs.to = 'Destination college or location is required.';
    }

    if (from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      errs.to = 'Departure stop and destination location must be different.';
    }

    if (!departureDate) {
      errs.departureDate = 'Departure date is required.';
    } else if (departureDate < todayStr) {
      errs.departureDate = 'Departure date cannot be in the past. Please select today or a future date.';
    }

    if (!departureTime || !departureTime.trim()) {
      errs.departureTime = 'Departure time is required.';
    }

    const seatsNum = Number(seatsAvailable);
    if (!seatsNum || seatsNum <= 0) {
      errs.seatsAvailable = 'Available seats must be greater than zero.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateRide = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newRideData = {
      initiatorName: fullName.trim(),
      college: collegeName.trim(),
      department: department.trim(),
      role: 'Student Commuter',
      vehicleType,
      from: from.trim(),
      to: to.trim(),
      departureDate,
      departureTime: departureTime.trim(),
      seatsAvailable: Number(seatsAvailable),
      seatsTotal: Number(seatsAvailable),
      fare: farePerStudent.trim() ? Number(farePerStudent) : 0,
      notes: notes.trim() || 'Safe student pool along rural highway.',
      contact: contactPhone.trim(),
      joinedStudents: [],
      status: 'OPEN'
    };

    addRideShare(newRideData);

    setJoinedSuccessMessage(`🎉 Ride offer published by ${newRideData.initiatorName}! Offering ${newRideData.seatsAvailable} seat(s) from ${newRideData.from} to ${newRideData.to}.`);
    setShowModal(false);
    resetForm();
    setTimeout(() => setJoinedSuccessMessage(''), 7000);
  };

  // Open booking modal
  const handleOpenBooking = (ride) => {
    setBookingRide(ride);
    setPassengerName('');
    setPassengerPhone('');
    setBookingError('');
  };

  // Submit seat booking
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!passengerName.trim()) {
      setBookingError('Please enter your full name to reserve a seat.');
      return;
    }

    if (bookingRide && bookingRide.seatsAvailable > 0) {
      joinRideShare(bookingRide.id, passengerName.trim());
      setJoinedSuccessMessage(`✅ Seat confirmed for ${passengerName.trim()} on ${bookingRide.initiatorName}'s ride to ${bookingRide.to}! Driver Contact: ${bookingRide.contact}`);
      setBookingRide(null);
      setTimeout(() => setJoinedSuccessMessage(''), 7000);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Rural Student Community
            </span>
            <span className="text-emerald-200 text-xs font-medium">Verified Peer Carpool & Auto-Share</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mt-1">Sankalpa Rural Student Ride-Sharing</h2>
          <p className="text-xs md:text-sm text-emerald-100 max-w-2xl mt-1 leading-relaxed">
            Stranded due to full government buses? Share an auto-rickshaw, car, or two-wheeler with classmates traveling along the same corridor. Every offer is posted by verified students.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-4 py-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2 shadow-md transition whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Ride / Auto Pool</span>
        </button>
      </div>

      {/* Success Notification */}
      {joinedSuccessMessage && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3.5 rounded-xl text-xs md:text-sm flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>{joinedSuccessMessage}</span>
        </div>
      )}

      {/* Active Rides Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">
          Available Rides: <strong className="text-emerald-700">{rideShares.length} Offers</strong>
        </span>
        <span>Showing real student offers • Verified college IDs</span>
      </div>

      {/* Rides List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rideShares.map(ride => {
          const isFull = ride.seatsAvailable <= 0;
          return (
            <div
              key={ride.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition ${
                isFull ? 'border-slate-200 bg-slate-50/60' : 'border-emerald-200/80 hover:border-emerald-400'
              }`}
            >
              <div className="space-y-3">
                {/* Header with Initiator details */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shadow-2xs">
                      {ride.initiatorName?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                        {ride.initiatorName}
                        <Shield className="w-3.5 h-3.5 text-blue-500 inline" title="Student ID Verified" />
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                        {ride.college}
                      </p>
                      {ride.department && (
                        <p className="text-[10px] text-emerald-700 font-medium truncate max-w-[170px]">
                          {ride.department}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isFull ? 'bg-slate-200 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isFull ? 'FILLED' : `${ride.seatsAvailable} / ${ride.seatsTotal} Free`}
                  </span>
                </div>

                {/* Journey Details */}
                <div className="bg-slate-50 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center text-slate-700 gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium text-slate-500">From:</span>
                    <span className="font-bold text-slate-800 truncate">{ride.from}</span>
                  </div>
                  <div className="flex items-center text-slate-700 gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    <span className="font-medium text-slate-500">To:</span>
                    <span className="font-bold text-slate-800 truncate">{ride.to}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200/60 text-[11px]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {ride.departureDate ? `${ride.departureDate} • ` : ''}{ride.departureTime}
                    </span>
                    <span className="font-semibold text-slate-700">{ride.vehicleType}</span>
                  </div>
                </div>

                {/* Fare & Notes */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-slate-500 flex items-center gap-0.5">
                    <IndianRupee className="w-3 h-3 text-slate-400" /> Fare:
                    <strong className="text-slate-800 pl-0.5">
                      {ride.fare > 0 ? `₹${ride.fare} / student` : 'Free / Fuel split'}
                    </strong>
                  </span>
                  {ride.joinedStudents && ride.joinedStudents.length > 0 && (
                    <span className="text-[10px] text-slate-400">
                      {ride.joinedStudents.length} booked
                    </span>
                  )}
                </div>

                {ride.notes && (
                  <p className="text-xs text-slate-600 italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/40">
                    "{ride.notes}"
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${ride.contact}`}
                  className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Driver
                </a>

                <button
                  disabled={isFull}
                  onClick={() => handleOpenBooking(ride)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm transition ${
                    isFull
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {isFull ? 'Seats Full' : 'Request Seat'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. Post a Ride User Input Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">Offer a Student Ride / Pool</h3>
                  <p className="text-xs text-emerald-100">Every ride uses your submitted information</p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateRide} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs bg-slate-50">
              {/* Validation Summary Error (if any) */}
              {Object.keys(errors).length > 0 && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Please correct the highlighted fields:</p>
                    <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-[11px]">
                      {Object.values(errors).map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Section 1: Personal Details */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  1. Student Personal Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Hegde"
                      className={`w-full border rounded-lg p-2 text-xs focus:ring-2 focus:outline-none ${
                        errors.fullName ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.fullName && <p className="text-[10px] text-rose-600 mt-0.5">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Contact Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 94812 34567"
                      className={`w-full border rounded-lg p-2 text-xs focus:ring-2 focus:outline-none ${
                        errors.contactPhone ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.contactPhone && <p className="text-[10px] text-rose-600 mt-0.5">{errors.contactPhone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      College Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. Sahyadri College of Engineering"
                      className={`w-full border rounded-lg p-2 text-xs focus:ring-2 focus:outline-none ${
                        errors.collegeName ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.collegeName && <p className="text-[10px] text-rose-600 mt-0.5">{errors.collegeName}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Department <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Computer Science / MBA"
                      className={`w-full border rounded-lg p-2 text-xs focus:ring-2 focus:outline-none ${
                        errors.department ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.department && <p className="text-[10px] text-rose-600 mt-0.5">{errors.department}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Journey Details */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    2. Journey Details
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                    Smart Stop Selector
                  </span>
                </h4>

                {/* 1. Departure Village / Bus Stop (Searchable Dropdown) */}
                <SearchableLocationSelect
                  label="Departure Village / Bus Stop"
                  value={from}
                  onChange={(val) => {
                    setFrom(val);
                    if (errors.from) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.from;
                        return next;
                      });
                    }
                  }}
                  options={departureStopOptions}
                  placeholder="Search village or bus stop (e.g. Mani Junction, Bellare)..."
                  error={errors.from}
                  icon={MapPin}
                  popularChips={[
                    'Mani Junction',
                    'Puttur KSRTC Depot',
                    'Sullia Rural Bus Stand',
                    'BC Road Kaikamba',
                    'Uppinangady River Road'
                  ]}
                />

                {/* 2. Destination College / Location (Searchable Dropdown) */}
                <SearchableLocationSelect
                  label="Destination College / Location"
                  value={to}
                  onChange={(val) => {
                    setTo(val);
                    if (errors.to) {
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.to;
                        return next;
                      });
                    }
                  }}
                  options={destinationOptions}
                  placeholder="Search college or destination hub (e.g. Sahyadri Campus, Puttur)..."
                  error={errors.to}
                  icon={Building2}
                  popularChips={[
                    'Sahyadri College Campus Gate',
                    'Vivekananda College Campus (Puttur)',
                    'Mangaluru Central Transit Terminal (State Bank)',
                    'Alva’s Institute Campus (Moodabidri)'
                  ]}
                />

                {/* 3. Departure Date & Time Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-700 font-semibold text-xs flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Departure Date <span className="text-rose-500">*</span>
                      </label>
                      {departureDate === todayStr && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium border border-emerald-200">
                          Today
                        </span>
                      )}
                    </div>
                    <input
                      type="date"
                      min={todayStr}
                      value={departureDate}
                      onChange={(e) => {
                        setDepartureDate(e.target.value);
                        if (errors.departureDate) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.departureDate;
                            return next;
                          });
                        }
                      }}
                      className={`w-full border rounded-lg p-2 text-xs font-medium focus:ring-2 focus:outline-none transition ${
                        errors.departureDate
                          ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30 text-rose-900'
                          : 'border-slate-300 focus:ring-emerald-500 bg-white text-slate-800'
                      }`}
                    />
                    {errors.departureDate && (
                      <p className="text-[10px] text-rose-600 font-medium mt-0.5">{errors.departureDate}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-700 font-semibold text-xs flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Departure Time Slot <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] text-slate-400">15/30-min intervals</span>
                    </div>
                    <select
                      value={departureTime}
                      onChange={(e) => {
                        setDepartureTime(e.target.value);
                        if (errors.departureTime) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.departureTime;
                            return next;
                          });
                        }
                      }}
                      className={`w-full border rounded-lg p-2 text-xs font-medium focus:ring-2 focus:outline-none transition bg-white text-slate-800 ${
                        errors.departureTime
                          ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30'
                          : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    >
                      <option value="" disabled>Select scheduled departure time</option>
                      {DEPARTURE_TIME_SLOTS.map((group) => (
                        <optgroup key={group.group} label={group.group}>
                          {group.slots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {errors.departureTime && (
                      <p className="text-[10px] text-rose-600 font-medium mt-0.5">{errors.departureTime}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Ride Details */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Car className="w-3.5 h-3.5 text-blue-600" />
                  3. Ride & Capacity Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="Shared Auto-Rickshaw">Shared Auto-Rickshaw</option>
                      <option value="Car (Carpool)">Car (Carpool)</option>
                      <option value="Two Wheeler (Bike/Scooter)">Two Wheeler (Bike/Scooter)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Available Seats <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={seatsAvailable}
                      onChange={(e) => setSeatsAvailable(e.target.value)}
                      className={`w-full border rounded-lg p-2 text-xs focus:ring-2 focus:outline-none ${
                        errors.seatsAvailable ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' : 'border-slate-300 focus:ring-emerald-500'
                      }`}
                    />
                    {errors.seatsAvailable && <p className="text-[10px] text-rose-600 mt-0.5">{errors.seatsAvailable}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Fare per Student (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={farePerStudent}
                      onChange={(e) => setFarePerStudent(e.target.value)}
                      placeholder="0 for free / fuel split"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Helmet provided for bike. Leaving sharp at 8:30 AM. Girl students preferred."
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Ride Offer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Request Seat Booking Modal */}
      {bookingRide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setBookingRide(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Request Seat Reservation</h3>
                <p className="text-xs text-slate-500">Commute with {bookingRide.initiatorName}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Route:</span>
                <span className="font-bold text-slate-800">{bookingRide.from} ➔ {bookingRide.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time:</span>
                <span className="font-semibold text-slate-700">{bookingRide.departureTime} ({bookingRide.vehicleType})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fare:</span>
                <span className="font-bold text-emerald-700">{bookingRide.fare > 0 ? `₹${bookingRide.fare}` : 'Free'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Seats:</span>
                <span className="font-bold text-slate-900">{bookingRide.seatsAvailable} Seat(s)</span>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Sandeep Varma"
                  required
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Your Contact Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="e.g. 98450 XXXXX"
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {bookingError && (
                <p className="text-[11px] text-rose-600 font-semibold">{bookingError}</p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookingRide(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition"
                >
                  Confirm Seat Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
