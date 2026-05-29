import { useEffect, useState } from 'react';
import { m, useMotionValue, useSpring } from 'motion/react';
import { isTouch } from '@/lib/gpu';

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const xs = useSpring(x, { damping: 30, stiffness: 320, mass: 0.4 });
  const ys = useSpring(y, { damping: 30, stiffness: 320, mass: 0.4 });

  useEffect(() => {
    if (isTouch()) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const enter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="hover"]')) setHovering(true);
    };
    const leave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [data-cursor="hover"]')) setHovering(false);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', enter);
    document.addEventListener('mouseout', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', enter);
      document.removeEventListener('mouseout', leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <m.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary mix-blend-difference"
        style={{ x, y }}
      />
      <m.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[99] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60 mix-blend-difference"
        style={{ x: xs, y: ys }}
        animate={{ scale: hovering ? 1.8 : 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 260 }}
      />
    </>
  );
}
