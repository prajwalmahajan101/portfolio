import { useEffect, useRef, useState } from 'react';
import { motionValue, useMotionValue, type MotionValue } from 'motion/react';
import {
  CHAIN_SPRING,
  CRESCENT_INSIDE,
  CRESCENT_OUTSIDE,
  GHOST_COUNT,
  HUD_DEBOUNCE_MS,
  IDLENESS_SMOOTHING,
  IDLE_VELOCITY_THRESHOLD,
  IS_MOVING_HYSTERESIS,
  MAGNET_LERP,
  MAGNET_RADIUS_PX,
  SECTION_THROTTLE_MS,
  VELOCITY_DECAY,
} from './cursor.constants';
import type { CursorHoverTarget, SceneId } from './cursor.types';

const KNOWN_SCENES: SceneId[] = [
  'hero', 'about', 'architecture', 'skills', 'experience', 'projects', 'contact',
];

function isSceneId(v: string | null): v is SceneId {
  return v != null && (KNOWN_SCENES as string[]).includes(v);
}

function deriveLabel(el: Element): { label: string; kind: CursorHoverTarget['kind'] } {
  const explicit = el.getAttribute('data-cursor-label');
  if (explicit) return { label: explicit, kind: 'generic' };

  if (el.tagName === 'A') {
    const href = (el as HTMLAnchorElement).getAttribute('href') ?? '/';
    const clean = href.startsWith('http') ? new URL(href).pathname : href;
    return { label: `GET ${clean || '/'}`, kind: 'link' };
  }
  if (el.tagName === 'BUTTON') {
    const txt = (el.textContent ?? '').trim().slice(0, 24).toLowerCase() || 'action';
    return { label: `endpoint: ${txt} · ready`, kind: 'button' };
  }
  if (el.getAttribute('data-cursor') === 'hover') {
    return { label: 'PROJECT · healthy', kind: 'card' };
  }
  return { label: '', kind: 'generic' };
}

export interface CursorState {
  // raw cursor — drives the block caret + HUD (no React renders per frame)
  mx: MotionValue<number>;
  my: MotionValue<number>;
  // crescent-offset radar target — head of the 9-link chain
  rx: MotionValue<number>;
  ry: MotionValue<number>;
  // 5 ghost positions (g0..g4) integrated each frame in the state-machine RAF.
  // gx[0] follows rx; gx[i] follows gx[i-1]. Each link uses the same
  // CHAIN_SPRING via semi-implicit Euler — see the chain block in `tick`.
  gx: MotionValue<number>[];
  gy: MotionValue<number>[];
  // velocity ref — written by pointermove, read by the state-machine RAF
  velocity: React.MutableRefObject<{ vx: number; vy: number; speed: number }>;
  // section under the cursor
  scene: SceneId;
  // current hover target (debounced)
  hover: CursorHoverTarget | null;
  // pressed
  isDown: boolean;
  // gates the scan-line / labels on the head radar (true while moving)
  isMoving: boolean;
  // mounted (gated on touch + reduced-motion)
  active: boolean;
}

