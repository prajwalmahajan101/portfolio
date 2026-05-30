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
export const TRAIL_SPAWN_PER_VELOCITY = 0.6;
export const SECTION_THROTTLE_MS = 120;
export const HUD_DEBOUNCE_MS = 60;
export const METRICS_INTERVAL_MS = 3000;
export const REQUEST_SPAWN_INTERVAL_MS = 2000;
export const SCAN_LINE_PERIOD_MS = 2500;

export const SPRING = { stiffness: 140, damping: 18, mass: 0.6 };
