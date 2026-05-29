import { useEffect, useRef } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';
import { ThemeProvider } from './components/theme-provider';
import { TooltipProvider } from './components/ui/tooltip';
import Nav from './components/Nav';
import ScrollProgress from './components/ScrollProgress';
import Loader from './components/Loader';
import Marquee from './components/Marquee';
import TerminalBackground from './components/TerminalBackground';
import Hero from './sections/Hero';
import About from './sections/About';
import Architecture from './sections/Architecture';
import Skills from './sections/Skills';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Contact from './sections/Contact';

const marqueeItems = [
  'Distributed Systems',
  'Resilient Microservices',
  'AWS · Docker · GitHub Actions',
  'PostgreSQL · Redis · MQTT',
  'LangChain · GPT-4 · RAG',
  'Available for selective consulting',
];

export default function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll backbone (Locomotive + ScrollTrigger). Async so initial paint is fast.
    let cleanup: (() => void) | undefined;
    import('./lib/scroll').then(({ initScroll }) => {
      initScroll(scrollContainerRef.current).then((h) => {
        cleanup = h.destroy;
      });
    });
    return () => cleanup?.();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <LazyMotion features={domAnimation}>
        <TooltipProvider delayDuration={200}>
          <Loader />
          <ScrollProgress />

          {/* Phosphor terminal — fixed background, all CSS, no R3F */}
          <TerminalBackground />

          <Nav />

          <main ref={scrollContainerRef} data-scroll-container className="relative z-10">
            <Hero />

            <div className="border-y border-border/60 bg-background/80 py-6 backdrop-blur-sm">
              <Marquee items={marqueeItems} />
            </div>

            <About />
            <Architecture />
            <Skills />
            <Experience />
            <Projects />
            <Contact />
          </main>
        </TooltipProvider>
      </LazyMotion>
    </ThemeProvider>
  );
}
