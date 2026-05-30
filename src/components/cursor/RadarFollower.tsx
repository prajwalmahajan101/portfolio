import { useEffect, useState } from 'react';
import { m, useSpring, type MotionValue } from 'motion/react';
import {
  GHOST_OPACITIES,
  GHOST_SCALES,
  GHOST_SPRINGS,
  METRICS_INTERVAL_MS,
  METRICS_ROTATION,
  SCAN_LINE_PERIOD_MS,
  SERVICE_NODES,
} from './cursor.constants';
import type { SceneId } from './cursor.types';

interface Props {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  scene: SceneId;
  isHovering: boolean;
}

const R = 56;
const STROKE = 1;
const LABEL_OFFSET = 16;

export default function RadarFollower({ sx, sy, scene, isHovering }: Props) {
  // Independent fan of springs — each ghost tracks the head's smoothed
  // position directly with its own time constant. Chaining (ghost[i] →
  // ghost[i-1]) accumulates energy through the cascade and produces ±9000px
  // overshoots on rapid moves; independent fan is unconditionally stable.
  const g0x = useSpring(sx, GHOST_SPRINGS[0]); const g0y = useSpring(sy, GHOST_SPRINGS[0]);
  const g1x = useSpring(sx, GHOST_SPRINGS[1]); const g1y = useSpring(sy, GHOST_SPRINGS[1]);
  const g2x = useSpring(sx, GHOST_SPRINGS[2]); const g2y = useSpring(sy, GHOST_SPRINGS[2]);
  const g3x = useSpring(sx, GHOST_SPRINGS[3]); const g3y = useSpring(sy, GHOST_SPRINGS[3]);
  const g4x = useSpring(sx, GHOST_SPRINGS[4]); const g4y = useSpring(sy, GHOST_SPRINGS[4]);

  const ghosts: Array<[MotionValue<number>, MotionValue<number>]> = [
    [g0x, g0y],
    [g1x, g1y],
    [g2x, g2y],
    [g3x, g3y],
    [g4x, g4y],
  ];

  return (
    <>
      {ghosts.map(([gx, gy], i) => (
        <RadarGhost
          key={i}
          sx={gx}
          sy={gy}
          scale={GHOST_SCALES[i]}
          opacity={GHOST_OPACITIES[i]}
        />
      ))}
      <RadarHead sx={sx} sy={sy} scene={scene} isHovering={isHovering} />
    </>
  );
}

// -------------------------------------------------------------------------- //
// RadarGhost — stripped trail copy: rings + crosshair + 4 cardinal markers.  //
// No scan-line, labels, dot grid, or metrics. Sits behind the head radar.    //
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
        <circle cx={0} cy={0} r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} opacity={0.7} />
        <circle cx={0} cy={0} r={R * 0.62} fill="none" stroke="currentColor" strokeWidth={STROKE * 0.8} opacity={0.4} />
        <line x1={-R} y1={0} x2={R} y2={0} stroke="currentColor" strokeWidth={STROKE * 0.5} opacity={0.3} />
        <line x1={0} y1={-R} x2={0} y2={R} stroke="currentColor" strokeWidth={STROKE * 0.5} opacity={0.3} />
        {[[0, -R], [R, 0], [0, R], [-R, 0]].map(([x, y], i) => (
          <rect key={i} x={x - 2} y={y - 2} width={4} height={4} fill="currentColor" />
        ))}
      </svg>
    </m.div>
  );
}

// -------------------------------------------------------------------------- //
// RadarHead — full radar with scan-line, labels, metrics. Renders on top.    //
// -------------------------------------------------------------------------- //

function RadarHead({ sx, sy, scene, isHovering }: Props) {
  const [metricIdx, setMetricIdx] = useState(0);
  const nodes = SERVICE_NODES[scene];

  useEffect(() => {
    if (isHovering) return;
    const t = window.setInterval(() => {
      setMetricIdx((i) => (i + 1) % METRICS_ROTATION.length);
    }, METRICS_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [isHovering]);

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
        x: sx,
        y: sy,
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
        width={R * 2 + 120}
        height={R * 2 + 60}
        viewBox={`${-(R + 60)} ${-(R + 30)} ${R * 2 + 120} ${R * 2 + 60}`}
        style={{ overflow: 'visible', transform: 'translate(-50%, -50%)' }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 0.92, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <g opacity={0.32}>
          {Array.from({ length: 9 }).map((_, gy) =>
            Array.from({ length: 9 }).map((_, gx) => {
              const x = -R + (gx * (R * 2)) / 8;
              const y = -R + (gy * (R * 2)) / 8;
              if (x * x + y * y > R * R) return null;
              return <circle key={`${gx}-${gy}`} cx={x} cy={y} r={0.6} fill="currentColor" />;
            }),
          )}
        </g>

        <circle cx={0} cy={0} r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} opacity={0.7} />
        <circle cx={0} cy={0} r={R * 0.62} fill="none" stroke="currentColor" strokeWidth={STROKE * 0.8} opacity={0.35} />
        <line x1={-R} y1={0} x2={R} y2={0} stroke="currentColor" strokeWidth={STROKE * 0.5} opacity={0.32} />
        <line x1={0} y1={-R} x2={0} y2={R} stroke="currentColor" strokeWidth={STROKE * 0.5} opacity={0.32} />

        {[[0, -R], [R, 0], [0, R], [-R, 0]].map(([x, y], i) => (
          <rect key={i} x={x - 2} y={y - 2} width={4} height={4} fill="currentColor" />
        ))}

        <g style={{ transformOrigin: '0 0', animation: `cursor-radar-spin ${SCAN_LINE_PERIOD_MS}ms linear infinite` }}>
          <line x1={0} y1={0} x2={R} y2={0} stroke="currentColor" strokeWidth={1.4} opacity={0.9} />
          <path
            d={`M 0 0 L ${R} 0 A ${R} ${R} 0 0 0 ${R * Math.cos(-0.5)} ${R * Math.sin(-0.5)} Z`}
            fill="currentColor"
            opacity={0.12}
          />
        </g>

        <text
          x={0}
          y={2}
          fill="currentColor"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={8.5}
          textAnchor="middle"
          opacity={0.78}
          style={{ transition: 'opacity 220ms ease' }}
        >
          {METRICS_ROTATION[metricIdx]}
        </text>

        {nodes.map((label, i) => {
          const [lx, ly, anchor, baseline] = labelPositions[i];
          return (
            <text
              key={label}
              x={lx}
              y={ly}
              fill="currentColor"
              fontFamily="JetBrains Mono, ui-monospace, monospace"
              fontSize={9}
              fontWeight={600}
              textAnchor={anchor}
              dominantBaseline={baseline}
              opacity={0.92}
              style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}
            >
              {label}
            </text>
          );
        })}
      </m.svg>
    </m.div>
  );
}
