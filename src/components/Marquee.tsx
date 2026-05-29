import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface MarqueeProps {
  items: ReactNode[];
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

const speedMap = { slow: '60s', normal: '40s', fast: '24s' } as const;

export default function Marquee({ items, className, speed = 'normal' }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={cn('relative overflow-hidden', className)} aria-hidden>
      <div
        className="flex w-max gap-12 animate-marquee"
        style={{ animationDuration: speedMap[speed] }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-12 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {item}
            <span className="h-1 w-1 rounded-full bg-primary/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
