import { useState } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { Check, Copy, Github, Linkedin, Mail } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { profile, education } from '@/data/resume';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" data-scene="contact" className="section-veil relative px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="mb-12 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <span className="inline-block h-px w-10 bg-primary" />
          06 — Portal
        </Reveal>

        <Reveal className="mb-20">
          <h2 className="font-display text-balance text-[clamp(2.75rem,9vw,8rem)] font-medium leading-[0.92] tracking-[-0.04em]">
            Let's build something
            <br />
            <span className="italic text-muted-foreground">resilient.</span>
          </h2>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <div className="hover-rise relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-1/3 -top-1/3 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
                style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent 70%)' }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Primary channel
              </span>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={`mailto:${profile.email}`}
                      data-cursor="hover"
                      data-cursor-label="POST /messages · 200 OK"
                      aria-label={`Email ${profile.email} — opens your mail client with a fresh draft`}
                      className="group font-display text-2xl tracking-tight md:text-4xl"
                    >
                      {profile.email}
                      <span className="block h-[1px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="border-primary/40 bg-background/95 normal-case tracking-[0.06em]">
                    <span className="text-primary">▸</span>{' '}
                    <span className="text-foreground/90">opens your mail client with a fresh draft</span>
                  </TooltipContent>
                </Tooltip>
                <Button onClick={copy} variant="outline" size="sm" aria-label="Copy email to clipboard">
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <m.span
                        key="copied"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="inline-flex items-center gap-2"
                      >
                        <Check className="h-3.5 w-3.5" /> Copied
                      </m.span>
                    ) : (
                      <m.span
                        key="copy"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="inline-flex items-center gap-2"
                      >
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </m.span>
                    )}
                  </AnimatePresence>
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild>
                      <a
                        href={`mailto:${profile.email}`}
                        data-cursor="hover"
                        data-cursor-label="POST /messages · ready"
                        aria-label="Send email — opens a draft to prajwal directly"
                      >
                        <Mail className="h-4 w-4" /> Send email
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border-primary/40 bg-background/95 normal-case tracking-[0.06em]">
                    <span className="text-primary">▸</span>{' '}
                    <span className="text-foreground/90">opens a draft to prajwal directly</span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline">
                      <a
                        href={profile.links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="hover"
                        data-cursor-label="connect · linkedin"
                        aria-label="LinkedIn — recent work, endorsements, and timeline"
                      >
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border-primary/40 bg-background/95 normal-case tracking-[0.06em]">
                    <span className="text-primary">▸</span>{' '}
                    <span className="text-foreground/90">recent work, endorsements, and timeline</span>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline">
                      <a
                        href={profile.links.github}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="hover"
                        data-cursor-label="git remote · github"
                        aria-label="GitHub — source for this portfolio site and code samples"
                      >
                        <Github className="h-4 w-4" /> GitHub
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="border-primary/40 bg-background/95 normal-case tracking-[0.06em]">
                    <span className="text-primary">▸</span>{' '}
                    <span className="text-foreground/90">source for this portfolio site and code samples</span>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="md:col-span-5">
            <div className="hover-rise flex h-full flex-col justify-between gap-8 rounded-2xl border border-border/60 p-8 md:p-10">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Education</span>
                <h3 className="mt-3 font-display text-xl tracking-tight">{education.school}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {education.degree} · {education.year}
                </p>
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Currently</span>
                <p className="mt-3 text-sm text-muted-foreground">
                  Senior Full Stack Developer at <span className="text-foreground">Optimo Capitals</span>. Open to selective
                  consulting around distributed-systems work and resilient backend architecture.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <footer className="mt-24 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Prajwal Mahajan — Built in Bengaluru</span>
          <span>v0.1 · React · R3F · GSAP · Motion</span>
        </footer>
      </div>
    </section>
  );
}
