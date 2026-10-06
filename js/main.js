/* ============================================================
   SITE SETTINGS: the only place you need to edit for contact
   details, social links, map, KRA, logo, and the contact form.
   ============================================================ */
const SITE = {
  name: "",

  // WhatsApp: country code + number, digits only (no + or spaces)
  whatsapp: "+254747829346",
  phone: "+254 747 829 346",
  email: "dreamtechsolutionske@gmail.com",

  // Shown in the footer and on the contact page. \n starts a new line.
  address: "DreamTech Solutions Limited\nNairobi, Kenya",

  // What Google Maps should search for. Use your business name or full address,
  // exactly as you would type it into Google Maps.
  mapQuery: "Nairobi, Kenya",

  // Social pages. Leave as "" to hide an icon.
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",

  // Paste your Google Business "write a review" link. Leave "" to hide the button.
  googleReview: "",

  // KRA. Only show what is true and up to date for your business.
  kraPin: "A000000000X",
  kraNote: "KRA compliant · eTIMS invoices",

  // Logo file, e.g. "images/logo.png". Leave "" to use the plus-sign icon.
  logo: "images/logo.png",

  // Your Formspree form address (see README, step 2).
  formEndpoint: "https://formspree.io/f/xppqanaz"
};

const BASKET_KEY = "dreamtech_quote_list";

/* ============================================================
   HELPERS
   ============================================================ */

function iconSvg(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const inner = cat ? cat.icon : "";
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

function categoryName(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.name : "";
}

// Photo path for a product. Add images/products/<id>.jpg, or set "image" in products.js.
function productImage(product) {
  return product.image || "images/products/" + product.id + ".jpg";
}

function productById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

/*
  Image with a fallback: the icon sits underneath, and the photo sits on top.
  If the photo file does not exist, onerror removes it and the icon shows.
*/
function productMedia(product, cssClass) {
  return `
    <div class="${cssClass}">
      <span class="media-fallback">${iconSvg(product.category)}</span>
      <img src="${productImage(product)}" alt="${product.name}" loading="lazy" onerror="this.remove()">
    </div>`;
}

function productCard(product) {
  const quoteUrl = "contact.html?product=" + encodeURIComponent(product.name);
  return `
    <article class="card">
      ${productMedia(product, "card-media")}
      <div class="card-body">
        <p class="card-cat">${categoryName(product.category)}</p>
        <h3>${product.name}</h3>
        <p class="card-desc">${product.description}</p>
        <div class="card-actions">
          <button type="button" class="btn btn-small add-to-quote" data-id="${product.id}">Add to quote</button>
          <a class="text-link" href="${quoteUrl}">Quote this item</a>
        </div>
      </div>
    </article>`;
}

const FB_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M14 8h2V5h-2.5C11 5 10 6.5 10 8.5V10H8v3h2v6h3v-6h2.2l.5-3H13V8.7c0-.5.2-.7 1-.7z"/></svg>';
const IG_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r="0.6" fill="currentColor"/></svg>';

function socialLinks() {
  const links = [];
  if (SITE.facebook) {
    links.push(`<a href="${SITE.facebook}" target="_blank" rel="noopener" aria-label="${SITE.name} on Facebook">${FB_ICON}</a>`);
  }
  if (SITE.instagram) {
    links.push(`<a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="${SITE.name} on Instagram">${IG_ICON}</a>`);
  }
  return links.length ? `<div class="social">${links.join("")}</div>` : "";
}

/* ============================================================
   QUOTE LIST (the "cart")
   Saved in the visitor's own browser with localStorage.
   ============================================================ */

let memoryBasket = []; // used if the browser blocks localStorage

function readBasket() {
  let items = memoryBasket;
  try {
    const raw = localStorage.getItem(BASKET_KEY);
    if (raw) items = JSON.parse(raw);
  } catch (error) {
    items = memoryBasket;
  }
  // Keep only valid lines for products that still exist
  return Array.isArray(items)
    ? items.filter((i) => i && productById(i.id) && i.qty > 0)
    : [];
}

function writeBasket(items) {
  memoryBasket = items;
  try {
    localStorage.setItem(BASKET_KEY, JSON.stringify(items));
  } catch (error) {
    // Storage blocked: the in-memory copy still works on this page.
  }
  refreshBasketCount();
}

function addToBasket(id) {
  const items = readBasket();
  const line = items.find((i) => i.id === id);
  if (line) {
    line.qty = Math.min(line.qty + 1, 999);
  } else {
    items.push({ id: id, qty: 1 });
  }
  writeBasket(items);
}

function refreshBasketCount() {
  const total = readBasket().reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll("[data-basket-count]").forEach((el) => {
    el.textContent = total;
    el.hidden = total === 0;
  });
}

function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }
  toast.textContent = "";
  const text = document.createElement("span");
  text.textContent = message;
  const link = document.createElement("a");
  link.href = "quote.html";
  link.textContent = "View list";
  toast.append(text, link);
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setupAddToQuote() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".add-to-quote");
    if (!button) return;

    const product = productById(Number(button.dataset.id));
    if (!product) return;

    addToBasket(product.id);
    showToast(product.name + " added");

    button.textContent = "Added ✓";
    setTimeout(() => {
      button.textContent = "Add to quote";
    }, 1500);
  });
}

