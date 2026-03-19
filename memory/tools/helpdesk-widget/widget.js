/**
 * Helpdesk Chat Widget
 * Floating chat widget for client websites
 * 
 * Usage:
 *   <script>
 *     window.HelpdeskConfig = {
 *       businessName: "Tech Electrical Services",
 *       greeting: "Hi! How can we help you today?",
 *       accentColor: "#2563eb",
 *       position: "bottom-right", // or "bottom-left"
 *       webhookUrl: "https://your-backend.com/chat",  // optional
 *       emailFallback: "support@techelectrical.com",  // shown when offline
 *       offlineMessage: "We're away right now. Send us a message and we'll respond ASAP.",
 *       onlineHours: { start: 8, end: 18, timezone: "America/Los_Angeles" },
 *       showBranding: true,       // show "Powered by..." footer
 *       brandingText: "Powered by Tech Electrical MSP",
 *       brandingUrl: "https://techelectrical.com",
 *       avatarUrl: "",            // optional avatar image URL
 *       autoOpenDelay: 0,         // ms to auto-open (0 = disabled)
 *       collectEmail: true,       // ask for email before chat
 *     };
 *   </script>
 *   <script src="widget.js" defer></script>
 */

(function () {
  "use strict";

  // ─── Default Config ──────────────────────────────────────────────────────────
  const DEFAULT_CONFIG = {
    businessName: "Support",
    greeting: "Hi there 👋 How can we help you today?",
    accentColor: "#2563eb",
    position: "bottom-right",
    webhookUrl: null,
    emailFallback: null,
    offlineMessage: "We're currently away. Leave your message and we'll get back to you soon.",
    onlineHours: null,
    showBranding: true,
    brandingText: "Helpdesk Widget",
    brandingUrl: "#",
    avatarUrl: "",
    autoOpenDelay: 0,
    collectEmail: false,
    inputPlaceholder: "Type a message...",
    sendLabel: "Send",
  };

  const cfg = Object.assign({}, DEFAULT_CONFIG, window.HelpdeskConfig || {});

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function isOnline() {
    if (!cfg.onlineHours) return true;
    try {
      const now = new Date();
      const local = new Date(now.toLocaleString("en-US", { timeZone: cfg.onlineHours.timezone || "UTC" }));
      const h = local.getHours();
      return h >= cfg.onlineHours.start && h < cfg.onlineHours.end;
    } catch (_) {
      return true;
    }
  }

  function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}` : "37, 99, 235";
  }

  function escape(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ts() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // ─── State ───────────────────────────────────────────────────────────────────
  let isOpen = false;
  let hasGreeted = false;
  let emailCollected = !cfg.collectEmail;
  let sessionId = null;
  let unreadCount = 0;

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const rgb = hexToRgb(cfg.accentColor);
  const isLeft = cfg.position === "bottom-left";
  const side = isLeft ? "left: 24px;" : "right: 24px;";

  const css = `
    #hd-widget-root * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    #hd-widget-root {
      position: fixed;
      bottom: 24px;
      ${side}
      z-index: 999999;
      display: flex;
      flex-direction: column;
      align-items: ${isLeft ? "flex-start" : "flex-end"};
    }
    /* ── Toggle Button ── */
    #hd-toggle-btn {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${cfg.accentColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(${rgb}, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      outline: none;
      position: relative;
      flex-shrink: 0;
    }
    #hd-toggle-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(${rgb}, 0.55);
    }
    #hd-toggle-btn:active { transform: scale(0.96); }
    #hd-toggle-btn svg { transition: opacity 0.2s, transform 0.2s; }
    #hd-toggle-btn .hd-icon-chat { opacity: 1; transform: scale(1) rotate(0deg); }
    #hd-toggle-btn .hd-icon-close { opacity: 0; transform: scale(0.6) rotate(-45deg); position: absolute; }
    #hd-widget-root.hd-open #hd-toggle-btn .hd-icon-chat { opacity: 0; transform: scale(0.6) rotate(45deg); }
    #hd-widget-root.hd-open #hd-toggle-btn .hd-icon-close { opacity: 1; transform: scale(1) rotate(0deg); }

    /* ── Unread Badge ── */
    #hd-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #ef4444;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      border: 2px solid #fff;
    }
    #hd-badge.hd-visible { display: flex; }

    /* ── Window ── */
    #hd-window {
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 520px;
      max-height: calc(100vh - 100px);
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin-bottom: 12px;
      transform-origin: ${isLeft ? "bottom left" : "bottom right"};
      transform: scale(0.9);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
    }
    #hd-widget-root.hd-open #hd-window {
      transform: scale(1);
      opacity: 1;
      pointer-events: all;
    }

    /* ── Header ── */
    #hd-header {
      background: ${cfg.accentColor};
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    #hd-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }
    #hd-avatar img { width: 100%; height: 100%; object-fit: cover; }
    #hd-header-info { flex: 1; min-width: 0; }
    #hd-header-name {
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #hd-status-line {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
    }
    .hd-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ade80;
      flex-shrink: 0;
    }
    .hd-status-dot.hd-offline { background: #fbbf24; }
    #hd-status-text {
      color: rgba(255,255,255,0.85);
      font-size: 12px;
    }
    #hd-header-close {
      background: none;
      border: none;
      cursor: pointer;
      color: rgba(255,255,255,0.8);
      padding: 4px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      transition: color 0.15s, background 0.15s;
    }
    #hd-header-close:hover { color: #fff; background: rgba(255,255,255,0.15); }

    /* ── Messages ── */
    #hd-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      scroll-behavior: smooth;
      background: #f8fafc;
    }
    #hd-messages::-webkit-scrollbar { width: 4px; }
    #hd-messages::-webkit-scrollbar-track { background: transparent; }
    #hd-messages::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

    /* ── Message Bubbles ── */
    .hd-msg-group {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }
    .hd-msg-group.hd-user { flex-direction: row-reverse; }
    .hd-msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: ${cfg.accentColor};
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .hd-msg-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .hd-msg-avatar svg { width: 16px; height: 16px; }
    .hd-msg-bubble-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-width: 76%;
    }
    .hd-msg-group.hd-user .hd-msg-bubble-wrap { align-items: flex-end; }
    .hd-bubble {
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-word;
    }
    .hd-bubble.hd-agent {
      background: #fff;
      color: #1e293b;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .hd-bubble.hd-user {
      background: ${cfg.accentColor};
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .hd-bubble.hd-system {
      background: #f1f5f9;
      color: #64748b;
      font-size: 12px;
      border-radius: 8px;
      text-align: center;
      align-self: center;
      padding: 6px 12px;
    }
    .hd-msg-time {
      font-size: 11px;
      color: #94a3b8;
      padding: 0 4px;
    }
    .hd-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: #fff;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      width: fit-content;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .hd-typing span {
      width: 6px;
      height: 6px;
      background: #94a3b8;
      border-radius: 50%;
      animation: hd-bounce 1.2s infinite;
    }
    .hd-typing span:nth-child(2) { animation-delay: 0.2s; }
    .hd-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes hd-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    /* ── Email Collect Form ── */
    #hd-email-form {
      padding: 16px;
      background: #fff;
      border-top: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex-shrink: 0;
    }
    #hd-email-form label {
      font-size: 13px;
      color: #475569;
      font-weight: 500;
    }
    #hd-email-input {
      padding: 10px 12px;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.15s;
      color: #1e293b;
    }
    #hd-email-input:focus { border-color: ${cfg.accentColor}; }
    #hd-email-submit {
      padding: 10px;
      background: ${cfg.accentColor};
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    #hd-email-submit:hover { opacity: 0.9; }

    /* ── Input Area ── */
    #hd-input-area {
      padding: 12px 14px;
      border-top: 1px solid #e2e8f0;
      background: #fff;
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
    }
    #hd-input {
      flex: 1;
      padding: 10px 12px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 14px;
      outline: none;
      resize: none;
      max-height: 100px;
      overflow-y: auto;
      line-height: 1.4;
      transition: border-color 0.15s;
      color: #1e293b;
      background: #f8fafc;
    }
    #hd-input:focus { border-color: ${cfg.accentColor}; background: #fff; }
    #hd-input::placeholder { color: #94a3b8; }
    #hd-send-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: ${cfg.accentColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s, transform 0.15s;
      outline: none;
    }
    #hd-send-btn:hover { opacity: 0.9; transform: scale(1.05); }
    #hd-send-btn:active { transform: scale(0.95); }
    #hd-send-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

    /* ── Branding ── */
    #hd-branding {
      text-align: center;
      padding: 6px 12px 8px;
      background: #fff;
      border-top: 1px solid #f1f5f9;
      flex-shrink: 0;
    }
    #hd-branding a {
      font-size: 11px;
      color: #94a3b8;
      text-decoration: none;
      transition: color 0.15s;
    }
    #hd-branding a:hover { color: #64748b; }

    /* ── Offline Banner ── */
    #hd-offline-bar {
      background: #fef9c3;
      border-bottom: 1px solid #fde68a;
      padding: 8px 14px;
      font-size: 12px;
      color: #92400e;
      text-align: center;
      flex-shrink: 0;
      display: none;
    }
    #hd-offline-bar.hd-visible { display: block; }

    /* ── Mobile ── */
    @media (max-width: 420px) {
      #hd-window {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        height: 75vh !important;
        border-radius: 16px 16px 0 0 !important;
        margin-bottom: 0 !important;
        transform-origin: bottom center !important;
      }
      #hd-widget-root {
        bottom: 16px;
        right: 16px;
      }
    }
  `;

  // ─── SVG Icons ────────────────────────────────────────────────────────────────
  const ICON_CHAT = `<svg class="hd-icon-chat" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white"/>
  </svg>`;

  const ICON_CLOSE = `<svg class="hd-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

  const ICON_CLOSE_SM = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

  const ICON_SEND = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const ICON_AGENT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" fill="white"/>
  </svg>`;

  // ─── Build DOM ────────────────────────────────────────────────────────────────
  function buildWidget() {
    // Inject styles
    const styleEl = document.createElement("style");
    styleEl.id = "hd-widget-styles";
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // Root
    const root = document.createElement("div");
    root.id = "hd-widget-root";

    const online = isOnline();

    // Window
    root.innerHTML = `
      <div id="hd-window" role="dialog" aria-label="${escape(cfg.businessName)} support chat" aria-modal="true">
        <div id="hd-header">
          <div id="hd-avatar">
            ${cfg.avatarUrl ? `<img src="${escape(cfg.avatarUrl)}" alt="Support" />` : ICON_AGENT}
          </div>
          <div id="hd-header-info">
            <div id="hd-header-name">${escape(cfg.businessName)}</div>
            <div id="hd-status-line">
              <div class="hd-status-dot${online ? "" : " hd-offline"}"></div>
              <span id="hd-status-text">${online ? "Online — typically replies quickly" : "Away — we'll reply soon"}</span>
            </div>
          </div>
          <button id="hd-header-close" aria-label="Close chat">${ICON_CLOSE_SM}</button>
        </div>

        <div id="hd-offline-bar" class="${online ? "" : "hd-visible"}">${escape(cfg.offlineMessage)}</div>

        <div id="hd-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>

        ${cfg.collectEmail ? `
        <div id="hd-email-form">
          <label for="hd-email-input">Your email (so we can follow up)</label>
          <input type="email" id="hd-email-input" placeholder="you@example.com" autocomplete="email" />
          <button id="hd-email-submit">Start Chat</button>
        </div>` : ""}

        <div id="hd-input-area" ${cfg.collectEmail ? 'style="display:none"' : ""}>
          <textarea id="hd-input" rows="1" placeholder="${escape(cfg.inputPlaceholder)}" aria-label="Message input"></textarea>
          <button id="hd-send-btn" aria-label="${escape(cfg.sendLabel)}">${ICON_SEND}</button>
        </div>

        ${cfg.showBranding ? `
        <div id="hd-branding">
          <a href="${escape(cfg.brandingUrl)}" target="_blank" rel="noopener">${escape(cfg.brandingText)}</a>
        </div>` : ""}
      </div>

      <button id="hd-toggle-btn" aria-label="Toggle support chat" aria-expanded="false">
        ${ICON_CHAT}
        ${ICON_CLOSE}
        <span id="hd-badge" aria-label="unread messages"></span>
      </button>
    `;

    document.body.appendChild(root);
    return root;
  }

  // ─── Message Rendering ────────────────────────────────────────────────────────
  function appendMessage(role, text, time) {
    const messages = document.getElementById("hd-messages");
    if (!messages) return;

    if (role === "system") {
      const el = document.createElement("div");
      el.className = "hd-bubble hd-system";
      el.textContent = text;
      messages.appendChild(el);
      messages.scrollTop = messages.scrollHeight;
      return;
    }

    const group = document.createElement("div");
    group.className = `hd-msg-group ${role === "user" ? "hd-user" : "hd-agent"}`;

    const avatarHtml = role === "agent"
      ? `<div class="hd-msg-avatar">${cfg.avatarUrl ? `<img src="${escape(cfg.avatarUrl)}" alt="" />` : ICON_AGENT}</div>`
      : "";

    group.innerHTML = `
      ${avatarHtml}
      <div class="hd-msg-bubble-wrap">
        <div class="hd-bubble hd-${role === "user" ? "user" : "agent"}">${escape(text)}</div>
        <div class="hd-msg-time">${time || ts()}</div>
      </div>
    `;

    messages.appendChild(group);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    const messages = document.getElementById("hd-messages");
    if (!messages) return;
    const el = document.createElement("div");
    el.className = "hd-msg-group hd-agent";
    el.id = "hd-typing-indicator";
    el.innerHTML = `
      <div class="hd-msg-avatar">${cfg.avatarUrl ? `<img src="${escape(cfg.avatarUrl)}" alt="" />` : ICON_AGENT}</div>
      <div class="hd-typing"><span></span><span></span><span></span></div>
    `;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById("hd-typing-indicator");
    if (el) el.remove();
  }

  // ─── Badge ────────────────────────────────────────────────────────────────────
  function setBadge(n) {
    const badge = document.getElementById("hd-badge");
    if (!badge) return;
    if (n > 0 && !isOpen) {
      badge.textContent = n > 9 ? "9+" : n;
      badge.classList.add("hd-visible");
      badge.setAttribute("aria-label", `${n} unread message${n !== 1 ? "s" : ""}`);
    } else {
      badge.classList.remove("hd-visible");
    }
  }

  // ─── Open / Close ─────────────────────────────────────────────────────────────
  function openWidget() {
    isOpen = true;
    unreadCount = 0;
    setBadge(0);
    const root = document.getElementById("hd-widget-root");
    const btn = document.getElementById("hd-toggle-btn");
    if (root) root.classList.add("hd-open");
    if (btn) btn.setAttribute("aria-expanded", "true");

    if (!hasGreeted) {
      hasGreeted = true;
      appendMessage("system", ts());
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          hideTyping();
          appendMessage("agent", cfg.greeting);
        }, 900);
      }, 200);
    }

    const input = document.getElementById("hd-input");
    if (input && emailCollected) {
      setTimeout(() => input.focus(), 300);
    }
  }

  function closeWidget() {
    isOpen = false;
    const root = document.getElementById("hd-widget-root");
    const btn = document.getElementById("hd-toggle-btn");
    if (root) root.classList.remove("hd-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  // ─── Send Message ─────────────────────────────────────────────────────────────
  async function sendMessage(text) {
    if (!text.trim()) return;

    const input = document.getElementById("hd-input");
    const sendBtn = document.getElementById("hd-send-btn");
    if (input) { input.value = ""; autoResizeTextarea(input); }
    if (sendBtn) sendBtn.disabled = true;

    appendMessage("user", text);

    if (!cfg.webhookUrl) {
      // Fallback: no backend
      setTimeout(() => {
        showTyping();
        setTimeout(() => {
          hideTyping();
          const reply = cfg.emailFallback
            ? `Thanks for your message! We'll follow up at ${cfg.emailFallback} soon.`
            : "Thanks for reaching out! Our team will get back to you shortly.";
          appendMessage("agent", reply);
          if (sendBtn) sendBtn.disabled = false;
        }, 1200);
      }, 300);
      return;
    }

    // Send to webhook
    showTyping();
    try {
      const payload = { message: text, sessionId, timestamp: new Date().toISOString() };
      const res = await fetch(cfg.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      hideTyping();

      if (data.sessionId) sessionId = data.sessionId;
      const replyText = data.reply || data.message || data.text || "Got it! We'll be in touch.";
      appendMessage("agent", replyText);
    } catch (err) {
      hideTyping();
      appendMessage("agent", "Sorry, something went wrong. Please try again or contact us directly.");
      console.warn("[HelpdeskWidget] Webhook error:", err);
    }

    if (sendBtn) sendBtn.disabled = false;
  }

  // ─── Auto-resize textarea ─────────────────────────────────────────────────────
  function autoResizeTextarea(el) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 100) + "px";
  }

  // ─── Event Binding ────────────────────────────────────────────────────────────
  function bindEvents() {
    const toggleBtn = document.getElementById("hd-toggle-btn");
    const headerClose = document.getElementById("hd-header-close");
    const input = document.getElementById("hd-input");
    const sendBtn = document.getElementById("hd-send-btn");
    const emailForm = document.getElementById("hd-email-form");
    const emailInput = document.getElementById("hd-email-input");
    const emailSubmit = document.getElementById("hd-email-submit");
    const inputArea = document.getElementById("hd-input-area");

    if (toggleBtn) toggleBtn.addEventListener("click", () => isOpen ? closeWidget() : openWidget());
    if (headerClose) headerClose.addEventListener("click", closeWidget);

    if (input) {
      input.addEventListener("input", () => autoResizeTextarea(input));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage(input.value);
        }
      });
    }

    if (sendBtn) sendBtn.addEventListener("click", () => {
      const inp = document.getElementById("hd-input");
      if (inp) sendMessage(inp.value);
    });

    if (emailForm && emailSubmit && emailInput && inputArea) {
      emailSubmit.addEventListener("click", () => {
        const email = emailInput.value.trim();
        if (!email || !email.includes("@")) {
          emailInput.style.borderColor = "#ef4444";
          return;
        }
        emailCollected = true;
        emailForm.style.display = "none";
        inputArea.style.display = "flex";
        // Store email in session
        sessionId = sessionId || `session_${Date.now()}`;
        const inp = document.getElementById("hd-input");
        if (inp) setTimeout(() => inp.focus(), 100);
        appendMessage("system", `Chat started as ${email}`);
      });
      emailInput.addEventListener("input", () => {
        emailInput.style.borderColor = "";
      });
    }

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) closeWidget();
    });

    // Click outside to close (optional, only on desktop)
    document.addEventListener("click", (e) => {
      const root = document.getElementById("hd-widget-root");
      if (isOpen && root && !root.contains(e.target)) closeWidget();
    }, true);
  }

  // ─── Public API ───────────────────────────────────────────────────────────────
  window.HelpdeskWidget = {
    open: openWidget,
    close: closeWidget,
    toggle: () => isOpen ? closeWidget() : openWidget(),
    sendAgentMessage: (text) => {
      appendMessage("agent", text);
      if (!isOpen) {
        unreadCount++;
        setBadge(unreadCount);
      }
    },
    setConfig: (overrides) => Object.assign(cfg, overrides),
  };

  // ─── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    buildWidget();
    bindEvents();

    if (cfg.autoOpenDelay > 0) {
      setTimeout(openWidget, cfg.autoOpenDelay);
    }

    // Emit ready event
    document.dispatchEvent(new CustomEvent("helpdesk:ready", { detail: { widget: window.HelpdeskWidget } }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
