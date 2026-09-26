// Single source of truth for everything CityLyfe provides or plans to provide.
//
// Feeds three things: the top-of-page ShowcaseCarousel (all items), the header
// Products dropdown (items with `inNav`) and the Products detail section
// (items with `featured`). Adding a sixth or seventh offering is one entry
// here — no component changes.
//
// SOURCING RULE, please keep it: every claim traces to a repo, a document, or
// the live services API. If you can't source it, flag it rather than writing
// something plausible. Where a status is uncertain it is stated conservatively
// on purpose — an honest "Prototype" is worth more than an implied launch.
//
//   PropKeep            -> citylyfe-dev/Property-Maintainer  (README, docs/LAUNCH_CHECKLIST.md)
//   StompingGround      -> kennermatt-cmd/StompingGround     (README + mtk-c1 code audit)
//   My Friend Consider  -> citylyfe-dev/myfriendconsider     (README) + live DNS/HTTP check
//   Services            -> https://www.citylyfe.net/api/public/services
//   Homelab             -> citylyfe-dev/homelab              (README, ARCHITECTURE.md)

export type ItemKind = 'app' | 'website' | 'service' | 'prototype';

export type ItemStatus =
  | 'beta'        // usable, but access is restricted
  | 'development' // being built, not open to anyone yet
  | 'unreleased'  // finished enough to see, not public yet
  | 'available'   // you can hire us for this today
  | 'prototype';  // being figured out; explicitly not an offering yet

export interface ShowcaseItem {
  id: string;
  name: string;
  kind: ItemKind;
  /** One line, plain language. */
  tagline: string;
  /** Two or three sentences. */
  summary: string;
  status: ItemStatus;
  /** Specific and honest. Shown on the card next to the status pill. */
  statusNote: string;
  /** Public URL, only when there genuinely is one to send people to. */
  href?: string;
  /** Internal page, for long-form explainers. */
  internalHref?: string;
  /** Show in the header Products dropdown. */
  inNav?: boolean;
  /** Show in the deeper Products section further down the page. */
  featured?: boolean;
  highlights?: string[];
}

