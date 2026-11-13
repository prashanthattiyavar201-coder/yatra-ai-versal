# YatraAI (यात्रा AI)
### *Connecting Villages. Empowering Journeys.*

**AI-Powered Rural Mobility & Student Transportation Platform**  
*Developed for the Hackathon Challenge: ROUTELESS: THE LAST MILE – AI-Powered Rural Transportation Challenge*

---

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1.1-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-Unspecified-lightgrey?style=flat-square)](#-license)

---

## 📖 Table of Contents

- [📌 Problem Statement](#-problem-statement)
- [💡 Our Solution](#-our-solution)
- [✨ Key Features](#-key-features)
  - [1. Student Dashboard & Commute Telemetry](#1-student-dashboard--commute-telemetry)
  - [2. Smart Route Optimization Engine](#2-smart-route-optimization-engine)
  - [3. Intelligent Bus Allocation & Capacity Enforcement](#3-intelligent-bus-allocation--capacity-enforcement)
  - [4. Sankalpa Rural Ride-Sharing & Auto Pooling](#4-sankalpa-rural-ride-sharing--auto-pooling)
  - [5. Interactive Seat Request & Reservation Management](#5-interactive-seat-request--reservation-management)
  - [6. Transit Authority Admin Dashboard](#6-transit-authority-admin-dashboard)
  - [7. Fleet & Corridor Demand Analytics](#7-fleet--corridor-demand-analytics)
  - [8. Emergency Incident Simulation & Multi-Tier Recovery](#8-emergency-incident-simulation--multi-tier-recovery)
  - [9. Exam Day Emergency Mode (PromptBattle Surprise Hurdle)](#9-exam-day-emergency-mode-promptbattle-surprise-hurdle)
  - [10. YatraAI Assistant (Gemini LLM & Offline Heuristics)](#10-yatraai-assistant-gemini-llm--offline-heuristics)
  - [11. Pre-Cached Offline Rural Timetable](#11-pre-cached-offline-rural-timetable)
- [🛠️ Technology Stack](#️-technology-stack)
- [📂 Project Architecture](#-project-architecture)
- [🚀 Installation and Setup](#-installation-and-setup)
- [📦 Production Build & Preview](#-production-build--preview)
- [🔄 How YatraAI Works](#-how-yatraai-works)
- [🚨 Emergency Scenario: Exam Day Crisis](#-emergency-scenario-exam-day-crisis)
- [🖼️ Application Screenshots](#️-application-screenshots)
- [🔮 Future Enhancements](#-future-enhancements)
- [⚠️ Project Limitations](#️-project-limitations)
- [👥 Contributors](#-contributors)
- [📄 License](#-license)

---

## 📌 Problem Statement

Rural student commuters face immense mobility barriers across rural India and developing regions:

* **Limited & Infrequent Public Transit**: Government buses in rural hinterlands operate on wide headway intervals (often 1–2 hours apart). Missing a single bus can mean missing an entire school day or examination session.
* **Dangerous Overcrowding & Route Bypass**: Peak morning educational rushes lead to buses running at 110%–130% capacity. Overloaded conductors are forced to skip rural village stops entirely, stranding students along isolated highways.
* **Zero Real-Time Visibility**: Rural transit networks lack live telemetry or digital passenger information systems. Students wait at unsheltered stops with zero visibility into whether their scheduled bus is on time, delayed, or stalled.
* **Vulnerability to Road Disruptions**: Monsoon weather, river causeway flooding, and mechanical breakdowns frequently sever rural corridors with no automated coordination for relief shuttles or detour routes.
* **Absence of Coordinated Community Pooling**: Students commuting along identical highway stretches have no trusted, institutional platform to coordinate carpooling, bike sharing, or shared auto-rickshaw pooling.

---

## 💡 Our Solution

**YatraAI** is an AI-powered rural mobility and student transportation decision-making platform designed specifically for rural educational belts. Modeled after the Dakshina Kannada and Sahyadri rural educational corridor (spanning Sullia, Bellare, Puttur, Mani, BC Road, and Mangaluru), YatraAI bridges the last-mile gap through:

1. **Capacity-Safe Route Optimization**: Evaluates travel time, intermediate village stops, passenger load, punctuality scores, and active road closures to recommend optimal transit corridors.
2. **Dynamic Bus Allocation**: Calculates real-time student demand across every corridor, strictly caps passenger allocations to legal vehicle capacity, and flags unserved queues for relief intervention.
3. **Automated Multi-Incident Recovery**: Automatically coordinates relief vehicles, reallocates underutilized feeder units, and activates student auto pools during breakdowns or weather emergencies.
4. **Institutional Student Ride-Sharing**: Provides a verified, peer-to-peer ride matching network with searchable stops, past-date prevention, and real-time seat reservation controls.
5. **Exam Day Emergency Prioritization**: Protects time-critical student commuters by guaranteeing first-wave priority boarding when semester examinations are scheduled within a 2-hour window.

---

## ✨ Key Features

### 1. Student Dashboard & Commute Telemetry
* **Live Next-Bus Telemetry**: Displays the incoming bus registration number, driver name, contact info, current speed, fuel percentage, and passenger occupancy.
* **Digital Student Pass Integration**: Displays institutional student commuter profiles with verified pass eligibility badges.
* **One-Tap Crowd Signaling**: Enables waiting students to tap *"I am Waiting at Stop"* to broadcast live crowd spikes directly to transit planners.
* **Live Corridor Broadcasts**: Real-time ticker for road condition advisories, breakdown notices, and relief bus ETAs.

### 2. Smart Route Optimization Engine
* **Multi-Route Algorithmic Solver**: Evaluates all candidate corridors between selected village stops and educational campuses.
* **Mathematical Scoring Function**: Combines travel duration, intermediate stop delays, available free seats, overcrowding penalties, breakdown risks, and driver punctuality ratings.
* **Comparative AI Explanations**: Surfaces explicit rationale for why the winning route was recommended and why alternative corridors were rejected.
* **Dynamic Hazard Rerouting**: Automatically detects impassable road closures and routes commuters around flooded river causeways.

### 3. Intelligent Bus Allocation & Capacity Enforcement
* **Corridor-by-Corridor Balancing**: Analyzes student queues against total active seat capacity across 12 distinct rural corridors.
* **Strict Capacity Safety Caps**: Enforces the invariant `allocatedStudents <= totalBusCapacity` across every route, ensuring zero dangerous overcrowding breaches.
* **Deficit & Surplus Detection**: Identifies surplus seats on low-occupancy feeder buses and reallocates them to critical high-demand bottlenecks.

### 4. Sankalpa Rural Ride-Sharing & Auto Pooling
* **Institutional Commuter Form**: Captures student names, verified colleges, academic departments, 10-digit phone numbers, vehicle types, available seats, and split fares.
* **Searchable Stop Comboboxes**: Real-time keystroke filtering across 27 rural village stops and educational campuses.
* **Smart Calendar & Time Validation**: Enforces `min` constraints to block historical dates, validates distinct route endpoints (`from !== to`), and provides 15/30-minute departure intervals across morning, afternoon, and evening slots.

### 5. Interactive Seat Request & Reservation Management
* **Instant Seat Booking Modal**: Commuters can reserve open carpool seats with real-time passenger name and contact registration.
* **Automated Capacity Decrement**: Decrements remaining seats upon reservation and automatically toggles ride status from `OPEN` to `FILLED` when capacity reaches zero.
* **Overbooking Protection**: Strictly disallows reservations on filled vehicles.

### 6. Transit Authority Admin Dashboard
* **High-Level KPI Overview**: Live metric cards displaying total fleet count, active road units, standby reserves, fleet health status, network demand, and available seats.
* **Fleet Directory & Filtering**: Filter 22 buses by category (*Government KSRTC Bus*, *Student Special Bus*, *Rural Feeder Bus*, *Express Bus*, *Emergency Relief Bus*) and operational status (*ACTIVE*, *BROKEN_DOWN*, *IDLE*, *EMERGENCY_REROUTED*).
* **Manual Incident Dispatch**: Operators can trigger simulated breakdowns, resolve mechanical faults, and dispatch emergency backup shuttles.

### 7. Fleet & Corridor Demand Analytics
* **Most Crowded Corridors**: Live ranking of corridors sorted by occupancy percentage and student passenger deficits.
* **Village Queue Aggregation**: Real-time rankings of highest-demand rural village stops (e.g., Mani Junction, BC Road, Uppinangady, Bellare).
* **Additional Fleet Calculations**: Calculates the exact number of 45-seat municipal relief buses required to clear residual student queues.

### 8. Emergency Incident Simulation & Multi-Tier Recovery
* **Multi-Scenario Simulator**: Tests 5 pre-configured emergency scenarios:
  1. *Major Rural Bus Breakdown* (BUS-04 stalled at Mani Junction).
  2. *Route Landslide / Road Blockage* (Netravati River corridor severed).
  3. *University Exam Demand Surge* (+180% passenger queue spike).
  4. *Critical Overcrowding* (Capacity breach avoidance).
  5. *Standby Reserve Depletion* (Inter-depot mutual aid dispatch).
* **Multi-Tiered Student Recovery**: Absorbs stranded students first via adjacent active buses, then via verified student ride-shares, and finally via standby reserve shuttle dispatches.

### 9. Exam Day Emergency Mode (PromptBattle Surprise Hurdle)
* **Simultaneous 4-Incident Crisis Solver**: Coordinates 4 concurrent emergency events in real time:
  1. **Dual Government Bus Breakdowns**: Selects `BUS-01` and `BUS-04`, removes 105 broken seats, and deploys Standby Shuttles `BUS-RESERVE-01` and `BUS-RESERVE-02` (+85 seats).
  2. **+40% Student Demand Surge**: Scales demand from 2,816 to 3,942 students (1.40x multiplier) while maintaining strict capacity safety caps.
  3. **Flood Road Severance**: Flags Netravati River causeway closure on Corridor R-201 and activates the Bellare-Puttur bypass detour (+12 km, +18 mins).
  4. **Imminent Exam Priority**: Prioritizes 14 students with university examinations starting within 2 hours, guaranteeing 100% on-time arrival.

### 10. YatraAI Assistant (Gemini LLM & Offline Heuristics)
* **Hybrid Intelligence Engine**: Supports online Google Gemini 1.5 Flash API with empathetic rural transit prompting when an API key is provided.
* **Offline Heuristic Fallback**: Comprehensive local rule-based assistant answering route questions, breakdown status, carpool options, and timetable schedules without internet or external API dependencies.

### 11. Pre-Cached Offline Rural Timetable
* **Rural Educational Corridor Schedules**: Full offline schedules for all 12 rural corridors, detailing intermediate village stops, distance, estimated travel times, and student bus pass acceptance.

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose in YatraAI |
|---|---|---|---|
| **Frontend Framework** | **React** | `18.3.1` | Component-driven user interface and reactive state management |
| **Build Tool & Bundler** | **Vite** | `6.1.1` | High-performance development server and optimized ES production bundler |
| **CSS Framework** | **Tailwind CSS** | `3.4.17` | Utility-first responsive styling and custom transit design system |
| **Mapping Engine** | **Leaflet** | `1.9.4` | Interactive geospatial mapping and tile layer rendering |
| **React Map Bindings** | **React-Leaflet** | `4.2.1` | Declarative React components for Leaflet map markers, polylines, and popups |
| **Icons** | **Lucide React** | `0.475.0` | Accessible, lightweight SVG icon system |
| **CSS Post-Processing** | **PostCSS & Autoprefixer** | `8.5.2` / `10.4.20` | Vendor prefixing and cross-browser CSS compilation |
| **Data Persistence** | **Web LocalStorage API** | Native | Client-side simulation state and demo persistence |
| **Language & Runtime** | **JavaScript (ES Modules)** | ES2022+ | Core intelligence engine, route algorithms, and business logic |
| **Test Runner** | **Node.js Test Scripts** | Native ES | 167 automated unit, route optimization, persistence, and audit tests |

---

## 📂 Project Architecture

```
prompt_sahyadri/
├── public/
│   ├── bus-icon.svg                  # Vector transit branding icon
│   └── favicon.ico                   # Application browser favicon
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx             # Comprehensive transit authority management console
│   │   │   ├── EmergencyRecoveryModal.jsx     # Multi-tier breakdown recovery inspection modal
│   │   │   └── ExamCrisisDashboard.jsx        # PromptBattle Exam Day Crisis command center
│   │   ├── ai/
│   │   │   └── AIAssistantModal.jsx           # Natural language commute assistant modal
│   │   ├── map/
│   │   │   └── LiveRouteMap.jsx               # Interactive Leaflet transit radar with flood alerts
│   │   ├── planner/
│   │   │   └── SmartRoutePlanner.jsx          # Multi-route solver with comparative AI explanations
│   │   └── student/
│   │       ├── RideMatching.jsx               # Sankalpa student ride-sharing, search, & reservations
│   │       └── StudentDashboard.jsx           # Student commute portal, next bus telemetry, & timetable
│   ├── context/
│   │   └── TransitContext.jsx                 # Global state provider with LocalStorage persistence
│   ├── data/
│   │   └── mockData.js                        # Fictional demonstration dataset (22 buses, 12 routes, 27 stops)
│   ├── services/
│   │   ├── aiAssistantService.js              # Gemini 1.5 Flash API connector + offline heuristic engine
│   │   └── intelligenceEngine.js              # Route optimization, bus allocation, & crisis algorithms
│   ├── tests/
│   │   ├── examCrisis.test.js                 # 50 tests: Exam Day Crisis simultaneous event verification
│   │   ├── intelligenceEngine.test.js         # 39 tests: Route solver, allocation, & recovery tests
│   │   ├── localStoragePersistence.test.js    # 11 tests: Browser persistence across simulated reloads
│   │   ├── productionAudit.test.js            # 20 tests: Production bundle & security audit checks
│   │   └── rideMatching.test.js               # 47 tests: Form validation, searchable stops, & booking tests
│   ├── App.jsx                                # Root application layout with navigation switcher
│   ├── index.css                              # Tailwind CSS directives & custom map styles
│   └── main.jsx                               # React DOM entry point
├── dist/                                      # Production build output generated by Vite
├── index.html                                 # HTML template with Leaflet styles & meta tags
├── package.json                               # Project metadata, dependencies, and build scripts
├── postcss.config.js                          # PostCSS configuration for Tailwind
├── tailwind.config.js                         # Tailwind theme extensions and color palettes
├── vercel.json                                # Production SPA routing configuration
└── vite.config.js                             # Vite bundler configuration with React plugin
```

---

## 🚀 Installation and Setup

Follow these steps to run YatraAI locally on your Windows machine:

### Prerequisites
* **Node.js**: Version 18.0.0 or higher ([Download Node.js](https://nodejs.org/))
* **npm**: Version 9.0.0 or higher (packaged with Node.js)
* **Git**: Installed on your system ([Download Git](https://git-scm.com/))

### 1. Clone the Repository
```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd prompt_sahyadri
```

### 2. Install Project Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The Vite development server will start immediately. Open your browser and navigate to:
```
http://localhost:5173/
```

> **Note**: Both `localhost:5173` and network IP bindings are exposed by default (`--host`) for easy cross-device mobile testing on your local Wi-Fi.

---

## 📦 Production Build & Preview

### Build for Production
To compile and optimize the application into production-ready assets:
```bash
npm run build
```
This triggers Vite's production pipeline:
* Bundles and tree-shakes all React modules into `dist/`.
* Minifies JavaScript and compiles PostCSS/Tailwind into `dist/assets/`.
* Verifies zero broken imports and asset links.

### Preview the Production Bundle Locally
To test the exact production build locally using Vite's embedded preview server:
```bash
npm run preview
```
The preview server will launch at:
```
http://localhost:4173/
```

---

## 🔄 How YatraAI Works

### A. The Student Commuter Workflow
1. **Check Live Commute Status**: Open the **Student Portal**. The next incoming bus for your registered home stop (e.g., *Mani Junction*) is displayed with real-time ETA, bus registration, and live passenger occupancy.
2. **Find the Best Route**: Navigate to the **Smart Route Optimizer** tab. Select your starting village and destination college. The engine evaluates all candidate corridors and surfaces the recommended winner along with alternative routes, intermediate stop counts, and comparative explanations.
3. **Broadcast Arrival Demand**: If waiting at a crowded stop with a delayed bus, tap *"I am Waiting at Stop"*. This broadcasts a crowd demand ping into the central transit database.
4. **Coordinate Peer Ride-Sharing**: If buses are full, navigate to **Sankalpa Rural Ride-Share**. Select from verified student offers or click *"Post a Ride / Auto Pool"* to offer empty vehicle seats using searchable stop comboboxes.
5. **Reserve Seats**: Click *"Request Seat"* on an open carpool offer, enter your name and phone number, and instantly lock in your seat reservation.

### B. The Transit Authority Workflow
1. **Monitor Network Health**: Open the **Transit Authority (Admin)** view. Inspect real-time KPI overview metrics: total operational fleet, active road units, standby reserve bays, total network demand, and available seats.
2. **Review Fleet Allocation**: Switch to **Intelligent Bus Allocation**. Inspect corridor-by-corridor demand against capacity limits. Corridors with passenger deficits or low occupancy are flagged for automated relief shifts.
3. **Simulate & Mitigate Breakdowns**: Use the **Advanced Incident Simulator** to simulate a mechanical breakdown. The multi-tiered recovery engine calculates stranded passengers and deploys standby shuttles to clear the corridor.
4. **Respond to Crises**: Activate the **Exam Day Crisis Mode** to orchestrate multi-incident emergencies simultaneously.

---

## 🚨 Emergency Scenario: Exam Day Crisis

Developed as part of the **PromptBattle Surprise Hurdle**, YatraAI features an automated crisis decision engine that simultaneously mitigates four concurrent emergency disruptions:

```
                                  🚨 EXAM DAY CRISIS TRIGGERED
                                                 │
        ┌────────────────────────┬───────────────┴───────────────┬────────────────────────┐
        ▼                        ▼                               ▼                        ▼
 [Dual Bus Breakdowns]   [+40% Demand Surge]            [Flood Road Blockage]     [Imminent Exams]
   BUS-01 & BUS-04        2,816 ➔ 3,942 Students          Netravati Causeway        14 VTU Students
   -105 Seats Lost        Capacity Caps Enforced         Corridor R-201 Severed    < 2 Hours to Hall
        │                        │                               │                        │
        ▼                        ▼                               ▼                        ▼
 [Standby Deployment]    [Safe Allocation]              [Puttur-Mani Detour]      [Priority Boarding]
   RESERVE-01 & 02        870 Seats Filled               54 km (+12 km)            100% On-Time Arrival
   +85 Seats Restored     0 Capacity Breaches            76 mins (+18 mins)        25-min Buffer
```

### The 4 Simulated Events
1. **Two Government Buses Breakdown**: Government KSRTC buses `BUS-01` (`KA-21-F-1402`) and `BUS-04` (`KA-19-F-3044`) suffer mechanical failure on Corridor R-101. 105 seats are removed from active capacity, and 100 onboard passengers are stranded. The system immediately dispatches Standby Shuttles `BUS-RESERVE-01` (40 seats) and `BUS-RESERVE-02` (45 seats), plus reallocates underutilized feeder `BUS-13`.
2. **+40% Student Demand Surge**: Student demand surges by exactly 1.40x (from 2,816 to 3,942 students) across all 12 corridors. Passenger allocations are strictly capped at vehicle capacity, ensuring zero dangerous overcrowding breaches.
3. **Flood Road Severance**: Monsoon flooding raises the Netravati River causeway 4.2 ft above the roadway between *Uppinangady River Road* (`ST-08`) and *Valavoor Cross* (`ST-09`), closing Corridor R-201. The system computes a dynamic alternative detour via the Bellare-Puttur bypass (**54 km, 76 mins vs 42 km, 58 mins**).
4. **University Exam Priority**: 14 student commuters have university semester examinations scheduled within 2 hours. The engine prioritizes them for first-wave boarding, guaranteeing that **all 14 students arrive with a 25-minute buffer before examination hall doors close**.

> **Demonstration Data Notice**: All buses, driver profiles, vehicle registrations, student records, and road blockage scenarios in this repository represent **internally consistent fictional demonstration data** modeled after the Dakshina Kannada geography for hackathon evaluation purposes.

---

## 🖼️ Application Screenshots

### 1. Student Commuter Portal & Route Optimizer
```
+---------------------------------------------------------------------------------+
|  YatraAI  [Sahyadri Rural Pilot]                       [Student Portal] [Admin] |
+---------------------------------------------------------------------------------+
|  🚨 TRANSIT SOS ALERT: Bus KA-19-F-3044 Stalled near Mani Junction              |
|  [View Recovery Plan]  [Find Student Ride Match]  [Ask AI Guide]                |
+---------------------------------------------------------------------------------+
|  NEXT INCOMING BUS: Sullia - Puttur Express 1 • KA-21-F-1402 • Arriving in 12m  |
|  DIGITAL PASS: Ananya Hegde • Sahyadri College (CS&E) • Pass ID: SCEM-2026-8812 |
+---------------------------------------------------------------------------------+
|  [Smart Route Optimizer]  [Live Transit Radar]  [Ride-Share]  [Timetable]       |
|                                                                                 |
|  Starting Stop: [ Mani Junction          v ]                                    |
|  Destination:   [ Sahyadri Campus Gate   v ]                                    |
|                                                                                 |
|  ★ TOP RECOMMENDED OPTION: ROUTE-101 (Express Corridor)                         |
|    Duration: ~28 mins • Distance: 21.4 km • 3 Intermediate Stops • 14 Free Seats|
|    AI Rationale: Fastest travel duration; zero active corridor disruptions.     |
+---------------------------------------------------------------------------------+
```
*Screenshot Placeholder: Student Commuter Portal with live telemetry and route solver.*

### 2. Sankalpa Rural Student Ride-Sharing
```
+---------------------------------------------------------------------------------+
|  Sankalpa Student Ride-Matching                   [ + Post a Ride / Auto Pool ] |
|  Safe, verified student pooling along rural highway corridors                   |
+---------------------------------------------------------------------------------+
|  [RIDE-1] Karthik Shenoy (CS&E) • Two-Wheeler • 1 Seat Available • Free / Split |
|           From: Puttur KSRTC Bus Stand  ➔  To: Sahyadri Campus Gate             |
|           Departure: 08:15 AM • Helmet Provided • Verified Student ID           |
|           [ Call Driver ]  [ Request Seat ]                                     |
|                                                                                 |
|  [RIDE-2] Pooja Bhat & Friends • Shared Auto • 2 Seats Available • ₹25/student  |
|           From: Mani Junction  ➔  To: Sahyadri Campus Gate                      |
|           Departure: 08:25 AM • Govt bus bypassed stop; sharing auto fare       |
|           [ Call Driver ]  [ Request Seat ]                                     |
+---------------------------------------------------------------------------------+
```
*Screenshot Placeholder: Sankalpa peer-to-peer student carpool and auto pooling interface.*

### 3. Exam Day Emergency Mode (Command Center)
```
+---------------------------------------------------------------------------------+
|  🚨 EXAM DAY EMERGENCY MODE (SIMULATION ACTIVE)         [ Reset to Normal Ops ] |
|  Dual Breakdowns • +40% Demand Surge • Flood Closure • VTU Exam Priority Active |
+---------------------------------------------------------------------------------+
|  Total Demand: 3,942 (+40%)  |  Active Fleet: 16 Units  |  Capacity: 870 Seats  |
|  Allocated: 870 Students     |  Exam On-Time: 14 / 14   |  Unserved Queue: 3,062|
+---------------------------------------------------------------------------------+
|  [Overview & Impact] [Bus Allocation] [Flood Detours] [Exam Priority Manifest]  |
|                                                                                 |
|  EXAM STUDENT PRIORITY ROSTER:                                                  |
|  1. Ananya Hegde   • Valavoor Cross  ➔ Sahyadri Campus • Exam: 09:30 AM • On-Time|
|  2. Rohan Shenoy   • Uppinangady     ➔ Sahyadri Campus • Exam: 09:30 AM • On-Time|
|  3. Pooja K. Rai   • Mani Junction   ➔ Sahyadri Campus • Exam: 09:30 AM • On-Time|
+---------------------------------------------------------------------------------+
```
*Screenshot Placeholder: Exam Day Crisis Command Center with real-time before/after metrics.*

---

## 🔮 Future Enhancements

The following capabilities represent realistic future development goals beyond the hackathon prototype:

* **Live Hardware GPS / OBD-II Integration**: Transition from simulated telemetry to physical GPS tracker streams mounted on state transport and institutional buses.
* **Official State Transit API Integration**: Direct integration with government road transport portals (such as KSRTC / NWKRTC) for synchronized crew rosters and schedule updates.
* **Native Mobile Apps (Android & iOS)**: Native mobile applications with background location tracking, push notifications for bus arrivals, and offline SMS fallback for areas with zero cellular data.
* **Multilingual Voice Assistant**: Natural voice interaction in regional languages including **Kannada (ಕನ್ನಡ)**, **Tulu (ತುಳು)**, and **Hindi (हिंदी)** to assist rural commuters with limited digital literacy.
* **Automated UPI Split Payments**: Integrated peer-to-peer micro-payments for students sharing auto-rickshaws and carpool fuel costs.

---

## ⚠️ Project Limitations

In the interest of full academic and hackathon integrity, the current prototype operates under the following known constraints:

* **Demonstration Dataset**: The 22 buses, 12 routes, and 27 rural stops are pre-configured fictional demonstration data modeled after the Dakshina Kannada rural belt.
* **Client-Side Persistence**: State changes (ride creation, crowd pings, seat reservations, and scenario resets) persist via browser `localStorage` (`yatra_ai_` key namespace). There is currently no multi-tenant server database.
* **Simulated Telemetry**: GPS coordinates, vehicle speeds, and fuel levels are programmatic demonstration values rather than live satellite OBD feeds.
* **Gemini LLM Key Requirement**: The AI Assistant operates in offline heuristic mode by default. Accessing the Google Gemini 1.5 Flash online model requires an API key provided in the UI settings modal.

---

## 👥 Contributors

* **Project Author & Developer**: Individual Hackathon Project  
  *Built for ROUTELESS: THE LAST MILE – AI-Powered Rural Transportation Challenge.*

---

## 📄 License

This project currently has **no specified open-source license**. All rights are reserved by the project creator. Unauthorized redistribution, commercial deployment, or copying without permission is prohibited.
