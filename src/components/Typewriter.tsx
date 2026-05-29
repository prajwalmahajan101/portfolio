import { useEffect, useState } from 'react';
import { m } from 'motion/react';
import { cn } from '@/lib/utils';

interface TypewriterProps {
  text: string;
  className?: string;
  delay?: number;
  cps?: number; // characters per second
  cursor?: boolean;
}

export default function Typewriter({ text, className, delay = 0, cps = 28, cursor = true }: TypewriterProps) {
  const [n, setN] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started || n >= text.length) return;
    const step = setTimeout(() => setN((v) => v + 1), 1000 / cps);
    return () => clearTimeout(step);
  }, [n, started, text.length, cps]);

  const done = n >= text.length;

  return (
    <m.span
      aria-label={text}
      className={cn('inline-flex items-baseline gap-[2px]', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: started ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <span aria-hidden>{text.slice(0, n)}</span>
      {cursor && (
        <span
          aria-hidden
          className={cn(
            'inline-block h-[0.9em] w-[2px] translate-y-[1px] bg-current',
            done ? 'animate-[terminal-cursor_1s_steps(2,end)_infinite]' : 'opacity-100',
          )}
        />
      )}
    </m.span>
  );
}
