/**
 * TES LLC Ticketing System — Frontend JS
 */

// Auto-dismiss alerts after 5s
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".alert").forEach(el => {
    setTimeout(() => {
      el.style.transition = "opacity 0.4s";
      el.style.opacity    = "0";
      setTimeout(() => el.remove(), 400);
    }, 5000);
  });

  // Highlight current nav item based on URL
  const path = window.location.pathname;
  document.querySelectorAll(".nav-link").forEach(link => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });

  // Live SLA countdown on dashboard (refresh time indicators)
  updateTimestamps();
});

function updateTimestamps() {
  const els = document.querySelectorAll("[data-ts]");
  els.forEach(el => {
    const ts = new Date(el.dataset.ts);
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60)  { el.textContent = `${diff}s ago`; return; }
    if (diff < 3600){ el.textContent = `${Math.floor(diff/60)}m ago`; return; }
    if (diff < 86400){ el.textContent = `${Math.floor(diff/3600)}h ago`; return; }
    el.textContent = `${Math.floor(diff/86400)}d ago`;
  });
}

// Confirm for destructive actions (supplementing HTML onsubmit)
document.addEventListener("submit", e => {
  const form = e.target;
  if (form.dataset.confirm) {
    if (!confirm(form.dataset.confirm)) {
      e.preventDefault();
    }
  }
});
