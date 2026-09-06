# A. B. Electrical & Maintenance — Website

A professional, single-page marketing website for **A. B. Electrical & Maintenance**, a reliable, local,  NAPIT-registered and TrustMark-approved electrician serving Nottinghamshire, Derbyshire and
the wider East Midlands for over 25 years.

## Features

- **Single page**, fully responsive (mobile-first), tested down to 375px.
- **Light / Dark / System themes** — the toggle cycles through all three; "System" follows the OS preference 
live. The choice is saved to `localStorage` and applied before first paint (no flash).
- **Standout animations** — animated glows and an orbiting logo emblem in the hero, count-up stats,
  scroll-reveal sections, hover micro-interactions, a sticky header with scroll shadow, and a
  back-to-top button. All motion respects `prefers-reduced-motion`, and can also be switched off
  from the in-page **Accessibility** panel.
- **Accessible — built to WCAG 2.2 Level AA** (see [Accessibility](#accessibility) below).
- **No build step / no dependencies** — plain HTML, CSS and vanilla JS. Fonts from Google Fonts.
- The contact form composes a pre-filled email to `abelectrical29@hotmail.com` (no backend required).

## Structure

```
index.html            # markup + content + SEO/meta, inline anti-flash theme script
favicon.ico           # multi-size (16/32/48) tab icon
robots.txt            # crawler rules + sitemap pointer
sitemap.xml           # single-page sitemap
site.webmanifest      # PWA manifest (name, colours, icons)
assets/
  styles.css          # design tokens, theming, layout, animations
  script.js           # theme, nav, scroll reveal, counters, scrollspy, form, cookie consent,
                      #   motion preference, accessibility dialog
  favicon.svg         # scalable brand mark
  favicon-16/32/48.png
  apple-touch-icon.png    # 180×180 iOS home-screen icon
  icon-192/512.png        # PWA icons ("any")
  icon-maskable-512.png   # PWA maskable icon (safe-zone padded)
  images/             # image assets
```

## Privacy & cookies

The site uses only essential/functional local storage (theme, cookie acknowledgement, map opt-in
and motion preference) and shows a
dismissable notice with a full **Cookie Policy** modal. The Google Maps embed on the contact section
is **not loaded until the visitor clicks "Enable map"**, so no third-party map cookies are set without
consent. There are no analytics, tracking or advertising cookies.

## Accessibility

The site targets **WCAG 2.2 Level AA**. A footer **Accessibility** link (under *Cookie policy*)
opens a statement covering conformance, known limitations and how to report a problem.

Key points:

- **Contrast** — every text/background pair meets 4.5:1, and UI boundaries, focus rings and
  meaningful icons meet 3:1, in *both* themes. Colour tokens were chosen against the actual
  surfaces they sit on rather than by eye.
- **Focus** — a visible 3px ring on every control, never suppressed; dark panels swap to a white
  ring so it stays visible. `scroll-padding-top` keeps focused targets clear of the sticky header
  (2.4.11 Focus Not Obscured).
- **Target size** — all controls resolve to at least 24×24px (2.5.8), except links inline in a
  sentence, which the success criterion exempts.
- **Motion** — `prefers-reduced-motion` is honoured, and a **Reduce motion** toggle in the
  Accessibility panel disables all decorative animation and persists to `localStorage`
  (`ab-motion`), giving 2.2.2 a mechanism independent of OS settings.
- **Forms** — each error message is bound to its field with `aria-describedby`, an `role="alert"`
  summary announces how many fields need attention, and errors are never signalled by colour alone.
- **Structure** — one `<h1>`, no skipped heading levels, landmark regions, a skip link, and
  scrollable regions that are reachable by keyboard.

### Checking it

Structural rules (roles, names, labels, heading order, ARIA references) can be audited headlessly
with [axe-core](https://github.com/dequelabs/axe-core) over jsdom. Contrast ratios and target sizes
need real layout, so check those in a browser with axe DevTools or Lighthouse.

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
