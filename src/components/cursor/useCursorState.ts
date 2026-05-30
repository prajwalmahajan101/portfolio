import { useEffect, useRef, useState } from 'react';
import { useMotionValue, type MotionValue } from 'motion/react';
import {
  CRESCENT_INSIDE,
  CRESCENT_OUTSIDE,
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
  // crescent-offset radar target — head spring lives in RadarFollower
  rx: MotionValue<number>;
  ry: MotionValue<number>;
  // velocity ref — written by pointermove, read by the state-machine RAF
  velocity: React.MutableRefObject<{ vx: number; vy: number; speed: number }>;
  // section under the cursor
  scene: SceneId;
  // current hover target (debounced)
  hover: CursorHoverTarget | null;
  // pressed
  isDown: boolean;
  // gates the scan-line / labels / metrics on the head radar (true while moving)
  isMoving: boolean;
  // mounted (gated on touch + reduced-motion)
  active: boolean;
}

export function useCursorState(): CursorState {
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const rx = useMotionValue(-9999);
  const ry = useMotionValue(-9999);

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

  // State-machine RAF — direction memory, idleness low-pass, velocity decay,
  // crescent radar target. The ghost chain is built inside RadarFollower via
  // chained useSpring calls; there is no ghost-position computation here.
  useEffect(() => {
    if (!active) return;

    const dir = { x: 0, y: -1 };
    let idleness = 1;
    let lastIsMoving = false;
    let raf = 0;

    const tick = () => {
      const cx = mx.get();
      const cy = my.get();
      const v = velocity.current;

      if (cx <= -1000) {
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
      // slow move still lets idleness rise (otherwise the crescent never
      // re-forms because velocity stays pinned at its last sampled value).
      v.vx *= VELOCITY_DECAY;
      v.vy *= VELOCITY_DECAY;
      v.speed = Math.hypot(v.vx, v.vy);

      // Idleness low-pass — smooths the crescent transition between
      // cursor-inside-radar (motion) and cursor-just-outside-radar (rest).
      const targetIdle = v.speed < IDLE_VELOCITY_THRESHOLD ? 1 : 0;
      idleness += (targetIdle - idleness) * IDLENESS_SMOOTHING;

      // Crescent offset: cursor sits INSIDE radar at full motion (offset small,
      // biased toward motion direction), and JUST OUTSIDE radar at rest
      // (offset large, behind the last-motion direction).
      const offMag = CRESCENT_INSIDE + (CRESCENT_OUTSIDE - CRESCENT_INSIDE) * idleness;
      rx.set(cx - dir.x * offMag);
      ry.set(cy - dir.y * offMag);

      const isMovingNow = idleness < IS_MOVING_HYSTERESIS;
      if (isMovingNow !== lastIsMoving) {
        lastIsMoving = isMovingNow;
        setIsMoving(isMovingNow);
      }

      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
    // mx/my/rx/ry are stable refs from useMotionValue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return { mx, my, rx, ry, velocity, scene, hover, isDown, isMoving, active };
}
