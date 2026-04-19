/**
 * js/data.js  —  Central data store
 *
 * Edit bin fill levels, locations, and chart values here.
 * mapX / mapY are percentage positions on the SCDI floor plan SVG.
 *
 * TO CONNECT LIVE DATA: replace the static `fill` values with
 * values fetched from Adafruit IO (see js/adafruit.js when ready).
 */

const WM = {

  // ── Bin data ──────────────────────────────────────────────────────────────
  bins: [
    {
      id: "bin-1",
      location: "SCDI 1st Floor — Main Entrance",
      fill: 85,
      updatedAgo: "2 min ago",
      priority: "high",
      colorClass: "red",
      statusLabel: "High Priority",
      mapX: "8%",    // near Main Entrance bottom-left
      mapY: "78%",
      highTraffic: true,
    },
    {
      id: "bin-2",
      location: "SCDI 1st Floor — Networking Area",
      fill: 62,
      updatedAgo: "5 min ago",
      priority: "moderate",
      colorClass: "amber",
      statusLabel: "Moderate",
      mapX: "28%",   // networking/breakfast area
      mapY: "82%",
      highTraffic: true,
    },
    {
      id: "bin-3",
      location: "SCDI 1st Floor — Left Wing Hallway",
      fill: 38,
      updatedAgo: "3 min ago",
      priority: "low",
      colorClass: "green",
      statusLabel: "Low Fill",
      mapX: "18%",   // left wing corridor
      mapY: "38%",
      highTraffic: false,
    },
    {
      id: "bin-4",
      location: "SCDI 1st Floor — Right Wing Hallway",
      fill: 55,
      updatedAgo: "4 min ago",
      priority: "moderate",
      colorClass: "amber",
      statusLabel: "Moderate",
      mapX: "72%",   // right wing corridor
      mapY: "38%",
      highTraffic: false,
    },
    {
      id: "bin-5",
      location: "SCDI 1st Floor — Bottom Corridor",
      fill: 22,
      updatedAgo: "6 min ago",
      priority: "low",
      colorClass: "green",
      statusLabel: "Low Fill",
      mapX: "58%",   // bottom hallway strip
      mapY: "65%",
      highTraffic: false,
    },
  ],

  // ── Map quick stats (auto-computed below) ─────────────────────────────────
  get mapStats() {
    return {
      total:        this.bins.length,
      highPriority: this.bins.filter(b => b.priority === "high").length,
      moderate:     this.bins.filter(b => b.priority === "moderate").length,
      lowFill:      this.bins.filter(b => b.priority === "low").length,
    };
  },

  // ── Trends data ───────────────────────────────────────────────────────────
  trends: {
    peakDay:             "Thursday",
    peakHours:           "12pm – 2pm high traffic",
    avgFillRate:         "68%",
    avgFillChange:       "+5% from last week",
    collectionsThisWeek: 142,

    weeklyLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    avgFill:      [60, 63, 65, 68, 73, 46, 38],
    peakFill:     [68, 70, 72, 75, 80, 52, 42],
    predicted:    [60, 63, 65, 68, 73, 46, 38],

    locationLabels: ["Main Ent.", "Networking", "Left Wing", "Right Wing", "Bottom"],
    locationFill:   [85, 62, 38, 55, 22],

    hourlyLabels: ["8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
    hourlyFill:   [22, 35, 71, 75, 55, 40, 25],
  },
};
