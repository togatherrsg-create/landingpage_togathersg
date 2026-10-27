import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';

import { DISTRICT_ORDER, DISTRICTS, type DistrictKey, type WorldModel } from './districts';
import { Chibi, floorboards, hullScale, inkMaterial, PALETTE, sizeOf, toon, Toon, type Hat } from './toon';

/**
 * ToGatherSG as a cutaway workshop, drawn like the home banner: warm wooden
 * floorboards, peach walls with shelves of pottery, a picture and a hanging
 * lamp, flat cel shading with dark-brown ink outlines, and the banner's chibi
 * crew — one at each station, hopping while the scene is on screen.
 *
 * Every station is a dashboard section, built from that section's numbers for
 * the selected range:
 *
 *   Booking Plaza   ticket stacks round a rug, one per booking (cancelled in
 *                   coral); the apron chibi cheers in the middle
 *   Download Port   App Store (purple) and Google Play (sage) cabinets, height
 *                   ∝ downloads; the headphones chibi
 *   Revenue Bank    a wooden chest and coin piles that grow with booking value
 *                   (log scale); the straw-hat chibi
 *   Host Village    a little house per host on a table — terracotta roof when
 *                   listing, lilac when approved but idle, grey while pending;
 *                   the chef chibi
 *   Customer Park   a mini chibi per customer, purple shirt if they've booked;
 *                   the beret chibi
 *   Clock Tower     a grandfather clock ringed with lights, one per upcoming
 *                   class
 *
 * Clicking a station (or its label) selects it; the camera flies over and the
 * page opens that section's charts. Clicking empty space goes back.
 *
 * Lazy-loaded by BusinessWorldView. Budget: repeated objects are instanced,
 * counts capped, outlines are inverted hulls (one extra draw per shape, no
 * post-processing), pixel ratio ≤ 1.5, and outside `active` the loop draws
 * only on demand — camera moves still finish because the rig keeps asking.
 */

const CAPS = { tickets: 160, houses: 36, people: 90, lights: 40, coins: 40 };

/** Which banner character works at which station. */
const CREW: Record<DistrictKey, { hat: Hat; at: [number, number, number] }> = {
  bookings: { hat: 'apron', at: [0, 0, 0] },
  downloads: { hat: 'headphones', at: [1.35, 0, 0.95] },
  revenue: { hat: 'straw', at: [-1.1, 0, 0.9] },
  hosts: { hat: 'chef', at: [1.3, 0, 1.15] },
  customers: { hat: 'beret', at: [0, 0, 0] },
  calendar: { hat: 'none', at: [1.05, 0, 0.95] },
};

interface SceneProps {
  world: WorldModel;
  selected: DistrictKey | null;
  onSelect: (key: DistrictKey | null) => void;
  /** Label elements the page renders over the canvas; positioned from here. */
  labels: MutableRefObject<Partial<Record<DistrictKey, HTMLElement | null>>>;
  active: boolean;
  still: boolean;
  /** Side panel covers the right of the view: frame the selected place left of it. */
  panelOnRight: boolean;
  onLost: () => void;
}

