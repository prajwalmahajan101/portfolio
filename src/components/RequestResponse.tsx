import { useRef } from 'react';
import { m, useScroll, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';
import type { SequenceStep } from '@/data/resume';

interface Props {
  lanes: readonly string[];
  sequence: SequenceStep[];
  className?: string;
}

/**
 * Swim-lane sequence diagram. Each step is a labelled arrow from one lane
 * to another. The arrow's path is drawn-on via motion `pathLength`, driven
 * by a scroll progress shared by the container.
 *
 * The detail card under each step reveals when that step's path is at least
 * half-drawn.
 */
export default function RequestResponse({ lanes, sequence, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.3'] });
  const progress = useSpring(scrollYProgress, { damping: 30, stiffness: 120, mass: 0.6 });

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* swim lane headers */}
      <div
        className="grid items-center gap-2 border-b border-border/60 pb-3"
        style={{ gridTemplateColumns: `repeat(${lanes.length}, minmax(0, 1fr))` }}
      >
        {lanes.map((l) => (
          <div key={l} className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:text-[11px]">
            <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-2.5 py-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />
              <span className="text-foreground">{l}</span>
            </div>
          </div>
        ))}
      </div>

      {/* vertical lane lines */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[44px] grid"
        style={{ gridTemplateColumns: `repeat(${lanes.length}, minmax(0, 1fr))`, height: `${sequence.length * 96}px` }}
      >
        {lanes.map((_, i) => (
          <div key={i} className="relative">
            <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border/40 [background-image:linear-gradient(to_bottom,transparent_0,transparent_3px,hsl(var(--border))_3px,hsl(var(--border))_6px)] [background-size:1px_6px]" />
          </div>
        ))}
      </div>

      {/* steps */}
      <ol className="relative space-y-12 pt-8">
        {sequence.map((step, i) => {
          const fromIdx = lanes.indexOf(step.from);
          const toIdx = lanes.indexOf(step.to);
          const start = (i / sequence.length);
          const end = ((i + 1) / sequence.length);
          const dir = toIdx >= fromIdx ? 1 : -1;
          const minIdx = Math.min(fromIdx, toIdx);
          const span = Math.abs(toIdx - fromIdx);
          return (
            <Step
              key={i}
              index={i}
              total={sequence.length}
              step={step}
              lanesCount={lanes.length}
              startIdx={minIdx}
              span={span}
              direction={dir}
              progress={progress}
              window={[start, end]}
            />
          );
        })}
      </ol>
    </div>
  );
}

interface StepProps {
  index: number;
  total: number;
  step: SequenceStep;
  lanesCount: number;
  startIdx: number;
  span: number;
  direction: 1 | -1;
  progress: import('motion/react').MotionValue<number>;
  window: [number, number];
}

function Step({ step, lanesCount, startIdx, span, direction, progress, window: [w0, w1] }: StepProps) {
  // local progress: 0 at w0, 1 at w1
  const local = useTransform(progress, [w0, w0 + (w1 - w0) * 0.05, w1 * 0.95 + w0 * 0.05, w1], [0, 0, 1, 1]);
  const drawLen = useTransform(local, [0, 1], [0, 1]);
  const detailOpacity = useTransform(local, [0.45, 0.7], [0, 1]);
  const detailY = useTransform(local, [0.45, 0.7], [8, 0]);

  const leftPct = ((startIdx + 0.5) / lanesCount) * 100;
  const widthPct = (span / lanesCount) * 100;

  return (
    <li className="relative grid grid-cols-1">
      <div className="relative h-12">
        {/* arrow track */}
        <svg
          aria-hidden
          width="100%"
          height="48"
          className="absolute inset-0 overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <marker id={`arr-${startIdx}-${direction}-${step.label}`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L6,4 L0,8 Z" fill="hsl(var(--phosphor))" />
            </marker>
          </defs>
          <m.line
            x1={direction === 1 ? `${leftPct}%` : `${leftPct + widthPct}%`}
            x2={direction === 1 ? `${leftPct + widthPct}%` : `${leftPct}%`}
            y1="24"
            y2="24"
            stroke="hsl(var(--phosphor))"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            style={{ pathLength: drawLen }}
            markerEnd={`url(#arr-${startIdx}-${direction}-${step.label})`}
          />
        </svg>

        {/* step label sitting on the arrow */}
        <m.div
          style={{ left: `${leftPct + widthPct / 2}%`, opacity: local }}
          className="absolute top-0 -translate-x-1/2 -translate-y-1 rounded-full border border-border bg-background/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground backdrop-blur-sm md:text-[11px]"
        >
          {step.label}{' '}
          {step.timing && (
            <span className="text-[hsl(var(--phosphor))]">· {step.timing}</span>
          )}
        </m.div>
      </div>

      {step.detail && (
        <m.p
          style={{ opacity: detailOpacity, y: detailY }}
          className="mx-auto max-w-[60ch] text-pretty text-center text-[12px] leading-relaxed text-muted-foreground md:text-[13.5px]"
        >
          {step.detail}
        </m.p>
      )}
    </li>
  );
}
