import { useMemo } from 'react';
import { buildLines, type LogLine, type LogLevel } from '@/data/terminal-lines';
import { cn } from '@/lib/utils';

const LEVEL_CLASS: Record<LogLevel, string> = {
  INFO: 'text-[hsl(var(--phosphor))]',
  OK: 'text-[hsl(var(--phosphor-info))]',
  WARN: 'text-[hsl(var(--phosphor-warn))]',
  DEBUG: 'text-[hsl(var(--phosphor-dim))]',
  TRACE: 'text-[hsl(var(--phosphor-dim))]',
};

const LEVEL_LABEL: Record<LogLevel, string> = {
  INFO: 'INFO ',
  OK: ' OK  ',
  WARN: 'WARN ',
  DEBUG: 'DEBUG',
  TRACE: 'TRACE',
};

function LineRow({ line, dim = false }: { line: LogLine; dim?: boolean }) {
  return (
    <div
      className={cn(
        'flex gap-3 whitespace-nowrap font-mono leading-[1.55] tracking-[-0.01em]',
        'text-[11px] md:text-[12px]',
        dim && 'opacity-60',
      )}
    >
      <span className="text-[hsl(var(--phosphor-dim))]">[{line.ts}]</span>
      <span className={cn('font-semibold', LEVEL_CLASS[line.level])}>{LEVEL_LABEL[line.level]}</span>
      <span className="text-[hsl(var(--phosphor-dim))]">{line.service.padEnd(18, ' ')}</span>
      <span className={LEVEL_CLASS[line.level]}>└─ {line.msg}</span>
    </div>
  );
}

function Column({
  lines,
  duration,
  delay = 0,
  showCursor = false,
}: {
  lines: LogLine[];
  duration: number;
  delay?: number;
  showCursor?: boolean;
}) {
  // Doubled list = seamless infinite scroll loop (CSS `-50%` translate).
  return (
    <div className="relative h-full overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 will-change-transform [animation:terminal-scroll_linear_infinite]"
        style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
      >
        {[...lines, ...lines].map((l, i) => (
          <LineRow key={i} line={l} dim={i >= lines.length} />
        ))}
        {showCursor && (
          <div className="flex items-center gap-2 pt-2 font-mono text-[12px] text-[hsl(var(--phosphor))]">
            <span className="opacity-60">$</span>
            <span className="inline-block h-[14px] w-[8px] animate-[terminal-cursor_1.05s_steps(2,end)_infinite] bg-[hsl(var(--phosphor))]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function TerminalBackground() {
  const colA = useMemo(() => buildLines(28, 0), []);
  const colB = useMemo(() => buildLines(28, 4200), []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 select-none opacity-100 [.light_&]:opacity-100"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-background" />

      {/* Top phosphor warmth */}
      <div
        className="absolute inset-x-0 top-0 h-[40vh] opacity-60 [.light_&]:opacity-60"
        style={{
          background:
            'linear-gradient(to bottom, hsl(var(--phosphor) / 0.06), transparent 80%)',
        }}
      />

      {/* Log columns — extra opacity dial-down on light so the cream paper stays the focus */}
      <div className="absolute inset-0 grid grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:gap-24 md:px-12 md:py-24">
        <div className="phosphor-glow opacity-[0.55] md:opacity-[0.45] [.light_&]:opacity-[0.7] [.light_&]:md:opacity-[0.65]">
          <Column lines={colA} duration={45} showCursor />
        </div>
        <div className="phosphor-glow hidden opacity-[0.35] md:block [.light_&]:opacity-[0.5]">
          <Column lines={colB} duration={60} delay={-15} />
        </div>
      </div>

      {/* Scanlines — drive opacity + color through theme tokens. */}
      <div
        className="absolute inset-0 mix-blend-overlay [.light_&]:mix-blend-multiply"
        style={{
          opacity: 'var(--scanline-opacity)',
          background:
            'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, hsl(var(--scanline-color)) 2px, hsl(var(--scanline-color)) 3px)',
        }}
      />

      {/* Flicker — very subtle, runs at 6Hz; calmer on light */}
      <div className="absolute inset-0 animate-[terminal-flicker_4.2s_infinite] bg-[hsl(var(--phosphor)/0.025)] [.light_&]:bg-[hsl(var(--phosphor)/0.025)]" />

      {/* Bottom fade so log feels like it's coming up out of background */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35vh]"
        style={{
          background:
            'linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.7) 50%, transparent 100%)',
        }}
      />

      {/* CRT vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, hsl(var(--background) / 0.55) 75%, hsl(var(--background)) 100%)',
        }}
      />
    </div>
  );
}
