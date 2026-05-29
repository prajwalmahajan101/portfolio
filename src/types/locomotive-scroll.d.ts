declare module 'locomotive-scroll' {
  export interface LocomotiveScrollOptions {
    el?: HTMLElement;
    smooth?: boolean;
    multiplier?: number;
    lerp?: number;
    smartphone?: { smooth?: boolean };
    tablet?: { smooth?: boolean; breakpoint?: number };
    [k: string]: unknown;
  }
  export default class LocomotiveScroll {
    constructor(options?: LocomotiveScrollOptions);
    scroll: { instance: { scroll: { y: number } } };
    on(event: string, cb: (...args: unknown[]) => void): void;
    scrollTo(target: number | string | HTMLElement, opts?: { duration?: number; disableLerp?: boolean }): void;
    update(): void;
    destroy(): void;
  }
}
