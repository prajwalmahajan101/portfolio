import { useEffect, useState } from 'react';

/**
 * Tracks the section currently most visible in the viewport via
 * IntersectionObserver. Sections are identified by a `data-scene`
 * attribute on the <section> element.
 */
export function useActiveSection(defaultScene = 'hero'): string {
  const [active, setActive] = useState(defaultScene);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry with the highest visible ratio
        let bestRatio = 0;
        let bestScene: string | null = null;
        entries.forEach((entry) => {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestScene = entry.target.getAttribute('data-scene');
          }
        });
        // Only update if we found a clear winner.
        if (bestScene && bestRatio > 0.2) setActive(bestScene);
      },
      {
        threshold: [0, 0.2, 0.4, 0.6, 0.8],
        rootMargin: '-10% 0px -30% 0px',
      },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}
