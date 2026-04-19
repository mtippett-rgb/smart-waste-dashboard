/**
 * js/map.js  —  Map View page
 *
 * Renders an accurate SVG floor plan of SCDI First Floor
 * with interactive bin markers.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SCDI First Floor SVG — traced from building floor plan
// U-shaped blue hallway corridor, rooms branching off, 1301/1302/1308 labeled
// ─────────────────────────────────────────────────────────────────────────────
const FLOOR_SVG = `
<svg viewBox="0 0 900 580" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
  <defs>
    <pattern id="grid" width="18" height="18" patternUnits="userSpaceOnUse">
      <path d="M18 0L0 0 0 18" fill="none" stroke="rgba(80,110,140,0.07)" stroke-width="0.5"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="900" height="580" fill="#eaeff5"/>
  <rect width="900" height="580" fill="url(#grid)"/>

  <!-- ── OUTER BUILDING SHELL ──────────────────────────────────── -->
  <!-- Top-left wing -->
  <rect x="35"  y="30"  width="355" height="265" rx="4" fill="#c2d3e0" stroke="#8baabb" stroke-width="1.5"/>
  <!-- Top-right wing -->
  <rect x="510" y="30"  width="355" height="265" rx="4" fill="#c2d3e0" stroke="#8baabb" stroke-width="1.5"/>
  <!-- Bottom connecting strip -->
  <rect x="35"  y="310" width="830" height="240" rx="4" fill="#c2d3e0" stroke="#8baabb" stroke-width="1.5"/>

  <!-- Gap between wings (exterior void) -->
  <rect x="390" y="30"  width="120" height="265" fill="#eaeff5" stroke="none"/>

  <!-- ── HALLWAY (blue walkable corridors) ─────────────────────── -->
  <!-- Left wing inner corridor -->
  <rect x="48"  y="43"  width="330" height="238" rx="3" fill="#9dc0d8" stroke="none"/>
  <!-- Right wing inner corridor -->
  <rect x="523" y="43"  width="330" height="238" rx="3" fill="#9dc0d8" stroke="none"/>
  <!-- Bottom wide hallway -->
  <rect x="48"  y="323" width="804" height="212" rx="3" fill="#9dc0d8" stroke="none"/>

  <!-- ── ROOMS — top-left wing ─────────────────────────────────── -->
  <!-- Top row rooms -->
  <rect x="58"  y="53"  width="80"  height="85"  rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="148" y="53"  width="80"  height="85"  rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="238" y="53"  width="80"  height="85"  rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="328" y="53"  width="46"  height="85"  rx="2" fill="#e8ecf0" stroke="#a0b8c8" stroke-width="1"/>
  <!-- Left-side rooms -->
  <rect x="58"  y="153" width="100" height="120" rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <!-- Central left room (larger, grey) -->
  <rect x="210" y="153" width="164" height="120" rx="2" fill="#e4eaef" stroke="#a0b8c8" stroke-width="1"/>

  <!-- ── ROOMS — top-right wing ────────────────────────────────── -->
  <!-- Top row rooms -->
  <rect x="523" y="53"  width="80"  height="85"  rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="613" y="53"  width="80"  height="85"  rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="703" y="53"  width="80"  height="85"  rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="793" y="53"  width="56"  height="85"  rx="2" fill="#e8ecf0" stroke="#a0b8c8" stroke-width="1"/>
  <!-- Right-side large room (grey) -->
  <rect x="703" y="153" width="146" height="120" rx="2" fill="#e4eaef" stroke="#a0b8c8" stroke-width="1"/>
  <!-- Center-right room -->
  <rect x="523" y="153" width="162" height="120" rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>

  <!-- ── ROOMS — bottom strip ───────────────────────────────────── -->
  <!-- Left cluster: 1301, 1302, 1308 -->
  <rect x="58"  y="335" width="95"  height="100" rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="163" y="335" width="95"  height="100" rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="268" y="335" width="95"  height="100" rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>

  <!-- Networking / Breakfast-Lunch area (warm yellow highlight) -->
  <rect x="58"  y="445" width="308" height="78"  rx="2" fill="#f5f0d4" stroke="#c8b055" stroke-width="1.2"/>

  <!-- Right cluster rooms -->
  <rect x="420" y="335" width="95"  height="100" rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="525" y="335" width="95"  height="100" rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="630" y="335" width="95"  height="100" rx="2" fill="#e4eaef" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="735" y="335" width="95"  height="100" rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>

  <!-- Bottom-right rooms -->
  <rect x="420" y="445" width="95"  height="78"  rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="525" y="445" width="95"  height="78"  rx="2" fill="#e4eaef" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="630" y="445" width="200" height="78"  rx="2" fill="#f2f5f8" stroke="#a0b8c8" stroke-width="1"/>

  <!-- ── INTERIOR DETAILS ───────────────────────────────────────── -->
  <!-- Hallway divider dashed line -->
  <line x1="35" y1="323" x2="865" y2="323" stroke="#6a90a8" stroke-width="1" stroke-dasharray="7,5"/>

  <!-- Main entrance bump-out -->
  <rect x="35"  y="500" width="55" height="50"  rx="2" fill="#d0e0ea" stroke="#8baabb" stroke-width="1"/>

  <!-- Staircase boxes -->
  <rect x="58"  y="445" width="38" height="38"  rx="1" fill="#dce8f0" stroke="#a0b8c8" stroke-width="1"/>
  <rect x="812" y="445" width="38" height="38"  rx="1" fill="#dce8f0" stroke="#a0b8c8" stroke-width="1"/>

  <!-- Small elevator / utility blocks -->
  <rect x="385" y="165" width="28" height="28"  rx="1" fill="#b8ccd8" stroke="#a0b8c8" stroke-width="1"/>
  <rect name="elev2" x="487" y="165" width="28" height="28" rx="1" fill="#b8ccd8" stroke="#a0b8c8" stroke-width="1"/>

  <!-- ── LABELS ─────────────────────────────────────────────────── -->
  <text x="450" y="18" text-anchor="middle"
    font-family="DM Sans,sans-serif" font-size="13" font-weight="700"
    fill="#2d4a62" letter-spacing="2" text-transform="uppercase">SCDI · FIRST FLOOR</text>

  <!-- Room number labels -->
  <text x="105" y="390" text-anchor="middle" font-family="DM Mono,monospace" font-size="11" font-weight="700" fill="#c0392b">1301</text>
  <text x="210" y="390" text-anchor="middle" font-family="DM Mono,monospace" font-size="11" font-weight="700" fill="#c0392b">1302</text>
  <text x="315" y="390" text-anchor="middle" font-family="DM Mono,monospace" font-size="11" font-weight="700" fill="#c0392b">1308</text>

  <!-- Networking area -->
  <text x="212" y="479" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="10" font-weight="600" fill="#7a6010">Networking Area / Breakfast &amp; Lunch</text>

  <!-- Main Entrance -->
  <text x="36" y="497" font-family="DM Sans,sans-serif" font-size="9" font-weight="700" fill="#c0392b">Main</text>
  <text x="36" y="508" font-family="DM Sans,sans-serif" font-size="9" font-weight="700" fill="#c0392b">Entrance</text>

  <!-- Staircase -->
  <text x="78" y="495" text-anchor="middle" font-family="DM Sans,sans-serif" font-size="8" fill="#4a6a80">Stair</text>
</svg>`;

// ── Build a bin marker DOM element ─────────────────────────────────────────
function buildMarker(bin) {
  const colorHex = { red: "#e53935", amber: "#f59e0b", green: "#22c55e" };

  const div = document.createElement("div");
  div.className   = `bin-marker ${bin.colorClass}`;
  div.style.left  = bin.mapX;
  div.style.top   = bin.mapY;
  div.textContent = "🗑️";

  if (bin.highTraffic) {
    const star = document.createElement("div");
    star.className   = "star-badge";
    star.textContent = "★";
    div.appendChild(star);
  }

  const batt = document.createElement("div");
  batt.className   = "batt-badge";
  batt.textContent = "🔋";
  div.appendChild(batt);

  div.addEventListener("mouseenter", () => {
    const tip   = document.getElementById("bin-tooltip");
    const color = colorHex[bin.colorClass];
    tip.innerHTML = `
      <strong>${bin.location}</strong><br>
      <span style="color:${color};font-weight:600">${bin.fill}% — ${bin.statusLabel}</span><br>
      <span style="opacity:0.65;font-size:11px">Updated ${bin.updatedAgo}</span>`;
    tip.style.display = "block";
    tip.style.left    = (div.offsetLeft + 52) + "px";
    tip.style.top     = (div.offsetTop  - 8)  + "px";
  });

  div.addEventListener("mouseleave", () => {
    document.getElementById("bin-tooltip").style.display = "none";
  });

  return div;
}

// ── Render ──────────────────────────────────────────────────────────────────
function renderMap() {
  const s = WM.mapStats;

  document.getElementById("page-map").innerHTML = `
    <div class="page-header">
      <div>
        <h2>Smart Bin Management</h2>
        <p>Real-time monitoring of waste bin locations, fill levels, and battery status</p>
      </div>
    </div>

    <div class="legend">
      <span class="legend-label">Status:</span>
      <div class="legend-item"><div class="legend-dot" style="background:var(--green)"></div>Optimal</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--amber)"></div>Moderate</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--red)"></div>Critical</div>
      <div class="legend-item"><div class="legend-ring">★</div>High Traffic</div>
    </div>

    <div class="map-layout">
      <div class="map-container">
        <div class="map-toolbar">
          <div style="display:flex;align-items:center;gap:10px">
            <label>Floor:</label>
            <select class="floor-select">
              <option>1st Floor (Active)</option>
              <option>2nd Floor</option>
              <option>3rd Floor</option>
            </select>
          </div>
          <div class="map-zoom">
            <button title="Zoom out">−</button>
            <button title="Zoom in">+</button>
            <button title="Fullscreen">⛶</button>
          </div>
        </div>
        <div class="floor-map" id="floor-map">
          ${FLOOR_SVG}
          <div class="tooltip-popup" id="bin-tooltip"></div>
        </div>
      </div>

      <div class="map-sidebar-panel">
        <div class="detail-panel">
          <div class="empty-icon">🗑️</div>
          <div class="empty-text">Select a bin marker on the map<br>to view details</div>
        </div>
        <div class="quick-stats-panel">
          <h4>Quick Stats</h4>
          <div class="qs-row"><span>Total Bins</span><span class="qs-val">${s.total}</span></div>
          <div class="qs-row"><span>High Priority</span><span class="qs-val red">${s.highPriority}</span></div>
          <div class="qs-row"><span>Moderate</span><span class="qs-val amber">${s.moderate}</span></div>
          <div class="qs-row"><span>Low Fill</span><span class="qs-val green">${s.lowFill}</span></div>
        </div>
      </div>
    </div>`;

  const floorMap = document.getElementById("floor-map");
  WM.bins.forEach((bin) => floorMap.appendChild(buildMarker(bin)));
}

renderMap();
