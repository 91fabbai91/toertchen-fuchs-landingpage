# 🦊 TörtchenFuchs Landing Page & Recipe

[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Hosted_on-Netlify-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)
[![Dependabot Enabled](https://img.shields.io/badge/Dependabot-enabled-blue?logo=dependabot&logoColor=white)](https://github.com/dependabot)

> **"Schlaue Pfade, süße Momente"** — An outdoor sweet geocaching project. Discover hidden treats along outdoor trails, scan location QR codes, share stories with photos, and bake the original TörtchenFuchs cinnamon rolls at home.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Core Systems & Architecture](#-core-systems--architecture)
  - [Multi-Page App Setup](#multi-page-app-setup)
  - [Automated Asset Optimization Pipeline](#automated-asset-optimization-pipeline)
  - [Client-Side Image Compression](#client-side-image-compression)
  - [Netlify Forms & Bot Protection](#netlify-forms--bot-protection)
  - [Privacy-Compliant Telemetry & QR Codes](#privacy-compliant-telemetry--qr-codes)
  - [Internationalization (i18n)](#internationalization-i18n)
  - [Self-Hosted Fonts & DSGVO / GDPR Compliance](#self-hosted-fonts--dsgvo--gdpr-compliance)
  - [Navigation & Scroll Stabilization](#navigation--scroll-stabilization)
- [Environment Variables](#-environment-variables)
- [Deployment & Edge Caching](#-deployment--edge-caching)
- [Directory Layout](#-directory-layout)
- [Developer Tooling & Code Quality](#-developer-tooling--code-quality)

---

## 🌟 Project Overview

TörtchenFuchs blends outdoor exploration (similar to geocaching) with baking craftsmanship. Hikers and explorers discover sweet surprises in nature, scan a custom QR code at the site, land on this web app, read about the creators, view recipes, and send messages with optional photos.

### Key Architectural Highlights:

- **Ultra-Fast & Lightweight:** Zero heavy frontend framework runtime (no React/Vue/Angular); built with vanilla TypeScript and Tailwind CSS v4 for sub-second load times on outdoor mobile networks.
- **100% GDPR / DSGVO Compliant:** Self-hosted WOFF2 fonts, zero third-party tracking cookies or scripts, and serverless IP-anonymized geolocation telemetry.
- **Mobile-First Asset Delivery:** Responsive `<picture>` elements serving modern AVIF & WebP formats, with in-browser image compression before uploading.

---

## 🛠 Architecture & Tech Stack

| Component                | Technology                                                                                             | Purpose                                                             |
| :----------------------- | :----------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Bundler & Dev Server** | [Vite 8](https://vitejs.dev/)                                                                          | Multi-page bundling (`index.html`, `recipe.html`), instant HMR      |
| **Language**             | [TypeScript 6](https://www.typescriptlang.org/)                                                        | Strict static typing across client modules & Netlify Functions      |
| **Styling**              | [Tailwind CSS v4](https://tailwindcss.com/)                                                            | `@tailwindcss/vite` plugin with custom theme tokens                 |
| **Asset Pipeline**       | [Sharp](https://sharp.pixelplumbing.com/) & [SVGO](https://svgo.dev/)                                  | Incremental generation of AVIF/WebP and SVG vector minification     |
| **Forms & Serverless**   | [Netlify](https://www.netlify.com/)                                                                    | Netlify Forms (AJAX multipart) & Netlify Functions for telemetry    |
| **Client Compression**   | Canvas & `ImageBitmap`                                                                                 | Resizes 10–20 MB smartphone camera photos to ~300–600 KB in browser |
| **Typography**           | Local WOFF2                                                                                            | Self-hosted _Outfit_ & _Plus Jakarta Sans_                          |
| **Git Hooks & CI**       | [Husky](https://typicode.github.io/husky/) & [lint-staged](https://github.com/lint-staged/lint-staged) | Auto-format & typecheck on commit; Dependabot for updates           |

---

## 📦 Prerequisites

- **Node.js:** `v20.x` or higher (LTS recommended)
- **npm:** `v10.x` or higher
- **Git**

---

## 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/<owner>/toertchen-fuchs-landingpage.git
   cd toertchen-fuchs-landingpage
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   > _Note:_ `npm install` automatically triggers `npm run prepare`, initializing Husky pre-commit git hooks.

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   The asset optimizer runs first to ensure all `.avif` and `.webp` assets are available, then Vite serves the application at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command            | Description                                                                                  |
| :----------------- | :------------------------------------------------------------------------------------------- |
| `npm run dev`      | Runs asset optimizer incrementally and launches local Vite dev server.                       |
| `npm run build`    | Optimizes assets, checks TypeScript types (`tsc`), and bundles production assets to `dist/`. |
| `npm run optimize` | Manually runs `scripts/optimize-assets.mjs` to convert raster images and optimize SVGs.      |
| `npm run preview`  | Spins up a local web server to preview the production build in `dist/`.                      |
| `npm run format`   | Runs Prettier with Tailwind class sorting across all code, HTML, CSS, and markdown files.    |
| `npm run prepare`  | Installs and activates Husky git hooks (executed automatically upon `npm install`).          |

---

## 🔍 Core Systems & Architecture

### Multi-Page App Setup

Configured in [`vite.config.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/vite.config.ts) using `rollupOptions.input`:

- **Main Landing Page:** [`index.html`](file:///home/fabian/devel/toertchen-fuchs-landingpage/index.html) with entry point [`src/main.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/main.ts).
- **Recipe Subpage:** [`recipe.html`](file:///home/fabian/devel/toertchen-fuchs-landingpage/recipe.html) with entry point [`src/recipe.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/recipe.ts).

### Automated Asset Optimization Pipeline

Implemented in [`scripts/optimize-assets.mjs`](file:///home/fabian/devel/toertchen-fuchs-landingpage/scripts/optimize-assets.mjs):

- **Incremental Builds:** Uses file modification timestamps (`mtime`) to skip unchanged assets, executing in **~60–120ms** on repeated builds.
- **Modern Formats:** Scans `src/assets/` and converts raster images (`.jpg`, `.jpeg`, `.png`) into `.webp` and `.avif`.
- **Downscaling Oversized Photos:** High-resolution camera originals (> 1920px width) are scaled down to 1920px max width for web delivery.
- **Vector Minification:** Passes `src/assets/Fuchs_farbig.svg` and `public/favicon.svg` through SVGO to strip editor metadata and reduce payload sizes by ~45%.
- **Responsive Markup:** Uses HTML5 `<picture>` tags with `<source type="image/avif">`, `<source type="image/webp">`, and `<img>` fallbacks.

### Client-Side Image Compression

Implemented in [`src/imageCompression.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/imageCompression.ts):

- Modern smartphones capture photos between 10 MB and 20 MB, which can fail or stall on mobile data.
- When an image is selected in the contact form, an offscreen Canvas/`ImageBitmap` resizes it to a maximum dimension of 1600px and exports an optimized JPEG (quality `0.82`).
- Drastically reduces file sizes to **~300 KB – 600 KB** while correcting EXIF orientation.
- **Safeguard:** Automatically skips re-encoding if the original image is already compact (≤ 600 KB) or if compression would produce a larger file.

### Netlify Forms & Bot Protection

Implemented in [`src/form.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/form.ts) and [`public/__forms.html`](file:///home/fabian/devel/toertchen-fuchs-landingpage/public/__forms.html):

- **Detection Scaffold:** Because the form is submitted via AJAX `fetch` with client-compressed blobs, [`public/__forms.html`](file:///home/fabian/devel/toertchen-fuchs-landingpage/public/__forms.html) provides a clean HTML template that Netlify's build-time parser detects without requiring SSR.
- **Form Fields:** `name`, `email`, `message`, `photo` (file), `loc-id` (hidden), `device` (hidden), `bot-field` (honeypot).
- **Anti-Spam Layers:**
  1. _Honeypot:_ Hidden input `bot-field`. Submissions with this field populated are dismissed silently.
  2. _Time-to-Submit Verification:_ Submissions completed faster than 2.5 seconds after page load are rejected.
  3. _Local Dev Mode:_ When running on `localhost`, submissions simulate a successful submission so developers can test without Netlify errors.

### Privacy-Compliant Telemetry & QR Codes

Implemented in [`src/tracking.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/tracking.ts), [`src/device.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/device.ts), and [`netlify/functions/track.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/netlify/functions/track.ts):

- **QR Code Location ID:** QR codes include a URL query parameter like `/?loc-id=42`.
- **Session Persistence:** `extractLocationId()` validates that `loc-id` contains digits only and persists it to `sessionStorage` (`tf_loc_id`). If the visitor navigates across anchors or visits `recipe.html`, the location ID is retained.
- **Form Integration:** Automatically populates `#form-loc-id` and `#form-device` (e.g. `iOS`, `Android`, `Desktop`).
- **Telemetry Event:** Sends a non-blocking `POST /api/track` (proxied to Netlify Function). The function extracts Netlify Geo headers (`x-nf-geo`), strips raw IP addresses for full GDPR compliance, and forwards the payload to `WEBHOOK_URL` if configured.

### Internationalization (i18n)

Implemented in [`src/i18n.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/i18n.ts):

- Supports **German** (`de`, default) and **English** (`en`).
- **Language Detection Priority:**
  1. URL query parameter: `?lang=en` or `?lang=de`
  2. Local storage: `localStorage.getItem('preferred_language')`
  3. Browser preference: `navigator.language`
- **Dynamic DOM Binding:**
  - `data-i18n="key"`: Replaces text content or inner HTML.
  - `data-i18n-placeholder="key"`: Updates input placeholders.
  - `data-i18n-srcset`: Dynamically swaps responsive `<source>` and `<img>` graphics for language-specific illustrations (e.g. the dough folding diagrams).

### Self-Hosted Fonts & DSGVO / GDPR Compliance

- Font files are stored locally in [`public/fonts/`](file:///home/fabian/devel/toertchen-fuchs-landingpage/public/fonts/):
  - `Outfit` (weights 600, 700)
  - `Plus Jakarta Sans` (weights 400, 600)
- Configured via `@font-face` with `font-display: swap` in [`src/style.css`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/style.css).
- No connections are made to `fonts.googleapis.com` or `fonts.gstatic.com`, preventing user IP leakage.

### Navigation & Scroll Stabilization

Implemented in [`src/navigation.ts`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/navigation.ts):

- When navigating from the recipe feedback button (`recipe.html` ➔ `index.html#contact-form`), browser history scroll restoration could restore stale scroll offsets.
- [`setupHashScrollHandler()`](file:///home/fabian/devel/toertchen-fuchs-landingpage/src/navigation.ts) sets `history.scrollRestoration = 'manual'` on hash entries and triggers smooth scrolling once the DOM and fonts settle.
- `#contact-form` uses `scroll-mt-20 sm:scroll-mt-28` to maintain clearance under sticky headers.

---

## 🔐 Environment Variables

Configure environment variables in your local `.env` file (for local testing) or in the **Netlify App Dashboard** under _Site configuration > Environment variables_:

| Variable      | Required | Default | Description                                                                                                                                                             |
| :------------ | :------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WEBHOOK_URL` | No       | _None_  | Destination webhook (e.g. Discord, Slack, n8n, Make) to receive real-time telemetry events. If unset, telemetry runs in mock mode and logs to Netlify function console. |

---

## 🌐 Deployment & Edge Caching

The site is configured for zero-config deployment on [Netlify](https://www.netlify.com/) via [`netlify.toml`](file:///home/fabian/devel/toertchen-fuchs-landingpage/netlify.toml):

```toml
[build]
  publish = "dist"
  command = "npm run build"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Edge Caching Strategy

- **Content-Hashed Assets (`/assets/*`) & Fonts (`/fonts/*`):** `Cache-Control: public, max-age=31536000, immutable` (1 year).
- **Unhashed Media & Icons (`/*.svg`, `/*.png`, `/*.ico`):** `Cache-Control: public, max-age=2592000, stale-while-revalidate=86400` (30 days).
- **HTML Pages (`/*.html`):** `Cache-Control: public, max-age=0, must-revalidate` (guarantees visitors see the latest release immediately).

---

## 📁 Directory Layout

```text
toertchen-fuchs-landingpage/
├── .github/
│   └── dependabot.yml           # Weekly automated npm dependency checks
├── .husky/
│   └── pre-commit               # Git pre-commit hook (lint-staged & tsc)
├── netlify/
│   └── functions/
│       └── track.ts             # Serverless telemetry handler (IP-anonymized)
├── public/
│   ├── fonts/                   # Self-hosted WOFF2 font files
│   ├── __forms.html             # Static Netlify form detection scaffold
│   ├── favicon.svg / png / ico  # App favicons
│   └── robots.txt               # Search engine crawler directives
├── scripts/
│   └── optimize-assets.mjs      # Incremental Sharp & SVGO optimization script
├── src/
│   ├── assets/                  # Source images, SVGs, and generated AVIF/WebP
│   ├── device.ts                # User-Agent device detection (iOS/Android/Desktop)
│   ├── form.ts                  # Form submission, validation, honeypot handling
│   ├── i18n.ts                  # DE/EN translation dictionaries & DOM binder
│   ├── imageCompression.ts      # Client-side HTML5 canvas photo compressor
│   ├── main.ts                  # Entry point for index.html
│   ├── navigation.ts            # Sticky nav, mobile drawer, scroll-spy, hash scroll
│   ├── recipe.ts                # Entry point for recipe.html
│   ├── style.css                # Tailwind CSS v4 import, custom fonts, theme tokens
│   └── tracking.ts              # QR code location ID extraction & telemetry dispatch
├── index.html                   # Main landing page
├── recipe.html                  # Cinnamon roll recipe & folding guide
├── netlify.toml                 # Netlify build, redirects, security & caching headers
├── package.json                 # Dependencies, scripts, and lint-staged config
├── tsconfig.json                # TypeScript compiler configuration
└── vite.config.ts               # Multi-page Vite configuration
```

---

## 🧪 Developer Tooling & Code Quality

### Pre-Commit Hooks

Pre-commit checks are powered by [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged). Whenever you execute `git commit`, the hook automatically:

1. Formats all staged files (`*.{ts,js,mjs,json,css,html,md}`) using Prettier.
2. Runs TypeScript type checking (`tsc --noEmit`) across the entire project.

If any type errors are detected, the commit is blocked to prevent broken code from entering the repository.

### Dependency Management (Dependabot)

Configured via [`.github/dependabot.yml`](file:///home/fabian/devel/toertchen-fuchs-landingpage/.github/dependabot.yml) to perform weekly security and version checks for npm dependencies with standard `chore(deps)` commit conventions.

### Code Style & Formatting

- **Prettier:** Run `npm run format` to format all files according to [`.prettierrc`](file:///home/fabian/devel/toertchen-fuchs-landingpage/.prettierrc).
- **VS Code:** Recommended workspace settings are provided in [`.vscode/settings.json`](file:///home/fabian/devel/toertchen-fuchs-landingpage/.vscode/settings.json), configuring Prettier as the default formatter and enabling Format on Save.
