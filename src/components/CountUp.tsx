import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
}

export default function CountUp({ to, duration = 1.8, className, suffix }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return controls.stop;
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString()}
      {suffix && <span className="text-primary">{suffix}</span>}
    </span>
  );
}
