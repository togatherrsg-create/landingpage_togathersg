import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import type { ActivityDay } from './activity';

/**
 * The dashboard's 3D header: the last few weeks as a ring of bars, downloads
 * (purple) under bookings (yellow), that grow in, drift with the pointer and
 * name the day under the cursor.
 *
 * Imported lazily (see ActivityHero), so three.js is only downloaded when an
 * admin opens the dashboard — never by visitors to the landing page.
 *
 * Kept cheap on purpose, because a dashboard that stutters is worse than a
 * flat one:
 *   - two instanced meshes: one draw call per colour, however many days;
 *   - no shadows, no post-processing, device pixel ratio capped at 1.5;
 *   - it only animates while visible — `active` is false when the tab is
 *     hidden or the scene is scrolled away, and the frame loop then switches to
 *     on-demand, drawing nothing until something changes.
 */

const BRAND_PURPLE = new THREE.Color('#8A2BE2');
const BRAND_YELLOW = new THREE.Color('#F4C300');
const MAX_HEIGHT = 3.2;
const BAR_W = 0.42;
const RING_RADIUS = 5.6;
const ARC = Math.PI * 0.85; // spread of the ring, radians
/** Lowers the scene so the tallest bars and the floating shapes stay in frame. */
const SCENE_DROP = -1.6;
const GROW_SECONDS = 1.4;
/** Laptop camera position; narrower screens step back from it (FitCamera). */
const CAMERA_Y = 3.4;
const CAMERA_Z = 11.5;

interface SceneProps {
  days: ActivityDay[];
  /** Animate. False → a single still frame, re-drawn only when data changes. */
  active: boolean;
  /** Skip the grow-in and pointer drift ("reduce motion"). */
  still: boolean;
  onHover: (index: number | null) => void;
  /** The GPU dropped the context (driver reset, too many tabs): show the flat view. */
  onLost: () => void;
}

export default function ActivityScene(props: SceneProps) {
  // Closing the scene deliberately drops its WebGL context (React Three Fiber
  // calls forceContextLoss on unmount). That is not a GPU failure, and treating
  // it as one switched the 3D view off for good, so only a loss while the
  // scene is still mounted reports onLost.
  const closing = useRef(false);
  useEffect(
    () => () => {
      closing.current = true;
    },
    [],
  );
  return (
    <Canvas
      frameloop={props.active ? 'always' : 'demand'}
      dpr={[1, 1.5]}
      // No filmic tone mapping: it greys near-whites and dulls the brand colours.
      flat
      camera={{ position: [0, CAMERA_Y, CAMERA_Z], fov: 38 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      // A lost GPU context (driver reset, too many tabs) leaves a blank
      // canvas; hand over to the flat view instead.
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', () => !closing.current && props.onLost(), { once: true });
      }}
    >
      <hemisphereLight args={['#ffffff', '#d9c9f5', 1.6]} />
      <directionalLight position={[4, 8, 6]} intensity={1.4} />
      <Rig still={props.still}>
        <Bars days={props.days} animate={props.active && !props.still} onHover={props.onHover} />
        <Orbs still={props.still} />
        {/* Unlit, so it stays a soft brand tint instead of the grey a lit
            near-white surface turns at this angle. */}
        <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
          <circleGeometry args={[RING_RADIUS + 1.4, 48]} />
          <meshBasicMaterial color="#ece0ff" transparent opacity={0.55} />
        </mesh>
      </Rig>
      <FitCamera />
      <Redraw deps={props.days} />
    </Canvas>
  );
}

/**
 * Steps the camera back on narrow screens so the whole ring fits the width —
 * on a phone the fixed laptop framing cut both ends off. Never closer than the
 * laptop framing.
 */
function FitCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const halfWidth = RING_RADIUS + 1.2;
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const z = Math.max(CAMERA_Z, halfWidth / (tanHalfFov * aspect));
    camera.position.set(0, z * (CAMERA_Y / CAMERA_Z), z);
    camera.lookAt(0, 0, 0);
    invalidate();
  }, [camera, aspect, invalidate]);
  return null;
}

/** Ask for a frame when the data changes, so the on-demand loop still updates. */
function Redraw({ deps }: { deps: unknown }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [deps, invalidate]);
  return null;
}

/** Tilts the whole scene a little towards the pointer. */
function Rig({ still, children }: { still: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || still) return;
    const target = state.pointer.x * 0.25;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, target, 3, delta);
  });
  return (
    <group ref={group} position-y={SCENE_DROP}>
      {children}
    </group>
  );
}

/**
 * `animate` false means the paused, one-frame-at-a-time mode (tab hidden,
 * scrolled away, or reduced motion). There the grow-in can't advance, so the
 * bars are drawn at full height instead of staying at zero.
 */
