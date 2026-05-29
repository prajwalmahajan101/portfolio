import { Reveal, Stagger } from '@/components/Reveal';
import { m } from 'motion/react';
import CountUp from '@/components/CountUp';
import { stats, profile } from '@/data/resume';

export default function About() {
  return (
    <section id="about" className="section-veil relative px-6 py-32 md:px-10 md:py-40">
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
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-5 md:pt-6">
            <p className="text-pretty text-base text-muted-foreground md:text-lg">
              Mechanical engineer by degree, distributed-systems engineer by trade. Most recently sole architect of a five-service
              co-lending platform at Optimo Capitals — gateway, partner-push engine, webapp, Lambda triage, and the Docker / nginx
              deploy stack.
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Currently in {profile.location}.
            </p>
          </Reveal>
        </div>

        <Stagger className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border md:grid-cols-4">
          {stats.map((s) => (
            <m.div
              key={s.label}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="group relative flex flex-col gap-3 overflow-hidden bg-card p-8 transition-colors hover:bg-card/70"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{s.label}</span>
              <CountUp
                to={Number(s.value)}
                suffix={s.suffix ?? ''}
                className="font-display text-5xl leading-none tracking-tight"
              />
            </m.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
