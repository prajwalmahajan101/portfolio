import { useEffect, useState } from 'react';
import { m, useSpring, type MotionValue } from 'motion/react';
import {
  GHOST_CHAIN_SPRING,
  GHOST_OPACITIES,
  GHOST_SCALES,
  HEAD_SPRING,
  METRICS_INTERVAL_MS,
  METRICS_ROTATION,
  RADAR_R,
  SCAN_LINE_PERIOD_MS,
  SERVICE_NODES,
} from './cursor.constants';
import type { SceneId } from './cursor.types';

interface Props {
  rx: MotionValue<number>;
  ry: MotionValue<number>;
  scene: SceneId;
  isMoving: boolean;
  isHovering: boolean;
}

const STROKE = 1;
const LABEL_OFFSET = 14;
const R = RADAR_R;

export default function RadarFollower({ rx, ry, scene, isMoving, isHovering }: Props) {
  // Head spring — chases the crescent target written by useCursorState.
  const headX = useSpring(rx, HEAD_SPRING);
  const headY = useSpring(ry, HEAD_SPRING);

  // Ghost chain — every link springs off the previous link with the same
  // overdamped config (ratio ≈ 1.05). The cascade is unconditionally stable;
  // at rest every ghost converges to the head, during motion each link lags
  // the previous by ~50 ms producing a visible 8-radar tail.
  const g0x = useSpring(headX, GHOST_CHAIN_SPRING); const g0y = useSpring(headY, GHOST_CHAIN_SPRING);
  const g1x = useSpring(g0x,   GHOST_CHAIN_SPRING); const g1y = useSpring(g0y,   GHOST_CHAIN_SPRING);
  const g2x = useSpring(g1x,   GHOST_CHAIN_SPRING); const g2y = useSpring(g1y,   GHOST_CHAIN_SPRING);
  const g3x = useSpring(g2x,   GHOST_CHAIN_SPRING); const g3y = useSpring(g2y,   GHOST_CHAIN_SPRING);
  const g4x = useSpring(g3x,   GHOST_CHAIN_SPRING); const g4y = useSpring(g3y,   GHOST_CHAIN_SPRING);
  const g5x = useSpring(g4x,   GHOST_CHAIN_SPRING); const g5y = useSpring(g4y,   GHOST_CHAIN_SPRING);
  const g6x = useSpring(g5x,   GHOST_CHAIN_SPRING); const g6y = useSpring(g5y,   GHOST_CHAIN_SPRING);
  const g7x = useSpring(g6x,   GHOST_CHAIN_SPRING); const g7y = useSpring(g6y,   GHOST_CHAIN_SPRING);

  const ghostXs = [g0x, g1x, g2x, g3x, g4x, g5x, g6x, g7x];
  const ghostYs = [g0y, g1y, g2y, g3y, g4y, g5y, g6y, g7y];

  return (
    <>
      {ghostXs.map((sx, i) => (
        <RadarGhost
          key={i}
          sx={sx}
          sy={ghostYs[i]}
          scale={GHOST_SCALES[i]}
          opacity={GHOST_OPACITIES[i]}
        />
      ))}
      <RadarHead headX={headX} headY={headY} scene={scene} isMoving={isMoving} isHovering={isHovering} />
    </>
  );
}

// -------------------------------------------------------------------------- //
// RadarGhost — minimal: outer ring + mid ring + crosshair + 4 cardinal dots. //
// -------------------------------------------------------------------------- //

interface GhostProps {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  scale: number;
  opacity: number;
}

