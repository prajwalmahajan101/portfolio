import { Reveal, Stagger } from '@/components/Reveal';
import { m } from 'motion/react';
import CountUp from '@/components/CountUp';
import MessageQueue from '@/components/MessageQueue';
import { stats, profile } from '@/data/resume';

export default function About() {
  return (
    <section id="about" data-scene="about" className="section-veil relative px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-10 bg-primary" />
          01 — Telemetry
        </Reveal>

        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <h2 className="font-display text-balance text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
              I build the kind of backend that{' '}
              <span className="italic text-muted-foreground">fails clean</span> — circuit breakers, idempotency, database-enforced
              invariants.
            </h2>
            <p className="mt-8 text-pretty text-base text-muted-foreground md:text-lg">
              {profile.summary}
            </p>
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-5">
            <MessageQueue className="h-full" />
          </Reveal>
        </div>

        <Stagger className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => {
            const parsedPrimary = parseFloat(s.primary);
            const isInt = Number.isInteger(parsedPrimary) && !s.primary.includes('.');
            return (
              <m.div
                key={s.caption}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="group relative flex min-h-[220px] flex-col justify-between gap-4 overflow-hidden bg-card p-7 transition-colors hover:bg-card/70"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="font-display text-[3.5rem] leading-[0.92] tracking-tight">
                  {isInt ? (
                    <CountUp to={parsedPrimary} suffix={s.primarySuffix} />
                  ) : (
                    <span>
                      {s.primary}
                      <span className="text-primary">{s.primarySuffix}</span>
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-pretty text-[13px] leading-snug text-foreground/85">{s.caption}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    <span className="text-primary">▸</span> {s.source}
                  </p>
                </div>
              </m.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
