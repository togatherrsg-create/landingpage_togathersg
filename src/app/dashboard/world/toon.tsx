import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

/**
 * The art kit for the business world, matched to the home banner ("Welcome to
 * ToGatherSG!"): warm parchment and wood, muted purple / sage / denim, flat
 * cel shading, and a hand-drawn dark-brown outline round everything — plus the
 * banner's cheering chibi crew.
 *
 * Outlines are the classic "inverted hull": a slightly larger copy of the
 * shape, drawn back-faces-only in the outline colour, so only its rim shows
 * around the original. No post-processing pass, so it costs one extra draw
 * per shape and nothing per pixel.
 */

export const INK = '#4b3425';

export const PALETTE = {
  ink: INK,
  paper: '#f3e2c7',
  woodLight: '#dcb27d',
  woodMid: '#b98552',
  woodDark: '#8b5a34',
  purple: '#7e4fc0',
  yellow: '#f2b91c',
  cream: '#fbf1df',
  white: '#fffaf2',
  sage: '#6f8f4e',
  denim: '#4a6286',
  terracotta: '#c96f45',
  coral: '#ec9c8f',
  lilac: '#b9a3d9',
  stone: '#cfc3b2',
  blush: '#f3a6a0',
  mouth: '#b8473e',
  skin: '#fffaf2',
} as const;

/** Outline thickness in world units. */
const LINE = 0.035;

// Three bands of light, like a cartoon: shadow, mid, lit.
const gradient = (() => {
  const t = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat);
  t.minFilter = THREE.NearestFilter;
  t.magFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
})();

const toonCache = new Map<string, THREE.MeshToonMaterial>();
/** One shared cel-shaded material per colour. */
export function toon(color: string, map?: THREE.Texture): THREE.MeshToonMaterial {
  const key = map ? `${color}|${map.uuid}` : color;
  let m = toonCache.get(key);
  if (!m) {
    m = new THREE.MeshToonMaterial({ color, gradientMap: gradient, map: map ?? null });
    toonCache.set(key, m);
  }
  return m;
}

export const inkMaterial = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });

/** Per-axis scale that grows a shape of `size` by LINE on every side. */
export function hullScale(size: THREE.Vector3, line = LINE): THREE.Vector3 {
  return new THREE.Vector3(
    size.x > 0 ? (size.x + 2 * line) / size.x : 1,
    size.y > 0 ? (size.y + 2 * line) / size.y : 1,
    size.z > 0 ? (size.z + 2 * line) / size.z : 1,
  );
}

export function sizeOf(geometry: THREE.BufferGeometry): THREE.Vector3 {
  if (!geometry.boundingBox) geometry.computeBoundingBox();
  return geometry.boundingBox!.getSize(new THREE.Vector3());
}

/**
 * A cel-shaded mesh with an ink outline. Geometry should be centred on its
 * origin (the outline grows from the centre).
 */
export function Toon({
  geometry,
  color,
  map,
  line = LINE,
  ...rest
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  map?: THREE.Texture;
  line?: number;
} & Omit<JSX.IntrinsicElements['group'], 'children'>) {
  const hull = useMemo(() => hullScale(sizeOf(geometry), line), [geometry, line]);
  return (
    <group {...rest}>
      <mesh geometry={geometry} material={toon(color, map)} />
      {line > 0 ? <mesh geometry={geometry} material={inkMaterial} scale={hull} /> : null}
    </group>
  );
}

