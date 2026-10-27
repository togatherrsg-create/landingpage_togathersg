/**
 * The places in the 3D business world, one per dashboard section. Shared by
 * the scene (what to build where) and the page (labels, buttons, side panel),
 * so a place can't exist in one and not the other.
 */

export type DistrictKey = 'downloads' | 'revenue' | 'bookings' | 'hosts' | 'customers' | 'calendar';

/** Classic page order, and the order of the buttons under the world. */
export const DISTRICT_ORDER: DistrictKey[] = ['downloads', 'revenue', 'bookings', 'hosts', 'customers', 'calendar'];

/** What the world is built from — counts for the selected date range. */
export interface WorldModel {
  downloads: { connected: boolean; appStore: number; googlePlay: number };
  revenue: { gmvCents: number; takeCents: number };
  bookings: { live: number; cancelled: number };
  hosts: { listing: number; approvedIdle: number; pending: number };
  customers: { booked: number; never: number };
  upcoming: number;
}

export interface District {
  label: string;
  /** The place's colour, from the home banner's palette (muted, warm). */
  color: string;
  /** Position on the island (x, z). The plaza is the centre. */
  at: [number, number];
  /** Headline under the label, e.g. "1,204 downloads". */
  headline: (w: WorldModel) => string;
}

const n = (v: number) => v.toLocaleString('en-SG');
const money = (cents: number) => `S$${Math.round(cents / 100).toLocaleString('en-SG')}`;

// Five places on a ring around the central plaza, 72° apart.
const RING = 5.4;
const around = (deg: number): [number, number] => {
  const r = (deg * Math.PI) / 180;
  return [Math.cos(r) * RING, -Math.sin(r) * RING];
};

export const DISTRICTS: Record<DistrictKey, District> = {
  bookings: {
    label: 'Booking Plaza',
    color: '#F2B91C',
    at: [0, 0],
    headline: (w) => `${n(w.bookings.live)} bookings`,
  },
  downloads: {
    label: 'Download Port',
    color: '#7E4FC0',
    at: around(90),
    headline: (w) => (w.downloads.connected ? `${n(w.downloads.appStore + w.downloads.googlePlay)} downloads` : 'not connected yet'),
  },
  revenue: {
    label: 'Revenue Bank',
    color: '#C98F2E',
    at: around(18),
    headline: (w) => money(w.revenue.gmvCents),
  },
  hosts: {
    label: 'Host Village',
    color: '#C96F45',
    at: around(-54),
    headline: (w) => `${n(w.hosts.listing)} hosts listing`,
  },
  customers: {
    label: 'Customer Park',
    color: '#6F8F4E',
    at: around(-126),
    headline: (w) => `${n(w.customers.booked + w.customers.never)} customers`,
  },
  calendar: {
    label: 'Clock Tower',
    color: '#4A6286',
    at: around(162),
    headline: (w) => `${n(w.upcoming)} upcoming classes`,
  },
};
