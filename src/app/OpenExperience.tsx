import { useEffect } from 'react';

const APP_STORE_URL = 'https://apps.apple.com/sg/app/togathersg/id6758666107';

/**
 * Web fallback for shared experience links (togathersg.com/experiences/:id).
 *
 * On phones with the app installed, iOS opens the app directly via the
 * universal link (AASA in public/.well-known) and this page is never seen.
 * Everyone else lands here: we try the custom scheme once (covers installed
 * apps before the universal-link build ships), then offer the App Store.
 */
export default function OpenExperience({ id }: { id: string }) {
  const deepLink = `togathersg://experiences/${id}`;

  useEffect(() => {
    // Best-effort: if the app is installed, this opens it. If not, the
    // navigation silently fails and the user stays on this page.
    const t = setTimeout(() => {
      window.location.href = deepLink;
    }, 100);
    return () => clearTimeout(t);
  }, [deepLink]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        padding: 24,
        textAlign: 'center',
        fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: '#7C3AED' }}>ToGatherSG</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: '#111827' }}>
        This experience lives in the ToGatherSG app
      </h1>
      <p style={{ color: '#6B7280', maxWidth: 420, margin: 0 }}>
        Open the app to see photos, dates and book your spot — host-led experiences across
        Singapore.
      </p>
      <a
        href={deepLink}
        style={{
          background: '#7C3AED',
          color: '#fff',
          padding: '14px 28px',
          borderRadius: 12,
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Open in the app
      </a>
      <a
        href={APP_STORE_URL}
        style={{ color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}
      >
        Don&rsquo;t have it? Download on the App Store
      </a>
    </div>
  );
}