/* ============================================================
   FORMS (Formspree)
   ============================================================ */

function isPlaceholderEndpoint() {
  return !SITE.formEndpoint || SITE.formEndpoint.includes("YOUR_FORM_ID");
}

async function sendToFormspree(formData) {
  const response = await fetch(SITE.formEndpoint, {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" }
  });
  if (!response.ok) throw new Error("Send failed");
}

function setStatus(element, message, type) {
  element.textContent = message;
  element.className = "form-status " + type;
  element.hidden = false;
}

const NOT_SET_UP_MESSAGE =
  "Our online form is not set up yet. Please contact us on WhatsApp instead.";
const FAILED_MESSAGE =
  "Sorry, that did not send. Please try WhatsApp or call us.";

// Any <form data-form> (contact form, rating form) uses this.
function setupForms() {
  document.querySelectorAll("form[data-form]").forEach((form) => {
    form.action = SITE.formEndpoint;
    const status = form.querySelector(".form-status");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (isPlaceholderEndpoint()) {
        setStatus(status, NOT_SET_UP_MESSAGE, "error");
        return;
      }
      const button = form.querySelector("[type=submit]");
      button.disabled = true;
      try {
        await sendToFormspree(new FormData(form));
        form.reset();
        setStatus(status, form.dataset.success || "Thank you! We will reply soon.", "ok");
      } catch (error) {
        setStatus(status, FAILED_MESSAGE, "error");
      } finally {
        button.disabled = false;
      }
    });
  });
}

/* ============================================================
   SITE-WIDE DETAILS AND EXTRAS
   ============================================================ */

function setupSiteDetails() {
  document.querySelectorAll("[data-site-name]").forEach((el) => {
    el.textContent = SITE.name;
  });
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.href = "https://wa.me/" + SITE.whatsapp;
  });
  document.querySelectorAll("[data-phone]").forEach((el) => {
    el.textContent = SITE.phone;
    el.href = "tel:" + SITE.phone.replace(/\s/g, "");
  });
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.textContent = SITE.email;
    el.href = "mailto:" + SITE.email;
  });
  document.querySelectorAll("[data-address]").forEach((el) => {
    el.textContent = SITE.address;
  });
  document.querySelectorAll("[data-kra-pin]").forEach((el) => {
    el.textContent = SITE.kraPin;
  });
  document.querySelectorAll("[data-kra-note]").forEach((el) => {
    el.textContent = SITE.kraNote;
  });
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  document.querySelectorAll("[data-social]").forEach((el) => {
    el.innerHTML = socialLinks();
  });
  document.querySelectorAll("[data-google-review]").forEach((el) => {
    if (SITE.googleReview) {
      el.href = SITE.googleReview;
    } else {
      el.hidden = true;
    }
  });

  // Map and directions
  const mapSearch = encodeURIComponent(SITE.mapQuery);
  document.querySelectorAll("[data-map]").forEach((el) => {
    el.src = "https://www.google.com/maps?q=" + mapSearch + "&output=embed";
  });
  document.querySelectorAll("[data-directions]").forEach((el) => {
    el.href = "https://www.google.com/maps/search/?api=1&query=" + mapSearch;
  });

  // Logo: replaces the plus-sign icon if SITE.logo is set
  if (SITE.logo) {
    document.querySelectorAll(".brand-mark").forEach((mark) => {
      const img = document.createElement("img");
      img.className = "brand-logo";
      img.src = SITE.logo;
      img.alt = SITE.name + " logo";
      mark.replaceWith(img);
    });
  }
}