export default function WorldScene(props: SceneProps) {
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
  const bounce = props.active && !props.still;
  return (
    <Canvas
      frameloop={props.active ? 'always' : 'demand'}
      dpr={[1, 1.5]}
      // No filmic tone mapping: it greys the banner's warm creams.
      flat
      camera={{ position: [0, 12.5, 14.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', () => !closing.current && props.onLost(), { once: true });
      }}
      onPointerMissed={() => props.onSelect(null)}
    >
      {/* Warm, soft light like the banner's afternoon room. */}
      <hemisphereLight args={['#fff4e0', '#c9a27a', 1.7]} />
      <directionalLight position={[-5, 10, 8]} intensity={1.6} color="#fff1dc" />
      <Room />
      {DISTRICT_ORDER.map((key, i) => (
        <Place key={key} id={key} selected={props.selected} onSelect={props.onSelect}>
          <Contents id={key} world={props.world} />
          {/* The banner's crew are its stars: drawn a size up from the props. */}
          <Chibi hat={CREW[key].hat} bounce={bounce} phase={i * 1.3} position={CREW[key].at} scale={1.5} />
        </Place>
      ))}
      <CameraRig selected={props.selected} still={props.still} panelOnRight={props.panelOnRight} />
      <Labels labels={props.labels} />
      <Redraw deps={props.world} />
    </Canvas>
  );
}

// ── Shared geometry ───────────────────────────────────────────────────────

const GEO = {
  box: new THREE.BoxGeometry(1, 1, 1),
  roof: new THREE.ConeGeometry(0.3, 0.28, 4).rotateY(Math.PI / 4),
  coin: new THREE.CylinderGeometry(0.3, 0.3, 0.08, 16),
  ticket: new THREE.BoxGeometry(0.26, 0.1, 0.18),
  miniBody: new THREE.CylinderGeometry(0.06, 0.075, 0.16, 10),
  miniHead: new THREE.SphereGeometry(0.09, 12, 10),
  light: new THREE.SphereGeometry(0.075, 10, 8),
  rug: new THREE.CylinderGeometry(1.95, 1.95, 0.06, 32),
  pot: new THREE.CylinderGeometry(0.22, 0.17, 0.4, 14),
  vase: new THREE.SphereGeometry(0.22, 14, 12),
};

/** Deterministic random, so the room looks the same on every visit. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

/** Ask for a frame when the numbers change, so the on-demand loop redraws. */
function Redraw({ deps }: { deps: unknown }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [deps, invalidate]);
  return null;
}

// ── The workshop ──────────────────────────────────────────────────────────

const FLOOR = { w: 20, d: 19 };
const WALL_H = 3.4;

const ROOM_GEO = {
  floor: new THREE.BoxGeometry(FLOOR.w, 0.4, FLOOR.d),
  backWall: new THREE.BoxGeometry(FLOOR.w, WALL_H, 0.3),
  sideWall: new THREE.BoxGeometry(0.3, WALL_H, FLOOR.d),
  backTrim: new THREE.BoxGeometry(FLOOR.w, 0.9, 0.06),
  sideTrim: new THREE.BoxGeometry(0.06, 0.9, FLOOR.d),
  shelf: new THREE.BoxGeometry(3.2, 0.12, 0.5),
  frame: new THREE.BoxGeometry(0.08, 1.2, 1.5),
  picture: new THREE.BoxGeometry(0.02, 0.9, 1.2),
  window: new THREE.BoxGeometry(2.2, 1.6, 0.06),
  pane: new THREE.BoxGeometry(1.9, 1.3, 0.02),
  lampShade: new THREE.ConeGeometry(0.55, 0.45, 16, 1, true),
  cord: new THREE.CylinderGeometry(0.015, 0.015, 1.4, 6),
};

