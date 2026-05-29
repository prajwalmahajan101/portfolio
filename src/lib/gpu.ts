export const hasWebGPU = (): boolean => typeof navigator !== 'undefined' && 'gpu' in navigator;

export const isMobile = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

export const isTouch = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
