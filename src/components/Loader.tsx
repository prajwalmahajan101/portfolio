import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type Line =
  | { type: 'header' }
  | { type: 'spacer' }
  | { type: 'stage'; label: string }
  | { type: 'check'; label: string; status: string; cls?: string }
  | { type: 'progress'; label: string; pct: number }
  | { type: 'banner'; lines: string[] }
  | { type: 'prompt'; text: string }
  | { type: 'meta'; text: string };

const PLAN: Line[] = [
  { type: 'header' },
  { type: 'spacer' },

  { type: 'stage', label: '[stage 1 / POST]' },
  { type: 'check', label: '  cpu  .............', status: '4 vCPU       ok' },
  { type: 'check', label: '  mem  .............', status: '8.0 GiB      ok' },
  { type: 'check', label: '  disk .............', status: '256 GiB      ok' },
  { type: 'spacer' },

  { type: 'stage', label: '[stage 2 / KERNEL]' },
  { type: 'check', label: '  loading tcp/ip ...', status: 'ok' },
  { type: 'check', label: '  dns resolver .....', status: 'ok' },
  { type: 'check', label: '  mounting / .......', status: 'ok' },
  { type: 'spacer' },

  { type: 'stage', label: '[stage 3 / FS]' },
  { type: 'progress', label: '  mount /skills      ', pct: 100 },
  { type: 'progress', label: '  mount /projects    ', pct: 100 },
  { type: 'progress', label: '  mount /experience  ', pct: 100 },
  { type: 'spacer' },

  { type: 'stage', label: '[stage 4 / SVC]' },
  { type: 'check', label: '  starting gateway          ', status: '[ ok ]' },
  { type: 'check', label: '  starting valkey           ', status: '[ ok ]' },
  { type: 'check', label: '  starting mqtt-broker      ', status: '[ ok ]' },
  { type: 'check', label: '  starting rag-worker       ', status: '[ ok ]' },
  { type: 'check', label: '  starting circuit-breaker  ', status: '[ ok ]' },
  { type: 'spacer' },

  { type: 'stage', label: '[stage 5 / NET]' },
  { type: 'check', label: '  handshake partner-acme    ', status: '200 OK (42ms)' },
  { type: 'check', label: '  handshake account-aggreg  ', status: '200 OK (118ms)' },
  { type: 'check', label: '  webhook signer online     ', status: 'ok' },
  { type: 'spacer' },

  { type: 'stage', label: '[stage 6 / READY]' },
  { type: 'meta', text: '  uptime 0d 0h 0m' },
  { type: 'meta', text: '  last incident: never' },
  { type: 'meta', text: '  available — selective consulting' },
  { type: 'spacer' },

  { type: 'prompt', text: 'service-mesh@portfolio:~$ ./show-me-the-work' },
];

const HEADER_BANNER = [
  '  ╔══════════════════════════════╗',
  '  ║  PORTFOLIO v0.2  ·  PRAJWAL  ║',
  '  ║  service-mesh@bengaluru:~$   ║',
  '  ╚══════════════════════════════╝',
];

export default function Loader() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [revealed, setRevealed] = useState(prefersReducedMotion ? PLAN.length : 0);
  const [skipped, setSkipped] = useState(false);

  const dismiss = useCallback(() => {
    setSkipped(true);
    setTimeout(() => setVisible(false), 250);
  }, []);

  // Step through lines on a slow tick. Total budget ~7s for the full sequence.
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (revealed >= PLAN.length) {
      const final = setTimeout(() => setVisible(false), 700);
      return () => clearTimeout(final);
    }
    // Variable per-line delay — bigger pauses around stage headers.
    const next = PLAN[revealed];
    const delay = next.type === 'stage' ? 180 : next.type === 'spacer' ? 70 : 150;
    const t = setTimeout(() => setRevealed((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [revealed, prefersReducedMotion]);

  // Esc to skip.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismiss]);

  const lines = useMemo(() => PLAN.slice(0, revealed), [revealed]);
  const done = revealed >= PLAN.length;

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="loader"
          initial={{ opacity: 1 }}
          animate={{ opacity: skipped ? 0 : 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-background"
        >
          {/* faint terminal scanlines layered behind */}
          <div className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.14] [background:repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,hsl(var(--phosphor)/0.5)_2px,hsl(var(--phosphor)/0.5)_3px)]" />
          <div className="grain pointer-events-none absolute inset-0 opacity-25" />

          <button
            type="button"
            onClick={dismiss}
            className="absolute right-4 top-4 z-10 rounded-full border border-border bg-background/60 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary md:right-6 md:top-6"
          >
            skip →
          </button>

          <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:left-6 md:top-6">
            press <span className="text-primary">esc</span> to skip
          </div>

          <div className="relative w-full max-w-[640px] px-6 font-mono text-[11px] leading-[1.55] md:text-[13px]">
            <pre className="phosphor-text mb-3 select-none whitespace-pre text-[10px] leading-[1.2] md:text-[12px]" aria-hidden>
{HEADER_BANNER.join('\n')}
            </pre>

            {lines.map((line, i) => {
              const key = `${line.type}-${i}`;
              switch (line.type) {
                case 'header':
                  return null;
                case 'spacer':
                  return <div key={key} className="h-2" />;
                case 'stage':
                  return (
                    <m.div
                      key={key}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="phosphor-text font-semibold"
                    >
                      {line.label}
                    </m.div>
                  );
                case 'check':
                  return (
                    <m.div
                      key={key}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="phosphor-text flex items-baseline"
                    >
                      <span className="whitespace-pre text-[hsl(var(--phosphor-dim))]">{line.label}</span>
                      <span className={line.cls ?? 'text-[hsl(var(--phosphor))]'}>{line.status}</span>
                    </m.div>
                  );
                case 'progress':
                  return (
                    <m.div
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="phosphor-text flex items-baseline"
                    >
                      <span className="whitespace-pre text-[hsl(var(--phosphor-dim))]">{line.label}</span>
                      <ProgressBar pct={line.pct} />
                    </m.div>
                  );
                case 'meta':
                  return (
                    <m.div
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="text-[hsl(var(--phosphor-dim))]"
                    >
                      {line.text}
                    </m.div>
                  );
                case 'prompt':
                  return (
                    <m.div
                      key={key}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="phosphor-text mt-2 flex items-center gap-1"
                    >
                      <span>{line.text}</span>
                      <span className="inline-block h-[14px] w-[8px] animate-[terminal-cursor_1s_steps(2,end)_infinite] bg-current" />
                    </m.div>
                  );
                default:
                  return null;
              }
            })}
            {!done && (
              <div className="phosphor-text mt-1">
                <span className="inline-block h-[12px] w-[7px] animate-[terminal-cursor_0.7s_steps(2,end)_infinite] bg-current" />
              </div>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const filled = Math.round((pct / 100) * 10);
  const empty = 10 - filled;
  return (
    <span className="text-[hsl(var(--phosphor))]">
      [<span className="text-[hsl(var(--phosphor))]">{'#'.repeat(filled)}</span>
      <span className="text-[hsl(var(--phosphor-dim))]">{' '.repeat(empty)}</span>] {pct}%
    </span>
  );
}
