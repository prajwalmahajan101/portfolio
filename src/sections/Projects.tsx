import { useState } from 'react';
import { m } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { projects, type Project } from '@/data/resume';

const accentMap: Record<Project['accent'], string> = {
  lime: 'hsl(38, 95%, 62%)',
  ember: 'hsl(18, 90%, 60%)',
  violet: 'hsl(48, 85%, 65%)',
  cyan: 'hsl(28, 80%, 55%)',
  rose: 'hsl(14, 80%, 58%)',
};

export default function Projects() {
  return (
    <section
      id="projects"
      data-scene="projects"
      className="section-veil relative px-6 py-32 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-10 bg-primary" />
          05 — Worlds
        </Reveal>

        <Reveal className="mb-20 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-balance text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            Selected projects.
            <br />
            <span className="italic text-muted-foreground">Each one ships in production.</span>
          </h2>
          <p className="max-w-sm text-pretty text-sm text-muted-foreground">
            Five recent systems — co-lending, robotics, RAG, real-time, encrypted transport. Tap a card for the architecture, the
            problem, the approach and the result.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-12">
          {projects.map((p, idx) => (
            <ProjectCard key={p.slug} project={p} idx={idx} accent={accentMap[p.accent]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, idx, accent }: { project: Project; idx: number; accent: string }) {
  const [open, setOpen] = useState(false);
  const span =
    idx % 5 === 0
      ? 'md:col-span-7'
      : idx % 5 === 1
      ? 'md:col-span-5'
      : idx % 5 === 2
      ? 'md:col-span-5'
      : idx % 5 === 3
      ? 'md:col-span-7'
      : 'md:col-span-12';

  return (
    <Reveal delay={idx * 0.06} className={`col-span-12 ${span}`}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <m.button
            whileHover={{ y: -4 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            data-cursor="hover"
            className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/80 p-8 text-left backdrop-blur-sm transition-colors hover:border-primary/40 md:p-10"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-1/4 -top-1/2 h-[400px] w-[400px] rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
              style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
            />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {String(idx + 1).padStart(2, '0')} / {projects.length.toString().padStart(2, '0')}
              </span>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <div className="relative z-10 mt-12 flex flex-col gap-4">
              <h3 className="font-display text-3xl leading-[0.95] tracking-tight md:text-4xl">{project.name}</h3>
              <p className="text-pretty text-sm text-muted-foreground md:text-base">{project.tagline}</p>
              <p className="text-pretty text-xs text-foreground/80 md:text-sm">{project.result}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.stack.slice(0, 5).map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
                {project.stack.length > 5 && <Badge variant="outline">+{project.stack.length - 5}</Badge>}
              </div>
            </div>
          </m.button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Project · {String(idx + 1).padStart(2, '0')} / {projects.length.toString().padStart(2, '0')}
            </span>
            <DialogTitle className="pt-2">{project.name}</DialogTitle>
            <DialogDescription>{project.tagline}</DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Badge key={s} variant="primary">
                {s}
              </Badge>
            ))}
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <Section tag="Problem" body={project.problem} />
            <Section tag="Approach" body={project.approach} />
            <Section tag="Result" body={project.result} primary />
          </div>

          <details className="mt-6 rounded-lg border border-border/60 bg-background/40 p-4 backdrop-blur-sm">
            <summary className="cursor-pointer select-none font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground">
              show implementation details ↘
            </summary>
            <ul className="mt-4 space-y-3">
              {project.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-[13px] leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </details>
        </DialogContent>
      </Dialog>
    </Reveal>
  );
}

function Section({ tag, body, primary }: { tag: string; body: string; primary?: boolean }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className={primary ? 'text-primary' : 'text-foreground/60'}>▸</span> {tag}
      </div>
      <p className="mt-2 text-pretty text-[13px] leading-relaxed text-foreground/90">{body}</p>
    </div>
  );
}
