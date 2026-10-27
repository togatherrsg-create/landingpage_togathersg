import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

import { canUseWebGL } from '../activity';
import { DISTRICT_ORDER, DISTRICTS, type DistrictKey, type WorldModel } from './districts';

// three.js loads only when the world is shown.
const WorldScene = lazy(() => import('./WorldScene'));

/** Laptop and up: the side panel sits over the right of the world instead of below it. */
const WIDE = '(min-width: 1024px)';

/**
 * The home banner's lettering is a chunky rounded display face; Lilita One is
 * the closest free match. Loaded here, once, so only the dashboard pays for it.
 */
const BANNER_FONT = "'Lilita One', 'Satoshi', sans-serif";
function useBannerFont() {
  useEffect(() => {
    if (document.getElementById('lilita-one')) return;
    const link = document.createElement('link');
    link.id = 'lilita-one';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
    document.head.appendChild(link);
  }, []);
}

/** The banner's purple pill with yellow lettering ("Explore Experiences Now"). */
const pill = {
  background: 'linear-gradient(180deg, #9a6ad6 0%, #7e4fc0 55%, #6b3fae 100%)',
  border: '2px solid #4b3425',
  color: '#f6c21c',
  fontFamily: BANNER_FONT,
  letterSpacing: '0.02em',
  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.35), 0 2px 0 #4b3425',
} as const;
/** Selected: the colours swapped — yellow pill, purple lettering. */
const pillOn = { ...pill, background: 'linear-gradient(180deg, #ffd85a 0%, #f2b91c 100%)', color: '#5b2f99' } as const;

/**
 * The dashboard as a clickable 3D town (see WorldScene), with:
 *   - a floating label over each place — also a button, so the world works
 *     with a tap on a phone and with the keyboard;
 *   - a row of the same places under the world;
 *   - the selected place's full section (charts and all) in a side panel.
 *
 * Anything that stops the 3D from working — no WebGL, a render error, a lost
 * GPU context — calls `onUnavailable`, and the page falls back to the classic
 * view, so the numbers are never lost to the decoration.
 */
