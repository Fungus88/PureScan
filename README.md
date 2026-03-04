# PureScan

A minimalist, front-end-only food ingredient safety analyzer. Enter a product barcode and PureScan fetches data from the Open Food Facts database, classifies each ingredient by safety level, and presents nutrition scores and facts in a clean dark UI.

No backend. No accounts. No data collection.

---

## Features

- **Ingredient safety classification** — every ingredient rated as Safe, Caution, or Harmful based on a built-in reference database of ~330 entries
- **Nutrition scores** — displays Nutri-Score (A–E), NOVA Group (1–4), and Eco-Score (A–E) when available
- **Nutrient levels** — fat, saturated fat, sugars, and salt rated low/moderate/high per EU thresholds
- **Full nutrition table** — energy, macros, fiber, and salt per 100g
- **Allergens & labels** — pulled directly from Open Food Facts tags
- **Camera scanning** — live barcode scanning via device camera (mobile)
- **Manual entry** — type or paste any EAN-8, EAN-13, UPC-A, or UPC-E barcode
- **Animated UI** — GSAP-powered transitions throughout
- **Glossary panel** — in-app definitions for Nutri-Score, NOVA, Eco-Score, and nutrient levels

---

## How It Works

1. User enters a barcode number (or scans one via camera on mobile)
2. The app validates the format (`/^\d{8,13}$/`) and fetches from:
   ```
   https://world.openfoodfacts.org/api/v2/product/{barcode}
   ```
3. The ingredient list is parsed from the product response (tries `ingredients_text_en`, then the structured `ingredients` array, then the generic `ingredients_text`)
4. Each ingredient is matched against the built-in `SAFETY_DATA` dictionary using bidirectional substring matching
5. Results are sorted (Harmful → Caution → Safe) and rendered as cards with color-coded indicators

---

## Safety Classification

Ingredients are classified into three levels:

| Level | Color | Meaning |
|---|---|---|
| **Harmful** | Red | Linked to health concerns — synthetic dyes (tartrazine, allura red), nitrites, trans fats, controversial sweeteners (aspartame, acesulfame K), EU-banned additives (titanium dioxide), etc. |
| **Caution** | Amber | Moderate concern — sugar alcohols, sulphites, certain emulsifiers, high-GI ingredients (maltodextrin, glucose syrup), vague labeling ("natural flavors") |
| **Safe** | Green | No known concerns — vitamins, natural acids, basic whole-food ingredients, natural colorants, baking staples |

Unrecognized ingredients default to **Safe** with the note "No known safety concerns."

The overall verdict:
- **Concerns Found** — any red ingredient present
- **Some Caution** — more than two yellow ingredients, no red
- **Generally Safe** — otherwise

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| HTML/CSS/JS | — | Core, no framework |
| [Tailwind CSS](https://tailwindcss.com/) | CDN | Utility-first styling |
| [GSAP](https://gsap.com/) | 3.12.5 | Animations and transitions |
| [QuaggaJS](https://github.com/serratus/quaggaJS) | 0.12.1 | Camera barcode scanning |
| [Inter](https://fonts.google.com/specimen/Inter) | — | Typography |
| [Open Food Facts API](https://openfoodfacts.github.io/openfoodfacts-server/api/) | v2 | Product data source |

No build step. No bundler. No dependencies to install. Open `index.html` in a browser.

---

## File Structure

```
/
├── index.html      # Full UI markup — panels, search, results sections
├── script.js       # All application logic (~1400 lines)
├── style.css       # Custom styles beyond Tailwind (~550 lines)
└── heart.png       # Favicon
```

### script.js breakdown

| Section | Contents |
|---|---|
| Security helpers | `sanitizeHTML`, `validateBarcode`, `validateImageURL`, `sanitizeIngredientName`, `sanitizeDescription` |
| `SAFETY_DATA` | ~330 ingredient entries across red / yellow / green categories |
| Core logic | `classifyIngredient`, `fetchProduct`, `parseIngredients`, `extractProductData` |
| Render functions | `renderScoreBadges`, `renderNutrientLevels`, `renderNutritionTable`, `renderAllergensLabels`, `renderResults` |
| Animations | `animateSearchDock`, `animateResultsIn`, `animateResetToCenter` |
| Camera | `initScanner`, `stopScanner`, `onBarcodeDetected`, `processCameraBarcode` |
| Panels | `openAboutPanel`, `closeAboutPanel`, `openInfoPanel`, `closeInfoPanel` |
| Entry point | `runSearch`, form/button event listeners, `DOMContentLoaded` init |

---

## Usage

### Desktop
Open `index.html` in any modern browser. Type a barcode into the search field and press **Scan** or hit Enter.

### Mobile
Open the page on a mobile device. The camera section appears automatically. Tap **Start Camera**, point at a barcode, and the app detects and looks it up automatically. Switch to **Manual** mode to type instead.

### Example barcodes to try

| Product | Barcode |
|---|---|
| Nutella | `3017620422003` |
| Coca-Cola | `5449000000996` |
| Oreo | `8992760223015` |

---

## Security

- All text from the API is sanitized via DOM `textContent` assignment before rendering — no `innerHTML` with raw API strings
- Image URLs are validated (protocol must be `http:` or `https:`)
- Barcodes are validated against a strict numeric regex before any fetch is made
- Ingredient names and descriptions are truncated (100 and 300 chars respectively) before display

---

## Data Source

Product data is provided by [Open Food Facts](https://world.openfoodfacts.org/), a free, open, collaborative database of food products from around the world. Data completeness varies by product and region — not all products will have nutrition scores, ingredient lists, or allergen tags.

---

## Limitations

- **Ingredient matching is imprecise.** The classifier uses simple substring matching, which can produce false positives for ingredients with overlapping names (e.g., "salt" matching "potassium salt").
- **Safety data is static.** The built-in ingredient database reflects current scientific understanding at time of writing and does not update automatically.
- **Camera scanning requires HTTPS.** Most browsers block `getUserMedia` on non-secure origins. Host the files over HTTPS or use `localhost` for camera features to work.
- **Open Food Facts coverage varies.** Some products, particularly regional or private-label items, may have incomplete or missing data.
- **Not medical advice.** Classifications are informational only and should not substitute professional dietary guidance.

---

## License

This project is open source. Use it however you like.

Data from Open Food Facts is available under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/1-0/).
