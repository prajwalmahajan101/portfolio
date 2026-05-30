import { useEffect, useState } from 'react';
import { m, type MotionValue } from 'motion/react';
import { METRICS_INTERVAL_MS, METRICS_ROTATION, SCAN_LINE_PERIOD_MS, SERVICE_NODES } from './cursor.constants';
import type { SceneId } from './cursor.types';

interface Props {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  scene: SceneId;
  isHovering: boolean;
}

const R = 56;            // radar radius
const STROKE = 1;
const LABEL_OFFSET = 16; // label distance outside the ring

export default function RadarFollower({ sx, sy, scene, isHovering }: Props) {
  const [metricIdx, setMetricIdx] = useState(0);
  const nodes = SERVICE_NODES[scene];

  useEffect(() => {
    if (isHovering) return; // pause rotation when reading a HUD label
    const t = window.setInterval(() => {
      setMetricIdx((i) => (i + 1) % METRICS_ROTATION.length);
    }, METRICS_INTERVAL_MS);
    return () => window.clearInterval(t);
  }, [isHovering]);

  type Anchor = 'middle' | 'end' | 'start';
  type Baseline = 'alphabetic' | 'middle' | 'hanging';
  const labelPositions: Array<[number, number, Anchor, Baseline]> = [
    [0, -(R + LABEL_OFFSET), 'middle', 'alphabetic'],   // top
    [R + LABEL_OFFSET, 0, 'start', 'middle'],           // right
    [0, R + LABEL_OFFSET + 4, 'middle', 'hanging'],     // bottom
    [-(R + LABEL_OFFSET), 0, 'end', 'middle'],          // left
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
        {/* faint inner dot grid */}
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

        {/* main ring */}
        <circle cx={0} cy={0} r={R} fill="none" stroke="currentColor" strokeWidth={STROKE} opacity={0.7} />
        {/* mid ring */}
        <circle cx={0} cy={0} r={R * 0.62} fill="none" stroke="currentColor" strokeWidth={STROKE * 0.8} opacity={0.35} />
        {/* crosshair */}
        <line x1={-R} y1={0} x2={R} y2={0} stroke="currentColor" strokeWidth={STROKE * 0.5} opacity={0.32} />
        <line x1={0} y1={-R} x2={0} y2={R} stroke="currentColor" strokeWidth={STROKE * 0.5} opacity={0.32} />

        {/* cardinal markers */}
        {[[0, -R], [R, 0], [0, R], [-R, 0]].map(([x, y], i) => (
          <rect key={i} x={x - 2} y={y - 2} width={4} height={4} fill="currentColor" />
        ))}

        {/* rotating scan line + sweep wedge */}
        <g style={{ transformOrigin: '0 0', animation: `cursor-radar-spin ${SCAN_LINE_PERIOD_MS}ms linear infinite` }}>
          <line x1={0} y1={0} x2={R} y2={0} stroke="currentColor" strokeWidth={1.4} opacity={0.9} />
          <path
            d={`M 0 0 L ${R} 0 A ${R} ${R} 0 0 0 ${R * Math.cos(-0.5)} ${R * Math.sin(-0.5)} Z`}
            fill="currentColor"
            opacity={0.12}
          />
        </g>

        {/* center metrics */}
        <text
          x={0}
          y={2}
          fill="currentColor"
          fontFamily="JetBrains Mono, ui-monospace, monospace"
          fontSize={8.5}
          textAnchor="middle"
          opacity={0.78}
          style={{
            transition: 'opacity 220ms ease',
          }}
        >
          {METRICS_ROTATION[metricIdx]}
        </text>

        {/* service node labels (top/right/bottom/left) */}
        {nodes.map((label, i) => {
          const [lx, ly, anchor, baseline] = labelPositions[i];
          return (
            <g key={label}>
              <text
                x={lx}
                y={ly}
                fill="currentColor"
                fontFamily="JetBrains Mono, ui-monospace, monospace"
                fontSize={9}
                fontWeight={600}
                textAnchor={anchor}
                dominantBaseline={baseline}
                opacity={0.92}
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </m.svg>
    </m.div>
  );
}
