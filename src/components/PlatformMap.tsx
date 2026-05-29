import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { ArchitectureMap, PlatformNode, PlatformEdge } from '@/data/resume';

interface Props {
  map: ArchitectureMap;
  className?: string;
}

const COLS = 4;
const ROWS = 4;
const CELL_W = 230;
const CELL_H = 140;
const NODE_W = 180;
const NODE_H = 92;
const PAD_X = 40;
const PAD_Y = 40;

const SVG_W = PAD_X * 2 + COLS * CELL_W;
const SVG_H = PAD_Y * 2 + ROWS * CELL_H;

interface NodeInfo extends PlatformNode {
  cx: number;
  cy: number;
  kind: 'service' | 'external';
}

const cellCenter = (col: number, row: number) => ({
  cx: PAD_X + col * CELL_W + CELL_W / 2,
  cy: PAD_Y + row * CELL_H + CELL_H / 2,
});

export default function PlatformMap({ map, className }: Props) {
  const nodes: NodeInfo[] = useMemo(
    () => [
      ...map.services.map((n) => ({ ...n, ...cellCenter(n.col, n.row), kind: 'service' as const })),
      ...map.externals.map((n) => ({ ...n, ...cellCenter(n.col, n.row), kind: 'external' as const })),
    ],
    [map],
  );

  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div className={cn('relative', className)}>
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        width="100%"
        className="block"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <marker id="pm-arrow-sync" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L8,5 L0,10 Z" fill="hsl(var(--phosphor))" />
          </marker>
          <marker id="pm-arrow-event" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L8,5 L0,10 Z" fill="hsl(var(--accent))" />
          </marker>
          <marker id="pm-arrow-async" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L8,5 L0,10 Z" fill="hsl(var(--phosphor-warn))" />
          </marker>
        </defs>

        {/* dotted grid background, very subtle */}
        <g opacity="0.18">
          {Array.from({ length: ROWS + 1 }, (_, r) => (
            <line
              key={`gh-${r}`}
              x1={PAD_X}
              x2={SVG_W - PAD_X}
              y1={PAD_Y + r * CELL_H}
              y2={PAD_Y + r * CELL_H}
              stroke="hsl(var(--border))"
              strokeDasharray="2 4"
              strokeWidth="1"
            />
          ))}
          {Array.from({ length: COLS + 1 }, (_, c) => (
            <line
              key={`gv-${c}`}
              y1={PAD_Y}
              y2={SVG_H - PAD_Y}
              x1={PAD_X + c * CELL_W}
              x2={PAD_X + c * CELL_W}
              stroke="hsl(var(--border))"
              strokeDasharray="2 4"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* edges */}
        {map.edges.map((e, i) => (
          <EdgeLine
            key={`e-${i}`}
            edge={e}
            from={nodeById.get(e.from)}
            to={nodeById.get(e.to)}
          />
        ))}

        {/* nodes */}
        {nodes.map((n) => (
          <NodeCard key={n.id} node={n} />
        ))}
      </svg>

      <p className="mx-auto mt-6 max-w-[68ch] text-pretty text-center text-[12.5px] leading-relaxed text-muted-foreground md:text-[13.5px]">
        {map.caption}
      </p>

      {/* legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <LegendDot color="hsl(var(--phosphor))" label="sync REST / SQL" />
        <LegendDot color="hsl(var(--phosphor-warn))" label="async" />
        <LegendDot color="hsl(var(--accent))" label="event / webhook" />
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm border border-border bg-card" />
          service
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm border border-dashed border-border" />
          external
        </span>
      </div>
    </div>
  );
}

function NodeCard({ node }: { node: NodeInfo }) {
  const x = node.cx - NODE_W / 2;
  const y = node.cy - NODE_H / 2;
  const isService = node.kind === 'service';
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={10}
        fill={isService ? 'hsl(var(--card))' : 'transparent'}
        stroke={isService ? 'hsl(var(--phosphor) / 0.55)' : 'hsl(var(--border))'}
        strokeWidth={1.2}
        strokeDasharray={isService ? undefined : '5 4'}
      />
      {isService && (
        <circle
          cx={x + 12}
          cy={y + 14}
          r={3.5}
          fill="hsl(var(--phosphor))"
          opacity="0.9"
        />
      )}
      <text
        x={node.cx}
        y={node.cy - 6}
        textAnchor="middle"
        className="font-mono"
        fontSize="13"
        fill="hsl(var(--foreground))"
      >
        {node.label}
      </text>
      <text
        x={node.cx}
        y={node.cy + 14}
        textAnchor="middle"
        className="font-mono"
        fontSize="10.5"
        letterSpacing="0.5"
        fill="hsl(var(--muted-foreground))"
      >
        {node.sub}
      </text>
    </g>
  );
}

function EdgeLine({
  edge,
  from,
  to,
}: {
  edge: PlatformEdge;
  from?: NodeInfo;
  to?: NodeInfo;
}) {
  if (!from || !to) return null;

  const colorMap: Record<PlatformEdge['kind'], string> = {
    sync: 'hsl(var(--phosphor))',
    async: 'hsl(var(--phosphor-warn))',
    event: 'hsl(var(--accent))',
  };
  const dashMap: Record<PlatformEdge['kind'], string | undefined> = {
    sync: undefined,
    async: '8 4',
    event: '2 5',
  };

  // shorten the line so the arrowhead doesn't slam into the node card
  const dx = to.cx - from.cx;
  const dy = to.cy - from.cy;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;

  // pull endpoints back to the rectangle edges
  const trim = (cx: number, cy: number, nx: number, ny: number) => {
    const halfW = NODE_W / 2 + 4;
    const halfH = NODE_H / 2 + 4;
    const tX = nx === 0 ? Infinity : halfW / Math.abs(nx);
    const tY = ny === 0 ? Infinity : halfH / Math.abs(ny);
    const t = Math.min(tX, tY);
    return { x: cx + nx * t, y: cy + ny * t };
  };
  const a = trim(from.cx, from.cy, ux, uy);
  const b = trim(to.cx, to.cy, -ux, -uy);

  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;

  return (
    <g>
      <line
        x1={a.x}
        y1={a.y}
        x2={b.x}
        y2={b.y}
        stroke={colorMap[edge.kind]}
        strokeWidth={1.6}
        strokeDasharray={dashMap[edge.kind]}
        markerEnd={`url(#pm-arrow-${edge.kind})`}
        opacity={0.85}
      />
      {edge.label && (
        <g>
          <rect
            x={mx - edge.label.length * 3.2 - 6}
            y={my - 8}
            width={edge.label.length * 6.4 + 12}
            height={16}
            rx={4}
            fill="hsl(var(--background) / 0.92)"
            stroke="hsl(var(--border))"
            strokeWidth={0.8}
          />
          <text
            x={mx}
            y={my + 3}
            textAnchor="middle"
            className="font-mono"
            fontSize="10"
            fill="hsl(var(--foreground))"
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-2.5 w-4 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      {label}
    </span>
  );
}