// Adds the quote-list link to the menu and a "Follow us / KRA" column to the footer
function injectSiteExtras() {
  const navList = document.querySelector(".site-nav ul");
  if (navList) {
    const item = document.createElement("li");
    const onQuotePage = window.location.pathname.endsWith("quote.html");
    item.innerHTML = `<a class="nav-quote" href="quote.html"${onQuotePage ? ' aria-current="page"' : ""}>Quote list <span class="badge" data-basket-count hidden>0</span></a>`;
    navList.appendChild(item);
  }

  const toggle = document.querySelector(".menu-toggle");
  if (toggle) {
    toggle.insertAdjacentHTML("beforeend", ' <span class="badge" data-basket-count hidden>0</span>');
  }

  const footerGrid = document.querySelector(".footer-grid");
  if (footerGrid) {
    const review = SITE.googleReview
      ? `<li><a href="${SITE.googleReview}" target="_blank" rel="noopener">Review us on Google</a></li>`
      : "";
    footerGrid.insertAdjacentHTML(
      "beforeend",
      `<div>
        <h3>Follow us</h3>
        ${socialLinks()}
        <p class="footer-kra"><strong>${SITE.kraNote}</strong><br>KRA PIN: ${SITE.kraPin}</p>
        <ul>
          <li><a href="contact.html#rate">Rate us &#9733;</a></li>
          ${review}
        </ul>
      </div>`
    );
  }
}

function setupMobileMenu() {
  const button = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
}

/* ============================================================
   HOME PAGE
   ============================================================ */

function setupHome() {
  const featuredGrid = document.getElementById("featured-grid");
  if (!featuredGrid) return;

  featuredGrid.innerHTML = PRODUCTS.filter((p) => p.featured)
    .slice(0, 4)
    .map(productCard)
    .join("");

  const tiles = document.getElementById("category-tiles");
  if (tiles) {
    tiles.innerHTML = CATEGORIES.map(
      (c) => `
      <a class="tile" href="products.html?category=${c.id}">
        <span class="tile-fallback">${iconSvg(c.id)}</span>
        <img src="images/categories/${c.id}.jpg" alt="" loading="lazy" onerror="this.remove()">
        <span class="tile-label">${c.name}</span>
      </a>`
    ).join("");
  }

  const heroFallback = document.getElementById("hero-fallback");
  if (heroFallback) {
    heroFallback.innerHTML = CATEGORIES.slice(0, 4).map((c) => iconSvg(c.id)).join("");
  }
}

/* ============================================================
   PRODUCTS PAGE
   ============================================================ */

function setupProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const searchInput = document.getElementById("search");
  const filterBar = document.getElementById("filters");
  const countEl = document.getElementById("result-count");
  const emptyEl = document.getElementById("empty-state");

  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get("category") || "all";
  searchInput.value = params.get("q") || "";

  const allFilters = [{ id: "all", name: "All products" }, ...CATEGORIES];
  filterBar.innerHTML = allFilters
    .map(
      (c) =>
        `<button type="button" class="filter" data-category="${c.id}" aria-pressed="${c.id === activeCategory}">${c.name}</button>`
    )
    .join("");

  function render() {
    const term = searchInput.value.trim().toLowerCase();

    const results = PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const text = (p.name + " " + p.description).toLowerCase();
      return matchesCategory && text.includes(term);
    });

    grid.innerHTML = results.map(productCard).join("");
    countEl.textContent = results.length + (results.length === 1 ? " product" : " products");
    emptyEl.hidden = results.length > 0;

    filterBar.querySelectorAll(".filter").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.category === activeCategory));
    });
  }

  filterBar.addEventListener("click", (event) => {
    const btn = event.target.closest(".filter");
    if (!btn) return;
    activeCategory = btn.dataset.category;
    render();
  });

  searchInput.addEventListener("input", render);
  render();
}

/* ============================================================
   QUOTE PAGE
   ============================================================ */

function quoteLines() {
  return readBasket().map((i) => ({ product: productById(i.id), qty: i.qty }));
}

