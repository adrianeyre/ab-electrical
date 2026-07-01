# A. B. Electrical & Maintenance — Website

A professional, single-page marketing website for **A. B. Electrical & Maintenance**, a reliable,
local, NAPIT-registered and TrustMark-approved electrician serving Nottinghamshire, Derbyshire and
the wider East Midlands for over 13 years.

## Features

- **Single page**, fully responsive (mobile-first), tested down to 375px.
- **Light / Dark / System themes** — the toggle cycles through all three; "System" follows the
  OS preference live. The choice is saved to `localStorage` and applied before first paint (no flash).
- **Standout animations** — animated glows and an orbiting logo emblem in the hero, count-up stats,
  scroll-reveal sections, hover micro-interactions, a sticky header with scroll shadow, and a
  back-to-top button. All motion respects `prefers-reduced-motion`.
- **Accessible** — WCAG-minded contrast, visible focus rings, a skip link, semantic headings,
  ARIA labels, keyboard-friendly nav, 44px+ touch targets, and form errors announced politely.
- **No build step / no dependencies** — plain HTML, CSS and vanilla JS. Fonts from Google Fonts.
- The contact form composes a pre-filled email to `abelectrical29@hotmail.com` (no backend required).

## Structure

```
index.html            # markup + content + SEO/meta, inline anti-flash theme script
assets/
  styles.css          # design tokens, theming, layout, animations
  script.js           # theme, nav, scroll reveal, counters, scrollspy, form
  images/             # image assets
```

## Run locally

It's a static site — just open `index.html`, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Works as-is on any static host. For **GitHub Pages**: push to `main`, then in
*Settings → Pages* set the source to `main` / root.

## Design system

A "Trust & Authority" corporate palette built around the A. B. Electrical mark: a signature
**cyan** (`#17A2DC`) with **blue** (`#005D86`), **navy** (`#003A65`) and **steel** (`#659DBD`).
Poppins headings + Inter body. Brand colours, spacing and radii are defined as CSS custom
properties in `assets/styles.css` and themed per mode — change them in one place. Light and dark
variants are designed together so contrast and brand feel stay consistent across both.

## Contact

- **Phone:** 01623 431440 · 07816 920771
- **Email:** abelectrical29@hotmail.com
- **Area:** Sutton-in-Ashfield (NG17 2DY) and the surrounding East Midlands
