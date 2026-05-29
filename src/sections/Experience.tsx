import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Badge } from '@/components/ui/badge';
import { experience } from '@/data/resume';
import { cn } from '@/lib/utils';

export default function Experience() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="experience"
      data-scene="experience"
      className="section-veil relative px-6 py-32 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-10 bg-primary" />
          04 — Deployment Timeline
        </Reveal>

        <Reveal className="mb-20 max-w-3xl">
          <h2 className="font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.03em]">
            Four years, four teams, one thing in common:{' '}
            <span className="italic text-muted-foreground">systems that stay up.</span>
          </h2>
        </Reveal>

        <div className="relative border-l border-border/60 md:ml-6">
          {experience.map((role, idx) => {
            const open = openIdx === idx;
            return (
              <Reveal key={role.company} delay={idx * 0.05}>
                <article className="relative pl-8 pb-16 md:pl-14">
                  <span
                    className={cn(
                      'absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary transition-all',
                      open && 'shadow-[0_0_0_4px_hsl(var(--primary)/0.2)]',
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => setOpenIdx(open ? null : idx)}
                    data-cursor="hover"
                    className="group flex w-full flex-col gap-3 text-left md:flex-row md:items-baseline md:justify-between"
                  >
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        {role.start} → {role.end}
                      </span>
                      <h3 className="mt-2 font-display text-2xl tracking-tight md:text-3xl">
                        {role.title}
                        <span className="text-muted-foreground"> · {role.company}</span>
                      </h3>
                      <span className="font-mono text-xs text-muted-foreground">{role.location}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 text-muted-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        open && 'rotate-180 text-primary',
                      )}
                    />
                  </button>

                  <p className="mt-5 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                    {role.narrative}
                  </p>

                  <AnimatePresence initial={false}>
                    {open && (
                      <m.div
                        key="achievements"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-7 pt-8">
                          {role.achievements.map((a, i) => (
                            <m.li
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                              className="grid gap-3 md:grid-cols-[80px_1fr]"
                            >
                              <Badge variant="outline" className="h-fit w-fit shrink-0">
                                {String(i + 1).padStart(2, '0')}
                              </Badge>
                              <div className="space-y-3">
                                <h4 className="font-display text-lg leading-tight tracking-tight md:text-xl">
                                  {a.headline}
                                </h4>
                                <p className="text-pretty text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                                  {a.detail}
                                </p>
                                {a.metrics && a.metrics.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-1">
                                    {a.metrics.map((metric) => (
                                      <Badge key={metric} variant="primary">
                                        {metric}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </m.li>
                          ))}
                        </ul>
                      </m.div>
                    )}
                  </AnimatePresence>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
