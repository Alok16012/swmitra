/* ==========================================================================
   SWAMITRA Foundation — App shell & interactions
   Injects the header, mobile app bar, bottom tab bar, drawer and footer,
   then wires up every interactive component on the page.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.SWAMITRA || {};
  var ORG = D.org || {};
  var BASE = (document.documentElement.getAttribute("data-base") || "");
  var PAGE = document.body.getAttribute("data-page") || "";
  var TITLE = document.body.getAttribute("data-title") || "SWAMITRA";
  var SUB = document.body.hasAttribute("data-subpage");

  function u(p) { return BASE + p; }

  /* ---------- Icons ---------- */
  var ICO = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.5"/>',
    programs: '<path d="M3 6.5A2.5 2.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v14a1.6 1.6 0 0 0-1.6-1.6H3z"/><path d="M21 6.5A2.5 2.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v14a1.6 1.6 0 0 1 1.6-1.6H21z"/>',
    training: '<path d="M12 3 2.5 8 12 13l9.5-5z"/><path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"/><path d="M21.5 8v6"/>',
    resources: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H16l4 4v10.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5z"/><path d="M15 4v5h5"/><path d="M8.5 13h7M8.5 16.5h4.5"/>',
    more: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    up: '<path d="M12 19V6M5.5 12.5 12 6l6.5 6.5"/>',
    phone: '<path d="M5 3.5h3.5l1.7 4.2-2.1 1.4a12 12 0 0 0 5.8 5.8l1.4-2.1 4.2 1.7V18a2.5 2.5 0 0 1-2.7 2.5C10.3 20 4 13.7 3.5 6.2A2.5 2.5 0 0 1 6 3.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/>',
    pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.4 2"/>',
    scale: '<path d="M12 3v18M7 21h10"/><path d="m5 7 7-2 7 2"/><path d="m5 7-2.5 6a3.5 3.5 0 0 0 5 0z"/><path d="m19 7 2.5 6a3.5 3.5 0 0 1-5 0z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5"/>',
    school: '<path d="M12 3 2.5 8 12 13l9.5-5z"/><path d="M6 10.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.5"/>',
    building: '<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M8 7h2M8 11h2M8 15h2M14 7h2M14 11h2M14 15h2"/>',
    shield: '<path d="M12 3 5 6v6c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    chart: '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12.5 16V8M17 16v-6"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16.5 5.4a3.2 3.2 0 0 1 0 5.2M17.5 14.6A6 6 0 0 1 21 20"/>',
    heart: '<path d="M12 20s-7-4.5-7-9.4A4 4 0 0 1 12 7.6 4 4 0 0 1 19 10.6C19 15.5 12 20 12 20z"/>',
    handshake: '<path d="m11 7 2-1.5 6 4.5v5l-2 1.5-3.5-3"/><path d="M13 5.5 11 7 8.5 5.5 5 8v6l2 1.5"/><path d="m7 15.5 3 2.5 2-1.5 2 1.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    award: '<circle cx="12" cy="9" r="5.5"/><path d="m8.5 13.5-1.5 7 5-2.5 5 2.5-1.5-7"/>',
    file: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H15l4 4v13.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5z"/><path d="M14.5 3v5h5"/>',
    news: '<rect x="3" y="5" width="14" height="15" rx="1.5"/><path d="M17 9h3.5v9a2 2 0 0 1-2 2H17"/><path d="M6.5 9h7M6.5 12.5h7M6.5 16h4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    sparkle: '<path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.2l-1.8-5.6L4.5 10.8 10.2 9z"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/>'
  };

  function icon(name, cls) {
    var p = ICO[name] || ICO.check;
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  }
  window.swIcon = icon;

  /* ---------- Social icons (filled) ---------- */
  var SOCIAL = {
    linkedin: '<path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05A4.2 4.2 0 0 1 16.6 8.7c4 0 4.7 2.6 4.7 6V21h-4v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9z"/>',
    facebook: '<path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V13h2.7v8z"/>',
    x: '<path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.3-5.6L6.4 21h-3l7-8L2.6 3h6.2l3.9 5.2zM16.4 19.2h1.6L8.1 4.7H6.4z"/>',
    youtube: '<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.1V8.9l5.2 3.1z"/>',
    instagram: '<path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9s.68.82.9 1.38c.16.42.36 1.06.41 2.23C21.8 8.4 21.8 8.8 21.8 12s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38s-.82.68-1.38.9c-.42.16-1.06.36-2.23.41-1.25.07-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38s.82-.68 1.38-.9c.42-.16 1.06-.36 2.23-.41C8.4 2.2 8.8 2.2 12 2.2zm0 3.05A6.75 6.75 0 1 0 18.75 12 6.75 6.75 0 0 0 12 5.25zm0 11.13A4.38 4.38 0 1 1 16.38 12 4.38 4.38 0 0 1 12 16.38zm6.99-11.4a1.58 1.58 0 1 1-1.58-1.58 1.58 1.58 0 0 1 1.58 1.58z"/>'
  };
  function socialLinks(cls) {
    var s = ORG.social || {};
    var names = { linkedin: "LinkedIn", facebook: "Facebook", x: "X (Twitter)", youtube: "YouTube", instagram: "Instagram" };
    return Object.keys(names).map(function (k) {
      return '<a href="' + (s[k] || "#") + '" aria-label="' + names[k] + '" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + SOCIAL[k] + "</svg></a>";
    }).join("");
  }


  /* ---------- Programme & training page URLs ---------- */
  function pageSlug(title) {
    return String(title).toLowerCase().replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function findBySlug(list, slug) {
    for (var i = 0; i < (list || []).length; i++) if (list[i].slug === slug) return list[i];
    return null;
  }
  window.swProgramUrl = function (slug) {
    var p = findBySlug(D.programs, slug);
    return u(p ? pageSlug(p.title) + ".html" : "programs.html");
  };
  window.swCourseUrl = function (slug) {
    var t = findBySlug(D.trainings, slug);
    return u(t ? pageSlug(t.title) + ".html" : "training.html");
  };

  /* ---------- Navigation model ---------- */
  var NAV = [
    { id: "home", label: "Home", href: "index.html" },
    {
      id: "about", label: "About", href: "about.html", children: [
        ["About SWAMITRA", "about.html"],
        ["Our Story", "our-story.html"],
        ["Vision & Mission", "vision-and-mission.html"],
        ["Core Values", "core-values.html"],
        ["Our Approach", "our-approach.html"],
        ["Leadership", "leadership.html"],
        ["Governance", "governance.html"],
        ["Advisory Council", "advisory-council.html"],
        ["Transparency & Accountability", "transparency-and-accountability.html"],
        ["Annual Reports", "annual-reports.html"],
        ["Policies", "policies.html"],
        ["Objects Clause", "objectives.html"]
      ]
    },
    {
      id: "programs", label: "Programs", href: "programs.html", children: (D.programs || []).map(function (p) {
        return [p.title, window.swProgramUrl(p.slug)];
      })
    },
    {
      id: "training", label: "Training", href: "training.html", children: (D.trainings || []).map(function (t) {
        return [t.title, window.swCourseUrl(t.slug)];
      })
    },
    {
      id: "research", label: "Research", href: "research.html", children: [
        ["Research Home", "research.html"],
        ["Research Themes", "research-themes.html"],
        ["Publications", "featured-publications.html"],
        ["Ongoing Projects", "ongoing-projects.html"],
        ["Frameworks & Standards", "national-frameworks-and-standards.html"],
        ["Research Collaborations", "research-collaborations.html"]
      ]
    },
    {
      id: "resources", label: "Resources", href: "resources.html", children: [
        ["Resource Home", "resources.html"],
        ["Toolkits & Templates", "resource-library.html"],
        ["SOPs & Guidelines", "resource-library.html"],
        ["Reports & Publications", "resource-library.html"],
        ["Multimedia Library", "multimedia-library.html"]
      ]
    },
    {
      id: "news", label: "News", href: "news.html", children: [
        ["Latest News", "news.html"],
        ["Press Releases", "press-releases.html"],
        ["Events", "events-calendar.html"],
        ["Media Gallery", "media-gallery.html"],
        ["Press Kit", "press-releases.htmlkit"]
      ]
    },
    {
      id: "get-involved", label: "Get Involved", href: "get-involved.html", children: [
        ["Ways to Get Involved", "get-involved.html"],
        ["Volunteer", "volunteer-programme.html"],
        ["Partner With Us", "partnership-opportunities.html"],
        ["Donate", "donate.html"],
        ["CSR Partnerships", "csr-collaboration.html"],
        ["Internship", "internship.html"],
        ["Careers", "careers.html"],
        ["Membership", "membership.html"]
      ]
    },
    { id: "contact", label: "Contact", href: "contact.html" }
  ];

  var TABS = [
    { id: "home", label: "Home", icon: "home", href: "index.html" },
    { id: "programs", label: "Programs", icon: "programs", href: "programs.html" },
    { id: "training", label: "Training", icon: "training", href: "training.html" },
    { id: "resources", label: "Resources", icon: "resources", href: "resources.html" },
    { id: "more", label: "More", icon: "more", href: "#more" }
  ];

  /* ---------- Build shell ---------- */
  function buildHeader() {
    var navHtml = NAV.map(function (n) {
      var active = n.id === PAGE ? ' class="active"' : "";
      var caret = n.children ? '<svg class="caret" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' : "";
      var dd = n.children ? '<div class="dropdown">' + n.children.map(function (c) {
        return '<a href="' + u(c[1]) + '">' + c[0] + "</a>";
      }).join("") + "</div>" : "";
      return "<li" + active + '><a href="' + u(n.href) + '">' + n.label + caret + "</a>" + dd + "</li>";
    }).join("");

    return '' +
      '<div class="topbar"><div class="wrap">' +
        '<div class="topbar-left">' +
          '<a href="mailto:' + ORG.email + '">' + ORG.email + "</a>" +
          '<a href="tel:' + ORG.phoneHref + '">' + ORG.phone + "</a>" +
        "</div>" +
        '<div class="topbar-right">' +
          '<div class="social-row">' + socialLinks() + "</div>" +
          '<div class="lang-switch" role="group" aria-label="Language">' +
            '<button type="button" data-lang="en" aria-pressed="true">English</button><span aria-hidden="true">|</span>' +
            '<button type="button" data-lang="hi" aria-pressed="false">हिन्दी</button>' +
          "</div>" +
          '<a class="btn btn--gold btn--sm" href="' + u("donate.html") + '">Donate</a>' +
        "</div>" +
      "</div></div>" +
      '<header class="site-header"><div class="wrap header-inner">' +
        '<a class="brand" href="' + u("index.html") + '" aria-label="SWAMITRA Foundation — Home">' +
          '<img src="' + u("assets/img/logo.png") + '" alt="SWAMITRA Foundation" width="2072" height="566">' +
        "</a>" +
        '<nav aria-label="Main"><ul class="nav">' + navHtml + "</ul></nav>" +
        '<div class="header-cta">' +
          '<a class="btn btn--primary btn--sm" href="' + u("get-involved.html") + '">Join Us</a>' +
        "</div>" +
      "</div></header>" +

      /* Mobile app bar */
      '<div class="app-bar">' +
        '<div class="app-bar__left">' +
          '<button class="icon-btn back-btn" type="button" aria-label="Go back">' + icon("back") + "</button>" +
          '<a href="' + u("index.html") + '" aria-label="Home"><img class="app-bar__mark" src="' + u("assets/img/mark.png") + '" alt="SWAMITRA Foundation"></a>' +
          '<span class="app-bar__title">' + TITLE + "</span>" +
        "</div>" +
        '<div class="app-bar__actions">' +
          '<a class="icon-btn" href="' + u("resource-library.html") + '" aria-label="Search resources">' + icon("search") + "</a>" +
          '<button class="icon-btn js-drawer-open" type="button" aria-label="Open menu" aria-expanded="false">' + icon("menu") + "</button>" +
        "</div>" +
      "</div>";
  }

  function buildTabbar() {
    return '<nav class="tabbar" aria-label="Primary">' + TABS.map(function (t) {
      var isMore = t.id === "more";
      var active = t.id === PAGE ? " active" : "";
      var attrs = isMore ? 'href="#" class="js-drawer-open' + active + '"' : 'href="' + u(t.href) + '" class="' + active.trim() + '"';
      return "<a " + attrs + '>' + icon(t.icon) + "<span>" + t.label + "</span></a>";
    }).join("") + "</nav>";
  }

  function buildDrawer() {
    var items = NAV.map(function (n) {
      if (!n.children) {
        return "<li><a href=" + '"' + u(n.href) + '"' + ">" + n.label + "</a></li>";
      }
      return "<li>" +
        '<button class="dnav__toggle" type="button" aria-expanded="false">' + n.label +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
        '<div class="dnav__sub"><ul>' +
          '<li><a href="' + u(n.href) + '"><strong>' + n.label + " Home</strong></a></li>" +
          n.children.map(function (c) { return '<li><a href="' + u(c[1]) + '">' + c[0] + "</a></li>"; }).join("") +
        "</ul></div></li>";
    }).join("");

    return '<div class="scrim js-drawer-close"></div>' +
      '<aside class="drawer" role="dialog" aria-modal="true" aria-label="Menu" tabindex="-1">' +
        '<div class="drawer__head">' +
          '<a class="brand" href="' + u("index.html") + '">' +
            '<img src="' + u("assets/img/logo.png") + '" alt="SWAMITRA Foundation" width="2072" height="566">' +
          "</a>" +
          '<button class="icon-btn js-drawer-close" type="button" aria-label="Close menu">' + icon("close") + "</button>" +
        "</div>" +
        '<div class="drawer__body">' +
          '<ul class="dnav">' + items + "</ul>" +
          '<div class="drawer-meta">' +
            '<div class="lang-switch" role="group" aria-label="Language" style="color:var(--muted)">' +
              '<button type="button" data-lang="en" aria-pressed="true" style="color:var(--maroon-700);font-weight:700">English</button><span>|</span>' +
              '<button type="button" data-lang="hi" aria-pressed="false">हिन्दी</button>' +
            "</div>" +
            '<a href="mailto:' + ORG.email + '">' + ORG.email + "</a>" +
            '<a href="tel:' + ORG.phoneHref + '">' + ORG.phone + "</a>" +
            '<div class="social-row" style="color:var(--muted)">' + socialLinks() + "</div>" +
          "</div>" +
        "</div>" +
        '<div class="drawer__foot">' +
          '<a class="btn btn--primary btn--block" href="' + u("get-involved.html") + '">Join Us</a>' +
          '<a class="btn btn--outline btn--block" href="' + u("donate.html") + '">Donate</a>' +
        "</div>" +
      "</aside>";
  }

  function buildFooter() {
    var progLinks = (D.programs || []).slice(0, 6).map(function (p) {
      return '<li><a href="' + window.swProgramUrl(p.slug) + '">' + p.title + "</a></li>";
    }).join("");

    return '<footer class="site-footer">' +
      '<div class="footer-news"><div class="wrap">' +
        '<div><h4>Stay Connected with SWAMITRA</h4><p>Programme updates, new research and resources — a few times a year, never more.</p></div>' +
        '<form class="newsletter-form js-newsletter" novalidate>' +
          '<label class="sr-only" for="nl-email">Email address</label>' +
          '<input class="input" id="nl-email" type="email" name="email" placeholder="Your email address" required>' +
          '<button class="btn btn--gold" type="submit">Subscribe</button>' +
        "</form>" +
      "</div></div>" +
      '<div class="wrap footer-top">' +
        '<div class="footer-brand">' +
          '<img src="' + u("assets/img/logo.png") + '" alt="SWAMITRA Foundation">' +
          "<p>" + (ORG.tagline || "") + ". SWAMITRA Foundation advances legal education, constitutional literacy, safe institutions and responsible citizenship across India through education, research and partnerships.</p>" +
          '<div class="footer-social">' + socialLinks() + "</div>" +
        "</div>" +
        '<div class="footer-col"><h5>About</h5><ul>' +
          '<li><a href="' + u("about.html") + '">About SWAMITRA</a></li>' +
          '<li><a href="' + u("vision-and-mission.html") + '">Vision & Mission</a></li>' +
          '<li><a href="' + u("leadership.html") + '">Leadership</a></li>' +
          '<li><a href="' + u("governance.html") + '">Governance</a></li>' +
          '<li><a href="' + u("objectives.html") + '">Objects Clause</a></li>' +
          '<li><a href="' + u("transparency-and-accountability.html") + '">Transparency</a></li>' +
        "</ul></div>" +
        '<div class="footer-col"><h5>Programmes</h5><ul>' + progLinks +
          '<li><a href="' + u("programs.html") + '">All Programmes →</a></li>' +
        "</ul></div>" +
        '<div class="footer-col"><h5>Contact</h5><div class="footer-contact">' +
          "<div>" + icon("pin") + "<span>" + ORG.address + "</span></div>" +
          "<div>" + icon("mail") + '<a href="mailto:' + ORG.email + '">' + ORG.email + "</a></div>" +
          "<div>" + icon("phone") + '<a href="tel:' + ORG.phoneHref + '">' + ORG.phone + "</a></div>" +
          "<div>" + icon("clock") + "<span>" + ORG.hours + "</span></div>" +
        "</div>" +
        '<a class="btn btn--ghost btn--sm mt-4" href="' + u("contact.html") + '" style="background:transparent;border-color:rgba(255,255,255,.25);color:#fff">Contact Form</a>' +
        "</div>" +
      "</div>" +
      '<div class="wrap footer-legal">' +
        "<span>© " + new Date().getFullYear() + " SWAMITRA Foundation. All Rights Reserved.</span>" +
        "<ul>" +
          '<li><a href="' + u("legal.html?doc=privacy-policy") + '">Privacy Policy</a></li>' +
          '<li><a href="' + u("legal.html?doc=terms-of-use") + '">Terms of Use</a></li>' +
          '<li><a href="' + u("legal.html?doc=cookie-policy") + '">Cookie Policy</a></li>' +
          '<li><a href="' + u("legal.html?doc=accessibility-statement") + '">Accessibility</a></li>' +
          '<li><a href="' + u("legal.html?doc=disclaimer") + '">Disclaimer</a></li>' +
          '<li><a href="' + u("legal.html") + '">All Policies</a></li>' +
        "</ul>" +
      "</div></footer>";
  }

  /* ---------- Mount ---------- */
  function mount() {
    var h = document.getElementById("site-header");
    if (h) h.innerHTML = buildHeader();
    var f = document.getElementById("site-footer");
    if (f) f.innerHTML = buildFooter();

    var shell = document.createElement("div");
    shell.innerHTML = buildTabbar() + buildDrawer() +
      '<button class="fab" type="button" aria-label="Back to top">' + icon("up") + "</button>" +
      '<div class="toast" role="status" aria-live="polite"></div>';
    while (shell.firstChild) document.body.appendChild(shell.firstChild);

    if (SUB) document.body.classList.add("is-subpage");
  }

  /* ---------- Interactions ---------- */
  function toast(msg) {
    var t = document.querySelector(".toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._t);
    t._t = setTimeout(function () { t.classList.remove("show"); }, 3400);
  }
  window.swToast = toast;

  function wireDrawer() {
    var drawer = document.querySelector(".drawer");
    var scrim = document.querySelector(".scrim");
    if (!drawer) return;
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add("open");
      scrim.classList.add("open");
      document.body.classList.add("no-scroll");
      drawer.focus();
      document.querySelectorAll(".js-drawer-open").forEach(function (b) {
        if (b.hasAttribute("aria-expanded")) b.setAttribute("aria-expanded", "true");
      });
    }
    function close() {
      drawer.classList.remove("open");
      scrim.classList.remove("open");
      document.body.classList.remove("no-scroll");
      document.querySelectorAll(".js-drawer-open").forEach(function (b) {
        if (b.hasAttribute("aria-expanded")) b.setAttribute("aria-expanded", "false");
      });
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var o = e.target.closest(".js-drawer-open");
      if (o) { e.preventDefault(); open(); return; }
      var c = e.target.closest(".js-drawer-close");
      if (c) { e.preventDefault(); close(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) close();
      if (e.key === "Tab" && drawer.classList.contains("open")) {
        var f = drawer.querySelectorAll('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Drawer accordions */
    drawer.addEventListener("click", function (e) {
      var t = e.target.closest(".dnav__toggle");
      if (!t) return;
      var panel = t.nextElementSibling;
      var open = t.getAttribute("aria-expanded") === "true";
      drawer.querySelectorAll(".dnav__toggle").forEach(function (o) {
        if (o !== t) { o.setAttribute("aria-expanded", "false"); o.nextElementSibling.style.maxHeight = null; }
      });
      t.setAttribute("aria-expanded", String(!open));
      panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
    });

    /* Auto-open the section matching the current page */
    var cur = drawer.querySelector('.dnav__toggle');
    if (cur) {
      drawer.querySelectorAll(".dnav__toggle").forEach(function (t) {
        var nav = NAV.filter(function (n) { return n.label === t.firstChild.textContent.trim(); })[0];
        if (nav && nav.id === PAGE) {
          t.setAttribute("aria-expanded", "true");
          t.nextElementSibling.style.maxHeight = t.nextElementSibling.scrollHeight + "px";
        }
      });
    }
  }

  function wireBack() {
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".back-btn")) return;
      if (history.length > 1) history.back();
      else location.href = u("index.html");
    });
  }

  function wireAccordions(root) {
    (root || document).querySelectorAll(".acc__btn").forEach(function (btn) {
      if (btn._wired) return;
      btn._wired = true;
      btn.addEventListener("click", function () {
        var panel = btn.nextElementSibling;
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", String(!open));
        panel.style.maxHeight = open ? null : panel.scrollHeight + "px";
      });
    });
  }
  window.swAccordions = wireAccordions;

  function wireTabs(root) {
    (root || document).querySelectorAll("[data-tabs]").forEach(function (group) {
      if (group._wired) return;
      group._wired = true;
      var btns = group.querySelectorAll(".tabs button");
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          btns.forEach(function (o) { o.setAttribute("aria-selected", "false"); });
          b.setAttribute("aria-selected", "true");
          var target = b.getAttribute("aria-controls");
          group.querySelectorAll(".tabpanel").forEach(function (p) { p.hidden = p.id !== target; });
        });
      });
    });
  }
  window.swTabs = wireTabs;

  function wireCounters() {
    var els = [].slice.call(document.querySelectorAll("[data-count]"));
    if (!els.length) return;

    function run(el) {
      el._done = true;
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var dur = 1300, start = Date.now();
      var id = setInterval(function () {
        var p = Math.min(1, (Date.now() - start) / dur);
        var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = v.toLocaleString("en-IN") + suffix;
        if (p >= 1) clearInterval(id);
      }, 30);
    }
    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      els = els.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh - 40 && r.bottom > 0) { run(el); return false; }
        return true;
      });
    }
    var t = null;
    window.addEventListener("scroll", function () {
      if (t) return;
      t = setTimeout(function () { t = null; check(); }, 120);
    }, { passive: true });
    check();
    /* Fail-safe: never leave a counter showing 0 */
    setTimeout(function () { els.forEach(run); els = []; }, 6000);
  }

  function wireScroll() {
    var header = document.querySelector(".site-header");
    var fab = document.querySelector(".fab");
    function onScroll() {
      var y = window.scrollY;
      if (header) header.classList.toggle("is-stuck", y > 8);
      if (fab) fab.classList.toggle("show", y > 700);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (fab) fab.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  function wireForms() {
    document.addEventListener("submit", function (e) {
      var form = e.target;
      if (!form.matches("form")) return;
      e.preventDefault();
      var invalid = false;
      form.querySelectorAll("[required]").forEach(function (f) {
        if (!f.checkValidity()) { invalid = true; f.style.borderColor = "var(--error)"; }
        else { f.style.borderColor = ""; }
      });
      if (invalid) { toast("Please complete the highlighted fields."); return; }
      if (form.classList.contains("js-newsletter")) toast("Thank you — please check your inbox to confirm.");
      else toast("Thank you. Your submission has been recorded and our team will respond shortly.");
      form.reset();
    });
    document.addEventListener("change", function (e) {
      if (e.target.type === "file" && e.target.files.length) {
        var drop = e.target.closest(".field") && e.target.closest(".field").querySelector(".file-drop");
        if (drop) drop.textContent = e.target.files[0].name;
      }
    });
  }

  function wireLang() {
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lang]");
      if (!b) return;
      document.querySelectorAll("[data-lang]").forEach(function (o) {
        o.setAttribute("aria-pressed", String(o.getAttribute("data-lang") === b.getAttribute("data-lang")));
      });
      if (b.getAttribute("data-lang") === "hi") toast("हिन्दी संस्करण शीघ्र उपलब्ध होगा।");
    });
  }

  /* ---------- Init ---------- */
  function init() {
    mount();
    wireDrawer();
    wireBack();
    wireAccordions();
    wireTabs();
    wireCounters();
    wireScroll();
    wireForms();
    wireLang();
    document.dispatchEvent(new CustomEvent("sw:ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
