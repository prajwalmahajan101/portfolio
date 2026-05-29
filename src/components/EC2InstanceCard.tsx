import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Field {
  k: string;
  v: string;
  className?: string;
}

const FIELDS: Field[] = [
  { k: 'instance-id', v: 'i-prajwal-0a3fb6' },
  { k: 'instance-type', v: 't3.senior' },
  { k: 'az', v: 'ap-south-1a (bengaluru)' },
  { k: 'image-id', v: 'ami-backend-2026.05' },
  { k: 'role', v: 'senior backend engineer' },
  { k: 'tags', v: '[Distributed, Microservices, Resilient, Fintech]' },
  { k: 'security-group', v: 'sg-fail-clean' },
  { k: 'last-incident', v: 'never' },
];

function formatUptime(startDate: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - startDate.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remDays = days - years * 365 - months * 30;
  return `${years}y ${months}m ${remDays}d`;
}

interface Props {
  className?: string;
}

export default function EC2InstanceCard({ className }: Props) {
  const [uptime, setUptime] = useState(() => formatUptime(new Date('2022-08-01')));
  useEffect(() => {
    const t = setInterval(() => setUptime(formatUptime(new Date('2022-08-01'))), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-background/60 font-mono text-[11px] backdrop-blur-md md:text-[12px]',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-background/40 px-4 py-2.5">
        <span className="flex items-center gap-2 uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-[hsl(var(--phosphor-info))] shadow-[0_0_8px_hsl(var(--phosphor-info))]" />
          aws ec2 · instance metadata
        </span>
        <span className="text-[hsl(var(--phosphor))]">running</span>
      </div>

      <dl className="divide-y divide-border/40">
        {FIELDS.map((f) => (
          <div key={f.k} className="grid grid-cols-[140px_1fr] gap-4 px-4 py-2">
            <dt className="text-muted-foreground">{f.k}</dt>
            <dd className={cn('text-foreground', f.className)}>{f.v}</dd>
          </div>
        ))}
        <div className="grid grid-cols-[140px_1fr] gap-4 px-4 py-2">
          <dt className="text-muted-foreground">uptime</dt>
          <dd className="text-[hsl(var(--phosphor))]">
            {uptime} <span className="text-[hsl(var(--phosphor-dim))]">· since 2022-08-01</span>
          </dd>
        </div>
      </dl>

      <div className="border-t border-border/60 bg-background/30 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-[hsl(var(--phosphor))]">$</span> aws ec2 describe-instances --instance-id i-prajwal-0a3fb6
      </div>
    </div>
  );
}