function RadarGhost({ sx, sy, scale, opacity }: GhostProps) {
  return (
    <m.div
      aria-hidden
      style={{
        x: sx,
        y: sy,
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9997,
        color: 'hsl(var(--phosphor))',
        opacity,
        willChange: 'transform, opacity',
      }}
    >
      <svg
        width={R * 2 + 8}
        height={R * 2 + 8}
        viewBox={`${-(R + 4)} ${-(R + 4)} ${R * 2 + 8} ${R * 2 + 8}`}
        style={{
          overflow: 'visible',
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        <circle cx={0} cy={0} r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} opacity={0.85} />
        <circle cx={0} cy={0} r={R * 0.6} fill="none" stroke="currentColor" strokeWidth={STROKE * 0.7} opacity={0.45} />
        <line x1={-R} y1={0} x2={R} y2={0} stroke="currentColor" strokeWidth={STROKE * 0.4} opacity={0.35} />
        <line x1={0} y1={-R} x2={0} y2={R} stroke="currentColor" strokeWidth={STROKE * 0.4} opacity={0.35} />
        {[[0, -R], [R, 0], [0, R], [-R, 0]].map(([x, y], i) => (
          <rect key={i} x={x - 1.6} y={y - 1.6} width={3.2} height={3.2} fill="currentColor" />
        ))}
      </svg>
    </m.div>
  );
}

// -------------------------------------------------------------------------- //
// RadarHead — small radar (R=38). Scan-line, service labels, and center      //
// metrics fade in only while the cursor is moving.                           //
// -------------------------------------------------------------------------- //

interface HeadProps {
  headX: MotionValue<number>;
  headY: MotionValue<number>;
  scene: SceneId;
  isMoving: boolean;
  isHovering: boolean;
}

function RadarHead({ headX, headY, scene, isMoving, isHovering }: HeadProps) {
  const [metricIdx, setMetricIdx] = useState(0);
  const nodes = SERVICE_NODES[scene];

  useEffect(() => {
    if (isHovering || !isMoving) return;
    const t = window.setInterval(() => {
      setMetricIdx((i) => (i + 1) % METRICS_ROTATION.length);
    }, METRICS_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [isHovering, isMoving]);

  type Anchor = 'middle' | 'end' | 'start';
  type Baseline = 'alphabetic' | 'middle' | 'hanging';
  const labelPositions: Array<[number, number, Anchor, Baseline]> = [
    [0, -(R + LABEL_OFFSET), 'middle', 'alphabetic'],
    [R + LABEL_OFFSET, 0, 'start', 'middle'],
    [0, R + LABEL_OFFSET + 4, 'middle', 'hanging'],
    [-(R + LABEL_OFFSET), 0, 'end', 'middle'],
  ];

  return (
    <m.div
      aria-hidden
      style={{
        x: headX,
        y: headY,
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9998,
        color: 'hsl(var(--phosphor))',
        willChange: 'transform',
      }}
    >
      <m.svg
        width={R * 2 + 100}
        height={R * 2 + 48}
        viewBox={`${-(R + 50)} ${-(R + 24)} ${R * 2 + 100} ${R * 2 + 48}`}
        style={{ overflow: 'visible', transform: 'translate(-50%, -50%)' }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.95, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Always-on: dot grid (low opacity at rest, brighter while moving) */}
        <m.g
          animate={{ opacity: isMoving ? 0.36 : 0.22 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {Array.from({ length: 7 }).map((_, gy) =>
            Array.from({ length: 7 }).map((_, gx) => {
              const x = -R + (gx * (R * 2)) / 6;
              const y = -R + (gy * (R * 2)) / 6;
              if (x * x + y * y > R * R) return null;
              return <circle key={`${gx}-${gy}`} cx={x} cy={y} r={0.6} fill="currentColor" />;
            }),
          )}
        </m.g>

        {/* Always-on: rings + crosshair + cardinal markers */}
        <circle cx={0} cy={0} r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} opacity={0.78} />
        <circle cx={0} cy={0} r={R * 0.6} fill="none" stroke="currentColor" strokeWidth={STROKE * 0.75} opacity={0.4} />
        <line x1={-R} y1={0} x2={R} y2={0} stroke="currentColor" strokeWidth={STROKE * 0.5} opacity={0.34} />
        <line x1={0} y1={-R} x2={0} y2={R} stroke="currentColor" strokeWidth={STROKE * 0.5} opacity={0.34} />
        {[[0, -R], [R, 0], [0, R], [-R, 0]].map(([x, y], i) => (
          <rect key={i} x={x - 1.8} y={y - 1.8} width={3.6} height={3.6} fill="currentColor" />
        ))}

        {/* Motion-gated: scan-line + sweep wedge */}
        <m.g
          animate={{ opacity: isMoving ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ transformOrigin: '0 0', animation: `cursor-radar-spin ${SCAN_LINE_PERIOD_MS}ms linear infinite` }}
        >
          <line x1={0} y1={0} x2={R} y2={0} stroke="currentColor" strokeWidth={1.3} opacity={0.95} />
          <path
            d={`M 0 0 L ${R} 0 A ${R} ${R} 0 0 0 ${R * Math.cos(-0.5)} ${R * Math.sin(-0.5)} Z`}
            fill="currentColor"
            opacity={0.16}
          />
        </m.g>

        {/* Motion-gated: center metrics */}
        <m.text
          x={0}
          y={2}
          fill="currentColor"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={7.5}
          textAnchor="middle"
          animate={{ opacity: isMoving ? 0.85 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {METRICS_ROTATION[metricIdx]}
        </m.text>

        {/* Motion-gated: service node labels */}
        <m.g
          animate={{ opacity: isMoving ? 0.95 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {nodes.map((label, i) => {
            const [lx, ly, anchor, baseline] = labelPositions[i];
            return (
              <text
                key={label}
                x={lx}
                y={ly}
                fill="currentColor"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fontSize={8.5}
                fontWeight={600}
                textAnchor={anchor}
                dominantBaseline={baseline}
                style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}
              >
                {label}
              </text>
            );
          })}
        </m.g>
      </m.svg>
    </m.div>
  );
}