function Room() {
  const z0 = -FLOOR.d / 2;
  const x0 = -FLOOR.w / 2;
  return (
    <group>
      {/* Floorboards, like the banner's. */}
      <Toon geometry={ROOM_GEO.floor} color="#ffffff" map={floorboards ?? undefined} position={[0, -0.2, 0]} />
      {/* Walls: only the back and left, a cutaway the camera can see over. */}
      <Toon geometry={ROOM_GEO.backWall} color="#efd2b3" position={[0, WALL_H / 2, z0 - 0.15]} />
      <Toon geometry={ROOM_GEO.sideWall} color="#e9c9a8" position={[x0 - 0.15, WALL_H / 2, 0]} />
      {/* Wooden wainscot along the bottom of the walls. */}
      <Toon geometry={ROOM_GEO.backTrim} color={PALETTE.woodMid} position={[0, 0.45, z0 + 0.03]} />
      <Toon geometry={ROOM_GEO.sideTrim} color={PALETTE.woodMid} position={[x0 + 0.03, 0.45, 0]} />

      {/* Window with a soft glow, on the back wall. */}
      <Toon geometry={ROOM_GEO.window} color={PALETTE.woodMid} position={[2.5, 2.1, z0 + 0.05]} />
      <mesh geometry={ROOM_GEO.pane} position={[2.5, 2.1, z0 + 0.1]}>
        <meshBasicMaterial color="#fff6dc" />
      </mesh>

      {/* Shelves of pottery, like the banner's back wall. */}
      {[
        [-5.5, 2.3],
        [7.2, 2.0],
      ].map(([x, y], i) => (
        <group key={i} position={[x, y, z0 + 0.3]}>
          <Toon geometry={ROOM_GEO.shelf} color={PALETTE.woodMid} />
          <Toon geometry={GEO.pot} color={PALETTE.terracotta} position={[-0.9, 0.26, 0]} />
          <Toon geometry={GEO.vase} color={PALETTE.sage} position={[0, 0.25, 0]} scale={[0.9, 1.1, 0.9]} />
          <Toon geometry={GEO.pot} color={PALETTE.woodLight} position={[0.95, 0.26, 0]} scale={[0.8, 0.8, 0.8]} />
        </group>
      ))}

      {/* A framed picture on the side wall. */}
      <group position={[x0 + 0.08, 2.1, -3.5]}>
        <Toon geometry={ROOM_GEO.frame} color={PALETTE.woodDark} />
        <mesh geometry={ROOM_GEO.picture} position={[0.05, 0, 0]}>
          <meshBasicMaterial color="#cfe0b0" />
        </mesh>
      </group>

      {/* Hanging lamp near the back of the room. */}
      <group position={[-1.2, WALL_H + 0.9, z0 + 2.4]}>
        <Toon geometry={ROOM_GEO.cord} color={PALETTE.ink} line={0} position={[0, 0.7, 0]} />
        <Toon geometry={ROOM_GEO.lampShade} color={PALETTE.cream} />
      </group>
    </group>
  );
}

// ── A clickable station ───────────────────────────────────────────────────

function Place({
  id,
  selected,
  onSelect,
  children,
}: {
  id: DistrictKey;
  selected: DistrictKey | null;
  onSelect: (key: DistrictKey) => void;
  children: ReactNode;
}) {
  const group = useRef<THREE.Group>(null);
  const hovered = useRef(false);
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const { at, color } = DISTRICTS[id];

  // Lift a little on hover or when selected; requests frames until settled.
  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const target = hovered.current || selected === id ? 1.06 : 1;
    const next = THREE.MathUtils.damp(g.scale.x, target, 10, delta);
    if (Math.abs(next - target) > 0.001) {
      g.scale.setScalar(next);
      invalidate();
    } else if (g.scale.x !== target) {
      g.scale.setScalar(target);
    }
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    hovered.current = true;
    gl.domElement.style.cursor = 'pointer';
    invalidate();
  };
  const out = () => {
    hovered.current = false;
    gl.domElement.style.cursor = '';
    invalidate();
  };

  const rugColor = useMemo(
    () => `#${new THREE.Color(color).lerp(new THREE.Color(PALETTE.cream), selected === id ? 0.35 : 0.6).getHexString()}`,
    [color, selected, id],
  );

  return (
    <group
      ref={group}
      position={[at[0], 0, at[1]]}
      onPointerOver={over}
      onPointerOut={out}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* Each station stands on its own round rug. */}
      <Toon geometry={GEO.rug} color={rugColor} position-y={0.03} />
      <group position-y={0.06}>{children}</group>
    </group>
  );
}

