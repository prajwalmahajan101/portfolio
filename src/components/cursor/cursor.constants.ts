import type { SceneId } from './cursor.types';

export const SERVICE_NODES: Record<SceneId, [string, string, string, string]> = {
  hero:         ['API', 'DB', 'CACHE', 'QUEUE'],
  about:        ['ROLE', 'STACK', 'LOCATION', 'STATUS'],
  architecture: ['Kafka', 'Redis', 'Postgres', 'FastAPI'],
  skills:       ['Python', 'Go', 'TypeScript', 'Rust'],
  experience:   ['AWS', 'EC2', 'Lambda', 'Docker'],
  projects:     ['Bedrock', 'Claude', 'RAG', 'Embeddings'],
  contact:      ['/contact', '/resume', '/github', '/linkedin'],
};

export const METRICS_ROTATION = [
  '2.4k req/min',
  '128ms avg',
  '99.9% uptime',
  'p99 240ms',
  '0 errors',
];

export const REQUEST_POOL = [
  'GET /api/users',
  'POST /auth/login',
  'PUT /loans/42',
  'GET /resume.pdf',
  'DELETE /sessions',
  'POST /webhooks/bhn',
  'GET /health',
  'PATCH /cases/77',
];

export const MAGNET_RADIUS_PX = 40;
export const MAGNET_LERP = 0.2;
export const PARTICLE_POOL_SIZE = 60;
export const TRAIL_SPAWN_PER_VELOCITY = 0.35;
export const SECTION_THROTTLE_MS = 120;
export const HUD_DEBOUNCE_MS = 60;
export const METRICS_INTERVAL_MS = 3000;
export const REQUEST_SPAWN_INTERVAL_MS = 2000;
export const SCAN_LINE_PERIOD_MS = 2500;

export const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };

// Radar ghost trail: each ghost springs DIRECTLY off the head's smoothed
// position (independent fan, not a chain). Chaining springs through other
// springs accumulates energy and overshoots wildly on rapid cursor moves —
// the independent fan stays stable because each ghost is a single 2nd-order
// system tracking the same head signal with its own time constant.
//
// All configs are overdamped (ratio ≥ 1.08) → no overshoot. Stiffness drops
// geometrically so each ghost lags progressively more, forming a clear tail.
export const GHOST_COUNT = 5;
export const GHOST_SCALES = [0.78, 0.6, 0.46, 0.36, 0.28] as const;
export const GHOST_OPACITIES = [0.55, 0.32, 0.18, 0.1, 0.06] as const;
export const GHOST_SPRINGS = [
  { stiffness: 100, damping: 18, mass: 0.7 },  // ratio ~1.08 (light over) — arrives nearly with head
  { stiffness:  70, damping: 18, mass: 0.8 },  // ratio ~1.20
  { stiffness:  50, damping: 18, mass: 0.9 },  // ratio ~1.34
  { stiffness:  35, damping: 18, mass: 1.0 },  // ratio ~1.52
  { stiffness:  25, damping: 18, mass: 1.1 },  // ratio ~1.72 (well over) — lazy tail
] as const;
