import { useEffect, useRef } from 'react';
import { type MotionValue } from 'motion/react';
import { useTheme } from '@/components/theme-provider';
import {
  PARTICLE_POOL_SIZE,
  REQUEST_POOL,
  REQUEST_SPAWN_INTERVAL_MS,
  TRAIL_SPAWN_PER_VELOCITY,
} from './cursor.constants';
import type { Particle } from './cursor.types';

interface Props {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  velocity: React.MutableRefObject<{ vx: number; vy: number; speed: number }>;
  isDown: boolean;
}

function readPhosphor(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--phosphor').trim();
  return v || '38 95% 62%';
}

export default function TrailCanvas({ mx, my, velocity, isDown }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phosphorRef = useRef<string>('38 95% 62%');
  const { theme } = useTheme();

  // Update phosphor on theme change (or mount)
  useEffect(() => {
    // Wait a tick so the new theme class is applied to <html>
    const id = window.requestAnimationFrame(() => {
      phosphorRef.current = readPhosphor();
    });
    return () => window.cancelAnimationFrame(id);
  }, [theme]);

  // Burst on click
  const burstRef = useRef(false);
  useEffect(() => {
    if (isDown) burstRef.current = true;
  }, [isDown]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pool: free slots are life<=0
    const pool: Particle[] = Array.from({ length: PARTICLE_POOL_SIZE }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1, size: 0, kind: 'trail',
    }));
    const recycle = (): Particle | null => pool.find((p) => p.life <= 0) ?? null;

    let lastRequest = performance.now();
    let raf = 0;

    const tick = () => {
      const cx = mx.get();
      const cy = my.get();
      const v = velocity.current;
      const speed = Math.min(v.speed * 60, 6); // normalize per-frame
      const now = performance.now();

      // Spawn trail particles based on speed
      if (cx > -1000) {
        const want = Math.floor(speed * TRAIL_SPAWN_PER_VELOCITY);
        for (let i = 0; i < want; i++) {
          const p = recycle();
          if (!p) break;
          p.x = cx + (Math.random() - 0.5) * 2;
          p.y = cy + (Math.random() - 0.5) * 2;
          p.vx = -v.vx * 18 + (Math.random() - 0.5) * 0.6;
          p.vy = -v.vy * 18 + (Math.random() - 0.5) * 0.6;
          p.life = 1;
          p.maxLife = 0.75 + Math.random() * 0.45;
          p.size = 1.6 + Math.random() * 1.4;
          p.kind = 'trail';
          p.text = undefined;
        }
      }

      // Burst on click
      if (burstRef.current) {
        burstRef.current = false;
        for (let i = 0; i < 14; i++) {
          const p = recycle();
          if (!p) break;
          const a = (i / 14) * Math.PI * 2;
          const s = 1.2 + Math.random() * 1.4;
          p.x = cx;
          p.y = cy;
          p.vx = Math.cos(a) * s * 60;
          p.vy = Math.sin(a) * s * 60;
          p.life = 1;
          p.maxLife = 0.55;
          p.size = 2.4 + Math.random() * 1.2;
          p.kind = 'burst';
          p.text = undefined;
        }
      }

      // Request-stream text particle every ~REQUEST_SPAWN_INTERVAL_MS, only while moving
      if (cx > -1000 && now - lastRequest > REQUEST_SPAWN_INTERVAL_MS && speed > 0.4) {
        lastRequest = now;
        const p = recycle();
        if (p) {
          p.x = cx;
          p.y = cy + 14;
          p.vx = -v.vx * 8;
          p.vy = -v.vy * 8 - 0.2;
          p.life = 1;
          p.maxLife = 1.6;
          p.size = 10;
          p.kind = 'request';
          p.text = REQUEST_POOL[Math.floor(Math.random() * REQUEST_POOL.length)];
        }
      }

      // Clear with slight alpha for motion blur look
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const phos = phosphorRef.current;
      // Draw particles
      for (const p of pool) {
        if (p.life <= 0) continue;
        // integrate
        const dt = 1 / 60;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.life -= dt / p.maxLife;
        if (p.life <= 0) continue;
        const alpha = Math.max(0, p.life);

        if (p.kind === 'request' && p.text) {
          ctx.font = '600 10px JetBrains Mono, ui-monospace, monospace';
          ctx.fillStyle = `hsla(${phos.split(' ').join(', ')}, ${alpha * 0.85})`;
          ctx.shadowColor = `hsla(${phos.split(' ').join(', ')}, ${alpha * 0.4})`;
          ctx.shadowBlur = 6;
          ctx.fillText(p.text, p.x, p.y);
          ctx.shadowBlur = 0;
        } else {
          const size = p.size * (p.kind === 'burst' ? 1 : alpha + 0.3);
          ctx.fillStyle = `hsla(${phos.split(' ').join(', ')}, ${alpha * 0.85})`;
          ctx.shadowColor = `hsla(${phos.split(' ').join(', ')}, ${alpha * 0.6})`;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [mx, my, velocity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9997,
      }}
    />
  );
}