function Contents({ id, world }: { id: DistrictKey; world: WorldModel }) {
  switch (id) {
    case 'downloads':
      return <DownloadPort {...world.downloads} />;
    case 'revenue':
      return <RevenueBank gmvCents={world.revenue.gmvCents} />;
    case 'bookings':
      return <BookingPlaza {...world.bookings} />;
    case 'hosts':
      return <HostVillage {...world.hosts} />;
    case 'customers':
      return <CustomerPark {...world.customers} />;
    case 'calendar':
      return <ClockTower upcoming={world.upcoming} />;
  }
}

// ── Instancing, with ink outlines ─────────────────────────────────────────

/**
 * `count` copies of one shape in one draw call (two with the outline). `place`
 * positions copy i and may return its colour; the outline copy is the same
 * shape grown by the line width, back faces only.
 */
function Instances({
  count,
  geometry,
  place,
  color = '#ffffff',
  emissive,
  outline = true,
  deps,
}: {
  count: number;
  geometry: THREE.BufferGeometry;
  place: (i: number, o: THREE.Object3D) => string | void;
  color?: string;
  emissive?: string;
  outline?: boolean;
  deps: unknown[];
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const ink = useRef<THREE.InstancedMesh>(null);
  const material = useMemo(() => {
    if (!emissive) return toon(color);
    const m = toon(color).clone();
    m.emissive = new THREE.Color(emissive);
    m.emissiveIntensity = 0.7;
    return m;
  }, [color, emissive]);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const base = sizeOf(geometry);
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      o.position.set(0, 0, 0);
      o.rotation.set(0, 0, 0);
      o.scale.set(1, 1, 1);
      const col = place(i, o);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      if (col) mesh.setColorAt(i, c.set(col));
      if (ink.current) {
        o.scale.multiply(hullScale(base.clone().multiply(o.scale), 0.025));
        o.updateMatrix();
        ink.current.setMatrixAt(i, o.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
    if (ink.current) {
      ink.current.instanceMatrix.needsUpdate = true;
      ink.current.computeBoundingSphere();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `deps` lists what place() reads
  }, [count, ...deps]);
  if (count <= 0) return null;
  return (
    <>
      <instancedMesh key={`m${count}`} ref={ref} args={[geometry, material, count]} />
      {outline ? <instancedMesh key={`o${count}`} ref={ink} args={[geometry, inkMaterial, count]} /> : null}
    </>
  );
}

// ── The stations ──────────────────────────────────────────────────────────

function Cabinet({ x, height, color }: { x: number; height: number; color: string }) {
  const geo = useMemo(() => new THREE.BoxGeometry(0.75, height, 0.6), [height]);
  const top = useMemo(() => new THREE.BoxGeometry(0.85, 0.1, 0.7), []);
  const screen = useMemo(() => new THREE.BoxGeometry(0.5, Math.max(0.2, height * 0.45), 0.02), [height]);
  return (
    <group position-x={x}>
      <Toon geometry={geo} color={color} position-y={height / 2} />
      <Toon geometry={top} color={PALETTE.woodDark} position-y={height + 0.05} />
      {/* A phone-screen panel on the front, so it reads as "app". */}
      <mesh geometry={screen} position={[0, height * 0.55, 0.31]}>
        <meshBasicMaterial color={PALETTE.cream} />
      </mesh>
    </group>
  );
}

function DownloadPort({ connected, appStore, googlePlay }: WorldModel['downloads']) {
  const peak = Math.max(1, appStore, googlePlay);
  const h = (v: number) => (connected ? 0.6 + (2.6 * v) / peak : 0.6);
  return (
    <>
      <Cabinet x={-0.5} height={h(appStore)} color={connected ? PALETTE.purple : PALETTE.stone} />
      <Cabinet x={0.5} height={h(googlePlay)} color={connected ? PALETTE.sage : PALETTE.stone} />
    </>
  );
}

const CHEST = {
  body: new THREE.BoxGeometry(1.3, 0.7, 0.8),
  lid: new THREE.CylinderGeometry(0.4, 0.4, 1.3, 16, 1, false, 0, Math.PI).rotateZ(Math.PI / 2),
  strap: new THREE.BoxGeometry(0.12, 0.72, 0.84),
};

function RevenueBank({ gmvCents }: { gmvCents: number }) {
  // Log scale: S$100 ≈ 16 coins, S$10,000 ≈ 32 — growth stays visible early on.
  const coins = gmvCents > 0 ? Math.min(CAPS.coins, Math.max(1, Math.round(8 * Math.log10(1 + gmvCents / 100)))) : 0;
  const jitter = useMemo(() => {
    const rnd = seeded(7);
    return Array.from({ length: CAPS.coins }, () => [(rnd() - 0.5) * 0.05, (rnd() - 0.5) * 0.05]);
  }, []);
  return (
    <>
      {/* A treasure chest — the bank, in a workshop. */}
      <group position={[0.35, 0, -0.55]}>
        <Toon geometry={CHEST.body} color={PALETTE.woodMid} position-y={0.35} />
        <Toon geometry={CHEST.lid} color={PALETTE.woodDark} position-y={0.7} />
        <Toon geometry={CHEST.strap} color={PALETTE.yellow} position={[-0.35, 0.36, 0]} />
        <Toon geometry={CHEST.strap} color={PALETTE.yellow} position={[0.35, 0.36, 0]} />
      </group>
      <Instances
        count={coins}
        geometry={GEO.coin}
        color={PALETTE.yellow}
        deps={[coins]}
        place={(i, o) => {
          const stack = i < 20 ? 0 : 1;
          const level = i % 20;
          o.position.set((stack ? -0.15 : 0.55) + jitter[i][0], 0.04 + level * 0.085, 0.55 + jitter[i][1]);
        }}
      />
    </>
  );
}

function BookingPlaza({ live, cancelled }: WorldModel['bookings']) {
  const total = live + cancelled;
  const shown = Math.min(CAPS.tickets, total);
  const liveShown = total ? Math.round((shown * live) / total) : 0;
  return (
    <Instances
      count={shown}
      geometry={GEO.ticket}
      deps={[shown, liveShown]}
      place={(i, o) => {
        // Little stacks of tickets in rings round the cheering chibi.
        const perRing = 20;
        const ring = Math.floor(i / perRing);
        const k = i % perRing;
        const a = (k / perRing) * Math.PI * 2 + ring * 0.15;
        const r = 0.85 + (ring % 3) * 0.32;
        o.position.set(Math.cos(a) * r, 0.05 + Math.floor(ring / 3) * 0.11, Math.sin(a) * r);
        o.rotation.y = -a;
        return i < liveShown ? PALETTE.yellow : PALETTE.coral;
      }}
    />
  );
}

function HostVillage({ listing, approvedIdle, pending }: WorldModel['hosts']) {
  const total = listing + approvedIdle + pending;
  const shown = Math.min(CAPS.houses, total);
  const scale = total ? shown / total : 0;
  const nListing = Math.round(listing * scale);
  const nIdle = Math.round(approvedIdle * scale);
  const kind = (i: number) => (i < nListing ? 0 : i < nListing + nIdle ? 1 : 2);
  // The houses sit on a low wooden table, in a cluster sized to the count.
  const perRow = Math.max(1, Math.min(6, Math.ceil(Math.sqrt(shown * 1.3))));
  const rows = Math.max(1, Math.ceil(shown / perRow));
  const TOP = 0.42;
  const tableW = Math.max(1.2, perRow * 0.48 + 0.3);
  const tableD = Math.max(1, rows * 0.5 + 0.3);
  const table = useMemo(() => new THREE.BoxGeometry(tableW, 0.12, tableD), [tableW, tableD]);
  const leg = useMemo(() => new THREE.BoxGeometry(0.1, TOP - 0.12, 0.1), []);
  const spot = (i: number, o: THREE.Object3D) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const inRow = row === rows - 1 ? shown - row * perRow : perRow;
    o.position.set((col - (inRow - 1) / 2) * 0.48 - 0.25, TOP, (row - (rows - 1) / 2) * 0.5 - 0.2);
  };
  return (
    <>
      <group position={[-0.25, 0, -0.2]}>
        <Toon geometry={table} color={PALETTE.woodMid} position-y={TOP - 0.06} />
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sz) => (
            <Toon
              key={`${sx}${sz}`}
              geometry={leg}
              color={PALETTE.woodDark}
              position={[sx * (tableW / 2 - 0.1), (TOP - 0.12) / 2, sz * (tableD / 2 - 0.1)]}
            />
          )),
        )}
      </group>
      <Instances
        count={shown}
        geometry={GEO.box}
        deps={[shown, nListing, nIdle, perRow]}
        place={(i, o) => {
          spot(i, o);
          o.position.y += 0.15;
          o.scale.set(0.32, 0.28, 0.32);
          return [PALETTE.white, '#f1e8f8', '#e2dbd2'][kind(i)];
        }}
      />
      <Instances
        count={shown}
        geometry={GEO.roof}
        deps={[shown, nListing, nIdle, perRow]}
        place={(i, o) => {
          spot(i, o);
          o.position.y += 0.43;
          return [PALETTE.terracotta, PALETTE.lilac, PALETTE.stone][kind(i)];
        }}
      />
    </>
  );
}