export function BusinessWorldView({
  world,
  selected,
  onSelect,
  onUnavailable,
  children,
}: {
  world: WorldModel;
  selected: DistrictKey | null;
  onSelect: (key: DistrictKey | null) => void;
  onUnavailable: () => void;
  /** The selected place's section. */
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const labels = useRef<Partial<Record<DistrictKey, HTMLElement | null>>>({});
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);
  const [wide, setWide] = useState(() => window.matchMedia?.(WIDE).matches ?? true);
  useBannerFont();

  useEffect(() => {
    if (!canUseWebGL()) onUnavailable();
  }, [onUnavailable]);

  // Animate only while someone can see it; track layout and motion settings.
  useEffect(() => {
    const el = box.current;
    const io = el && 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
      : null;
    if (el) io?.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReduceMotion(Boolean(motion?.matches));
    motion?.addEventListener?.('change', onMotion);
    const wideMq = window.matchMedia?.(WIDE);
    const onWide = () => setWide(Boolean(wideMq?.matches));
    wideMq?.addEventListener?.('change', onWide);
    return () => {
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      motion?.removeEventListener?.('change', onMotion);
      wideMq?.removeEventListener?.('change', onWide);
    };
  }, []);

  // Escape closes the side panel and flies back out.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onSelect(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, onSelect]);

  return (
    <div className="lg:relative">
      <div
        ref={box}
        className="relative overflow-hidden rounded-2xl border-2 h-[420px] sm:h-[min(72vh,620px)]"
        // Parchment, like the banner's warm wash.
        style={{ background: 'radial-gradient(ellipse at 50% 35%, #fbefdc 0%, #f0dcc0 60%, #e6c9a5 100%)', borderColor: '#e2c9a6' }}
      >
        <SceneBoundary onError={onUnavailable}>
          <Suspense fallback={<p className="absolute inset-0 grid place-items-center text-sm text-purple-700/60">Building the town…</p>}>
            <WorldScene
              world={world}
              selected={selected}
              onSelect={onSelect}
              labels={labels}
              active={visible && pageVisible && !reduceMotion}
              still={reduceMotion}
              panelOnRight={wide && selected !== null}
              onLost={onUnavailable}
            />
          </Suspense>
        </SceneBoundary>

        {/* Labels: positioned every frame by the scene, clickable like the places.
            Not on phones — six of them crowd a phone-width island; the place
            buttons below carry the same names and numbers there. */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          {DISTRICT_ORDER.map((key) => {
            const d = DISTRICTS[key];
            const isSel = selected === key;
            return (
              <button
                key={key}
                ref={(el) => {
                  labels.current[key] = el;
                }}
                onClick={() => onSelect(isSel ? null : key)}
                className={`pointer-events-auto absolute left-0 top-0 whitespace-nowrap rounded-full px-3 py-1 text-[13px] leading-tight transition-transform hover:scale-105 ${
                  selected && !isSel ? 'hidden lg:block' : ''
                }`}
                style={{ opacity: 0, ...(isSel ? pillOn : pill) }}
                aria-pressed={isSel}
              >
                {d.label}
                <span className="ml-1.5 text-[12px]" style={{ color: isSel ? '#6b3fae' : '#fbf1df', fontFamily: 'Satoshi, sans-serif', fontWeight: 600 }}>
                  {d.headline(world)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="absolute top-3 left-3 pointer-events-none">
          {selected ? (
            <button onClick={() => onSelect(null)} className="pointer-events-auto rounded-full px-3.5 py-1.5 text-sm hover:scale-105 transition-transform" style={pill}>
              ← Whole town
            </button>
          ) : (
            <div>
              {/* The banner's headline treatment: yellow, thick purple outline. */}
              <p
                className="text-3xl sm:text-4xl leading-none"
                style={{
                  fontFamily: BANNER_FONT,
                  color: '#f6c21c',
                  WebkitTextStroke: '7px #7e4fc0',
                  paintOrder: 'stroke fill',
                  textShadow: '0 3px 0 #5b2f99',
                  transform: 'rotate(-3deg)',
                  transformOrigin: 'left bottom',
                }}
              >
                ToGatherSG Town!
              </p>
              <p className="mt-2 inline-block rounded-full bg-[#fbf1df]/85 px-3 py-1 text-xs text-[#6b4a33] border border-[#e2c9a6]">
                <span className="sm:hidden">Tap a place to open its numbers</span>
                <span className="hidden sm:inline">Click a place to open its numbers</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* The same places as plain buttons: keyboard, screen readers, small screens. */}
      <div className="flex flex-wrap gap-2 mt-3" role="toolbar" aria-label="Places">
        {DISTRICT_ORDER.map((key) => {
          const d = DISTRICTS[key];
          const isSel = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(isSel ? null : key)}
              aria-pressed={isSel}
              className={`rounded-full border px-3 py-1.5 text-sm ${isSel ? 'text-white border-transparent' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
              style={isSel ? { background: d.color } : undefined}
            >
              <span className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle" style={{ background: isSel ? '#fff' : d.color }} />
              {d.label}
              <span className={`sm:hidden ml-1.5 ${isSel ? 'text-white/85' : 'text-gray-500'}`}>{d.headline(world)}</span>
            </button>
          );
        })}
      </div>

      {/* Side panel: over the right of the world on a laptop, below it otherwise. */}
      {selected ? (
        <div
          className="mt-4 lg:mt-0 lg:absolute lg:top-3 lg:right-3 lg:w-[470px] lg:overflow-y-auto rounded-2xl bg-white/95 backdrop-blur border border-gray-100 shadow-lg p-4"
          style={wide ? { maxHeight: 'calc(min(72vh, 620px) - 24px)' } : undefined}
        >
          <div className="flex justify-end -mb-2">
            <button onClick={() => onSelect(null)} className="text-gray-400 hover:text-gray-700 text-sm" aria-label="Close">
              ✕
            </button>
          </div>
          {children}
        </div>
      ) : null}
    </div>
  );
}

/** A render failure in the 3D scene switches the page to the classic view. */
class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('Business world failed; switching to the classic dashboard.', error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
