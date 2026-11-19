# M. Faqih Dwinanda — Editorial Portfolio

Live site: https://portfolio-dwinan.vercel.app/

## Architecture & Direction

A dependency-free static portfolio built around a Swiss International typographic grid, self-hosted typography (`Geist` & `Geist Mono`), and dual curated color editions (**Obsidian Mist** and **Archival Paper**) synchronized live with the ambient WebGL mist renderer.

### Highlights

- **Zero build step & self-hosted assets** — No frameworks, no CDN font blocking; portrait optimized to 29 KB WebP + 69 KB progressive JPEG (96% smaller than the original 783 KB image).
- **Dual Edition Switcher (`[T]`)** — Instant Obsidian Mist / Archival Paper mode with live WebGL mist shader palette synchronization and WCAG AA+ verified contrast across both editions.
- **Interactive Engineering Specimens** — Authentic architectural blueprints for *ArtSpace* and a live interactive Finite State Machine (FSM) Morse decoder right inside the *Morse Code Translator* project dossier.
- **Editorial Polish** — Masked display typography reveal, hairline-collapsed filterable skill matrix, live Bandar Lampung (WIB) telemetry clock, one-click email clipboard copy (`[C]`), and fine-pointer architectural cursor.

## Directory Structure

```text
portfolio-dwinan-v2/
├── index.html
├── README.md
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

Serve the root directory with any static server (`npx serve .`, `python3 -m http.server`, or VS Code Live Server).
