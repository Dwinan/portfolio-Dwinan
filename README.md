# M. Faqih Dwinanda | Editorial Portfolio

Live site: https://portfolio-dwinan.vercel.app/

## Architecture & Direction

A dependency-free static software engineering portfolio built around a Swiss International typographic grid, self-hosted typography (`Geist` and `Geist Mono`), and dual curated color editions (**Obsidian Mist** and **Archival Paper**) documented in [DESIGN.md](DESIGN.md).

### Highlights

- **Zero build step & device-aware performance:** Static CSS radial mist on phones and low-spec devices (`0` WebGL bytes loaded), with lazy-loaded desktop WebGL mist synchronized live to the active color edition.
- **Dual Edition Switcher:** Instant Obsidian Mist / Archival Paper toggle with WCAG AA+ verified text and interactive border contrast in both editions.
- **Verified Engineering Showcase:** Features `Eventory`, `MoonlightPDF`, `ArtSpace`, and `Morse Code Translator` with factual technical spec sheets, an interactive FSM Morse decoder, and direct GitHub/live links.
- **Intentional 3-State Responsive Layout:** Desktop split rails, compact tablet hero spread, and mobile identity card hero + elevated project cards with >= 44px tap targets, focus-trapped mobile drawer, and one-click email copy feedback.

## Directory Structure

```text
portfolio-Dwinan/
├── DESIGN.md
├── README.md
├── index.html
├── docs/
│   └── PRODUCT.md
├── assets/
│   ├── fonts/
│   │   ├── geist-latin.woff2
│   │   └── geist-mono-latin.woff2
│   ├── icons/
│   │   └── favicon.svg
│   └── images/
│       ├── dwinan.webp
│       └── dwinan.jpg
├── css/
│   └── style.css
└── js/
    ├── main.js
    └── vendor/
        └── gradient-engine.js
```

## Local Preview

Serve the root directory with any static HTTP server (`python -m http.server 4173`, `npx serve .`, or VS Code Live Server).
