/**
 * js/nav.js — Page switching & live clock
 */

document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    item.classList.add("active");
    document.getElementById("page-" + item.dataset.page).classList.add("active");
    if (item.dataset.page === "trends") initTrendCharts();
  });
});

function updateClock() {
  let h = new Date().getHours(), m = new Date().getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const el = document.getElementById("live-time");
  if (el) el.textContent = `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} ${ampm}`;
}

updateClock();
setInterval(updateClock, 60_000);
