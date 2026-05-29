import { Reveal } from '@/components/Reveal';
import ArchitectureScene from '@/components/ArchitectureScene';
import { architectureMap } from '@/data/resume';

export default function Architecture() {
  return (
    <section
      id="architecture"
      data-scene="architecture"
      className="section-veil relative px-6 py-32 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-10 bg-primary" />
          02 — Architecture in Action
        </Reveal>

        <Reveal className="mb-20 max-w-3xl">
          <h2 className="font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            The actual platform —{' '}
            <span className="italic text-muted-foreground">five services, two LOS feeds, one AI tail.</span>
          </h2>
          <p className="mt-6 text-pretty text-base text-muted-foreground md:text-lg">
            Watch one co-lending case flow through the platform in five steps — ingest from the LOS, work in the
            webapp, triage email replies, push to the partner, and operate through the deploy hub. Each animated
            packet is colour-coded by transport: solid amber for sync REST, dashed green for async, dotted ember
            for event-driven webhooks.
          </p>
        </Reveal>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm md:p-10">
          <ArchitectureScene map={architectureMap} />
        </div>

        <Reveal className="mt-12 grid gap-6 md:grid-cols-3">
          <Pillar
            tag="Why this works"
            title="Invariants live in Postgres"
            body="CHECK constraints and BEFORE INSERT/UPDATE triggers reject malformed state right at the database. Gateway requests, the admin shell, bulk_create paths and raw SQL all hit the same guardrails — there is no application-level enforcement to forget to wire up."
          />
          <Pillar
            tag="Why this works"
            title="Idempotency is durable"
            body="The partner-push engine commits a durable_id before it calls BHN. A crash between commit and call is safe — replay sees the commit and skips the duplicate. When BHN already holds the case (HTTP-406 'AHFC exists'), the engine recovers via a stored fallback_case_id and an audit-honest hook records exactly one row marked recovered: true — never a duplicate case at BHN, ever."
          />
          <Pillar
            tag="Why this works"
            title="Async tail closes the loop"
            body="When BHN replies with a pushback email, Gmail Apps Script forwards it to the email_analysis Lambda, which PII-scrubs the body and uses an LLM to break the reason into workable sub-queries. The gateway auto-assigns each sub-query by state, branch and query type; once they all resolve, a consolidated reply ships back to the partner. Event-driven end to end — no human polling, no missed updates."
          />
        </Reveal>
      </div>
    </section>
  );
}

function Pillar({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div
      data-cursor="hover"
      className="hover-rise rounded-xl border border-border/60 bg-background/40 p-6 backdrop-blur-sm"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">▸</span> {tag}
      </div>
      <h3 className="mt-2 font-display text-xl tracking-tight">{title}</h3>
      <p className="mt-3 text-pretty text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
