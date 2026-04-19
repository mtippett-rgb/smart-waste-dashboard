/**
 * js/overview.js — Live Overview page
 */

const STROKE = { red: "#e53935", amber: "#f59e0b", green: "#16a34a" };

function buildDonut(id, color) {
  const circum = 2 * Math.PI * 48;
  return `
    <svg class="donut-svg" width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="48" fill="none" stroke="#e8ecf2" stroke-width="11"/>
      <circle id="${id}" cx="60" cy="60" r="48" fill="none"
        stroke="${color}" stroke-width="11"
        stroke-dasharray="${circum}" stroke-dashoffset="${circum}"
        stroke-linecap="round"/>
      <text x="60" y="56" class="donut-text" fill="${color}" transform="rotate(90,60,60)">--</text>
      <text x="60" y="71" class="donut-sub" transform="rotate(90,60,60)">Full</text>
    </svg>`;
}

function buildBinCard(bin) {
  const id    = `donut-${bin.id}`;
  const color = STROKE[bin.colorClass];
  return `
    <div class="bin-card ${bin.colorClass}-card"
         data-fill="${bin.fill}" data-donut="${id}" data-color="${color}">
      <div class="bin-card-top">
        <h4>${bin.location}</h4>
        <span class="bin-icon">🗑️</span>
      </div>
      <div class="updated">Updated ${bin.updatedAgo}</div>
      <div class="donut-wrap">${buildDonut(id, color)}</div>
      <div class="bin-status ${bin.colorClass}">${bin.statusLabel}</div>
    </div>`;
}

function countBy(priority) {
  return WM.bins.filter(b => b.priority === priority).length;
}

function renderOverview() {
  const highBin = WM.bins.find(b => b.priority === "high");

  const alertHTML = highBin ? `
    <div class="alert-card">
      <div class="alert-header">
        <div class="alert-icon">⚠️</div>
        <div>
          <h3>High Priority Alerts</h3>
          <p>${countBy("high")} bin${countBy("high") > 1 ? "s" : ""} require immediate attention</p>
        </div>
      </div>
      <div class="alert-bin-row">
        <div class="alert-bin-top">
          <span>${highBin.location}</span>
          <span>${highBin.fill}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill red" style="width:${highBin.fill}%"></div>
        </div>
        <div class="alert-bin-time">Updated ${highBin.updatedAgo}</div>
      </div>
    </div>` : "";

  document.getElementById("page-overview").innerHTML = `
    <div class="page-header">
      <div>
        <h2>Live Overview</h2>
        <p>Real-time bin status across campus</p>
      </div>
      <div class="time-badge">🕐 <span id="live-time">--:-- --</span></div>
    </div>

    ${alertHTML}

    <div class="stats-grid">
      <div class="stat-card">
        <div class="val dark">${WM.bins.length}</div>
        <div class="label">Total Bins</div>
      </div>
      <div class="stat-card">
        <div class="val red">${countBy("high")}</div>
        <div class="label">High Priority</div>
      </div>
      <div class="stat-card">
        <div class="val amber">${countBy("moderate")}</div>
        <div class="label">Medium Fill</div>
      </div>
      <div class="stat-card">
        <div class="val green">${countBy("low")}</div>
        <div class="label">Low Fill</div>
      </div>
    </div>

    <div class="section-title">All Locations</div>
    <div class="bins-grid">
      ${WM.bins.map(buildBinCard).join("")}
    </div>`;
}

function animateDonut(circleId, pct) {
  const circum = 2 * Math.PI * 48;
  const el     = document.getElementById(circleId);
  if (!el) return;

  // Also update the label text
  const textEl = el.closest("svg")?.querySelector(".donut-text");

  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / 850, 1);
    el.setAttribute("stroke-dashoffset", circum - circum * (pct / 100) * p);
    if (textEl) textEl.textContent = Math.round(pct * p) + "%";
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

renderOverview();

setTimeout(() => {
  document.querySelectorAll(".bin-card[data-donut]").forEach(card => {
    animateDonut(card.dataset.donut, Number(card.dataset.fill));
  });
}, 300);
