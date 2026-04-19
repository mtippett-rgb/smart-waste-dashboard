/**
 * js/trends.js — Trends & Predictions page
 */

let _chartsInit = false;

function renderTrends() {
  const t = WM.trends;

  document.getElementById("page-trends").innerHTML = `
    <div class="page-header">
      <div>
        <h2>Trends &amp; Predictions</h2>
        <p>Analyze patterns and optimize collection routes</p>
      </div>
    </div>

    <div class="trends-top-grid">
      <div class="trend-stat-card blue">
        <div class="ts-icon">📈</div>
        <div class="ts-label">Peak Usage</div>
        <div class="ts-val">${t.peakDay}</div>
        <div class="ts-sub">${t.peakHours}</div>
      </div>
      <div class="trend-stat-card purple">
        <div class="ts-icon">📊</div>
        <div class="ts-label">Avg Fill Rate</div>
        <div class="ts-val">${t.avgFillRate}</div>
        <div class="ts-sub">${t.avgFillChange}</div>
      </div>
      <div class="trend-stat-card green">
        <div class="ts-icon">📅</div>
        <div class="ts-label">Collections</div>
        <div class="ts-val">${t.collectionsThisWeek}</div>
        <div class="ts-sub">This week</div>
      </div>
    </div>

    <div class="chart-card">
      <h3>Weekly Fill Trend</h3>
      <p>Average and peak fill levels with predictions</p>
      <div class="chart-area"><canvas id="chart-weekly"></canvas></div>
      <div class="chart-legend">
        <div class="chart-legend-item">
          <div class="chart-legend-dot" style="background:#6366f1"></div> Average Fill
        </div>
        <div class="chart-legend-item">
          <div class="chart-legend-dot" style="background:#ef4444"></div> Peak Fill
        </div>
        <div class="chart-legend-item">
          <div class="chart-legend-dot" style="background:#a855f7"></div> Predicted
        </div>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="chart-card">
        <h3>Location Performance</h3>
        <p>Fill rate by bin location</p>
        <div class="chart-area"><canvas id="chart-location"></canvas></div>
      </div>
      <div class="chart-card">
        <h3>Daily Pattern</h3>
        <p>Average fill by hour of day</p>
        <div class="chart-area"><canvas id="chart-daily"></canvas></div>
      </div>
    </div>`;
}

const AXIS = {
  grid:  { color: "#f0f2f6" },
  ticks: { font: { family: "DM Sans", size: 11 }, color: "#677a92" },
};

function initTrendCharts() {
  if (_chartsInit) return;
  _chartsInit = true;
  const t = WM.trends;

  new Chart(document.getElementById("chart-weekly"), {
    type: "line",
    data: {
      labels: t.weeklyLabels,
      datasets: [
        { label: "Average Fill", data: t.avgFill,  borderColor: "#6366f1", backgroundColor: "rgba(99,102,241,0.07)", fill: true, borderWidth: 2, pointBackgroundColor: "#6366f1", tension: 0.4 },
        { label: "Peak Fill",    data: t.peakFill,  borderColor: "#ef4444", backgroundColor: "transparent", borderWidth: 2, borderDash: [5,4], pointBackgroundColor: "#ef4444", tension: 0.4 },
        { label: "Predicted",   data: t.predicted, borderColor: "#a855f7", backgroundColor: "transparent", borderWidth: 2, borderDash: [2,3], pointBackgroundColor: "#a855f7", tension: 0.4 },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { x: AXIS, y: { ...AXIS, min: 0, max: 100 } },
      elements: { point: { radius: 5, hoverRadius: 7 } },
    },
  });

  const locColors = t.locationFill.map(v => v >= 80 ? "#ef4444" : v >= 55 ? "#f59e0b" : "#16a34a");

  new Chart(document.getElementById("chart-location"), {
    type: "bar",
    data: {
      labels: t.locationLabels,
      datasets: [{ data: t.locationFill, backgroundColor: locColors, borderRadius: 6, borderSkipped: false }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: "DM Sans", size: 10 }, color: "#677a92" } },
        y: { ...AXIS, min: 0, max: 100 },
      },
    },
  });

  new Chart(document.getElementById("chart-daily"), {
    type: "line",
    data: {
      labels: t.hourlyLabels,
      datasets: [{ data: t.hourlyFill, borderColor: "#2563eb", backgroundColor: "rgba(37,99,235,0.09)", fill: true, borderWidth: 2, pointBackgroundColor: "#2563eb", tension: 0.4 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: "DM Sans", size: 10 }, color: "#677a92" } },
        y: { ...AXIS, min: 0, max: 100 },
      },
      elements: { point: { radius: 4, hoverRadius: 6 } },
    },
  });
}

renderTrends();
