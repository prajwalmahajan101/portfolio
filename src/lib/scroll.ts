import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollHandle {
  destroy: () => void;
}

/**
 * Native scroll only for v1. Locomotive Scroll v4 requires `data-scroll-section`
 * on every section and is currently throwing `getTranslate` errors against
 * our layout. The Phosphor Terminal background, motion useScroll progress bar,
 * and CSS scroll-behavior smooth give us a polished feel without it.
 *
 * GSAP ScrollTrigger plugin is still registered so future pinned timelines
 * (project carousel, hero camera dolly) can attach to window scroll.
 */
export async function initScroll(_container: HTMLElement | null = null): Promise<ScrollHandle> {
  return { destroy: () => {} };
}
