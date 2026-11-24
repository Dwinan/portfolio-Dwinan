# Design Direction: M. Faqih Dwinanda Editorial Portfolio

> Direction owned by M. Faqih Dwinanda: retains the Swiss editorial dual-edition identity (Obsidian Mist and Archival Paper) with gated desktop WebGL mist, lightweight mobile rendering, factual project spec sheets, and an opt-in Morse FSM decoder.

## Design Read

Reading this as: software engineer personal portfolio for recruiters and engineering leads, in a bold Swiss International editorial grid style with dual curated themes, dial `ENERGY 3 / RHYTHM 2 / MOTION 2`.

## Liveliness Dials

- **ENERGY 3 (Bold):** Monumental uppercase display hero (`M. FAQIH / DWINANDA`), sharp architectural hairlines, and dual-edition dark/paper contrast.
- **RHYTHM 2 (Balanced with 3-state responsive adaptation):** Asymmetric desktop hero spread (`> 900px`), compact 2-column tablet hero (`641px–900px`), and purpose-built mobile identity hero + cardified dossiers (`<= 640px`), paired with sticky desktop `section-rail` splits.
- **MOTION 2 (Purposeful & Device-Aware):** Desktop masked display entrance, drawing hairline, scroll-reveal sections, hover roller/kinetic arrows (fine-pointer only), and opt-in Morse FSM demo. Mobile and low-memory devices skip WebGL (`0` vendor bytes downloaded), `backdrop-filter`, scroll reveals, and orb animations for smooth 60fps performance.

## Dual Color Editions (WCAG AA+ Verified)

### Obsidian Mist (`data-theme="dark"`, Default)

| Token | Value | Contrast / Role |
|---|---|---|
| `--bg` | `#060808` | Deep obsidian canvas |
| `--bg-elev` | `#0C1010` | Elevated specimen, spec sheet, and mobile card surface |
| `--ink-hi` | `#ECEEEB` | Primary text (17.20:1 on `--bg`) |
| `--ink-md` | `#A2AEAB` | Secondary copy (8.78:1 on `--bg`) |
| `--ink-lo` | `#7C8C88` | Metadata and indices (5.70:1 on `--bg`, 5.44:1 on `--bg-elev`) |
| `--accent` | `#56CFC2` | Primary teal accent (10.61:1 on `--bg`, 10.12:1 on `--bg-elev`) |
| `--rule-control` | `rgba(236, 238, 235, 0.38)` | Interactive button/control borders (3.12:1 on `--bg`, 3.20:1 on `--bg-elev`) |

### Archival Paper (`data-theme="paper"`)

| Token | Value | Contrast / Role |
|---|---|---|
| `--bg` | `#F7F4EC` | Warm archival paper canvas |
| `--bg-elev` | `#EFECE2` | Elevated specimen, spec sheet, and mobile card surface |
| `--ink-hi` | `#141917` | Primary text (16.18:1 on `--bg`) |
| `--ink-md` | `#444D49` | Secondary copy (7.95:1 on `--bg`) |
| `--ink-lo` | `#58635E` | Metadata and indices (5.68:1 on `--bg`, 5.29:1 on `--bg-elev`) |
| `--accent` | `#2F6B3F` | Botanical forest accent (5.80:1 on `--bg`, 5.39:1 on `--bg-elev`) |
| `--rule-control` | `rgba(20, 25, 23, 0.49)` | Interactive button/control borders (3.21:1 on `--bg`, 3.15:1 on `--bg-elev`) |

## Typography & Craft Decisions (R-06, R-31)

- **Self-hosted `Geist` + `Geist Mono`:** Zero CDN blocking; `Geist` drives display headings and body copy, while `Geist Mono` sets tabular index numbers, dates, stack metadata, and buttons.
- **No AI micro-slop:** Tech stack lists pure technologies with clean category tags (`LANG`, `STACK`, `UI`, `DATA`, `VCS`, `TOOLS`) and category filtering without generic one-line definitions.
- **Factual project spec sheets + real FSM decoder:** `Eventory`, `MoonlightPDF`, and `ArtSpace` use concise 3-row `<dl>` architecture sheets; `Morse Code Translator` keeps the live FSM decoder with manual input and opt-in `DEMO` mode.
- **Mobile-first ergonomics:** Compact side-by-side portrait/name hero above the fold, 3-column social strip, 2-column stack grid, elevated dossier cards with full-width action buttons, >= 44px tap targets, and focus-trapped mobile drawer.