/** Floorboards in the given tones, drawn once on a small canvas. */
function planks(tones: string[]): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  const plank = 32;
  for (let i = 0; i < 256 / plank; i++) {
    g.fillStyle = tones[i % tones.length];
    g.fillRect(0, i * plank, 256, plank);
    g.fillStyle = 'rgba(75,52,37,0.35)';
    g.fillRect(0, i * plank, 256, 2);
    // Staggered butt joints, as real boards have.
    const joint = ((i * 97) % 200) + 28;
    g.fillRect(joint, i * plank, 2, plank);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Warm wooden floorboards. */
export const floorboards = planks(['#dcb27d', '#d4a671', '#e0b986', '#cf9f69']);

/** Soft pink floorboards, like a cosy game-room floor. */
export const pinkFloorboards = planks(['#eeb4b4', '#e8a9ab', '#f2bfbd', '#e5a2a6']);

/** Vertical wallpaper stripes, one pair per texture repeat. */
export function wallStripes(a: string, b: string): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 4;
  const g = c.getContext('2d')!;
  g.fillStyle = a;
  g.fillRect(0, 0, 32, 4);
  g.fillStyle = b;
  g.fillRect(32, 0, 32, 4);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.magFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ── The banner's chibi crew ───────────────────────────────────────────────

export type Hat = 'chef' | 'beret' | 'headphones' | 'apron' | 'straw' | 'none';

const G = {
  body: new THREE.CylinderGeometry(0.22, 0.27, 0.4, 18),
  head: new THREE.SphereGeometry(0.34, 22, 18),
  leg: new THREE.CylinderGeometry(0.075, 0.075, 0.16, 10),
  arm: new THREE.CylinderGeometry(0.065, 0.065, 0.3, 10),
  hand: new THREE.SphereGeometry(0.08, 12, 10),
  eye: new THREE.SphereGeometry(0.045, 10, 8),
  dot: new THREE.SphereGeometry(0.06, 10, 8),
  chefBand: new THREE.CylinderGeometry(0.25, 0.25, 0.16, 18),
  chefPuff: new THREE.SphereGeometry(0.26, 16, 12),
  beret: new THREE.SphereGeometry(0.3, 18, 10),
  band: new THREE.TorusGeometry(0.34, 0.04, 8, 24, Math.PI),
  cup: new THREE.CylinderGeometry(0.1, 0.1, 0.08, 14),
  brim: new THREE.CylinderGeometry(0.5, 0.5, 0.04, 22),
  crown: new THREE.SphereGeometry(0.25, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
  apron: new THREE.BoxGeometry(0.34, 0.36, 0.04),
};

/**
 * One of the banner's characters: white round head, purple shirt, arms up,
 * a big open-mouthed grin — wearing the hat of their trade. Hops on the spot
 * while the scene animates (`bounce`), still otherwise.
 */
export function Chibi({
  hat,
  bounce,
  phase = 0,
  ...rest
}: { hat: Hat; bounce: boolean; phase?: number } & Omit<JSX.IntrinsicElements['group'], 'children'>) {
  const root = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!bounce || !root.current) return;
    const t = state.clock.elapsedTime * 2.4 + phase;
    root.current.position.y = Math.abs(Math.sin(t)) * 0.16;
    const wave = Math.sin(t * 2) * 0.25;
    if (armL.current) armL.current.rotation.z = 0.55 + wave;
    if (armR.current) armR.current.rotation.z = -0.55 - wave;
  });

  return (
    <group {...rest}>
      <group ref={root}>
        {/* legs */}
        <Toon geometry={G.leg} color={PALETTE.skin} position={[-0.1, 0.08, 0]} />
        <Toon geometry={G.leg} color={PALETTE.skin} position={[0.1, 0.08, 0]} />
        {/* shirt */}
        <Toon geometry={G.body} color={PALETTE.purple} position={[0, 0.36, 0]} />
        {hat === 'apron' ? <Toon geometry={G.apron} color={PALETTE.woodMid} position={[0, 0.34, 0.24]} /> : null}
        {/* arms raised in a cheer, hands white like the banner's */}
        <group ref={armL} position={[-0.22, 0.48, 0]} rotation-z={0.55}>
          <Toon geometry={G.arm} color={PALETTE.purple} position={[0, 0.15, 0]} />
          <Toon geometry={G.hand} color={PALETTE.skin} position={[0, 0.32, 0]} />
        </group>
        <group ref={armR} position={[0.22, 0.48, 0]} rotation-z={-0.55}>
          <Toon geometry={G.arm} color={PALETTE.purple} position={[0, 0.15, 0]} />
          <Toon geometry={G.hand} color={PALETTE.skin} position={[0, 0.32, 0]} />
        </group>
        {/* head and face */}
        <group position={[0, 0.88, 0]}>
          <Toon geometry={G.head} color={PALETTE.skin} />
          <Toon geometry={G.eye} color={INK} line={0} position={[-0.11, 0.06, 0.3]} scale={[1, 1.3, 0.6]} />
          <Toon geometry={G.eye} color={INK} line={0} position={[0.11, 0.06, 0.3]} scale={[1, 1.3, 0.6]} />
          <Toon geometry={G.dot} color={PALETTE.mouth} line={0} position={[0, -0.09, 0.3]} scale={[1.3, 0.9, 0.5]} />
          <Toon geometry={G.dot} color={PALETTE.blush} line={0} position={[-0.2, -0.03, 0.26]} scale={[0.9, 0.55, 0.4]} />
          <Toon geometry={G.dot} color={PALETTE.blush} line={0} position={[0.2, -0.03, 0.26]} scale={[0.9, 0.55, 0.4]} />
          <HatFor hat={hat} />
        </group>
      </group>
    </group>
  );
}

function HatFor({ hat }: { hat: Hat }): ReactNode {
  switch (hat) {
    case 'chef':
      return (
        <>
          <Toon geometry={G.chefBand} color={PALETTE.white} position={[0, 0.3, 0]} />
          <Toon geometry={G.chefPuff} color={PALETTE.white} position={[0, 0.48, 0]} scale={[1.15, 0.85, 1.15]} />
        </>
      );
    case 'beret':
      return <Toon geometry={G.beret} color={PALETTE.sage} position={[0.04, 0.27, 0]} rotation-z={-0.25} scale={[1.05, 0.38, 1.05]} />;
    case 'headphones':
      return (
        <>
          <Toon geometry={G.band} color={PALETTE.denim} position={[0, 0.02, 0]} />
          <Toon geometry={G.cup} color={PALETTE.denim} position={[-0.34, 0, 0]} rotation-z={Math.PI / 2} />
          <Toon geometry={G.cup} color={PALETTE.denim} position={[0.34, 0, 0]} rotation-z={Math.PI / 2} />
        </>
      );
    case 'straw':
      return (
        <>
          <Toon geometry={G.brim} color={PALETTE.woodLight} position={[0, 0.22, 0]} />
          <Toon geometry={G.crown} color={PALETTE.woodMid} position={[0, 0.22, 0]} />
        </>
      );
    default:
      return null;
  }
}
