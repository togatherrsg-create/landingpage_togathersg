import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import { ActivityHero } from './dashboard/ActivityHero';
import type { ActivityDay } from './dashboard/activity';
import { demoData, demoSession } from './dashboard/demoData';

/**
 * Admin dashboard at /admin.
 *
 * Reads straight from Supabase as the signed-in admin — every table already has
 * an is_admin() row-level policy, so nothing is exposed to non-admins and no
 * service-role key goes near the browser. Volumes are small (hundreds of rows),
 * so everything is fetched once and aggregated client-side, which keeps the
 * filters instant and avoids a query round trip per control.
 */

type Booking = {
  id: string;
  status: string | null;
  payment_status: string | null;
  total_amount: number | null;
  discount_amount: number | null;
  platform_fee_cents: number | null;
  cancellation_reason: string | null;
  created_at: string;
  customer_id: string | null;
  service_id: string | null;
  schedule_id: string | null;
  participants_count: number | null;
};
type Service = { id: string; owner_id: string | null; status: string | null; is_active: boolean | null; title: string | null; category_id: string | null };
type Owner = { user_id: string; display_name: string | null; is_approved: boolean | null; onboarding_status: string | null; created_at: string };
type Customer = { user_id: string; created_at: string };
type Schedule = { id: string; service_id: string | null; start_time: string; status: string | null };
type Category = { id: string; name: string | null };
/** One row of public.app_store_daily_stats (migration 0090), filled daily by sync-store-stats. */
export type StoreStat = {
  day: string;
  store: 'app_store' | 'google_play';
  app: 'customer' | 'host';
  downloads: number;
  fetched_at: string;
};

type Data = {
  bookings: Booking[];
  services: Service[];
  owners: Owner[];
  customers: Customer[];
  schedules: Schedule[];
  categories: Category[];
  /** null: store stats aren't set up yet (no table, or nothing synced). */
  storeStats: StoreStat[] | null;
};

/** yyyy-mm-dd in local time — never toISOString(), which shifts across midnight. */
const dayKey = (d: Date) =>
  `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(2, '0')}`;
const todayKey = () => dayKey(new Date());
const daysAgoKey = (n: number) => dayKey(new Date(Date.now() - n * 86400_000));

// Quick presets sit beside the date pickers; picking dates by hand just
// overrides them, so the two controls never fight each other.
const PRESETS = [
  { key: '7', label: 'Last 7 days', from: () => daysAgoKey(7) },
  { key: '30', label: 'Last 30 days', from: () => daysAgoKey(30) },
  { key: '90', label: 'Last 90 days', from: () => daysAgoKey(90) },
  { key: 'all', label: 'All time', from: () => '2020-01-01' },
] as const;

