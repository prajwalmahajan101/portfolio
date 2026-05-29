import { useEffect, useState } from 'react';
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from './ui/sheet';
import { cn } from '@/lib/utils';

const links = [
  { href: '#about', label: 'About' },
  { href: '#architecture', label: 'Architecture' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    // Hide on scroll down past 200px, reveal on scroll up — but never hide the menu is open.
    if (!open) setHidden(y > 200 && y > prev);
  });

  useEffect(() => {
    // ensure body scroll resumes if the sheet is closed
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.18em] focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <m.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 transition-[backdrop-filter,background,padding,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-10',
          scrolled && 'glass border-b border-border/60 py-3',
        )}
      >
        <a href="#top" className="group flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em]">
          <span className="inline-block h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))] transition-transform group-hover:scale-125" />
          <span className="hidden sm:inline">Prajwal Mahajan</span>
          <span className="sm:hidden">PM</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em]">
                  <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  Navigate
                </SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-2 pb-6">
                {links.map((l, idx) => (
                  <li key={l.href}>
                    <AnimatePresence>
                      <m.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.04 } }}
                      >
                        <SheetClose asChild>
                          <a
                            href={l.href}
                            className="block rounded-lg px-4 py-3 font-display text-2xl tracking-tight text-foreground transition-colors hover:bg-secondary hover:text-primary"
                          >
                            <span className="mr-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                              0{idx + 1}
                            </span>
                            {l.label}
                          </a>
                        </SheetClose>
                      </m.div>
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-border/60 p-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                <span className="text-primary">●</span> Available — selective consulting
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </m.nav>
    </>
  );
}
