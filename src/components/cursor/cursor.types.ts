export type SceneId =
  | 'hero'
  | 'about'
  | 'architecture'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'contact';

export interface CursorHoverTarget {
  el: Element;
  rect: DOMRect;
  label: string;
  kind: 'link' | 'button' | 'card' | 'generic';
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  kind: 'trail' | 'burst' | 'request';
  text?: string;
}
