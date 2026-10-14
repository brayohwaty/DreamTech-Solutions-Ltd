/* ============================================================
   QUOTATION GENERATOR
   Settings live in SITE.quotation (js/main.js).
   Everything runs in the browser and is saved in this browser's
   localStorage: draft, remembered prices, and the next number.
   Optional: add  price: 12500  to a product in products.js to
   give it a default unit price.
   ============================================================ */
(function () {
  const Q = SITE.quotation;
  const KEY = { draft: "dreamtech_qt_draft", next: "dreamtech_qt_next", prices: "dreamtech_qt_prices" };
  const FIELDS = ["q-number", "q-date", "q-valid", "q-sales", "q-vat", "q-cname", "q-cco", "q-cphone", "q-cemail", "q-caddr", "q-notes"];

  const $ = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const multiline = (s) => esc(s).replace(/\n/g, "<br>");

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* storage blocked: the page still works, nothing is remembered */
      }
    }
  };

  const money = (n) =>
    (Number(n) || 0).toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const pad = (n) => String(n).padStart(2, "0");
  function todayISO() {
    const d = new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function addDays(iso, days) {
    const [y, m, d] = iso.split("-").map(Number);
    const t = new Date(y, m - 1, d + days);
    return t.getFullYear() + "-" + pad(t.getMonth() + 1) + "-" + pad(t.getDate());
  }
  const showDate = (iso) => (iso ? iso.split("-").reverse().join("/") : "");

  let lines = []; // { pid, name, qty, price }
  let prices = store.get(KEY.prices, {});

  const priceKey = (l) => (l.pid ? "p" + l.pid : "n:" + l.name.trim().toLowerCase());
  const nextNumber = () => store.get(KEY.next, Q.firstNumber);

  function findProduct(name) {
    const n = name.trim().toLowerCase();
    return PRODUCTS.find((p) => p.name.toLowerCase() === n);
  }

  function makeLine(name, qty) {
    const p = findProduct(name);
    const line = { pid: p ? p.id : null, name: p ? p.name : name.trim(), qty: qty || 1, price: "", vat: Number($("q-vat").value) || 0 };
    const saved = prices[priceKey(line)];
    line.price = saved !== undefined ? saved : p && p.price ? p.price : "";
    return line;
  }

  function addLine(name, qty) {
    if (!name.trim()) return;
    const line = makeLine(name, qty);
    const existing = lines.find((l) => priceKey(l) === priceKey(line));
    if (existing) existing.qty += line.qty;
    else lines.push(line);
    renderRows();
    refresh();
  }

  /* ---------- totals ---------- */
  // Each item has its own VAT rate. Older drafts without one use the default.
  const lineRate = (l) => (l.vat === undefined || l.vat === "" ? Number($("q-vat").value) || 0 : Number(l.vat) || 0);
  const rateName = (r) => (r ? "VAT " + r + "%" : "VAT Exempt");

  function totals() {
    let subtotal = 0;
    const byRate = {}; // rate -> VAT amount for items at that rate
    lines.forEach((l) => {
      const amount = (Number(l.qty) || 0) * (Number(l.price) || 0);
      const r = lineRate(l);
      subtotal += amount;
      byRate[r] = (byRate[r] || 0) + (amount * r) / 100;
    });
    Object.keys(byRate).forEach((r) => (byRate[r] = Math.round(byRate[r] * 100) / 100));
    const vat = Object.values(byRate).reduce((a, b) => a + b, 0);
    return { subtotal, byRate, vat, total: subtotal + vat };
  }

  function expiryISO() {
    return addDays($("q-date").value || todayISO(), Number($("q-valid").value) || 0);
  }

  /* ---------- editor ---------- */
  function renderRows() {
    $("q-rows").innerHTML = lines
      .map(
        (l, i) => `
      <tr>
        <td><input type="text" data-i="${i}" data-f="name" value="${esc(l.name)}" aria-label="Description"></td>
        <td><input type="number" min="1" step="1" data-i="${i}" data-f="qty" value="${l.qty}" aria-label="Quantity"></td>
        <td><input type="number" min="0" step="0.01" data-i="${i}" data-f="price" value="${l.price}" aria-label="Unit price"></td>
        <td><select data-i="${i}" data-f="vat" aria-label="VAT">
          <option value="0"${lineRate(l) === 0 ? " selected" : ""}>Exempt</option>
          <option value="16"${lineRate(l) === 16 ? " selected" : ""}>16%</option>
        </select></td>
        <td class="qt-amt" data-amt="${i}">${money(l.qty * l.price)}</td>
        <td><button type="button" class="qt-rm" data-rm="${i}" aria-label="Remove item">&times;</button></td>
      </tr>`
      )
      .join("");
    $("q-empty-hint").hidden = lines.length > 0;
  }

  function renderWarnings() {
    const notes = [];
    const unpriced = lines.filter((l) => !(Number(l.price) > 0)).length;
    if (unpriced) notes.push(unpriced + (unpriced === 1 ? " item has" : " items have") + " no price yet.");
    if (!Q.payment || !Q.payment.length) notes.push("Payment details are not set (SITE.quotation.payment in main.js).");
    if (/^A0+X$/.test(SITE.kraPin) || !SITE.kraPin) notes.push("KRA PIN in main.js is still a placeholder.");
    const el = $("qt-warn");
    el.hidden = notes.length === 0;
    el.innerHTML = notes.map(esc).join("<br>");
  }

  /* ---------- document ---------- */
  function renderPaper() {
    const t = totals();
    const rates = Object.keys(t.byRate).map(Number).filter((r) => r > 0).sort((a, b) => a - b);
    const vatRows = rates.length
      ? rates.map((r) => `<tr><td>${rateName(r)}</td><td>${money(t.byRate[r])} ${esc(Q.currency)}</td></tr>`).join("")
      : `<tr><td>VAT Exempt</td><td>${money(0)} ${esc(Q.currency)}</td></tr>`;
    const cur = Q.currency;

    const addressLines = (SITE.address || "").split("\n").filter(Boolean);
    const logo = SITE.logo
      ? `<img class="qd-logo" src="${esc(SITE.logo)}" alt="" onerror="this.remove()">`
      : `<strong>${esc(SITE.name)}</strong>`;

    const rows = lines.length
      ? lines
          .map((l) => {
            const qty = Number(l.qty) || 0;
            return `<tr>
              <td>${esc(l.name)}</td>
              <td class="r">${qty} ${qty === 1 ? "Unit" : "Units"}</td>
              <td class="r">${money(l.price)}</td>
              <td class="r">Sales ${rateName(lineRate(l))}</td>
              <td class="r amt">${money(qty * (Number(l.price) || 0))} ${esc(cur)}</td>
            </tr>`;
          })
          .join("")
      : `<tr><td colspan="5" style="text-align:center;color:#6b7a86">No items added yet</td></tr>`;

    const cust = [$("q-cname").value, $("q-cco").value, $("q-cphone").value, $("q-cemail").value, $("q-caddr").value]
      .map((s) => s.trim())
      .filter(Boolean);

    const payment = (Q.payment || []).filter(Boolean);
    const notes = $("q-notes").value.trim();

    $("q-paper").innerHTML = `
      <div class="qd-head">
        <div>${logo}</div>
        <div class="qd-co">
          <p><strong>${esc(SITE.name)}</strong></p>
          ${addressLines.map((a) => `<p>${esc(a)}</p>`).join("")}
          <p>Tax ID: ${esc(SITE.kraPin)}</p>
          <p>${esc(SITE.phone)} &middot; ${esc(SITE.email)}</p>
        </div>
      </div>

      ${cust.length ? `<div class="qd-to"><p class="lbl">Prepared for</p>${cust.map((c) => `<p>${multiline(c)}</p>`).join("")}</div>` : ""}

      <h2 class="qd-title">Quotation # ${esc($("q-number").value) || "(draft)"}</h2>
      <div class="qd-meta">
        <div><b>Quotation Date</b>${showDate($("q-date").value)}</div>
        <div><b>Expiration</b>${showDate(expiryISO())}</div>
        <div><b>Salesperson</b>${esc($("q-sales").value) || "&nbsp;"}</div>
      </div>

      <table class="qd-table">
        <thead><tr><th>DESCRIPTION</th><th class="r">QUANTITY</th><th class="r">UNIT PRICE</th><th class="r">TAXES</th><th class="r">AMOUNT</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <table class="qd-totals">
        <tr><td>Untaxed Amount</td><td>${money(t.subtotal)} ${esc(cur)}</td></tr>
        ${vatRows}
        <tr class="grand"><td>Total</td><td>${money(t.total)} ${esc(cur)}</td></tr>
      </table>

      ${notes ? `<div class="qd-block"><h4>Notes and terms</h4><p>${multiline(notes)}</p></div>` : ""}
      ${payment.length ? `<div class="qd-block"><h4>Payments should be made to</h4>${payment.map((p) => `<p>${esc(p)}</p>`).join("")}</div>` : ""}

      <p class="qd-foot">${esc(SITE.name)} &middot; ${esc(SITE.email)} &middot; ${esc(SITE.phone)}</p>`;
  }

  /* ---------- state ---------- */
  function save() {
    const fields = {};
    FIELDS.forEach((id) => (fields[id] = $(id).value));
    store.set(KEY.draft, { fields, lines });
  }

  function refresh() {
    renderPaper();
    renderWarnings();
    save();
  }

  function setDefaults() {
    $("q-number").value = BACKEND.enabled ? "" : Q.prefix + nextNumber();
    $("q-date").value = todayISO();
    $("q-valid").value = Q.validDays;
    $("q-vat").value = String(Q.vatRate);
    $("q-sales").value = Q.salesperson;
    $("q-notes").value = Q.terms;
    ["q-cname", "q-cco", "q-cphone", "q-cemail", "q-caddr"].forEach((id) => ($(id).value = ""));
    lines = [];
  }

  function newQuotation() {
    if (lines.length && !confirm("Start a new quotation? The current one will be cleared.")) return;
    if (!BACKEND.enabled) {
      const used = parseInt(($("q-number").value.match(/(\d+)\s*$/) || [])[1], 10);
      if (!isNaN(used)) store.set(KEY.next, Math.max(nextNumber(), used + 1));
    }
    setDefaults();
    renderRows();
    refresh();
  }

  async function printQuotation() {
    if (BACKEND.enabled && !(await saveQuotation())) return;
    const old = document.title;
    document.title = "Quotation " + $("q-number").value;
    window.print();
    document.title = old;
  }

  /* ---------- import helpers ---------- */
  function importFromText(text) {
    let count = 0;
    text.split(/\r?\n/).forEach((row) => {
      const m = row.match(/^\s*(?:\d+[.)]\s*)?(.+?)\s*[-\u2013]\s*Qty:?\s*(\d+)\s*$/i);
      if (m) {
        addLine(m[1], parseInt(m[2], 10));
        count++;
      }
    });
    return count;
  }

  /* ---------- backend (optional; active when SITE.backend is filled in) ---------- */
  function status(msg, bad) {
    const el = $("qt-status");
    el.hidden = !msg;
    el.textContent = msg || "";
    el.style.color = bad ? "#b3261e" : "";
  }

  function currentData() {
    const fields = {};
    FIELDS.forEach((id) => (fields[id] = $(id).value));
    return { fields, lines };
  }

  function applyData(d) {
    FIELDS.forEach((id) => {
      if (d.fields && d.fields[id] !== undefined) $(id).value = d.fields[id];
    });
    lines = Array.isArray(d.lines) ? d.lines : [];
    renderRows();
    refresh();
  }

  // Returns true when saved (or when no backend is in use)
  async function saveQuotation() {
    if (!BACKEND.enabled) return true;
    if (!BACKEND.signedIn()) {
      status("Please sign in to save.", true);
      return false;
    }
    try {
      status("Saving...");
      if (!$("q-number").value.trim()) {
        $("q-number").value = Q.prefix + (await BACKEND.nextNumber());
        refresh();
      }
      await BACKEND.saveQuotation({
        number: $("q-number").value.trim(),
        customer: ($("q-cname").value || $("q-cco").value).trim() || null,
        total: totals().total,
        data: currentData(),
        updated_at: new Date().toISOString()
      });
      status("Saved as " + $("q-number").value + ".");
      loadSaved();
      return true;
    } catch (e) {
      status("Could not save: " + e.message, true);
      return false;
    }
  }

  const priceTimers = {};
  function pushPrice(key, price) {
    if (!BACKEND.enabled || !BACKEND.signedIn()) return;
    clearTimeout(priceTimers[key]);
    priceTimers[key] = setTimeout(() => BACKEND.savePrice(key, price).catch(() => {}), 800);
  }

  async function syncPrices() {
    try {
      (await BACKEND.loadPrices()).forEach((r) => (prices[r.key] = Number(r.price)));
      store.set(KEY.prices, prices);
    } catch (e) {
      /* prices stay as they are on this device */
    }
  }

  async function loadSaved() {
    try {
      const rows = await BACKEND.listQuotations();
      $("qt-saved-list").innerHTML = rows.length
        ? rows
            .map(
              (r) => `<li><span>${esc(r.number)} &middot; ${esc(r.customer || "No name")} &middot; ${money(r.total)}</span>
              <button type="button" class="text-link" data-open="${esc(r.number)}">Open</button></li>`
            )
            .join("")
        : "<li>No saved quotations yet.</li>";
    } catch (e) {
      status("Could not load saved quotations: " + e.message, true);
    }
  }

  let requests = [];
  async function loadRequests() {
    try {
      requests = await BACKEND.listRequests();
      $("qt-req-list").innerHTML = requests.length
        ? requests
            .map(
              (r) => `<li><span title="${esc(r.message || "")}">${esc(r.name)} &middot; ${esc(r.phone)}</span>
              <button type="button" class="text-link" data-use="${r.id}">Use</button></li>`
            )
            .join("")
        : "<li>No new requests.</li>";
    } catch (e) {
      status("Could not load requests: " + e.message, true);
    }
  }

  async function useRequest(id) {
    const r = requests.find((x) => String(x.id) === String(id));
    if (!r) return;
    if (lines.length && !confirm("Replace the current quotation with this request?")) return;
    setDefaults();
    $("q-cname").value = r.name;
    $("q-cphone").value = r.phone;
    $("q-cemail").value = r.email || "";
    renderRows();
    importFromText(r.items || "");
    refresh();
    if (r.message) status("Customer note: " + r.message);
    try {
      await BACKEND.markRequest(r.id, "used");
    } catch (e) {
      /* request stays in the list */
    }
    loadRequests();
  }

  async function openSaved(number) {
    try {
      const rows = await BACKEND.getQuotation(number);
      if (!rows.length) return status("Quotation not found.", true);
      applyData(rows[0].data);
      status("Opened " + number + ".");
    } catch (e) {
      status("Could not open: " + e.message, true);
    }
  }

  function showAccount() {
    if (!BACKEND.enabled) return;
    const signedIn = BACKEND.signedIn();
    // Signed out: show only the sign-in box, hide the form and the preview
    document.querySelector(".qt-layout").classList.toggle("qt-locked", !signedIn);
    $("qt-account").hidden = false;
    $("qt-login").hidden = signedIn;
    $("qt-signed").hidden = !signedIn;
    $("q-number").readOnly = true;
    $("q-number").placeholder = "Assigned on save";
    if (signedIn) {
      $("qt-user").textContent = BACKEND.email();
      syncPrices();
      loadRequests();
      loadSaved();
    }
  }

  // Sign out and clear the on-screen draft and the copy kept in this browser (shared computers)
  function signOut(message) {
    BACKEND.signOut();
    setDefaults();
    renderRows();
    refresh();
    status(message || "");
    showAccount();
  }

  /* ---------- automatic sign-out after inactivity ---------- */
  const ACTIVE_KEY = "dreamtech_qt_active";
  const IDLE_MS = (Q.idleMinutes || 15) * 60000;
  const WARN_MS = Math.min(60000, IDLE_MS / 2);
  let lastActive = Date.now();
  let lastWrite = 0;
  let warned = false;
  let signingOut = false;

  function touch() {
    const now = Date.now();
    lastActive = now;
    if (now - lastWrite > 5000) {
      lastWrite = now;
      try {
        localStorage.setItem(ACTIVE_KEY, String(now)); // other open tabs see this too
      } catch (e) {
        /* ignore */
      }
    }
    if (warned) {
      warned = false;
      status("");
    }
  }

  async function autoSignOut() {
    if (signingOut) return;
    signingOut = true;
    let msg = "You were signed out after " + (Q.idleMinutes || 15) + " minutes of inactivity.";
    if (lines.length) {
      const ok = await saveQuotation();
      msg += ok
        ? " Your work was saved as " + $("q-number").value + "."
        : " Your latest changes could not be saved.";
    }
    signOut(msg);
    signingOut = false;
  }

  function idleCheck() {
    if (!BACKEND.enabled || !BACKEND.signedIn() || signingOut) return;
    let last = lastActive;
    try {
      last = Math.max(last, Number(localStorage.getItem(ACTIVE_KEY)) || 0);
    } catch (e) {
      /* ignore */
    }
    const idle = Date.now() - last;
    if (idle >= IDLE_MS) {
      autoSignOut();
    } else if (idle >= IDLE_MS - WARN_MS) {
      warned = true;
      status(
        "Signing out in " + Math.ceil((IDLE_MS - idle) / 1000) + " seconds because of inactivity. Move the mouse or press a key to stay signed in.",
        true
      );
    }
  }

  function startIdleWatch() {
    // A session left over from long ago (page closed, not signed out) ends right away
    let stored = 0;
    try {
      stored = Number(localStorage.getItem(ACTIVE_KEY)) || 0;
    } catch (e) {
      /* ignore */
    }
    if (BACKEND.signedIn() && Date.now() - stored >= IDLE_MS) {
      signOut("You were signed out after a period of inactivity. Please sign in again.");
    }
    ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "click", "input"].forEach((ev) =>
      document.addEventListener(ev, touch, { passive: true })
    );
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) idleCheck(); // e.g. laptop woke from sleep
    });
    setInterval(idleCheck, 1000);
  }

  function initAccount() {
    $("q-save").addEventListener("click", saveQuotation);
    if (!BACKEND.enabled) {
      $("q-save").hidden = true; // no backend: Save is not needed
      return;
    }
    $("qt-login").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        status("Signing in...");
        await BACKEND.signIn($("qt-email").value.trim(), $("qt-pass").value);
        $("qt-pass").value = "";
        status("");
        touch();
        showAccount();
      } catch (err) {
        status(err.message, true);
      }
    });
    $("qt-logout").addEventListener("click", () => signOut());
    $("qt-saved-list").addEventListener("click", (e) => {
      const b = e.target.closest("[data-open]");
      if (b) openSaved(b.dataset.open);
    });
    $("qt-req-list").addEventListener("click", (e) => {
      const b = e.target.closest("[data-use]");
      if (b) useRequest(b.dataset.use);
    });
    showAccount();
    startIdleWatch();
  }

  /* ---------- start ---------- */
  function init() {
    $("q-products").innerHTML = PRODUCTS.map((p) => `<option value="${esc(p.name)}"></option>`).join("");

    setDefaults();
    const draft = store.get(KEY.draft, null);
    if (draft && draft.fields) {
      FIELDS.forEach((id) => {
        if (draft.fields[id] !== undefined) $(id).value = draft.fields[id];
      });
      lines = Array.isArray(draft.lines) ? draft.lines : [];
    }
    renderRows();
    refresh();

    // Any change to the details above the item table
    FIELDS.forEach((id) => {
      $(id).addEventListener("input", refresh);
      $(id).addEventListener("change", refresh);
    });

    // Editing item rows (no re-render, so typing keeps focus)
    const tbody = $("q-rows");
    tbody.addEventListener("input", (e) => {
      const el = e.target;
      const line = lines[el.dataset.i];
      if (!line) return;
      const field = el.dataset.f;
      if (field === "name") line.name = el.value;
      if (field === "qty") line.qty = Number(el.value) || 0;
      if (field === "vat") line.vat = Number(el.value) || 0;
      if (field === "price") {
        line.price = el.value === "" ? "" : Number(el.value);
        if (line.price !== "") {
          prices[priceKey(line)] = line.price;
          store.set(KEY.prices, prices);
          pushPrice(priceKey(line), line.price);
        }
      }
      const amt = tbody.querySelector(`[data-amt="${el.dataset.i}"]`);
      if (amt) amt.textContent = money(line.qty * line.price);
      refresh();
    });
    tbody.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-rm]");
      if (!btn) return;
      lines.splice(Number(btn.dataset.rm), 1);
      renderRows();
      refresh();
    });

    // Add item
    const addInput = $("q-add");
    const doAdd = () => {
      addLine(addInput.value, 1);
      addInput.value = "";
      addInput.focus();
    };
    $("q-add-btn").addEventListener("click", doAdd);
    addInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        doAdd();
      }
    });

    // Import
    $("q-load-basket").addEventListener("click", () => {
      const items = readBasket();
      if (!items.length) return alert("There is no quote list saved in this browser.");
      items.forEach((i) => addLine(productById(i.id).name, i.qty));
    });
    $("q-paste-btn").addEventListener("click", () => {
      const n = importFromText($("q-paste").value);
      if (!n) return alert("No items found. Each line should look like: 1. Product name - Qty: 2");
      $("q-paste").value = "";
    });

    $("q-print").addEventListener("click", printQuotation);
    $("q-new").addEventListener("click", newQuotation);
    initAccount();
  }

  init();
})();