export const showcaseItems: ShowcaseItem[] = [
  {
    id: 'propkeep',
    name: 'PropKeep',
    kind: 'app',
    tagline: 'Property maintenance, tracked properly.',
    summary:
      'A workflow tool for keeping on top of a property: the rooms and areas in it, the appliances, fixtures and systems inside those, and the inspections and maintenance history attached to each one. Photos and documents live alongside the component they belong to, so the record is in one place rather than scattered across a phone and a filing cabinet.',
    status: 'beta',
    // 3 October is a soft launch to invited testers, not a public opening, and
    // registration is gated. Do NOT turn this into a "sign up" CTA — if a
    // waitlist URL exists, point at that instead (none found: propkeep.org is a
    // SPA so every route returns 200, and the homepage says "register", not
    // "waitlist"). PropKeep is a web app today; the Capacitor wrapper
    // (org.propkeep.app) is still being built, so nothing may imply an iOS app.
    statusNote: 'Invite-only beta from 3 October 2026 — web app',
    href: 'https://propkeep.org',
    inNav: true,
    featured: true,
    highlights: [
      'Properties broken down into areas, rooms and components',
      'Inspection reports and maintenance records per component',
      'Photo and document storage attached to each item',
      'Renewal and maintenance notifications',
      'A tenant and household portal, including rent split',
    ],
  },
  {
    id: 'stompingground',
    name: 'StompingGround',
    kind: 'app',
    tagline: 'Find local places the way you find everything else now.',
    summary:
      'A local business discovery app. You browse nearby places as a deck of cards or on a map, say which ones interest you, and a match forms when the interest is mutual. Reviews earn you stomps, and stomps let you open up areas that nobody has covered yet — so the places that get found are the ones people actually went to.',
    status: 'development',
    // "In progress" overstated the mobile app: it has screens, but it is two API
    // calls deep against a far more complete web app and has not been committed
    // to since May. No domain or contact here — stompingground.live sits under a
    // personal identity that is mid-migration to CityLyfe.
    statusNote: 'Web app built; mobile app in early development',
    inNav: true,
    featured: true,
    highlights: [
      'Swipe or map-and-list browsing of nearby businesses',
      'Mutual-interest matching between people and places',
      'Reviews earn stomps; stomps seed new areas',
      'Web app on React, mobile app on React Native',
    ],
  },
  {
    id: 'myfriendconsider',
    name: 'My Friend Consider',
    kind: 'website',
    tagline: 'An author site for the My Friend Consider trilogy.',
    summary:
      'A website for the My Friend Consider trilogy by Dru Ann Kenner, built on Next.js and Tailwind. Client work — designed, built and hosted by CityLyfe.',
    status: 'unreleased',
    // Checked 2026-09-26: the apex has no A record, and www returns HTTP 401 —
    // the Cloudflare Pages SITE_PASSWORD gate is still on. It is NOT live, so
    // no link here and no "live" claim. See MFC-cloudflare-fix.md in
    // Documents/session-consolidation-2026-09-20/ for what unblocks it.
    statusNote: 'Built; site is password-gated until launch',
  },
  {
    id: 'web-development',
    name: 'Website Building',
    kind: 'service',
    tagline: 'Sites built to be fast, secure and maintainable.',
    // Sourced verbatim in substance from the live services API, "Custom Web
    // Development" and "Website Audit & Updates".
    summary:
      'Professional, responsive websites built for performance, security and scalability. Existing sites welcome too — a review of performance, security, SEO and usability, then either the recommendations or the fixes themselves.',
    status: 'available',
    statusNote: 'Taking work now',
    highlights: [
      'New builds, responsive and performance-focused',
      'Audits and improvements to existing sites',
      'SEO setup, plus teaching you to maintain it',
    ],
  },
  {
    id: 'it-services',
    name: 'Local & Remote IT',
    kind: 'service',
    tagline: 'Someone who picks up, in person or remotely.',
    // "Local and remote IT" is Matt's own phrasing for this line. The closest
    // entries in the live services catalog are "Ongoing Support & Maintenance",
    // "Cloud & Hosting Solutions" and "Local Smart Home Integration"; the
    // summary below is drawn from those rather than invented.
    summary:
      'Proactive support that keeps websites and systems secure, updated and running smoothly, on site or remotely. Also hosting and infrastructure without you having to manage servers, and smart-home setup that prioritises reliability over gadgetry.',
    status: 'available',
    statusNote: 'Taking work now',
    highlights: [
      'Ongoing support and maintenance',
      'Hosting and infrastructure management',
      'Smart home setup and automation',
    ],
  },
  {
    id: 'homelab',
    name: 'Homelab Builds',
    kind: 'prototype',
    tagline: 'Your own storage and services, running in your own house.',
    summary:
      'A small always-on machine that holds your files, runs the services you would otherwise rent, and keeps working when the internet does not. Being built and documented here first, on real hardware, so the build guide is tested before anyone else has to follow it.',
    status: 'prototype',
    // Matt's explicit instruction: this carries a Prototype marker. It is not a
    // shipped offering and must not look like one.
    statusNote: 'Prototype — being built and documented in-house',
    internalHref: '/homelab',
    inNav: true,
    featured: true,
    highlights: [
      'One always-on box for files, backups and services',
      'Separate machine handling DNS so a reboot does not take the house offline',
      'On-demand workstation for heavy compute',
      'Documented build procedure, not a one-off',
    ],
  },
];

export const kindLabels: Record<ItemKind, string> = {
  app: 'App',
  website: 'Website',
  service: 'Service',
  prototype: 'Prototype',
};

export const statusLabels: Record<ItemStatus, string> = {
  beta: 'Invite-only beta',
  development: 'In development',
  unreleased: 'Not yet public',
  available: 'Available now',
  prototype: 'Prototype',
};

export const statusStyles: Record<ItemStatus, string> = {
  beta: 'bg-green-100 text-green-800 border-green-200',
  development: 'bg-blue-100 text-blue-800 border-blue-200',
  unreleased: 'bg-slate-100 text-slate-700 border-slate-200',
  available: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  prototype: 'bg-amber-100 text-amber-900 border-amber-300',
};

export const navItems = showcaseItems.filter((item) => item.inNav);
export const featuredItems = showcaseItems.filter((item) => item.featured);

/** Where a card or nav entry should point, or null when there is nowhere public to go. */
export function itemHref(item: ShowcaseItem): string | null {
  return item.internalHref ?? item.href ?? null;
}

/** External links need target/rel; internal ones must not have them. */
export function isExternal(item: ShowcaseItem): boolean {
  return !item.internalHref && !!item.href;
}
