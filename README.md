# SWAMITRA Foundation — Website v1.0

A static, responsive website built from the client's blueprint documents. The desktop
layout is a conventional institutional site; on phones and small tablets the same pages
render as an **app shell** — sticky app bar, bottom tab bar, slide-in menu, safe-area
padding and installable as a home-screen app (PWA manifest).

## Run it

No build step, no dependencies. Any static server works:

```bash
python3 .claude/serve.py        # serves ./site on http://127.0.0.1:5173
```

or open `site/index.html` directly (some browsers restrict `file://` for the manifest only —
everything else works).

## Deploy

Upload the contents of `site/` to any static host (Netlify, Vercel, GitHub Pages, cPanel,
S3). No server-side code is required.

## Structure

```
site/
  index.html            Homepage (16 blueprint sections)
  about.html            About — 12 blueprint sections as one anchored page
  objectives.html       The 60 charitable objects across 6 chapters
  programs.html         Programmes overview + filter
  program.html          Programme detail — driven by ?p=<slug>
  training.html         Training overview + registration form
  course.html           Training detail — driven by ?c=<slug>
  research.html         Research Centre
  resources.html        Resource Centre with live search + filters
  news.html             News & Media
  get-involved.html     Volunteer / Partner / Donate / CSR / Internship / Careers / Membership
  contact.html          Contact, departments, compliance contacts
  legal.html            All 13 policies — driven by ?doc=<slug>
  404.html
  manifest.webmanifest  PWA manifest (installable on mobile)
  robots.txt
  sitemap.xml           43 URLs — regenerate if you add programmes/courses/policies
  assets/
    css/style.css       The entire design system — tokens, components, responsive rules
    js/data.js          ALL CONTENT DATA — edit this to update the site
    js/app.js           Header, mobile app bar, tab bar, drawer, footer + component wiring
    img/                logo.png, mark.png, favicon.png, apple-touch-icon.png
```

## Editing content

Almost everything a non-developer needs to change lives in **`site/assets/js/data.js`**:

| Key            | Controls                                                  |
|----------------|-----------------------------------------------------------|
| `org`          | Email, phone, address, office hours, social links          |
| `programs`     | The 10 programmes and every field on their detail pages    |
| `trainings`    | The 9 training programmes and their detail pages           |
| `resources`    | The Resource Centre library (search/filter reads this)     |
| `publications` | Research Centre publications                               |
| `news`, `events` | News cards and the events calendar                       |
| `stats`        | The impact counters on the homepage                        |
| `focus`        | The six focus-area cards                                   |
| `chapters`     | The 60 objects on `objectives.html`                        |
| `legal`        | Every policy rendered by `legal.html`                      |

Adding a programme to `programs` automatically adds it to the homepage grid, the
programmes page, the desktop dropdown, the mobile drawer and the footer.

## Design system

- **Brand colours are taken from the logo**, not the blueprint's placeholder "navy":
  deep maroon `#620405` as primary with the logo's gold `#D9AE45` as the accent.
  The full token set is at the top of `assets/css/style.css` — change it there once
  and it propagates everywhere.
- Type: **Marcellus** (display, matches the logo's classical serif) + **Inter** (UI/body),
  with Noto Sans Devanagari loaded for Hindi.
- Accessibility: WCAG-level contrast, visible focus rings, keyboard-navigable drawer with
  focus trapping, skip link, labelled icon buttons, `prefers-reduced-motion` support.

## Mobile app behaviour

Below 1024px the desktop header is replaced by:

- a translucent **app bar** with the flame mark, page title, search and menu;
- a **bottom tab bar** (Home · Programs · Training · Resources · More) with an active indicator;
- a **back button** on detail pages (`data-subpage` on `<body>`);
- a full-height **drawer** for the complete navigation tree;
- `env(safe-area-inset-*)` padding for notched devices, and an installable manifest so
  "Add to Home Screen" opens it standalone without browser chrome.

## Known placeholders — to be replaced before launch

These are deliberate and marked as such in the copy. Nothing has been invented.

1. **Registered office address, phone number and email** (`org` in `data.js`) — currently
   generic. Update, then re-check `contact.html` and the footer.
2. **Leadership, board and advisory names** — pages describe roles only. No names were
   fabricated.
3. **Statutory details** on `about.html#transparency` — registration numbers, PAN, CSR
   eligibility, financials all read "To be published".
4. **Impact statistics** in `data.js` are indicative and labelled as such on the homepage.
5. **Downloads** — resource and publication rows are listed but no files are attached yet;
   clicking shows a notice. Drop real PDFs into `site/assets/files/` and point the `href`s at them.
6. **Donations** — no payment form is included by design. The page explains that donation
   channels will be published once the gateway and registrations are live.
7. **Map** on the contact page is a styled placeholder until the address is published.
8. **Hindi** — the language switch is wired and shows a notice; translated content is not
   yet written.
