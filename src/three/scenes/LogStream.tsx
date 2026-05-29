import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Group, MathUtils } from 'three';
import { useReducedMotion } from 'motion/react';

const LOG_LINES = [
  '2026-05-29T16:42:18Z  gateway       POST   /co-lending/applications     8ms   200',
  '2026-05-29T16:42:18Z  gateway       SQL    CHECK + BEFORE INSERT        11ms  ok',
  '2026-05-29T16:42:19Z  partner-push  STAGE  04 docs.upload concurrency=6 ok',
  '2026-05-29T16:42:19Z  partner-push  STAGE  05 case.commit               ok',
  '2026-05-29T16:42:19Z  partner-push  STAGE  06 status.poll               ok',
  '2026-05-29T16:42:19Z  partner-push  BHN    AHFC-exists recovered        idem',
  '2026-05-29T16:42:20Z  valkey        CACHE  hit ratio=0.78 ttl=120s',
  '2026-05-29T16:42:20Z  valkey        RATE   burst tier ok user=u_7af3',
  '2026-05-29T16:42:21Z  webapp        AUTH   jwt refresh user=u_7af3',
  '2026-05-29T16:42:21Z  webapp        REST   GET /leads/payload=2.1kb     112ms ok',
  '2026-05-29T16:42:22Z  email_analysis SNS   bedrock.classify intent=ack  92ms',
  '2026-05-29T16:42:22Z  email_analysis HMAC  webhook verified sig=sha256',
  '2026-05-29T16:42:23Z  gateway       SES    notify underwriter id=u_881',
  '2026-05-29T16:42:24Z  synoriq       READ   borrower payload bytes=8421',
  '2026-05-29T16:42:24Z  synofin       DOCS   presigned-url ttl=300s',
  '2026-05-29T16:42:25Z  partner-push  IDEMP  durable_id committed         skip-dup',
  '2026-05-29T16:42:26Z  gateway       CB     pybreaker(closed) calls=2.1k',
  '2026-05-29T16:42:26Z  gateway       AUDIT  ImportSession id=s_18 ok',
  '2026-05-29T16:42:27Z  webapp        ROUTE  /push?case=c_902 → partner   X-API-Key',
  '2026-05-29T16:42:27Z  email_analysis LLM   ollama fallback=false',
  '2026-05-29T16:42:28Z  gateway       CELERY broker=valkey queue=push     ok',
  '2026-05-29T16:42:29Z  partner-push  HTTPX  POST bhn/v2/case 224ms       201',
  '2026-05-29T16:42:30Z  colending-ops CI    repository-dispatch deploy-gateway',
  '2026-05-29T16:42:31Z  gateway       SQL    durable_id UNIQUE ok         row=lock',
  '2026-05-29T16:42:31Z  webapp        TQ     mutate(/leads) cache invalidate',
  '2026-05-29T16:42:32Z  valkey        BROKER celery.enqueue payload=1.2kb',
  '2026-05-29T16:42:33Z  gateway       SSRF   blocked egress→169.254.169.254',
  '2026-05-29T16:42:34Z  email_analysis DLQ   sns→s3 retries=5 reason=4xx',
  '2026-05-29T16:42:35Z  partner-push  STAGE  07 status.reconcile ok',
  '2026-05-29T16:42:36Z  gateway       OBS    cloudwatch traceId=tr_44ce',
];

// Each column's vertical configuration. z<0 → behind, z>0 → in front. Far
// columns dimmer and a touch slower so the eye reads near/far.
const COLUMNS = [
  { x: -3.4, z: -1.6, speed: 0.32, scale: 0.52, opacity: 0.18, seed: 0 },
  { x: -1.4, z: -0.4, speed: 0.42, scale: 0.62, opacity: 0.28, seed: 7 },
  { x:  1.2, z:  0.4, speed: 0.50, scale: 0.66, opacity: 0.38, seed: 14 },
  { x:  3.5, z: -0.9, speed: 0.36, scale: 0.55, opacity: 0.22, seed: 21 },
];

const ROW_GAP = 0.22;
const ROWS_PER_COLUMN = 18;
const COLUMN_HEIGHT = ROW_GAP * ROWS_PER_COLUMN;

interface Row {
  text: string;
  baseY: number;
}

function buildColumn(seed: number): Row[] {
  return Array.from({ length: ROWS_PER_COLUMN }, (_, i) => ({
    text: LOG_LINES[(i + seed) % LOG_LINES.length],
    baseY: i * ROW_GAP,
  }));
}

export default function LogStream() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();
  const reduced = useReducedMotion();

  const columns = useMemo(
    () => COLUMNS.map((c) => ({ ...c, rows: buildColumn(c.seed) })),
    [],
  );

  useFrame((_, dt) => {
    if (!group.current) return;
    // very subtle horizontal sway from pointer for life
    const targetY = MathUtils.degToRad(-4) + pointer.x * 0.04;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 3, dt);
  });

  return (
    <group ref={group} rotation={[0, MathUtils.degToRad(-4), 0]}>
      {columns.map((col, ci) => (
        <Column key={ci} {...col} paused={!!reduced} />
      ))}
    </group>
  );
}

interface ColumnProps {
  x: number;
  z: number;
  speed: number;
  scale: number;
  opacity: number;
  rows: Row[];
  paused: boolean;
}

function Column({ x, z, speed, scale, opacity, rows, paused }: ColumnProps) {
  const inner = useRef<Group>(null);
  const offset = useRef(0);

  useFrame((_, dt) => {
    if (!inner.current) return;
    if (!paused) offset.current = (offset.current + dt * speed) % COLUMN_HEIGHT;
    inner.current.position.y = offset.current;
  });

  return (
    <group position={[x, -COLUMN_HEIGHT / 2 - 0.4, z]}>
      <group ref={inner}>
        {rows.map((r, i) => {
          // wrap each row so the column always feels infinite
          const y = ((r.baseY - 0 + COLUMN_HEIGHT) % COLUMN_HEIGHT) - COLUMN_HEIGHT / 2;
          // fade rows near top/bottom edges
          const edgeFade = (yy: number) => {
            const half = COLUMN_HEIGHT / 2;
            const dist = Math.abs(yy);
            const fadeStart = half - 0.6;
            return MathUtils.clamp(1 - (dist - fadeStart) / 0.6, 0, 1);
          };
          const op = opacity * edgeFade(y);
          return (
            <Text
              key={i}
              position={[0, y + COLUMN_HEIGHT / 2, 0]}
              fontSize={0.085 * scale}
              color="hsl(38, 95%, 65%)"
              anchorX="left"
              anchorY="middle"
              maxWidth={6.4 * scale}
              fillOpacity={op}
              letterSpacing={0.02}
              outlineWidth={0}
            >
              {r.text}
            </Text>
          );
        })}
      </group>
    </group>
  );
}
