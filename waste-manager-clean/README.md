# Waste Manager — SCU Campus Dashboard

Smart Waste Management System dashboard for Santa Clara University.
Senior Design Project — Clare Epolite, Mia Tippett, William Yancey, Willem McCarthy.

---

## Project Structure

```
waste-manager/
├── index.html            ← Entry point
├── css/
│   ├── base.css          ← Variables, reset, shared layout
│   ├── sidebar.css       ← Sidebar navigation
│   ├── overview.css      ← Live Overview page
│   ├── map.css           ← Map View page
│   └── trends.css        ← Trends & Predictions page
└── js/
    ├── data.js           ← ★ All bin data & chart values (edit here)
    ├── overview.js       ← Live Overview logic + donut animations
    ├── map.js            ← SCDI floor plan + bin markers
    ├── trends.js         ← Chart.js charts
    ├── nav.js            ← Page switching & live clock
    └── adafruit.js       ← ★ Adafruit IO live data integration
```

---

## Running Locally

Open `index.html` directly in a browser, or use **VS Code Live Server**:
1. Install the Live Server extension
2. Right-click `index.html` → **Open with Live Server**

---

## Connecting Adafruit IO (Live Sensor Data)

Your teammate has sensors sending fill-level data to Adafruit IO.
To connect that live data to this dashboard:

### Step 1 — Add the script to index.html
Add this line in `index.html` **before** `<script src="js/nav.js">`:
```html
<script src="js/adafruit.js"></script>
```

### Step 2 — Configure js/adafruit.js
Open `js/adafruit.js` and fill in the top section:
```js
const ADAFRUIT_USERNAME = "your_adafruit_username";
const ADAFRUIT_KEY      = "your_adafruit_io_key";   // from io.adafruit.com → My Key

const BIN_FEEDS = {
  "bin-1": "bin-1-fill",   // replace with your actual feed slugs
  "bin-2": "bin-2-fill",
  ...
};
```

### Step 3 — Find your feed slugs
On io.adafruit.com, go to each feed. The slug is the last part of the URL:
`https://io.adafruit.com/yourname/feeds/` **bin-1-fill** ← that's the slug.

### Step 4 — Sensor value format
The sensor should publish a number **0–100** (percent full) to each feed.
The dashboard automatically:
- Sets the bin color (green / amber / red) based on the value
- Updates the donut charts and map markers
- Refreshes every 30 seconds

---

## Updating Static Data

Edit `js/data.js` to change bin names, positions on the map, or chart values.

### Move a bin marker on the map
```js
{
  id: "bin-1",
  mapX: "8%",    // percentage from left edge of floor plan
  mapY: "78%",   // percentage from top edge of floor plan
  ...
}
```

---

## GitHub Pages (Live Website)

Settings → Pages → Branch: main → / (root) → Save.
Your site will be live at: `https://[username].github.io/waste-manager`
