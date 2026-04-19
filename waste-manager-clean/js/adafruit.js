/**
 * js/adafruit.js — Adafruit IO Live Data Integration
 * =====================================================
 * Drop this file in your project and add this to index.html
 * BEFORE nav.js loads:
 *
 *   <script src="js/adafruit.js"></script>
 *
 * SETUP (3 steps):
 * 1. Replace ADAFRUIT_USERNAME with your Adafruit IO username
 * 2. Replace ADAFRUIT_KEY with your Adafruit IO Active Key
 *    (found at https://io.adafruit.com → "My Key" button)
 * 3. Replace each FEED_KEY with the feed name for that bin
 *    (the slug shown on your Adafruit IO feed page, e.g. "bin-1-fill")
 *
 * HOW IT WORKS:
 * - Fetches the latest value from each Adafruit IO feed every 30 seconds
 * - Updates WM.bins fill levels in-place
 * - Re-renders the Overview page and updates the map marker colors
 * - The sensor value should be a number 0–100 (percent full)
 */

// ── CONFIGURE THESE ──────────────────────────────────────────────────────────
const ADAFRUIT_USERNAME = "YOUR_USERNAME_HERE";
const ADAFRUIT_KEY      = "YOUR_ADAFRUIT_IO_KEY_HERE";

// Map each bin ID → its Adafruit IO feed key (the slug from your feed URL)
const BIN_FEEDS = {
  "bin-1": "bin-1-fill",   // e.g. https://io.adafruit.com/yourname/feeds/bin-1-fill
  "bin-2": "bin-2-fill",
  "bin-3": "bin-3-fill",
  "bin-4": "bin-4-fill",
  "bin-5": "bin-5-fill",
};

// How often to poll (milliseconds). Adafruit IO free tier allows 30 req/min.
const POLL_INTERVAL_MS = 30_000; // 30 seconds
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch the latest value for one Adafruit IO feed.
 * Returns a number (0–100) or null on error.
 */
async function fetchFeedValue(feedKey) {
  const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_USERNAME}/feeds/${feedKey}/data/last`;
  try {
    const res = await fetch(url, {
      headers: { "X-AIO-Key": ADAFRUIT_KEY }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const val  = parseFloat(data.value);
    return isNaN(val) ? null : Math.min(100, Math.max(0, val));
  } catch (err) {
    console.warn(`[Adafruit] Could not fetch feed "${feedKey}":`, err.message);
    return null;
  }
}

/**
 * Determine priority + color class from a fill percentage.
 */
function classifyFill(pct) {
  if (pct >= 80) return { priority: "high",     colorClass: "red",   statusLabel: "High Priority" };
  if (pct >= 50) return { priority: "moderate", colorClass: "amber", statusLabel: "Moderate"      };
  return              { priority: "low",      colorClass: "green", statusLabel: "Low Fill"      };
}

/**
 * Poll all feeds, update WM.bins, and refresh the UI.
 */
async function pollAdafruit() {
  let anyUpdate = false;

  for (const bin of WM.bins) {
    const feedKey = BIN_FEEDS[bin.id];
    if (!feedKey) continue;

    const val = await fetchFeedValue(feedKey);
    if (val === null) continue;

    // Update the bin data
    bin.fill       = Math.round(val);
    bin.updatedAgo = "just now";
    Object.assign(bin, classifyFill(bin.fill));
    anyUpdate = true;
  }

  if (!anyUpdate) return;

  // Re-render whichever page is currently visible
  const activePage = document.querySelector(".page.active")?.id;

  if (activePage === "page-overview") {
    renderOverview();
    setTimeout(() => {
      document.querySelectorAll(".bin-card[data-donut]").forEach(card => {
        animateDonut(card.dataset.donut, Number(card.dataset.fill));
      });
    }, 100);
  }

  if (activePage === "page-map") {
    renderMap();
  }

  console.log("[Adafruit] Data refreshed at", new Date().toLocaleTimeString());
}

// ── Start polling once the page has loaded ───────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
  // Only start if credentials have been filled in
  if (ADAFRUIT_USERNAME === "YOUR_USERNAME_HERE") {
    console.info("[Adafruit] Integration not configured yet. Edit js/adafruit.js to connect live data.");
    return;
  }

  // First fetch immediately, then on interval
  pollAdafruit();
  setInterval(pollAdafruit, POLL_INTERVAL_MS);
});
