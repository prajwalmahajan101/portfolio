import { m } from 'motion/react';
import { Reveal, Stagger } from '@/components/Reveal';
import { skills } from '@/data/resume';

export default function Skills() {
  return (
    <section id="skills" data-scene="skills" className="section-veil relative px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-10 bg-primary" />
          03 — Service Registry
        </Reveal>

        <Reveal className="mb-20 max-w-3xl">
          <h2 className="font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            A toolkit shaped by{' '}
            <span className="italic text-muted-foreground">production incidents</span>, not tutorials.
          </h2>
        </Reveal>

        <div className="space-y-12">
          {skills.map((group) => (
            <Reveal key={group.category}>
              <div className="grid gap-6 border-t border-border/60 pt-8 md:grid-cols-12">
                <div className="md:col-span-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    /{group.category.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}
                  </span>
                  <h3 className="mt-2 font-display text-2xl tracking-tight">{group.category}</h3>
                </div>
                <Stagger
                  stagger={0.04}
                  className="md:col-span-9 grid auto-rows-min grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                >
                  {group.items.map((item) => (
                    <m.span
                      key={item}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                      }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      data-cursor="hover"
                      className="flex cursor-default items-center justify-center rounded-full border border-border bg-card/80 px-3 py-2.5 text-center font-mono text-[11px] text-foreground/90 ring-1 ring-foreground/[0.03] backdrop-blur-sm transition-colors hover:border-primary/60 hover:bg-card hover:text-primary"
                    >
                      {item}
                    </m.span>
                  ))}
                </Stagger>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
