export type LogLevel = 'INFO' | 'WARN' | 'DEBUG' | 'OK' | 'TRACE';

export interface LogLine {
  ts: string; // formatted HH:MM:SS.mmm
  level: LogLevel;
  service: string;
  msg: string;
}

const services = [
  'gateway',
  'partner-push',
  'valkey',
  'mqtt-broker',
  'rag-worker',
  'extract-pipeline',
  'fleet-router',
  'webhook-signer',
  'scheduler',
  'circuit-breaker',
  'aa-consent',
  'lambda-triage',
];

// Hand-seeded so the log feels authored, not procedural-mush.
const seedLines: Omit<LogLine, 'ts'>[] = [
  { level: 'INFO', service: 'gateway', msg: 'partner_push ok latency=122ms' },
  { level: 'INFO', service: 'valkey', msg: 'rate.limit.tier=burst remaining=412/500' },
  { level: 'TRACE', service: 'gateway', msg: 'idempotency_key=01HZAQ… reused=false' },
  { level: 'INFO', service: 'partner-push', msg: 'lender=ACME signed=hmac-sha256 nonce=fresh' },
  { level: 'OK', service: 'extract-pipeline', msg: 'ec.parse → ownership_chain=7 hops' },
  { level: 'WARN', service: 'circuit-breaker', msg: 'partner=BETA half_open after=30s failures=3' },
  { level: 'INFO', service: 'mqtt-broker', msg: 'topic=/amr/+/state qos=1 inflight=1024' },
  { level: 'TRACE', service: 'fleet-router', msg: 'amr=AMR-042 zone=B7 task=pickup' },
  { level: 'INFO', service: 'rag-worker', msg: 'chunk=512 embed=ada-002 dim=1536' },
  { level: 'OK', service: 'rag-worker', msg: 'clause_qa contract=lease-2026 conf=0.94' },
  { level: 'DEBUG', service: 'webhook-signer', msg: 'replay_window=300s nonce=verified' },
  { level: 'INFO', service: 'scheduler', msg: 'trial.expired tenants=14 notified=ok' },
  { level: 'INFO', service: 'gateway', msg: 'circuit=closed since=00:14:02 errs=0' },
  { level: 'WARN', service: 'valkey', msg: 'evicted key=sess:9f3e:rate ttl=expired' },
  { level: 'INFO', service: 'aa-consent', msg: 'fip=ICICI consent=ACTIVE expires=180d' },
  { level: 'OK', service: 'lambda-triage', msg: 'mail.classified intent=lender_reply' },
  { level: 'TRACE', service: 'gateway', msg: 'ssrf.guard host=10.0.0.0/8 blocked=true' },
  { level: 'INFO', service: 'fleet-router', msg: 'fleet.health amrs=100 online=99 lag<100ms' },
  { level: 'DEBUG', service: 'partner-push', msg: 'fernet.rotate kid=2026-05 grace=24h' },
  { level: 'INFO', service: 'extract-pipeline', msg: 'motd.detect pages=42 ms=380' },
  { level: 'OK', service: 'gateway', msg: 'p95=87ms p99=141ms rps=312' },
  { level: 'INFO', service: 'rag-worker', msg: 'prompt=tpl:redline.v17 tokens=2.4k' },
  { level: 'WARN', service: 'mqtt-broker', msg: 'client=AMR-013 reconnect attempts=2' },
  { level: 'TRACE', service: 'circuit-breaker', msg: 'probe partner=GAMMA result=ok' },
  { level: 'INFO', service: 'scheduler', msg: 'cron=*/5 job=stripe.dunning sent=22' },
  { level: 'OK', service: 'gateway', msg: 'uptime=99.5% window=24h' },
  { level: 'DEBUG', service: 'valkey', msg: 'pubsub.fanout subs=14 lag=2ms' },
  { level: 'INFO', service: 'extract-pipeline', msg: 'prior_mortgage detected encumbrance=2' },
  { level: 'INFO', service: 'fleet-router', msg: 'task.assign amr=AMR-077 path=hops:6' },
  { level: 'OK', service: 'webhook-signer', msg: 'webhook.fire partners=8 retries=0' },
  { level: 'TRACE', service: 'gateway', msg: 'durable_id=co_01HZ… commit=ok rollback=none' },
  { level: 'INFO', service: 'rag-worker', msg: 'cot.steps=5 chain=clause→risk→summary' },
  { level: 'INFO', service: 'aa-consent', msg: 'fetch.txns days=90 anonymized=true' },
  { level: 'WARN', service: 'scheduler', msg: 'job=fcm.push backlog=412 drained=ok' },
  { level: 'OK', service: 'lambda-triage', msg: 'cold_start=812ms warm=18ms' },
  { level: 'INFO', service: 'gateway', msg: 'auth.jwt iss=optimo aud=internal exp=15m' },
  { level: 'DEBUG', service: 'circuit-breaker', msg: 'tiered.rate user=premium=120rps' },
  { level: 'INFO', service: 'fleet-router', msg: 'collision.avoidance triggers=0 last=4h' },
  { level: 'OK', service: 'rag-worker', msg: 'doc.compare clauses=412 diffs=37' },
  { level: 'INFO', service: 'mqtt-broker', msg: 'broker.throughput msgs=10120/s loss=0' },
];

function pad(n: number, w = 2) {
  return n.toString().padStart(w, '0');
}

function formatTs(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}

/**
 * Deterministic-ish timestamps drifting back from "now" so each line looks
 * slightly older than the one above it. Cycles after one full pass.
 */
export function buildLines(count = seedLines.length, startOffsetMs = 0): LogLine[] {
  const now = Date.now() - startOffsetMs;
  return Array.from({ length: count }, (_, i) => {
    const seed = seedLines[i % seedLines.length];
    const d = new Date(now - i * 813); // ~0.8s between lines, avoids round numbers
    return { ...seed, ts: formatTs(d) };
  });
}

export const SERVICES = services;