export function useCursorState(): CursorState {
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const rx = useMotionValue(-9999);
  const ry = useMotionValue(-9999);

  // 5-link spring chain — MotionValues (consumed by RadarFollower) plus the
  // internal pos/vel arrays integrated each frame. Single lazy allocation:
  // cheaper than 16 useMotionValue calls and avoids a fixed-count hook loop.
  const chainRef = useRef<{
    gx: MotionValue<number>[];
    gy: MotionValue<number>[];
    pos: Array<{ x: number; y: number }>;
    vel: Array<{ x: number; y: number }>;
  } | null>(null);
  if (!chainRef.current) {
    chainRef.current = {
      gx: Array.from({ length: GHOST_COUNT }, () => motionValue(-9999)),
      gy: Array.from({ length: GHOST_COUNT }, () => motionValue(-9999)),
      pos: Array.from({ length: GHOST_COUNT }, () => ({ x: -9999, y: -9999 })),
      vel: Array.from({ length: GHOST_COUNT }, () => ({ x: 0, y: 0 })),
    };
  }
  const chain = chainRef.current;

  const velocity = useRef({ vx: 0, vy: 0, speed: 0 });
  const lastSample = useRef({ x: 0, y: 0, t: performance.now() });

  const [scene, setScene] = useState<SceneId>('hero');
  const [hover, setHover] = useState<CursorHoverTarget | null>(null);
  const [isDown, setIsDown] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [active, setActive] = useState(false);

  // Gate: touch + reduced-motion
  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const compute = () => setActive(hoverQuery.matches && !reduceQuery.matches);
    compute();
    hoverQuery.addEventListener('change', compute);
    reduceQuery.addEventListener('change', compute);
    return () => {
      hoverQuery.removeEventListener('change', compute);
      reduceQuery.removeEventListener('change', compute);
    };
  }, []);

  // Pointer wiring — raw cursor, velocity, magnetic, section, HUD
  useEffect(() => {
    if (!active) return;

    let sectionTimer = 0;
    let hudTimer = 0;
    let lastHoverEl: Element | null = null;

    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const last = lastSample.current;
      const dt = Math.max(1, now - last.t);
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      velocity.current = {
        vx: dx / dt,
        vy: dy / dt,
        speed: Math.hypot(dx, dy) / dt,
      };
      lastSample.current = { x: e.clientX, y: e.clientY, t: now };

      // Magnetic hover — pull caret toward [data-cursor="hover"] target center
      let cx = e.clientX;
      let cy = e.clientY;
      const target = lastHoverEl;
      if (target) {
        const r = target.getBoundingClientRect();
        const tcx = r.left + r.width / 2;
        const tcy = r.top + r.height / 2;
        const dist = Math.hypot(cx - tcx, cy - tcy);
        if (dist < MAGNET_RADIUS_PX) {
          cx = cx + (tcx - cx) * MAGNET_LERP;
          cy = cy + (tcy - cy) * MAGNET_LERP;
        }
      }
      mx.set(cx);
      my.set(cy);

      if (now - sectionTimer > SECTION_THROTTLE_MS) {
        sectionTimer = now;
        const under = document.elementFromPoint(e.clientX, e.clientY);
        if (under) {
          const sect = under.closest('[data-scene]');
          const id = sect?.getAttribute('data-scene') ?? null;
          if (isSceneId(id)) setScene(id);
        }
      }

      const target2 = e.target instanceof Element
        ? e.target.closest('a, button, [data-cursor], [data-cursor-label]')
        : null;
      if (target2 !== lastHoverEl) {
        lastHoverEl = target2;
        window.clearTimeout(hudTimer);
        hudTimer = window.setTimeout(() => {
          if (!target2) { setHover(null); return; }
          const { label, kind } = deriveLabel(target2);
          if (!label) { setHover(null); return; }
          setHover({ el: target2, rect: target2.getBoundingClientRect(), label, kind });
        }, HUD_DEBOUNCE_MS);
      }
    };

    const onDown = () => setIsDown(true);
    const onUp = () => setIsDown(false);
    const onLeave = () => {
      mx.set(-9999);
      my.set(-9999);
      setHover(null);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      window.clearTimeout(hudTimer);
    };
  }, [active, mx, my]);

  // State-machine RAF — idleness low-pass, velocity decay, radar head (on the
  // cursor), AND the 5-link ghost chain integration. Previously
  // the chain was built inside RadarFollower with chained useSpring; that
  // didn't propagate (links 4..7 stuck at the -9999 sentinel, links 1..3
  // non-monotonic) because Motion's useSpring doesn't reliably subscribe when
  // the source is itself a useSpring output. Replacing the subscription graph
  // with a deterministic semi-implicit Euler chain in one RAF fixes the order
  // invariant structurally — pos[i] is integrated against pos[i-1] right
  // before pos[i+1] integrates against the new pos[i], every single frame.
  useEffect(() => {
    if (!active) return;

    const dir = { x: 0, y: -1 };
    let idleness = 1;
    let lastIsMoving = false;
    let raf = 0;

    // Chain integration state — see CHAIN_SPRING for the physical constants.
    const { stiffness: k, damping: c, mass: m } = CHAIN_SPRING;
    let primed = false;
    let lastTickTime = performance.now();

    const tick = () => {
      const cx = mx.get();
      const cy = my.get();
      const v = velocity.current;
      const now = performance.now();

      if (cx <= -1000) {
        // Off-page: drop the prime so re-entry restarts the chain at the new
        // appearance point rather than sprinting in from wherever it stopped.
        primed = false;
        raf = window.requestAnimationFrame(tick);
        return;
      }

      // Direction memory — retains last motion direction when at rest so the
      // crescent stays oriented after the cursor stops moving.
      if (v.speed > IDLE_VELOCITY_THRESHOLD) {
        const inv = 1 / v.speed;
        dir.x = v.vx * inv;
        dir.y = v.vy * inv;
      }

      // Per-frame velocity decay so a rapid drag that ends without a follow-up
      // slow move still lets idleness rise (otherwise isMoving stays pinned
      // true because velocity stays at its last sampled value).
      v.vx *= VELOCITY_DECAY;
      v.vy *= VELOCITY_DECAY;
      v.speed = Math.hypot(v.vx, v.vy);

      // Idleness low-pass — drives the crescent magnitude and the isMoving
      // hysteresis (scan-line / label fade) without flicker on brief pauses.
      const targetIdle = v.speed < IDLE_VELOCITY_THRESHOLD ? 1 : 0;
      idleness += (targetIdle - idleness) * IDLENESS_SMOOTHING;

      // Crescent offset — ONE vector, applied identically to the head and every
      // ghost below. Small while moving (cursor inside radar), large at rest
      // (cursor on the ring edge). The chain integrates in cursor-space; this
      // offset just slides the whole assembly as a rigid unit, so the head and
      // all ghosts share the exact same displacement with no per-link lag.
      const offMag = CRESCENT_INSIDE + (CRESCENT_OUTSIDE - CRESCENT_INSIDE) * idleness;
      const offX = -dir.x * offMag;
      const offY = -dir.y * offMag;

      // Chain anchor is the raw cursor; the crescent is added only at render.
      const headX = cx;
      const headY = cy;
      rx.set(headX + offX);
      ry.set(headY + offY);

      // ---- Chain integration ----
      // First frame after the cursor appears: collapse every link onto the
      // head so the chain doesn't visibly sprint in from the -9999 sentinel.
      if (!primed) {
        for (let i = 0; i < GHOST_COUNT; i++) {
          chain.pos[i].x = headX; chain.pos[i].y = headY;
          chain.vel[i].x = 0;     chain.vel[i].y = 0;
          chain.gx[i].set(headX + offX); chain.gy[i].set(headY + offY);
        }
        primed = true;
        lastTickTime = now;
      } else {
        // Clamp dt so a tab-switch frame drop can't make a single Euler step
        // overshoot and blow up — 1/30s is the worst-case integrator window.
        const dt = Math.min((now - lastTickTime) / 1000, 1 / 30);
        lastTickTime = now;

        // Sequential update: i reads pos[i-1] AFTER pos[i-1] was just
        // integrated this frame. This is what gives the chain its order
        // invariant — link i is always pulled toward the up-to-date upstream.
        for (let i = 0; i < GHOST_COUNT; i++) {
          const srcX = i === 0 ? headX : chain.pos[i - 1].x;
          const srcY = i === 0 ? headY : chain.pos[i - 1].y;
          const p = chain.pos[i];
          const vv = chain.vel[i];
          const ax = (-k * (p.x - srcX) - c * vv.x) / m;
          const ay = (-k * (p.y - srcY) - c * vv.y) / m;
          vv.x += ax * dt; vv.y += ay * dt;
          p.x  += vv.x * dt; p.y  += vv.y * dt;
          // Same crescent offset as the head — assembly slides as one unit.
          chain.gx[i].set(p.x + offX);
          chain.gy[i].set(p.y + offY);
        }
      }

      const isMovingNow = idleness < IS_MOVING_HYSTERESIS;
      if (isMovingNow !== lastIsMoving) {
        lastIsMoving = isMovingNow;
        setIsMoving(isMovingNow);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
    // mx/my/rx/ry are stable refs from useMotionValue; `chain` is a stable
    // ref-held container.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return {
    mx, my, rx, ry,
    gx: chain.gx, gy: chain.gy,
    velocity, scene, hover, isDown, isMoving, active,
  };
}
