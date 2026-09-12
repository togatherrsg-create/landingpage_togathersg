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
};
type Service = { id: string; owner_id: string | null; status: string | null; is_active: boolean | null; title: string | null; category_id: string | null };
type Owner = { user_id: string; display_name: string | null; is_approved: boolean | null; onboarding_status: string | null; created_at: string };
type Customer = { user_id: string; created_at: string };
type Schedule = { id: string; service_id: string | null; start_time: string; status: string | null };
type Category = { id: string; name: string | null };

type Data = {
  bookings: Booking[];
  services: Service[];
  owners: Owner[];
  customers: Customer[];
  schedules: Schedule[];
  categories: Category[];
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

export default function AdminDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState(() => daysAgoKey(90));
  const [to, setTo] = useState(() => todayKey());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: d }) => {
      setSession(d.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Admin status comes from the owners row, the same flag the apps use.
  useEffect(() => {
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
        supabase.from('bookings').select('id,status,payment_status,total_amount,discount_amount,platform_fee_cents,cancellation_reason,created_at,customer_id,service_id').limit(CAP),
        supabase.from('services').select('id,owner_id,status,is_active,title,category_id').limit(CAP),
        supabase.from('owners').select('user_id,display_name,is_approved,onboarding_status,created_at').limit(CAP),
        supabase.from('customers').select('user_id,created_at').limit(CAP),
        supabase.from('service_schedules').select('id,service_id,start_time,status').limit(CAP),
        supabase.from('categories').select('id,name').limit(CAP),
      ]);
      const firstErr = [b, s, o, c, sc, cat].find((r) => r.error)?.error;
      if (firstErr) throw firstErr;
      setData({
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
    if (isAdmin) void load();
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
        </div>
      )}
    </Shell>
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
    <div className="bg-white rounded-xl border border-gray-100 p-4">
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
