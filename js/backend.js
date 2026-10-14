/* ============================================================
   BACKEND CLIENT (Supabase)
   Load AFTER js/main.js (it reads SITE.backend).
   If SITE.backend is empty, BACKEND.enabled is false and the site
   works exactly as before.
   ============================================================ */
const BACKEND = (function () {
  const cfg = Object.assign({}, SITE.backend);
  // Tidy the address: remove spaces, trailing slashes and any /rest/v1 or /auth/v1 ending
  cfg.url = (cfg.url || "").trim().replace(/\/+$/, "").replace(/\/(rest|auth)\/v1$/, "");
  cfg.anonKey = (cfg.anonKey || "").trim();
  const enabled = !!(cfg.url && cfg.anonKey);
  const SESSION_KEY = "dreamtech_staff_session";

  let session = null;
  try {
    session = JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (e) {
    session = null;
  }

  function keep(s) {
    session = s;
    try {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) {
      /* storage blocked: you will need to sign in on each page load */
    }
  }

  async function auth(path, body) {
    const res = await fetch(cfg.url + "/auth/v1/" + path, {
      method: "POST",
      headers: { apikey: cfg.anonKey, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).catch(() => {
      throw new Error("Cannot reach Supabase. Check the url in main.js and your internet connection.");
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const why = data.error_description || data.msg || data.message || data.error || "";
      throw new Error(why ? "Sign-in failed: " + why : "Sign-in failed (error " + res.status + ")");
    }
    return data;
  }

  function remember(d) {
    keep({
      access: d.access_token,
      refresh: d.refresh_token,
      expires: Date.now() + d.expires_in * 1000 - 60000,
      email: d.user && d.user.email
    });
  }

  async function token() {
    if (!session) return null;
    if (Date.now() > session.expires) {
      try {
        remember(await auth("token?grant_type=refresh_token", { refresh_token: session.refresh }));
      } catch (e) {
        keep(null);
        return null;
      }
    }
    return session.access;
  }

  // anon: true = send as a website visitor (no staff login needed)
  async function api(path, opts) {
    const { method = "GET", body, prefer, anon } = opts || {};
    const t = anon ? null : await token();
    if (!anon && !t) throw new Error("Please sign in first.");
    const headers = { apikey: cfg.anonKey, "Content-Type": "application/json" };
    // Staff requests carry their login token. Visitors send only the key; the older
    // "anon" JWT key also goes in Authorization, the newer "sb_publishable_" key must not.
    if (t) headers.Authorization = "Bearer " + t;
    else if (cfg.anonKey.startsWith("eyJ")) headers.Authorization = "Bearer " + cfg.anonKey;
    if (prefer) headers.Prefer = prefer;
    const res = await fetch(cfg.url + "/rest/v1/" + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Request failed (" + res.status + ")");
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  const upsert = "resolution=merge-duplicates";

  return {
    enabled,
    signedIn: () => !!session,
    email: () => (session ? session.email : ""),
    async signIn(email, password) {
      remember(await auth("token?grant_type=password", { email, password }));
    },
    signOut: () => keep(null),

    // staff
    nextNumber: () => api("rpc/next_quote_number", { method: "POST", body: {} }),
    saveQuotation: (row) => api("quotations?on_conflict=number", { method: "POST", body: row, prefer: upsert }),
    listQuotations: () => api("quotations?select=number,customer,total,created_at&order=created_at.desc&limit=30"),
    getQuotation: (number) => api("quotations?number=eq." + encodeURIComponent(number) + "&select=data"),
    loadPrices: () => api("prices?select=key,price"),
    savePrice: (key, price) => api("prices?on_conflict=key", { method: "POST", body: { key, price }, prefer: upsert }),
    listRequests: () => api("quote_requests?select=*&status=eq.new&order=created_at.desc&limit=30"),
    markRequest: (id, status) => api("quote_requests?id=eq." + id, { method: "PATCH", body: { status } }),

    // public website
    submitRequest: (row) => api("quote_requests", { method: "POST", body: row, anon: true })
  };
})();
