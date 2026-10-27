/** One day of activity for the dashboard header. */
export interface ActivityDay {
  /** yyyy-mm-dd, local time. */
  day: string;
  /** First-time app downloads, both stores, both apps. */
  downloads: number;
  /** Bookings made that day. */
  bookings: number;
}

/** True when the browser can make a WebGL context — checked once, before loading three.js. */
export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    // Release it straight away: browsers cap live contexts per page.
    (gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}
