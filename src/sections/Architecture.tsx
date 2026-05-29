import { Reveal } from '@/components/Reveal';
import RequestResponse from '@/components/RequestResponse';
import { architectureLanes, architectureSequence } from '@/data/resume';

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
            How a single loan request flows through{' '}
            <span className="italic text-muted-foreground">five services</span>.
          </h2>
          <p className="mt-6 text-pretty text-base text-muted-foreground md:text-lg">
            One real path through the co-lending platform — gateway, valkey, partner-push, Postgres, lambda-triage.
            Scroll to walk each step; the arrows draw at their actual timing and the trail tells the failure story.
          </p>
        </Reveal>

        <div className="overflow-x-auto rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm md:p-10">
          <RequestResponse
            lanes={architectureLanes}
            sequence={architectureSequence}
            className="min-w-[760px]"
          />
        </div>

        <Reveal className="mt-12 grid gap-6 md:grid-cols-3">
          <Pillar
            tag="Why this works"
            title="Invariants live in Postgres"
            body="CHECK constraints and BEFORE INSERT/UPDATE triggers reject malformed state at the database. The gateway, admin shell, bulk_create and raw-SQL paths all hit the same guardrails — no application-level enforcement to forget."
          />
          <Pillar
            tag="Why this works"
            title="Idempotency is durable"
            body="The partner-push engine commits a durable_id before the HTTP call. A crash between commit and call is safe: replay sees the commit and skips the duplicate. Partner downtime never produces double-applications."
          />
          <Pillar
            tag="Why this works"
            title="Async tail closes the loop"
            body="Hours later, the lender replies via email. Lambda mail-triage classifies the intent and posts back to the gateway. The whole loop is event-driven from that point on — no human polling, no missed updates."
          />
        </Reveal>
      </div>
    </section>
  );
}

function Pillar({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-6 backdrop-blur-sm">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="text-primary">▸</span> {tag}
      </div>
      <h3 className="mt-2 font-display text-xl tracking-tight">{title}</h3>
      <p className="mt-3 text-pretty text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