function Bars({ days, animate, onHover }: Pick<SceneProps, 'days' | 'onHover'> & { animate: boolean }) {
  const lower = useRef<THREE.InstancedMesh>(null);
  const upper = useRef<THREE.InstancedMesh>(null);
  const invalidate = useThree((s) => s.invalidate);
  const progress = useRef(animate ? 0 : 1);
  const hovered = useRef<number | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => {
    // Unit-height box resting on y=0, so scaling y grows it upwards.
    const g = new THREE.BoxGeometry(BAR_W, 1, BAR_W);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  const layout = useMemo(() => {
    const peak = Math.max(1, ...days.map((d) => d.downloads + d.bookings));
    return days.map((d, i) => {
      const t = days.length === 1 ? 0.5 : i / (days.length - 1);
      const angle = Math.PI / 2 + ARC / 2 - t * ARC; // left → right, curving away
      return {
        x: Math.cos(angle) * RING_RADIUS,
        z: -Math.sin(angle) * RING_RADIUS + RING_RADIUS * 0.55,
        low: (d.downloads / peak) * MAX_HEIGHT,
        high: (d.bookings / peak) * MAX_HEIGHT,
      };
    });
  }, [days]);

  // A new range restarts the grow-in — when it can run.
  useEffect(() => {
    progress.current = animate ? 0 : 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on new data
  }, [layout]);

  // Paused mid-grow (tab hidden, scrolled away): finish it in one step.
  // Resuming never restarts it, so returning to the tab doesn't replay it.
  useEffect(() => {
    if (animate) return;
    progress.current = 1;
    place(1);
    invalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- place reads refs
  }, [animate, invalidate]);

  const place = (p: number) => {
    if (!lower.current || !upper.current) return;
    layout.forEach((b, i) => {
      // Stagger left to right so the ring fills like a wave.
      const local = THREE.MathUtils.clamp(p * 1.6 - (i / Math.max(1, layout.length)) * 0.6, 0, 1);
      const ease = 1 - Math.pow(1 - local, 3);
      const lift = hovered.current === i ? 1.08 : 1;
      dummy.position.set(b.x, 0, b.z);
      dummy.scale.set(lift, Math.max(0.001, b.low * ease), lift);
      dummy.updateMatrix();
      lower.current!.setMatrixAt(i, dummy.matrix);
      dummy.position.set(b.x, b.low * ease, b.z);
      dummy.scale.set(lift, Math.max(0.001, b.high * ease), lift);
      dummy.updateMatrix();
      upper.current!.setMatrixAt(i, dummy.matrix);
    });
    lower.current.instanceMatrix.needsUpdate = true;
    upper.current.instanceMatrix.needsUpdate = true;
    // Hover hit-testing uses a bounding sphere three.js measures once and
    // caches. Measured mid-grow it would be a few millimetres tall and every
    // later hover would miss, so re-measure after each change (a few dozen
    // bars — trivial).
    lower.current.computeBoundingSphere();
    upper.current.computeBoundingSphere();
  };

  // Place once before the first paint, so a still scene is never empty.
  useLayoutEffect(() => place(progress.current));

  useFrame((_, delta) => {
    if (progress.current >= 1) return;
    progress.current = Math.min(1, progress.current + delta / GROW_SECONDS);
    place(progress.current);
  });

  const pick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const i = e.instanceId ?? null;
    if (i === hovered.current) return;
    hovered.current = i;
    onHover(i);
    place(progress.current);
  };
  const leave = () => {
    hovered.current = null;
    onHover(null);
    place(progress.current);
  };

  return (
    <>
      <instancedMesh
        ref={lower}
        args={[geometry, undefined, Math.max(1, layout.length)]}
        onPointerMove={pick}
        onPointerOut={leave}
      >
        <meshStandardMaterial color={BRAND_PURPLE} roughness={0.45} metalness={0.05} />
      </instancedMesh>
      <instancedMesh
        ref={upper}
        args={[geometry, undefined, Math.max(1, layout.length)]}
        onPointerMove={pick}
        onPointerOut={leave}
      >
        <meshStandardMaterial color={BRAND_YELLOW} roughness={0.45} metalness={0.05} />
      </instancedMesh>
    </>
  );
}

/** Three slow-floating shapes in brand colours — the "playful" part. */
function Orbs({ still }: { still: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const orbs = useMemo(
    () => [
      { pos: [-4.8, 3.3, -1.5], color: '#8A2BE2', size: 0.55, speed: 0.6 },
      { pos: [4.6, 3.8, -2], color: '#F4C300', size: 0.42, speed: 0.8 },
      { pos: [0.4, 4.6, -4.5], color: '#C9A2F2', size: 0.32, speed: 1.1 },
    ],
    [],
  );
  useFrame((state) => {
    if (still) return;
    const t = state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const o = orbs[i];
      m.position.y = o.pos[1] + Math.sin(t * o.speed + i) * 0.25;
      m.rotation.x = t * 0.2 * o.speed;
      m.rotation.y = t * 0.3 * o.speed;
    });
  });
  return (
    <>
      {orbs.map((o, i) => (
        <mesh key={i} ref={(m) => (refs.current[i] = m)} position={o.pos as [number, number, number]}>
          <icosahedronGeometry args={[o.size, 1]} />
          <meshStandardMaterial color={o.color} roughness={0.3} flatShading />
        </mesh>
      ))}
    </>
  );
}