function CustomerPark({ booked, never }: WorldModel['customers']) {
  const total = booked + never;
  const shown = Math.min(CAPS.people, total);
  const nBooked = total ? Math.round((shown * booked) / total) : 0;
  const spots = useMemo(() => {
    const rnd = seeded(11);
    return Array.from({ length: CAPS.people }, () => {
      const a = rnd() * Math.PI * 2;
      const r = 0.5 + Math.sqrt(rnd()) * 1.2;
      return [Math.cos(a) * r, Math.sin(a) * r] as const;
    });
  }, []);
  return (
    <>
      {/* Potted plants, like the banner's room. */}
      {[
        [-1.35, -0.9],
        [1.35, -0.9],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <Toon geometry={GEO.pot} color={PALETTE.terracotta} position-y={0.2} />
          <Toon geometry={GEO.vase} color={PALETTE.sage} position-y={0.55} scale={[1.2, 1.3, 1.2]} />
        </group>
      ))}
      {/* A crowd of mini chibis: white heads, purple shirts if they've booked. */}
      <Instances
        count={shown}
        geometry={GEO.miniBody}
        deps={[shown, nBooked]}
        place={(i, o) => {
          o.position.set(spots[i][0], 0.08, spots[i][1]);
          return i < nBooked ? PALETTE.purple : PALETTE.stone;
        }}
      />
      <Instances
        count={shown}
        geometry={GEO.miniHead}
        color={PALETTE.white}
        deps={[shown]}
        place={(i, o) => {
          o.position.set(spots[i][0], 0.24, spots[i][1]);
        }}
      />
    </>
  );
}

