import { m } from 'motion/react';
import { ArrowDownRight, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Typewriter from '@/components/Typewriter';
import EC2InstanceCard from '@/components/EC2InstanceCard';
import { profile } from '@/data/resume';

const tags = ['Distributed Systems', 'Microservices', 'AI / LLM', 'Resilience'];

export default function Hero() {
  return (
    <section id="top" data-scene="hero" className="relative flex min-h-[100svh] items-end overflow-hidden px-6 pb-16 pt-32 md:px-10 md:pb-24">
      <div className="pointer-events-none absolute inset-0 grain opacity-20" aria-hidden />
      {/* Soft amber halo bottom-left — anchors the headline against the live log */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(var(--phosphor) / 0.45), transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-col gap-12">
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="inline-block h-px w-10 bg-primary" />
          <Typewriter
            text={`${profile.location.toLowerCase()} · available — selective consulting`}
            delay={0.8}
            cps={40}
            className="phosphor-text"
          />
        </m.div>

        <m.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="font-display text-balance text-[clamp(3rem,11vw,9rem)] font-medium leading-[0.92] tracking-[-0.04em]"
        >
          Backend systems
          <br />
          you can{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-tr from-[hsl(var(--phosphor))] via-[hsl(var(--accent))] to-[hsl(var(--phosphor-warn))] bg-clip-text italic text-transparent">
              trust under load.
            </span>
            <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-gradient-to-r from-[hsl(var(--phosphor))] via-[hsl(var(--accent))] to-transparent" />
          </span>
        </m.h1>

        <div className="grid gap-12 md:grid-cols-12">
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            className="md:col-span-6 md:col-start-1 text-pretty text-base text-muted-foreground md:text-lg"
          >
            {profile.summary}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.05 }}
            className="md:col-span-5 md:col-start-8 flex flex-col gap-6"
          >
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href="#projects" data-cursor="hover">
                  See selected work
                  <ArrowDownRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon">
                <a href={`mailto:${profile.email}`} aria-label="Email">
                  <Mail className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </m.div>
        </div>

        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 grid gap-6 md:grid-cols-12"
        >
          <div className="md:col-span-7 lg:col-span-6">
            <EC2InstanceCard />
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-12 flex items-center justify-between border-t border-border/60 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span>// service-mesh.online</span>
          <span className="hidden md:block">5 nodes · 99.5% uptime · sub-100ms p95</span>
          <span>scroll ↓</span>
        </m.div>
      </div>
    </section>
  );
}
