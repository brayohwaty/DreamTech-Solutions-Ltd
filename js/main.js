/*
  SITE SETTINGS
  Change these once and they update on every page.
  WhatsApp number: country code + number, digits only (no + or spaces).
*/
const SITE = {
  name: "DreamTech Solutions Ltd",
  whatsapp: "+254747829346",
  phone: "+254747829346",
  email: "dreamtechsolutionske@gmail.com"
};

/* ---------- Helpers ---------- */

function iconSvg(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  const inner = cat ? cat.icon : "";
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

function categoryName(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.name : "";
}

function productCard(product) {
  const quoteUrl = "contact.html?product=" + encodeURIComponent(product.name);
  return `
    <article class="card">
      <div class="card-icon cat-${product.category}">${iconSvg(product.category)}</div>
      <p class="card-cat">${categoryName(product.category)}</p>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <a class="btn btn-small" href="${quoteUrl}">Request a quote</a>
    </article>`;
}

/* ---------- Runs on every page ---------- */

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
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
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

/* ---------- Home page ---------- */

function setupHome() {
  const featuredGrid = document.getElementById("featured-grid");
  if (!featuredGrid) return;

  featuredGrid.innerHTML = PRODUCTS.filter((p) => p.featured)
    .slice(0, 4)
    .map(productCard)
    .join("");

  const categoryList = document.getElementById("category-list");
  if (categoryList) {
    categoryList.innerHTML = CATEGORIES.map(
      (c) => `
      <li>
        <a href="products.html?category=${c.id}">
          <span class="chip-icon cat-${c.id}">${iconSvg(c.id)}</span>
          ${c.name}
        </a>
      </li>`
    ).join("");
  }
}

/* ---------- Products page ---------- */

function setupProducts() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const searchInput = document.getElementById("search");
  const filterBar = document.getElementById("filters");
  const countEl = document.getElementById("result-count");
  const emptyEl = document.getElementById("empty-state");

  // Read starting values from the address bar, e.g. products.html?category=mobility
  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get("category") || "all";
  searchInput.value = params.get("q") || "";

  // Build the filter buttons
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

/* ---------- Contact page ---------- */

function setupContact() {
  const productField = document.getElementById("product");
  if (!productField) return;

  // Pre-fill the product if the visitor clicked "Request a quote"
  const params = new URLSearchParams(window.location.search);
  const product = params.get("product");
  if (product) productField.value = product;
}

/* ---------- Start ---------- */

setupSiteDetails();
setupMobileMenu();
setupHome();
setupProducts();
setupContact();