const CLOCK = {
  body: new THREE.BoxGeometry(0.8, 2.4, 0.6),
  hood: new THREE.BoxGeometry(0.95, 0.3, 0.72),
  face: new THREE.CylinderGeometry(0.28, 0.28, 0.04, 24).rotateX(Math.PI / 2),
  pendulum: new THREE.SphereGeometry(0.11, 12, 10),
};

function ClockTower({ upcoming }: { upcoming: number }) {
  const shown = Math.min(CAPS.lights, upcoming);
  return (
    <>
      {/* A grandfather clock — the class calendar. */}
      <Toon geometry={CLOCK.body} color={PALETTE.woodMid} position-y={1.2} />
      <Toon geometry={CLOCK.hood} color={PALETTE.woodDark} position-y={2.55} />
      <Toon geometry={CLOCK.face} color={PALETTE.cream} position={[0, 1.95, 0.32]} />
      <Toon geometry={CLOCK.pendulum} color={PALETTE.yellow} position={[0, 0.9, 0.32]} />
      {/* A ring of little lights, one per upcoming class. */}
      <Instances
        count={shown}
        geometry={GEO.light}
        color={PALETTE.yellow}
        emissive={PALETTE.yellow}
        outline={false}
        deps={[shown]}
        place={(i, o) => {
          const a = (i / Math.max(1, shown)) * Math.PI * 2;
          o.position.set(Math.cos(a) * 1.4, 0.1, Math.sin(a) * 1.4);
        }}
      />
    </>
  );
}

