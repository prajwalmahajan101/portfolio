import { useEffect, useState } from 'react';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface QueueMsg {
  id: string;
  ts: string;
  topic: string;
  type: string;
  status: 'ack' | 'pending' | 'retry';
}

const TOPICS = [
  'co-lending.outbound',
  'fleet.amr.state',
  'gateway.audit',
  'rag.embedding.upsert',
  'webhook.signed',
  'scheduler.cron',
  'aa.consent.granted',
];

const TYPES = [
  'ApplicationSubmitted',
  'PartnerPushQueued',
  'AmrZoneChanged',
  'ClauseExtracted',
  'WebhookSent',
  'TrialExpired',
  'ConsentRenewed',
  'CircuitTrippedOpen',
];

const STATUSES: QueueMsg['status'][] = ['ack', 'ack', 'ack', 'pending', 'ack', 'retry'];

function pad(n: number, w = 2) {
  return n.toString().padStart(w, '0');
}

function nowTs(): string {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

function randomMsg(): QueueMsg {
  return {
    id: Math.random().toString(36).slice(2, 8),
    ts: nowTs(),
    topic: TOPICS[Math.floor(Math.random() * TOPICS.length)],
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
  };
}

const STATUS_CLASS: Record<QueueMsg['status'], string> = {
  ack: 'text-[hsl(var(--phosphor-info))]',
  pending: 'text-[hsl(var(--phosphor-dim))]',
  retry: 'text-[hsl(var(--phosphor-warn))]',
};

const STATUS_GLYPH: Record<QueueMsg['status'], string> = {
  ack: '✓ ack',
  pending: '… pending',
  retry: '↻ retry',
};

interface Props {
  className?: string;
  /** How many rows visible at once. */
  rows?: number;
  /** Interval between new msgs (ms). */
  interval?: number;
}

export default function MessageQueue({ className, rows = 7, interval = 1800 }: Props) {
  const reduced = useReducedMotion();
  const [msgs, setMsgs] = useState<QueueMsg[]>(() => Array.from({ length: rows }, randomMsg));

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => {
      setMsgs((prev) => [randomMsg(), ...prev].slice(0, rows));
    }, interval);
    return () => clearInterval(t);
  }, [reduced, rows, interval]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-card/70 backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-block h-2 w-2 animate-[terminal-cursor_1.5s_steps(2,end)_infinite] rounded-full bg-primary" />
          live · outbound queue
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          throughput <span className="text-primary">10K+/s</span>
        </div>
      </div>
      <ul className="divide-y divide-border/40 font-mono">
        <AnimatePresence initial={false}>
          {msgs.map((msg, i) => (
            <m.li
              key={msg.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: i === 0 ? 1 : 1 - i * 0.05, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2.5 text-[10.5px] md:text-[11px]"
            >
              <span className="text-[hsl(var(--phosphor-dim))]">[{msg.ts}]</span>
              <span className="truncate">
                <span className="text-[hsl(var(--phosphor))]">▸ {msg.topic}</span>{' '}
                <span className="text-foreground/80">type=</span>
                <span className="text-foreground">{msg.type}</span>
              </span>
              <span className={cn('whitespace-nowrap font-semibold', STATUS_CLASS[msg.status])}>
                {STATUS_GLYPH[msg.status]}
              </span>
            </m.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
