import { Component, lazy, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { canUseWebGL, type ActivityDay } from './activity';

// three.js (~600 KB) loads only here, after an admin is signed in.
const ActivityScene = lazy(() => import('./ActivityScene'));

const shortDate = (key: string) =>
  new Date(`${key}T00:00:00`).toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short' });

/**
 * Dashboard header: headline numbers over a 3D scene of the last weeks.
 *
 * The 3D is decoration over numbers that stand on their own, so every way it
 * can fail lands on the same flat bar strip instead of a broken page:
 * no WebGL, an error while rendering, or a lost GPU context. A visitor who
 * asks for reduced motion still gets the 3D view, just not animated.
 */
export function ActivityHero({ days, rangeLabel }: { days: ActivityDay[]; rangeLabel: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [webgl] = useState(canUseWebGL);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
  const [reduceMotion, setReduceMotion] = useState(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  );
  const [hover, setHover] = useState<number | null>(null);

  // Animate only while someone can see it.
  useEffect(() => {
    const el = box.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReduceMotion(Boolean(mq?.matches));
    mq?.addEventListener?.('change', onMotion);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      mq?.removeEventListener?.('change', onMotion);
    };
  }, []);

  const totals = useMemo(
    () => days.reduce((t, d) => ({ downloads: t.downloads + d.downloads, bookings: t.bookings + d.bookings }), { downloads: 0, bookings: 0 }),
    [days],
  );
  const show3d = webgl && !failed && days.length > 0;
  const hovered = hover != null ? days[hover] : null;

  return (
    <div
      ref={box}
      className="relative overflow-hidden rounded-2xl border border-purple-100 mb-8"
      style={{ height: 300, background: 'linear-gradient(135deg, #f6f0ff 0%, #fffaf0 100%)' }}
    >
      <div className="absolute inset-0">
        {show3d ? (
          <SceneBoundary onError={() => setFailed(true)}>
            <Suspense fallback={<FlatBars days={days} />}>
              <ActivityScene
                days={days}
                active={visible && pageVisible && !reduceMotion}
                still={reduceMotion}
                onHover={setHover}
                onLost={() => setFailed(true)}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          <FlatBars days={days} />
        )}
      </div>

      {/* Numbers as HTML over the canvas: crisp, selectable, and cheaper than 3D text. */}
      <div className="relative pointer-events-none p-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-700/70">{rangeLabel}</p>
          <div className="flex gap-6 mt-1">
            <Headline value={totals.downloads} label="app downloads" color="#8A2BE2" still={reduceMotion} />
            <Headline value={totals.bookings} label="bookings" color="#B38600" still={reduceMotion} />
          </div>
        </div>
        {hovered ? (
          <div className="bg-white/90 backdrop-blur rounded-xl px-3 py-2 shadow-sm text-sm">
            <p className="font-semibold text-gray-900">{shortDate(hovered.day)}</p>
            <p className="text-gray-600">
              <span className="text-[#8A2BE2] font-semibold">{hovered.downloads}</span>{' '}
              {hovered.downloads === 1 ? 'download' : 'downloads'} ·{' '}
              <span className="text-[#B38600] font-semibold">{hovered.bookings}</span>{' '}
              {hovered.bookings === 1 ? 'booking' : 'bookings'}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** A number that counts up when it changes; jumps straight there for reduced motion. */
function Headline({ value, label, color, still }: { value: number; label: string; color: string; still: boolean }) {
  const [shown, setShown] = useState(still ? value : 0);
  useEffect(() => {
    if (still) {
      setShown(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setShown(Math.round(from + (value - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, still]);
  return (
    <div>
      <p className="text-4xl font-bold leading-none" style={{ color }}>
        {shown.toLocaleString('en-SG')}
      </p>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  );
}

/** The no-3D view: the same days as a plain stacked bar strip. */
function FlatBars({ days }: { days: ActivityDay[] }) {
  const peak = Math.max(1, ...days.map((d) => d.downloads + d.bookings));
  return (
    <div className="absolute inset-x-5 bottom-5 top-24 flex items-end gap-1" aria-hidden>
      {days.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col justify-end h-full" title={`${d.day}: ${d.downloads} downloads, ${d.bookings} bookings`}>
          <div className="rounded-t-sm bg-[#F4C300]" style={{ height: `${(d.bookings / peak) * 100}%` }} />
          <div className="bg-[#8A2BE2]" style={{ height: `${(d.downloads / peak) * 100}%` }} />
        </div>
      ))}
    </div>
  );
}

/** Catches a render failure inside the 3D scene and reports it, so the flat view takes over. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('Dashboard 3D scene failed; showing the flat view instead.', error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