// ── Camera and labels ─────────────────────────────────────────────────────

/** Height above the floor where each station's label floats. */
const LABEL_Y: Record<DistrictKey, number> = {
  // Above the crew's heads (they stand ~1.6 tall at their size-up).
  bookings: 2.8,
  downloads: 3.9,
  revenue: 2.4,
  hosts: 2.4,
  customers: 2.8,
  calendar: 3.2,
};

function CameraRig({ selected, still, panelOnRight }: { selected: DistrictKey | null; still: boolean; panelOnRight: boolean }) {
  const camera = useThree((s) => s.camera);
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height));
  const invalidate = useThree((s) => s.invalidate);
  const look = useRef(new THREE.Vector3());
  const goal = useMemo(() => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }), []);

  // Where the camera wants to be.
  useEffect(() => {
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov / 2));
    // Portrait screens (phones): look down from higher up, so the room fills
    // the width instead of sitting small in a tall, empty box.
    const portrait = aspect < 1.2;
    if (!selected) {
      if (portrait) {
        const d = 10.6 / (tanHalfFov * aspect);
        goal.pos.set(0, d * 0.9, d * 0.44);
      } else {
        const back = Math.max(1, 1.55 / aspect);
        goal.pos.set(0, 12.5 * back, 14.5 * back);
      }
      goal.look.set(0, 0, -0.5);
    } else {
      const [x, z] = DISTRICTS[selected].at;
      // Stations are seen from the open front of the room, leaning a little
      // towards where the station sits.
      goal.look.set(x, 0.9, z);
      const k = portrait ? 1.6 : 1;
      goal.pos.set(x * 1.25, 5.6 * k, z + 6.2 * k);
      if (panelOnRight) {
        // Aim right of the station so it sits left of the side panel.
        goal.look.x += 1.7;
      }
    }
    invalidate();
  }, [selected, aspect, panelOnRight, goal, invalidate, camera]);

  useFrame((state, delta) => {
    const sway = !still && !selected ? state.pointer.x * 0.8 : 0;
    const target = goal.pos.clone().add(new THREE.Vector3(sway, 0, 0));
    const speed = still ? 100 : 3.5;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.x, speed, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.y, speed, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.z, speed, delta);
    look.current.lerp(goal.look, 1 - Math.exp(-speed * delta));
    camera.lookAt(look.current);
    // Keep drawing until the move has finished, even in on-demand mode.
    if (camera.position.distanceTo(target) > 0.01 || look.current.distanceTo(goal.look) > 0.01) invalidate();
  });
  return null;
}

/** Positions the page's HTML labels over their stations each frame — no re-renders. */
function Labels({ labels }: { labels: MutableRefObject<Partial<Record<DistrictKey, HTMLElement | null>>> }) {
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const key of DISTRICT_ORDER) {
      const el = labels.current[key];
      if (!el) continue;
      const [x, z] = DISTRICTS[key].at;
      v.set(x, LABEL_Y[key], z).project(camera);
      const hidden = v.z > 1 || Math.abs(v.x) > 1.1 || Math.abs(v.y) > 1.1;
      el.style.opacity = hidden ? '0' : '1';
      el.style.transform = `translate(-50%, -100%) translate(${((v.x + 1) / 2) * size.width}px, ${((1 - v.y) / 2) * size.height}px)`;
    }
  });
  return null;
}
