// Single source of truth for the product line.
//
// The header nav, the home-page Products section and any future product page
// all read from this array. Adding a fourth or fifth product means adding one
// entry here — no component needs to change.
//
// Every claim in this file is sourced from the product's own repo:
//   PropKeep       -> citylyfe-dev/Property-Maintainer  (README, DEPLOYMENT.md, docs/LAUNCH_CHECKLIST.md)
//   StompingGround -> kennermatt-cmd/StompingGround     (README)
//   Homelab        -> citylyfe-dev/homelab              (README, ARCHITECTURE.md)
// Please keep it that way: if a line here can't be traced to one of those, it
// shouldn't ship.

export type ProductStatus = 'beta' | 'development' | 'prototyping';

export interface Product {
  /** Stable key, also used as the nav anchor on the home page. */
  id: string;
  name: string;
  /** One line, plain language. Shown in the nav dropdown and as the card lede. */
  tagline: string;
  /** Two or three sentences for the card body. */
  summary: string;
  status: ProductStatus;
  /** Shown next to the status pill. Keep it honest and specific. */
  statusNote: string;
  /** Public site, when there is one to send people to. */
  href?: string;
  /** Internal page for the long-form explainer, when one exists. */
  internalHref?: string;
  /** Short, factual capability list. Not feature marketing. */
  highlights: string[];
}

export const products: Product[] = [
  {
    id: 'propkeep',
    name: 'PropKeep',
    tagline: 'Property maintenance, tracked properly.',
    summary:
      'A workflow tool for keeping on top of a property: the rooms and areas in it, the appliances, fixtures and systems inside those, and the inspections and maintenance history attached to each one. Photos and documents live alongside the component they belong to, so the record is in one place rather than scattered across a phone and a filing cabinet.',
    status: 'beta',
    statusNote: 'Free beta opens 3 October 2026',
    href: 'https://propkeep.org',
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
    tagline: 'Find local places the way you find everything else now.',
    summary:
      'A local business discovery app. You browse nearby places as a deck of cards or on a map, say which ones interest you, and a match forms when the interest is mutual. Reviews earn you stomps, and stomps let you open up areas that nobody has covered yet — so the places that get found are the ones people actually went to.',
    status: 'development',
    statusNote: 'Web app built; mobile app in progress',
    highlights: [
      'Swipe or map-and-list browsing of nearby businesses',
      'Mutual-interest matching between people and places',
      'Reviews earn stomps; stomps seed new areas',
      'Web app on React, mobile app on React Native',
    ],
  },
  {
    id: 'homelab',
    name: 'Homelab',
    tagline: 'Your own storage and services, running in your own house.',
    summary:
      'A small always-on machine that holds your files, runs the services you would otherwise rent, and keeps working when the internet does not. Built and documented here first, on real hardware, so the build guide is tested before anyone else has to follow it.',
    status: 'prototyping',
    statusNote: 'Being built and documented in-house',
    internalHref: '/homelab',
    highlights: [
      'One always-on box for files, backups and services',
      'Separate machine handling DNS so a reboot does not take the house offline',
      'On-demand workstation for heavy compute',
      'Documented build procedure, not a one-off',
    ],
  },
];

export const statusLabels: Record<ProductStatus, string> = {
  beta: 'Beta',
  development: 'In development',
  prototyping: 'Prototyping',
};

export const statusStyles: Record<ProductStatus, string> = {
  beta: 'bg-green-100 text-green-800 border-green-200',
  development: 'bg-blue-100 text-blue-800 border-blue-200',
  prototyping: 'bg-amber-100 text-amber-800 border-amber-200',
};

/** Where a product card or nav entry should point. */
export function productHref(product: Product): string {
  return product.internalHref ?? product.href ?? `/#${product.id}`;
}

/** External links need target/rel; internal ones must not have them. */
export function isExternal(product: Product): boolean {
  return !product.internalHref && !!product.href;
}
