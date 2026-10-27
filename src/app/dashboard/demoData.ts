import type { Session } from '@supabase/supabase-js';

import type { StoreStat } from '../AdminDashboard';

/**
 * Sample data for /admin?demo in local development only (see DEMO in
 * AdminDashboard). Made-up numbers with a believable shape: weekday dips,
 * a launch spike, two stores and two apps. Never shipped to the live site.
 */

export const demoSession = { user: { id: 'demo', email: 'demo@localhost' } } as unknown as Session;

/** Deterministic pseudo-random, so the demo looks the same on every reload. */
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const iso = (daysAgo: number, hour = 12) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const utcDay = (daysAgo: number) => iso(daysAgo).slice(0, 10);

export function demoData() {
  const r = rng(42);
  const categories = ['Culinary', 'Arts & Crafts', 'Fitness & Wellness', 'Music', 'Education'].map((name, i) => ({ id: `c${i}`, name }));
  const owners = Array.from({ length: 14 }, (_, i) => ({
    user_id: `o${i}`,
    display_name: `Host ${i + 1}`,
    is_approved: i < 11,
    onboarding_status: 'complete',
    created_at: iso(120 - i * 6),
  }));
  const services = Array.from({ length: 22 }, (_, i) => ({
    id: `s${i}`,
    owner_id: `o${i % 11}`,
    status: 'published',
    is_active: true,
    title: `Experience ${i + 1}`,
    category_id: `c${i % categories.length}`,
  }));
  const schedules = Array.from({ length: 80 }, (_, i) => ({
    id: `sc${i}`,
    service_id: `s${i % services.length}`,
    start_time: iso(40 - i, 10 + (i % 8)),
    status: 'scheduled',
  }));
  const customers = Array.from({ length: 160 }, (_, i) => ({ user_id: `u${i}`, created_at: iso(Math.floor(r() * 90)) }));
  const bookings = Array.from({ length: 140 }, (_, i) => {
    const cancelled = r() < 0.12;
    const total = 3500 + Math.floor(r() * 6) * 500;
    return {
      id: `b${i}`,
      status: cancelled ? 'cancelled' : 'confirmed',
      payment_status: 'paid',
      total_amount: total,
      discount_amount: r() < 0.15 ? 500 : 0,
      platform_fee_cents: Math.round(total * 0.125),
      cancellation_reason: cancelled ? (r() < 0.5 ? 'min_pax_not_reached' : 'customer_cancel_refund') : null,
      created_at: iso(Math.floor(Math.pow(r(), 1.4) * 90), 9 + Math.floor(r() * 12)),
      customer_id: `u${Math.floor(r() * 90)}`,
      service_id: `s${i % services.length}`,
      schedule_id: `sc${i % schedules.length}`,
      participants_count: 1 + Math.floor(r() * 3),
    };
  });
  const storeStats: StoreStat[] = [];
  for (let d = 90; d >= 1; d--) {
    const weekend = [0, 6].includes(new Date(iso(d)).getDay());
    const launch = d < 20 && d > 12 ? 2.4 : 1; // a campaign spike
    for (const [store, base] of [['app_store', 9], ['google_play', 6]] as const) {
      const customer = Math.round(base * launch * (weekend ? 1.4 : 1) * (0.6 + r() * 0.8));
      storeStats.push({ day: utcDay(d), store, app: 'customer', downloads: customer, fetched_at: iso(0, 2) });
      storeStats.push({ day: utcDay(d), store, app: 'host', downloads: Math.round(r() * 2), fetched_at: iso(0, 2) });
    }
  }
  return { bookings, services, owners, customers, schedules, categories, storeStats };
}
