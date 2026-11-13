// YatraAI - AI Transportation Assistant Service
// Supports optional Google Gemini API with robust rule-based rural mobility fallback

export async function askTransitAssistant({ prompt, contextData, apiKey }) {
  // If an API key is provided and valid, try Gemini API first
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are YatraAI Transit Assistant, an empathetic, hyper-local AI guide helping rural students and travelers in the Sahyadri/Karnataka rural belt (Sullia, Puttur, Mani, BC Road, Mangaluru) travel to school and college safely despite bus shortages.
Current Live System State:
- Buses Active: ${contextData.buses.filter(b => b.status === 'ACTIVE').length}
- Buses Broken Down: ${contextData.buses.filter(b => b.status === 'BROKEN_DOWN').map(b => `${b.regNumber} at ${b.currentStop}`).join(', ') || 'None'}
- Reserve Shuttles: ${contextData.buses.filter(b => b.status === 'IDLE' || b.status === 'EMERGENCY_REROUTED').length}
- Open Student Ride-Pools: ${contextData.rideShares.filter(r => r.status === 'OPEN').length}
- High-Risk Village Bottlenecks: Mani Junction, Bellare, Valavoor.

Rules:
1. Keep answers concise, actionable, and encouraging (max 3-4 bullet points or short paragraphs).
2. If there is a breakdown, immediately provide the emergency backup status and carpool alternatives.
3. Support queries in simple English or Kannada/Hinglish transit terms.

User Question: ${prompt}`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return {
            text: candidateText,
            source: 'Gemini 1.5 Flash (Online)'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local heuristic engine:', err);
    }
  }

  // Heuristic Rule-Based Fallback Engine
  const p = prompt.toLowerCase();
  const brokenBus = contextData.buses.find(b => b.status === 'BROKEN_DOWN');
  const reliefBus = contextData.buses.find(b => b.status === 'EMERGENCY_REROUTED');
  const activeBuses = contextData.buses.filter(b => b.status === 'ACTIVE');
  const openRides = contextData.rideShares.filter(r => r.status === 'OPEN');

  // Query matching
  if (p.includes('breakdown') || p.includes('broken') || p.includes('accident') || p.includes('stuck') || p.includes('sos') || p.includes('emergency')) {
    if (brokenBus) {
      return {
        text: `⚠️ **Emergency Breakdown Active**: Bus **${brokenBus.regNumber}** (${brokenBus.routeName}) has broken down near **${brokenBus.currentStop}**.\n\n` +
          `• **Relief Shuttle**: ${reliefBus ? `Reserve Shuttle (KA-19-F-9999) is currently ${reliefBus.currentStop}! ETA ~10-12 mins.` : `Authority notified. Dispatching reserve bus from Sahyadri Bay.`}\n` +
          `• **Carpool Fallback**: We have found **${openRides.length} student ride-pools** operating on nearby corridors. Check the 'Ride Matching' tab!\n` +
          `• **Student Advisory**: Stay in groups at designated stop shelters. Do not hitchhike with unverified vehicles.`,
        source: 'YatraAI Emergency Response Engine (Offline Fallback)'
      };
    } else {
      return {
        text: `✅ **All Systems Normal**: There are currently **no reported breakdowns** across the Sahyadri rural network.\n\n` +
          `• 5 out of 6 scheduled shuttles are running on time.\n` +
          `• If you encounter a stalled bus or are stranded, use the red "Simulate/Report Breakdown" trigger in the admin portal or report it immediately to the depot.`,
        source: 'YatraAI Fleet Status Engine'
      };
    }
  }

  if (p.includes('next bus') || p.includes('timing') || p.includes('schedule') || p.includes('when') || p.includes('time') || p.includes('sullia') || p.includes('puttur') || p.includes('barutteya')) {
    const nextBus = activeBuses[0] || contextData.buses[0];
    return {
      text: `🚌 **Upcoming Bus Departures & ETAs**:\n\n` +
        `• **Next Arrival at Mani / Puttur**: ${nextBus.name} (${nextBus.regNumber}) - currently at **${nextBus.currentStop}**, heading to **${nextBus.nextStop}**. Speed: ${nextBus.speedKmH} km/h.\n` +
        `• **Occupancy Status**: ${nextBus.currentPassengers}/${nextBus.capacity} seats (${Math.round((nextBus.currentPassengers/nextBus.capacity)*100)}% capacity).\n` +
        `• **Student Pass**: Accepted on all green & blue KSRTC Express units. Ensure you have your valid KSRTC digital/laminated student ID.`,
      source: 'YatraAI Route Schedule Engine'
    };
  }

  if (p.includes('carpool') || p.includes('ride') || p.includes('share') || p.includes('pool') || p.includes('auto')) {
    const topRide = openRides[0];
    return {
      text: `🤝 **Sankalpa Rural Student Ride-Sharing**:\n\n` +
        `• There are currently **${openRides.length} active verified ride-shares**.\n` +
        (topRide ? `• **Recommended Pick**: ${topRide.initiatorName} (${topRide.vehicleType}) from *${topRide.from}* to *${topRide.to}* at **${topRide.departureTime}** with **${topRide.seatsAvailable} seat(s)** left.\n` : '') +
        `• To join or create a pool, switch to the **Student Ride Matching** tab on your dashboard. Female student buddy matching is prioritised during evening hours.`,
      source: 'YatraAI Peer Match Engine'
    };
  }

  if (p.includes('pass') || p.includes('concession') || p.includes('fee') || p.includes('ticket') || p.includes('fare')) {
    return {
      text: `🎫 **KSRTC Student Concession Pass Info**:\n\n` +
        `• All buses coded **ROUTE-101**, **ROUTE-204**, and **ROUTE-305** accept the Karnataka State Student Bus Pass.\n` +
        `• **Emergency Provision**: If you forgot your pass, present your college ERP identity card to the conductor. YatraAI buses have digital sync with Sahyadri College roll numbers.\n` +
        `• Shared rural auto-rickshaw pools generally cost ₹20 - ₹30 per student from Mani to Adyar.`,
      source: 'YatraAI Policy Guide'
    };
  }

  if (p.includes('crowd') || p.includes('full') || p.includes('rush') || p.includes('mani') || p.includes('bellare')) {
    return {
      text: `📊 **Crowd & Bottleneck Advisory**:\n\n` +
        `• **Mani Junction**: High student crowd warning between 07:30 AM - 08:30 AM (approx. 51 students waiting).\n` +
        `• **Bellare Village**: 28 students reported waiting.\n` +
        `• **Recommendation**: Tap the "I am waiting at stop" button to signal depot controllers to dispatch the Sahyadri standby shuttle or join an auto pool.`,
      source: 'YatraAI Demand Analytics Engine'
    };
  }

  // Default response
  return {
    text: `Namaskara! I am your **YatraAI Rural Transit Assistant** 🌱.\n\n` +
      `Here is how I can assist your daily commute:\n` +
      `1. **Find Next Bus**: Ask *"When is the next bus from Mani or Puttur to Sahyadri?"*\n` +
      `2. **Check Overcrowding**: Ask *"Which stops are most crowded right now?"*\n` +
      `3. **Breakdown / SOS**: Ask *"What should I do if Bus 4 broke down?"*\n` +
      `4. **Student Carpools**: Ask *"Are there shared autos or student rides available?"*`,
    source: 'YatraAI Assistant (Knowledge Base)'
  };
}
