# CareLine Medical Supplies: starter website

A simple static website (HTML, CSS, JavaScript) for a medical equipment supplier. No build tools or installs needed.

## What is in the project

```
careline-site/
├── index.html        Home page
├── products.html     Product catalogue with search and category filters
├── about.html        About and credentials
├── contact.html      Quote request form
├── css/style.css     All styling (colours and fonts are at the top)
├── js/products.js    Your product list (edit this to add products)
├── js/main.js        Site settings and page behaviour
└── images/           Put logos and product photos here
```

## Step 1: Make it yours (10 minutes)

1. Open the folder in VS Code.
2. In `js/main.js`, edit the `SITE` block at the top: company name, WhatsApp number (digits only, with country code, e.g. `2547XXXXXXXX`), phone, and email. These update on every page.
3. In `js/products.js`, replace the sample products with yours.
4. Search all files for `000000` and `Your Street` and replace them with your real registration numbers and address.
5. Rewrite the text on `about.html` in your own words.

To preview: right-click `index.html` and open it in your browser. For auto-refresh, install the **Live Server** extension in VS Code.

## Step 2: Make the contact form work

1. Create a free account at https://formspree.io and create a form.
2. Copy the form URL, which looks like `https://formspree.io/f/abcdwxyz`.
3. In `contact.html`, replace `https://formspree.io/f/YOUR_FORM_ID` with it.

(Netlify Forms will not work on GitHub Pages, which is why Formspree is used here.)

## Step 3: Publish on GitHub Pages (free)

1. Create a free account at https://github.com.
2. Create a new **public** repository, for example `careline-site`.
3. In a terminal inside this folder, run:
   ```
   git init
   git add .
   git commit -m "First version of the website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/careline-site.git
   git push -u origin main
   ```
4. On GitHub, open the repository, then **Settings, Pages**.
5. Under **Build and deployment**, set Source to **Deploy from a branch**, choose branch `main` and folder `/ (root)`, then Save.
6. Wait about a minute. Your site will be live at `https://YOUR-USERNAME.github.io/careline-site/`.

Every time you change something, run:
```
git add .
git commit -m "Describe your change"
git push
```
and the live site updates automatically.

If you do not want to use the terminal yet, you can also upload the files through the GitHub website (**Add file, Upload files**).

## Step 4: Use your own domain (optional)

Buy a domain (for example a `.co.ke` or `.com`), then in **Settings, Pages** enter it under **Custom domain** and follow GitHub's DNS instructions. Tick **Enforce HTTPS**.

## Things to study in the code

| What | Where | Concept |
|---|---|---|
| Product cards built from a list | `products.js` and `productCard()` in `main.js` | Arrays, objects, template strings |
| Search and filter | `setupProducts()` in `main.js` | `filter()`, events, re-rendering |
| Pre-filled quote form | `setupContact()` | `URLSearchParams`, query strings |
| Colours and fonts in one place | top of `style.css` | CSS custom properties |
| Mobile menu | `setupMobileMenu()` and `.site-nav` CSS | Toggling classes, `aria-expanded` |
| Accessible filters | `aria-pressed` on filter buttons | Basic accessibility |

## Ideas for next steps

- Add real product photos in `images/` and show them on the cards.
- Add a `<link rel="icon">` favicon and a Google Maps embed.
- Add a `sitemap.xml` and register the site with Google Search Console.
- When you have 30+ products, learn **Eleventy** to generate a page per product.

## Notes

- The header and footer are repeated in each HTML file. That is normal for a plain static site, and a static site generator removes this duplication later.
- Do not collect patient health information through the form.
- Check Kenyan licensing requirements (for example Pharmacy and Poisons Board) for the products you sell, and display your licence details.
