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
    <section id="experience" className="section-veil relative px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-16 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-10 bg-primary" />
          03 — Timeline
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
                <article className="relative pl-8 pb-12 md:pl-14">
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

                  <AnimatePresence initial={false}>
                    {open && (
                      <m.ul
                        key="bullets"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 pt-6">
                          {role.bullets.map((b, i) => (
                            <m.li
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                              className="flex gap-3 text-pretty text-sm text-muted-foreground md:text-base"
                            >
                              <Badge variant="outline" className="mt-1 h-fit shrink-0">
                                {String(i + 1).padStart(2, '0')}
                              </Badge>
                              <span>{b}</span>
                            </m.li>
                          ))}
                        </div>
                      </m.ul>
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
