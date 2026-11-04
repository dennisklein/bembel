---
name: docs-mockups
description: Use to change the web UI or terminal mockups in docs/design/mockups/, their CSS or JS, or the screenshots in docs/design/img/ that the chapters show. Keeps the sidebar, the domain colours, the glossary links and the screenshots in step with the design record.
---

# Mockups and screenshots

The mockups are complete, high-fidelity HTML pages with the story data. The
build copies them verbatim (it does not wrap them) and only checks their links.
The chapters `ui.html`, `ui-addr.html`, `ui-dns.html`, `ui-assets.html` and
`ui-access.html` describe them and show screenshots of them.

| Part | Path |
|---|---|
| Web UI pages | `docs/design/mockups/ui/*.html` |
| Shared CSS and JS | `docs/design/mockups/assets/` (`bembel.css` tokens and components, `shell.css` frame and sidebar, `shell.js` keys and pop-ups, one CSS per area: `addr.css`, `dns.css`, `assets.css`, `access.css`, `overview.css`) |
| Fonts | `docs/design/mockups/assets/fonts/` (IBM Plex Mono, Barlow for the rack views; the sans font is Helvetica or Arial from the system) |
| Gallery | `docs/design/mockups/index.html` |
| Screenshots | `docs/design/img/ui-*.webp`, `ui-*-mobile.webp` |
| Screenshot tool | `tools/site/shots.mjs` |

## Rules

- Each web UI page has its own copy of the shell (top bar and sidebar),
  between the comments `<!-- SHELL: ... -->` and `<!-- /SHELL -->`. The
  reference is `ui/overview.html`. A change to the shell goes into all pages
  in `ui/`. Compare them after the change, for example
  with `grep -c 'nav-item' docs/design/mockups/ui/*.html`.
- The sidebar uses the glossary domains: a group label has `data-domain` and
  the domain icon (`svg.nav-dom`), an entry has `data-domain` and an icon. The
  active entry (`aria-current="page"`) gets the tint and the left bar from
  `shell.css`. Overview and the Host entries stay neutral. The domain icons are
  the `icon` paths of `domains` in `docs/assets/glossary-data.js`, in a 16 px
  viewBox with `class="dom"`.
- Colours come only from the tokens in `bembel.css` (`--d-addr`, `--d-dns`,
  `--d-dhcp`, `--d-assets`, `--d-access`, `--d-integ`, the state tokens
  `ok`, `warn`, `failed`, `info`, `pending`, `neutral`, and the rack tokens
  `--rk-*`), in light and in both dark blocks. A domain colour marks a
  domain, never a state. A new token goes into all three blocks and into the
  colour table of `docs/design/ui.html`.
- The tokens follow the GSI design system (`ui.html#colours`). House orange
  (`--c-brand`) is decoration only: the top bar line, the brand mark, the
  active item rule, the primary button with black text. Text in orange uses
  `--c-brand-text`. All other text, links and small UI use the AA-safe GSI web
  palette. Helvetica, radii from `--r-sm`, `--r-md`, `--r-lg` only.
- Show permissions as in `ui.html#permissions`: an allowed button, a
  "Request" button for a change request, a disabled button with a
  `.why-not` text. Show the source and `managed_by` of each object.
- Use the project words of the glossary in the UI text. Do not write glossary
  links by hand: the tool writes them (see below). Text in `.no-gl` stays plain.
  Buttons, tables, the sidebar, the top bar, code, IPs, ids and paths
  never get links (profile `MOCKUPS` in `tools/site/glossary.py`).
- `tools/site/shots.mjs` takes each page in `ui/`. `<body data-shot-mobile>`
  adds a phone shot, `<body data-shot="none">` skips the page. The chapter
  that shows a page has a `figure.shot` with an `alt`
  text and a `figcaption` that tell what the screenshot shows.
- When the UI changes, change the text of the chapter in the same change: the
  chapter is the design, the mockup shows it.

## After a change

```sh
mise run docs:glossary                          # glossary links and scripts
node tools/site/shots.mjs <page> ...            # or mise run docs:shots
mise run docs
```

- `glossary.py mockups` is idempotent: run it after each change to a page or
  to the glossary. `--check` must then say `0 files to change`.
- `shots.mjs` needs Node with Playwright and Chromium, and Python 3 with
  Pillow. It takes each web UI page at 1440x900 CSS px and some at 390x844,
  at device scale 2. Make the shots of each page that you changed, and of all
  pages after a change to the shared CSS, to the sidebar or to the glossary.
- Look at each new screenshot before you commit it: no hover card open, no
  focus ring that is not part of the design, the same data as the text.
- Open one page in a browser and check: light and dark mode, the hover card on
  a dotted word, the keys of `shell.js` (`g` plus a letter, `/`, `?`, `a`),
  and a phone width for the pages with a mobile shot.
- Commit the changed pages, the screenshots and the chapter text together.
