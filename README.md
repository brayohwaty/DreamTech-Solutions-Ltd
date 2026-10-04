# DreamTech Solutions Ltd: website (version 2)

A static website (HTML, CSS, JavaScript) with a quote list, map, rating form, social links, KRA details, and a photo-first design.

## Files

```
dreamtech-site/
├── index.html      Home: hero photo, trust strip, category tiles, popular products
├── products.html   Catalogue with search and filters
├── quote.html      Quote list (the "cart")
├── about.html      About and credentials
├── contact.html    Contact form, map, rating
├── css/style.css   Styling (colours and fonts at the top)
├── js/products.js  Your product list
├── js/main.js      SETTINGS block at the top + all behaviour
└── images/         Your photos (see images/README.txt for file names)
```

## Step 1: Edit the SITE block in js/main.js (one place for everything)

| Setting | What it does |
|---|---|
| `whatsapp`, `phone`, `email` | Contact links on every page |
| `address` | Footer, About, and Contact pages |
| `mapQuery` | What the map searches for. Use your business name or full address as it appears on Google Maps |
| `facebook`, `instagram` | Social icons (leave `""` to hide one) |
| `googleReview` | Your Google "write a review" link (leave `""` to hide the button) |
| `kraPin`, `kraNote` | KRA details shown on the home page, footer, and About page. Only show what is true and current |
| `logo` | e.g. `"images/logo.png"`. Replaces the plus icon in the header on every page |
| `formEndpoint` | Your Formspree form address (Step 2) |

## Step 2: Connect the forms (Formspree)

1. Create a free account at formspree.io and create a form.
2. Copy the form URL, e.g. `https://formspree.io/f/abcdwxyz`.
3. Paste it into `formEndpoint` in `js/main.js`.

That one setting powers the quote list, the contact form, and the rating form. Until it is set, visitors see a message pointing them to WhatsApp.

## Step 3: Add photos

The site shows icons until a photo exists. Add photos one at a time using the names in `images/README.txt` (for example `images/hero.jpg` and `images/products/1.jpg`). Keep each under 200 KB.

## How the quote list works

- Visitors select **Add to quote** on any product, change quantities on the quote page, and send the list by email form or WhatsApp.
- **Quote this item** still lets them ask about a single product.
- The list is saved in the visitor's own browser, so it survives page changes and reloads.
- You receive a numbered list, for example `1. Foldable wheelchair - Qty: 2`, so you can price each line and then give the total.

## Ratings

Ratings are sent privately to your email. A static site cannot store and show public ratings by itself. For public ratings, use the Google review button, which needs your Google Business Profile link.

## Publish on GitHub Pages

```
git add .
git commit -m "Version 2: quote list, map, rating, KRA"
git push
```

Then Settings, Pages, branch `main`, folder `/ (root)`.

## Checklist before going live

- Replace every placeholder: phone, WhatsApp, email, address, map, registration number, PPB licence, KRA PIN.
- Replace the Facebook and Instagram links with your real pages.
- Check that every compliance statement (KRA, eTIMS, licences) is true and current.
- Add real photos.
- Send a test message through each form.
