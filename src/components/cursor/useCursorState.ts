import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'motion/react';
import {
  HUD_DEBOUNCE_MS,
  MAGNET_LERP,
  MAGNET_RADIUS_PX,
  SECTION_THROTTLE_MS,
  SPRING,
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
  // raw mouse — drives the caret directly (no React renders)
  mx: MotionValue<number>;
  my: MotionValue<number>;
  // smoothed — drives the radar follower
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  // velocity ref (read each frame in the RAF loop)
  velocity: React.MutableRefObject<{ vx: number; vy: number; speed: number }>;
  // section under the cursor
  scene: SceneId;
  // current hover target (debounced)
  hover: CursorHoverTarget | null;
  // pressed
  isDown: boolean;
  // mounted (gated on touch + reduced-motion)
  active: boolean;
}

export function useCursorState(): CursorState {
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);

  const velocity = useRef({ vx: 0, vy: 0, speed: 0 });
  const lastSample = useRef({ x: 0, y: 0, t: performance.now() });

  const [scene, setScene] = useState<SceneId>('hero');
  const [hover, setHover] = useState<CursorHoverTarget | null>(null);
  const [isDown, setIsDown] = useState(false);
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

  // Mouse / pointer wiring
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

      // Magnetic hover: if a [data-cursor="hover"] target is within MAGNET_RADIUS_PX,
      // pull the caret 20% toward its center.
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

      // Throttled section + hover detection
      if (now - sectionTimer > SECTION_THROTTLE_MS) {
        sectionTimer = now;
        const under = document.elementFromPoint(e.clientX, e.clientY);
        if (under) {
          const sect = under.closest('[data-scene]');
          const id = sect?.getAttribute('data-scene') ?? null;
          if (isSceneId(id)) setScene(id);
        }
      }

      // HUD: find nearest interactive ancestor; debounce updates
      const target2 = e.target instanceof Element
        ? e.target.closest('a, button, [data-cursor], [data-cursor-label]')
        : null;
      if (target2 !== lastHoverEl) {
        lastHoverEl = target2;
        window.clearTimeout(hudTimer);
        hudTimer = window.setTimeout(() => {
          if (!target2) {
            setHover(null);
            return;
          }
          const { label, kind } = deriveLabel(target2);
          if (!label) {
            setHover(null);
            return;
          }
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

  return { mx, my, sx, sy, velocity, scene, hover, isDown, active };
}