// Numbered list so we can price line by line, then give a total
function quoteAsText() {
  return quoteLines()
    .map((line, n) => `${n + 1}. ${line.product.name} - Qty: ${line.qty}`)
    .join("\n");
}

function quoteRow(line) {
  const p = line.product;
  return `
    <li class="quote-row">
      ${productMedia(p, "quote-thumb")}
      <div>
        <h3>${p.name}</h3>
        <p class="card-cat">${categoryName(p.category)}</p>
      </div>
      <div class="quote-controls">
        <div class="qty" role="group" aria-label="Quantity for ${p.name}">
          <button type="button" data-action="dec" data-id="${p.id}" aria-label="Decrease quantity">&minus;</button>
          <span>${line.qty}</span>
          <button type="button" data-action="inc" data-id="${p.id}" aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="text-link danger" data-action="remove" data-id="${p.id}">Remove</button>
      </div>
    </li>`;
}

function setupQuotePage() {
  const list = document.getElementById("quote-list");
  if (!list) return;

  const emptyEl = document.getElementById("quote-empty");
  const contentEl = document.getElementById("quote-content");
  const successEl = document.getElementById("quote-success");
  const summaryEl = document.getElementById("quote-summary");
  const form = document.getElementById("quote-form");
  const status = document.getElementById("quote-status");

  // The page already has its own WhatsApp button, so hide the floating one here
  const floatingButton = document.querySelector(".whatsapp-float");
  if (floatingButton) floatingButton.remove();

  function render() {
    const lines = quoteLines();
    emptyEl.hidden = lines.length > 0;
    contentEl.hidden = lines.length === 0;
    list.innerHTML = lines.map(quoteRow).join("");

    const units = lines.reduce((sum, l) => sum + l.qty, 0);
    summaryEl.textContent =
      lines.length + (lines.length === 1 ? " product" : " products") + ", " + units + " in total";
  }

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    let items = readBasket();
    const line = items.find((i) => i.id === id);
    if (!line) return;

    if (button.dataset.action === "inc") line.qty = Math.min(line.qty + 1, 999);
    if (button.dataset.action === "dec") line.qty = Math.max(line.qty - 1, 1);
    if (button.dataset.action === "remove") items = items.filter((i) => i.id !== id);

    writeBasket(items);
    render();
  });

  document.getElementById("clear-list").addEventListener("click", () => {
    writeBasket([]);
    render();
  });

  // Send the list on WhatsApp
  document.getElementById("whatsapp-send").addEventListener("click", () => {
    const name = form.elements["name"].value.trim();
    const phone = form.elements["phone"].value.trim();
    const notes = form.elements["message"].value.trim();

    let text = `Hello ${SITE.name}, I would like a quote for:\n${quoteAsText()}`;
    if (notes) text += `\n\nNotes: ${notes}`;
    if (name) text += `\n\nName: ${name}`;
    if (phone) text += `\nPhone: ${phone}`;

    window.open(
      "https://wa.me/" + SITE.whatsapp + "?text=" + encodeURIComponent(text),
      "_blank",
      "noopener"
    );
  });

  // Send the list by email through Formspree
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isPlaceholderEndpoint()) {
      setStatus(status, NOT_SET_UP_MESSAGE, "error");
      return;
    }

    const data = new FormData(form);
    data.set("items", quoteAsText());
    data.set("_subject", "Quote request: " + quoteLines().length + " product(s)");

    const button = form.querySelector("[type=submit]");
    button.disabled = true;
    try {
      await sendToFormspree(data);
      writeBasket([]);
      form.reset();
      emptyEl.hidden = true;
      contentEl.hidden = true;
      successEl.hidden = false;
    } catch (error) {
      setStatus(status, FAILED_MESSAGE, "error");
    } finally {
      button.disabled = false;
    }
  });

  render();
}

/* ============================================================
   CONTACT PAGE
   ============================================================ */

function setupContact() {
  const productField = document.getElementById("product");
  if (!productField) return;

  const params = new URLSearchParams(window.location.search);
  const product = params.get("product");
  if (product) productField.value = product;
}

/* ============================================================
   START
   ============================================================ */

setupSiteDetails();
injectSiteExtras();
setupMobileMenu();
setupAddToQuote();
setupForms();
setupHome();
setupProducts();
setupQuotePage();
setupContact();
refreshBasketCount();
