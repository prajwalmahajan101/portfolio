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

// Radar head — smaller than v1/v2. Position is the crescent target written
// by useCursorState; the spring config is shared with the rest of the chain
// (see CHAIN_SPRING below) so the whole 9-link cascade feels homogeneous.
export const RADAR_R = 38;

// 8-ghost trail forming a chain with the head: head springs off the crescent
// target, ghost[0] springs off the head, ghost[i] springs off ghost[i-1].
// Every link uses the SAME spring config — the head's only difference from a
// ghost is its scale, detail, and the fact that the cursor sits on it.
export const GHOST_COUNT = 8;
export const GHOST_SCALES    = [0.88, 0.76, 0.66, 0.56, 0.48, 0.40, 0.32, 0.24] as const;
export const GHOST_OPACITIES = [0.85, 0.70, 0.58, 0.46, 0.36, 0.26, 0.16, 0.08] as const;

// One spring config used by every link in the chain (head + 8 ghosts). Damping
// ratio ζ ≈ 1.05 (light overdamp) — each link is non-oscillating, so the
// 9-link cascade cannot resonate even on whip-back direction reversals.
// Per-link time constant ≈ 52 ms; total chain lag ≈ 470 ms.
export const CHAIN_SPRING = { stiffness: 200, damping: 23, mass: 0.6 };

// Velocity ref isn't otherwise reset between pointermove events, so a rapid
// drag that ends without a subsequent slow move keeps velocity pinned high
// (idleness never rises, crescent never forms). Decay per RAF frame fixes it.
export const VELOCITY_DECAY = 0.86;

// Crescent geometry — cursor sits OUTSIDE the radar when idle (forms a moon),
// INSIDE the radar (biased toward motion direction) when moving fast.
export const CRESCENT_INSIDE  = RADAR_R * 0.45;  // distance from radar center to cursor at full motion
export const CRESCENT_OUTSIDE = RADAR_R + 8;     // distance from radar center to cursor at full rest

// Idleness scalar (0 = full motion, 1 = full idle) drives crescent + label fade.
export const IDLE_VELOCITY_THRESHOLD = 0.04; // px/ms — below this, cursor is idle
export const IDLENESS_SMOOTHING = 0.08;      // per-frame low-pass smoothing
export const IS_MOVING_HYSTERESIS = 0.55;    // isMoving = idleness < this (drives scan/label fade)