const money = (cents: number) =>
  `S$${(cents / 100).toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Monday-anchored week key, so weekly buckets line up with how people think. */
function weekKey(iso: string) {
  const d = new Date(iso);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}
const shortDate = (key: string) =>
  new Date(key).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' });

const PIE_COLORS = ['#8A2BE2', '#F4C300', '#1D9E75', '#D85A30', '#378ADD', '#D4537E'];

/** Days shown in the 3D header: the most recent ones in the selected range. */
const ACTIVITY_DAYS = 30;

// Local development only: /admin?demo renders the dashboard from sample data,
// so the layout can be checked without an admin login. `import.meta.env.DEV`
// is false in production builds, so this is compiled out of the live site.
const DEMO = import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo');

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(DEMO ? demoSession : null);
  const [checking, setChecking] = useState(!DEMO);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(DEMO ? true : null);
  const [data, setData] = useState<Data | null>(DEMO ? demoData() : null);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState(() => daysAgoKey(90));
  const [to, setTo] = useState(() => todayKey());

  useEffect(() => {
    if (DEMO) return;
    supabase.auth.getSession().then(({ data: d }) => {
      setSession(d.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Admin status comes from the owners row, the same flag the apps use.
  useEffect(() => {
    if (DEMO) return;
    if (!session) {
      setIsAdmin(null);
      return;
    }
    supabase
      .from('owners')
      .select('is_admin')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data: d }) => setIsAdmin(Boolean(d?.is_admin)));
  }, [session]);

  const load = useCallback(async () => {
    setError(null);
    try {
      // The API caps responses at 1000 rows SERVER-side (PostgREST max_rows),
      // which this limit cannot lift — it only makes the ceiling explicit.
      // Every table is far below that today (schedules 274, customers 116,
      // bookings 65), but once one passes 1000 these reads will silently
      // truncate and understate every metric. Switch to ranged paging then.
      const CAP = 1000;
      const [b, s, o, c, sc, cat] = await Promise.all([
        supabase.from('bookings').select('id,status,payment_status,total_amount,discount_amount,platform_fee_cents,cancellation_reason,created_at,customer_id,service_id,schedule_id,participants_count').limit(CAP),
        supabase.from('services').select('id,owner_id,status,is_active,title,category_id').limit(CAP),
        supabase.from('owners').select('user_id,display_name,is_approved,onboarding_status,created_at').limit(CAP),
        supabase.from('customers').select('user_id,created_at').limit(CAP),
        supabase.from('service_schedules').select('id,service_id,start_time,status').limit(CAP),
        supabase.from('categories').select('id,name').limit(CAP),
      ]);
      const firstErr = [b, s, o, c, sc, cat].find((r) => r.error)?.error;
      if (firstErr) throw firstErr;
      // Read separately and allowed to fail: until migration 0090 and the store
      // keys are in place there is nothing to show, and that must not take the
      // rest of the dashboard down with it.
      const st = await supabase
        .from('app_store_daily_stats')
        .select('day,store,app,downloads,fetched_at')
        .order('day', { ascending: true })
        .limit(CAP);
      setData({
        storeStats: st.error || !st.data?.length ? null : (st.data as StoreStat[]),
        bookings: (b.data ?? []) as Booking[],
        services: (s.data ?? []) as Service[],
        owners: (o.data ?? []) as Owner[],
        customers: (c.data ?? []) as Customer[],
        schedules: (sc.data ?? []) as Schedule[],
        categories: (cat.data ?? []) as Category[],
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load data.');
    }
  }, []);

  useEffect(() => {
    if (isAdmin && !DEMO) void load();
  }, [isAdmin, load]);

  const metrics = useMemo(() => {
    if (!data) return null;
    // Inclusive of both endpoints: "to" runs to the end of that day, so picking
    // the same date twice shows that one day rather than nothing.
    const fromMs = new Date(`${from}T00:00:00`).getTime();
    const toMs = new Date(`${to}T23:59:59.999`).getTime();
    const inRange = (iso: string) => {
      const t = new Date(iso).getTime();
      return t >= fromMs && t <= toMs;
    };

    const bookings = data.bookings.filter((b) => inRange(b.created_at));
    const paid = bookings.filter((b) => b.payment_status === 'paid' || b.payment_status === 'refunded');
    const live = paid.filter((b) => b.status !== 'cancelled');

    const gmv = live.reduce((t, b) => t + (b.total_amount ?? 0), 0);
    const take = live.reduce((t, b) => t + (b.platform_fee_cents ?? 0), 0);
    const discounts = live.reduce((t, b) => t + (b.discount_amount ?? 0), 0);

    const cancelled = bookings.filter((b) => b.status === 'cancelled');
    const autoCancelled = cancelled.filter((b) => b.cancellation_reason === 'min_pax_not_reached');
    const customerCancelled = cancelled.filter((b) => (b.cancellation_reason ?? '').startsWith('customer_cancel'));

    // Weekly series: bookings made, and the take they generated.
    const weeks = new Map<string, { week: string; bookings: number; gmv: number; take: number }>();
    for (const b of bookings) {
      const k = weekKey(b.created_at);
      const row = weeks.get(k) ?? { week: k, bookings: 0, gmv: 0, take: 0 };
      row.bookings += 1;
      if (b.status !== 'cancelled' && (b.payment_status === 'paid' || b.payment_status === 'refunded')) {
        row.gmv += (b.total_amount ?? 0) / 100;
        row.take += (b.platform_fee_cents ?? 0) / 100;
      }
      weeks.set(k, row);
    }
    const weekly = [...weeks.values()].sort((a, b) => a.week.localeCompare(b.week));

    // Customer signups per week over the same window.
    const newCustomerRows = data.customers.filter((x) => inRange(x.created_at));
    const signupWeeks = new Map<string, { week: string; signups: number }>();
    for (const c of newCustomerRows) {
      const k = weekKey(c.created_at);
      const row = signupWeeks.get(k) ?? { week: k, signups: 0 };
      row.signups += 1;
      signupWeeks.set(k, row);
    }
    const signups = [...signupWeeks.values()].sort((a, b) => a.week.localeCompare(b.week));

    // Supply: who is approved, and who actually lists.
    const listingsByOwner = new Map<string, number>();
    for (const s of data.services) {
      if (s.status !== 'published' || !s.is_active || !s.owner_id) continue;
      listingsByOwner.set(s.owner_id, (listingsByOwner.get(s.owner_id) ?? 0) + 1);
    }
    const approvedHosts = data.owners.filter((o) => o.is_approved);
    const hostsListing = approvedHosts.filter((o) => listingsByOwner.has(o.user_id)).length;

    // Repeat customers: more than one non-cancelled paid booking, all time.
    const perCustomer = new Map<string, number>();
    for (const b of data.bookings) {
      if (!b.customer_id || b.status === 'cancelled') continue;
      perCustomer.set(b.customer_id, (perCustomer.get(b.customer_id) ?? 0) + 1);
    }
    const bookers = [...perCustomer.values()];
    const repeat = bookers.filter((n) => n > 1).length;

    // Category mix by live listings.
    const catName = new Map(data.categories.map((c) => [c.id, c.name ?? 'Other']));
    const byCat = new Map<string, number>();
    for (const s of data.services) {
      if (s.status !== 'published' || !s.is_active) continue;
      const n = catName.get(s.category_id ?? '') ?? 'Uncategorised';
      byCat.set(n, (byCat.get(n) ?? 0) + 1);
    }
    const categoryMix = [...byCat.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // App downloads in range, from the daily store sync. Store days are UTC
    // dates already, so they're compared as strings, not shifted to local time.
    const storeRows = (data.storeStats ?? []).filter((r) => r.day >= from && r.day <= to);
    const sumDownloads = (pick: (r: StoreStat) => boolean) =>
      storeRows.filter(pick).reduce((t, r) => t + r.downloads, 0);
    const downloadWeeks = new Map<string, { week: string; appStore: number; googlePlay: number }>();
    for (const r of storeRows) {
      const k = weekKey(`${r.day}T00:00:00`);
      const row = downloadWeeks.get(k) ?? { week: k, appStore: 0, googlePlay: 0 };
      if (r.store === 'app_store') row.appStore += r.downloads;
      else row.googlePlay += r.downloads;
      downloadWeeks.set(k, row);
    }
    const lastSynced = (data.storeStats ?? []).reduce<string | null>(
      (latest, r) => (!latest || r.fetched_at > latest ? r.fetched_at : latest),
      null,
    );

    // The 3D header: one entry per day for the last ACTIVITY_DAYS of the range.
    const activity: ActivityDay[] = [];
    const end = new Date(`${to}T00:00:00`);
    const start = new Date(`${from}T00:00:00`);
    for (let i = ACTIVITY_DAYS - 1; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(end.getDate() - i);
      if (d < start) continue;
      const key = dayKey(d);
      activity.push({
        day: key,
        downloads: storeRows.filter((r) => r.day === key).reduce((t, r) => t + r.downloads, 0),
        bookings: bookings.filter((b) => dayKey(new Date(b.created_at)) === key).length,
      });
    }

    const now = Date.now();
    const upcoming = data.schedules.filter(
      (s) => s.status === 'scheduled' && new Date(s.start_time).getTime() > now,
    ).length;

    return {
      gmv,
      take,
      discounts,
      bookingCount: bookings.length,
      liveCount: live.length,
      cancelledCount: cancelled.length,
      autoCancelled: autoCancelled.length,
      customerCancelled: customerCancelled.length,
      weekly,
      signups,
      totalHosts: data.owners.length,
      approvedHosts: approvedHosts.length,
      hostsListing,
      liveListings: [...listingsByOwner.values()].reduce((a, b) => a + b, 0),
      upcoming,
      newCustomers: newCustomerRows.length,
      totalCustomers: data.customers.length,
      bookersCount: bookers.length,
      repeat,
      categoryMix,
      downloads: {
        connected: data.storeStats !== null,
        total: sumDownloads(() => true),
        appStore: sumDownloads((r) => r.store === 'app_store'),
        googlePlay: sumDownloads((r) => r.store === 'google_play'),
        host: sumDownloads((r) => r.app === 'host'),
        weekly: [...downloadWeeks.values()].sort((a, b) => a.week.localeCompare(b.week)),
        lastSynced,
      },
      activity,
    };
  }, [data, from, to]);

  if (checking) return <Shell><p className="text-gray-500">Loading…</p></Shell>;
  if (!session) return <Shell><LoginPanel /></Shell>;
  if (isAdmin === null) return <Shell><p className="text-gray-500">Checking access…</p></Shell>;
  if (!isAdmin)
    return (
      <Shell>
        <div className="max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No access</h1>
          <p className="text-gray-600 mb-4">
            {session.user.email} isn't an admin account. Ask someone on the team to grant access, or sign in
            with a different account.
          </p>
          <button onClick={() => supabase.auth.signOut()} className="text-[#8A2BE2] font-semibold">
            Sign out
          </button>
        </div>
      </Shell>
    );

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">Signed in as {session.user.email}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => {
            const active = from === p.from() && to === todayKey();
            return (
              <button
                key={p.key}
                onClick={() => {
                  setFrom(p.from());
                  setTo(todayKey());
                }}
                className={`px-3 py-1.5 rounded-lg text-sm border ${
                  active ? 'bg-[#8A2BE2] text-white border-[#8A2BE2]' : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {p.label}
              </button>
            );
          })}
          <span className="text-sm text-gray-500 ml-1">From</span>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white"
          />
          <span className="text-sm text-gray-500">to</span>
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white"
          />
          <button onClick={() => void load()} className="px-3 py-1.5 rounded-lg text-sm border bg-white text-gray-700 border-gray-200">
            Refresh
          </button>
          <button onClick={() => supabase.auth.signOut()} className="px-3 py-1.5 rounded-lg text-sm text-gray-500">
            Sign out
          </button>
        </div>
      </div>

      {error ? <p className="text-red-600 mb-4">{error}</p> : null}
      {!metrics ? (
        <p className="text-gray-500">Loading data…</p>
      ) : (
        <div className="space-y-8">
          <ActivityHero
            days={metrics.activity}
            rangeLabel={`Last ${metrics.activity.length} days to ${shortDate(to)}`}
          />

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">App downloads</h2>
            {metrics.downloads.connected ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <Stat label="Downloads" value={metrics.downloads.total.toLocaleString('en-SG')} hint="first-time, both stores" />
                  <Stat label="App Store" value={metrics.downloads.appStore.toLocaleString('en-SG')} hint="iPhone and iPad" />
                  <Stat label="Google Play" value={metrics.downloads.googlePlay.toLocaleString('en-SG')} hint="Android" />
                  <Stat label="Host app" value={metrics.downloads.host.toLocaleString('en-SG')} hint="of the total" />
                </div>
                <Panel title="Downloads by week">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={metrics.downloads.weekly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="week" tickFormatter={shortDate} fontSize={12} />
                      <YAxis allowDecimals={false} fontSize={12} />
                      <Tooltip labelFormatter={(l) => shortDate(String(l))} />
                      <Legend />
                      <Bar dataKey="appStore" name="App Store" stackId="d" fill="#8A2BE2" />
                      <Bar dataKey="googlePlay" name="Google Play" stackId="d" fill="#1D9E75" />
                    </BarChart>
                  </ResponsiveContainer>
                </Panel>
                <p className="text-xs text-gray-400 mt-2">
                  From Apple and Google's daily reports, which arrive about a day late.
                  {metrics.downloads.lastSynced
                    ? ` Last synced ${new Date(metrics.downloads.lastSynced).toLocaleString('en-SG', { dateStyle: 'medium', timeStyle: 'short' })}.`
                    : ''}
                </p>
              </>
            ) : (
              <div className="bg-white rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                Store downloads aren't connected yet. Once the App Store Connect and Google Play keys are added, they
                appear here the next morning.
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Revenue</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat label="Booking value" value={money(metrics.gmv)} hint="paid, not cancelled" />
              <Stat label="Platform take" value={money(metrics.take)} hint="after launch rates and promos" negative={metrics.take < 0} />
              <Stat label="Promo discounts" value={money(metrics.discounts)} hint="absorbed by the platform" />
              <Stat label="Avg booking" value={metrics.liveCount ? money(Math.round(metrics.gmv / metrics.liveCount)) : '—'} hint={`${metrics.liveCount} bookings`} />
            </div>
            <Panel title="Booking value and platform take by week">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={metrics.weekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="week" tickFormatter={shortDate} fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(v: number) => `S$${v.toFixed(2)}`} labelFormatter={shortDate} />
                  <Legend />
                  <Bar dataKey="gmv" name="Booking value" fill="#8A2BE2" />
                  <Bar dataKey="take" name="Platform take" fill="#F4C300" />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Bookings and cancellations</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat label="Bookings made" value={String(metrics.bookingCount)} />
              <Stat label="Cancelled" value={String(metrics.cancelledCount)} hint={metrics.bookingCount ? `${Math.round((metrics.cancelledCount / metrics.bookingCount) * 100)}% of bookings` : undefined} />
              <Stat label="Auto-cancelled" value={String(metrics.autoCancelled)} hint="minimum guests not reached" />
              <Stat label="Guest cancellations" value={String(metrics.customerCancelled)} />
            </div>
            <Panel title="Bookings made per week">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={metrics.weekly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="week" tickFormatter={shortDate} fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip labelFormatter={shortDate} />
                  <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#8A2BE2" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Host supply</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat label="Hosts" value={String(metrics.totalHosts)} />
              <Stat label="Approved" value={String(metrics.approvedHosts)} />
              <Stat label="Actually listing" value={String(metrics.hostsListing)} hint={`${metrics.approvedHosts - metrics.hostsListing} approved but no listing`} />
              <Stat label="Upcoming classes" value={String(metrics.upcoming)} hint={`${metrics.liveListings} live listings`} />
            </div>
            <Panel title="Live listings by category">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={metrics.categoryMix} dataKey="value" nameKey="name" outerRadius={95} label>
                    {metrics.categoryMix.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Panel>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Customers</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <Stat label="New customers" value={String(metrics.newCustomers)} hint="signed up in this range" />
              <Stat label="Customers (all time)" value={String(metrics.totalCustomers)} />
              <Stat label="Have booked" value={String(metrics.bookersCount)} hint={metrics.totalCustomers ? `${Math.round((metrics.bookersCount / metrics.totalCustomers) * 100)}% of signups` : undefined} />
              <Stat label="Booked more than once" value={String(metrics.repeat)} />
              <Stat label="Never booked" value={String(metrics.totalCustomers - metrics.bookersCount)} />
            </div>
            <Panel title="New customers per week">
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={metrics.signups}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="week" tickFormatter={shortDate} fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip labelFormatter={shortDate} />
                  <Line type="monotone" dataKey="signups" name="Signups" stroke="#1D9E75" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Class calendar</h2>
            <ClassCalendar
              schedules={data!.schedules}
              services={data!.services}
              owners={data!.owners}
              bookings={data!.bookings}
            />
          </section>
        </div>
      )}
    </Shell>
  );
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Month view of every class across all hosts. Built from data the dashboard has
 * already loaded, so switching months costs nothing and needs no extra query.
 * Independent of the date-range filter above — a calendar is about what is
 * scheduled, not about the reporting window.
 */
function ClassCalendar({
  schedules,
  services,
  owners,
  bookings,
}: {
  schedules: Schedule[];
  services: Service[];
  owners: Owner[];
  bookings: Booking[];
}) {
  const now = new Date();
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(() => todayKey());

  const serviceById = useMemo(() => new Map(services.map((s) => [s.id, s])), [services]);
  const ownerName = useMemo(
    () => new Map(owners.map((o) => [o.user_id, o.display_name ?? 'Host'])),
    [owners],
  );
  // Seats taken per class — cancelled bookings release their seats.
  const seats = useMemo(() => {
    const m = new Map<string, number>();
    for (const b of bookings) {
      if (!b.schedule_id || b.status === 'cancelled') continue;
      m.set(b.schedule_id, (m.get(b.schedule_id) ?? 0) + (b.participants_count ?? 1));
    }
    return m;
  }, [bookings]);

  const monthClasses = useMemo(
    () =>
      schedules
        .filter((s) => {
          const d = new Date(s.start_time);
          return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
        })
        .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [schedules, month],
  );

  const counts = useMemo(() => {
    const m: Record<string, { total: number; cancelled: number }> = {};
    for (const s of monthClasses) {
      const k = dayKey(new Date(s.start_time));
      const row = m[k] ?? { total: 0, cancelled: 0 };
      row.total += 1;
      if (s.status === 'cancelled') row.cancelled += 1;
      m[k] = row;
    }
    return m;
  }, [monthClasses]);

  const dayList = monthClasses.filter((s) => dayKey(new Date(s.start_time)) === selected);
  const cancelledThisMonth = monthClasses.filter((s) => s.status === 'cancelled').length;

  const year = month.getFullYear();
  const mo = month.getMonth();
  const firstDow = new Date(year, mo, 1).getDay();
  const daysInMonth = new Date(year, mo + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, mo, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="grid lg:grid-cols-2 gap-3">
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setMonth(new Date(year, mo - 1, 1))}
            className="px-2 py-1 text-lg text-[#8A2BE2]"
            aria-label="Previous month"
          >
            ‹
          </button>
          <p className="font-semibold text-gray-900">{MONTH_NAMES[mo]} {year}</p>
          <button
            onClick={() => setMonth(new Date(year, mo + 1, 1))}
            className="px-2 py-1 text-lg text-[#8A2BE2]"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((cell, i) => {
            if (!cell) return <div key={`b${i}`} />;
            const key = dayKey(cell);
            const c = counts[key];
            const isSelected = key === selected;
            const isToday = key === todayKey();
            const allCancelled = !!c && c.total > 0 && c.cancelled === c.total;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`rounded-lg py-1.5 text-sm border ${
                  isSelected
                    ? 'bg-[#8A2BE2] text-white border-[#8A2BE2]'
                    : isToday
                      ? 'border-[#8A2BE2] text-gray-900'
                      : 'border-transparent text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="block leading-tight">{cell.getDate()}</span>
                <span
                  className={`block text-[10px] leading-tight ${
                    !c ? 'invisible' : isSelected ? 'text-white' : allCancelled ? 'text-gray-400' : 'text-[#8A2BE2]'
                  }`}
                >
                  {c ? `${c.total}` : '0'}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-gray-400 mt-3">
          {monthClasses.length} {monthClasses.length === 1 ? 'class' : 'classes'} this month
          {cancelledThisMonth > 0 ? ` · ${cancelledThisMonth} cancelled` : ''}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          {selected
            ? new Date(`${selected}T00:00:00`).toLocaleDateString('en-SG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })
            : 'Pick a day'}
        </p>
        {dayList.length === 0 ? (
          <p className="text-sm text-gray-400">Nothing scheduled on this day.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {dayList.map((s) => {
              const svc = s.service_id ? serviceById.get(s.service_id) : undefined;
              const host = svc?.owner_id ? ownerName.get(svc.owner_id) ?? 'Host' : 'Host';
              const cancelled = s.status === 'cancelled';
              return (
                <div key={s.id} className={`border rounded-lg p-3 ${cancelled ? 'border-gray-100 bg-gray-50' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#8A2BE2]">
                      {new Date(s.start_time).toLocaleTimeString('en-SG', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${cancelled ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                      {cancelled ? 'cancelled' : s.status ?? 'scheduled'}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${cancelled ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {svc?.title ?? 'Experience'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {host} · {seats.get(s.id) ?? 0} booked
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] font-['Satoshi',sans-serif]">
      <div className="container mx-auto px-4 py-10 max-w-6xl">{children}</div>
    </div>
  );
}

function Stat({ label, value, hint, negative }: { label: string; value: string; hint?: string; negative?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${negative ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
      {hint ? <p className="text-xs text-gray-400 mt-1">{hint}</p> : null}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 mt-3">
      <p className="text-sm font-semibold text-gray-700 mb-3">{title}</p>
      {children}
    </div>
  );
}

function LoginPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const signIn = async () => {
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setErr(error.message);
    setBusy(false);
  };

  const google = async () => {
    setErr(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/admin` },
    });
    if (error) setErr(error.message);
  };

  return (
    <div className="max-w-sm mx-auto mt-16 bg-white rounded-2xl border border-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">ToGatherSG admin</h1>
      <p className="text-gray-500 text-sm mb-5">Sign in with your admin account.</p>
      <button
        onClick={google}
        className="w-full border border-gray-200 rounded-xl py-2.5 font-semibold text-gray-700 mb-4"
      >
        Continue with Google
      </button>
      <div className="text-center text-xs text-gray-400 mb-4">or</div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@togathersg.com"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-2"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 mb-3"
        onKeyDown={(e) => e.key === 'Enter' && signIn()}
      />
      {err ? <p className="text-red-600 text-sm mb-3">{err}</p> : null}
      <button
        onClick={signIn}
        disabled={busy || !email || !password}
        className="w-full bg-[#8A2BE2] text-white rounded-xl py-2.5 font-semibold disabled:opacity-50"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </div>
  );
}
