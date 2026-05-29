import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import ServiceRack, { type RackKind } from '../primitives/ServiceRack';
import WireEdge from '../primitives/WireEdge';
import DataPacket, { type PacketKind } from '../primitives/DataPacket';
import { ArchitectureHoverProvider } from './hoverContext';
import type { ArchitectureMap } from '@/data/resume';

interface Props {
  map: ArchitectureMap;
}

// Translate the architectureMap's (col, row) grid into 3D positions.
// Externals push back along z; services sit on the foreground plane.
const COL_GAP = 2.3;
const ROW_GAP = 1.55;
const COL_CENTER = 1.5;
const ROW_CENTER = 1.0;

function gridPos(col: number, row: number, kind: 'service' | 'external'): [number, number, number] {
  const x = (col - COL_CENTER) * COL_GAP;
  const y = -(row - ROW_CENTER) * ROW_GAP;
  const z = kind === 'external' ? -0.7 : 0;
  return [x, y, z];
}

const KIND_BY_ID: Record<string, RackKind> = {
  // services
  webapp: 'client',
  gateway: 'service',
  partner: 'service',
  email: 'service',
  ops: 'queue',
  // externals
  synoriq: 'datastore',
  synofin: 'datastore',
  gmail: 'external',
  bhn: 'external',
};

// Packet routes mapping the two real journeys: outbound (lead intake → 5-stage
// case push → post-approval PRS/UTR) and inbound (pushback email → AI triage →
// auto-assigned sub-queries → consolidated reply).
const FLOWS: { ids: string[]; kind: PacketKind; duration: number; seed: number }[] = [
  // 1. Lead intake — Synoriq read-only → gateway (CRE)
  { ids: ['synoriq', 'gateway'], kind: 'sync', duration: 3.6, seed: 0.0 },

  // 2. Heimdall review — gateway ↔ webapp (round trip)
  { ids: ['gateway', 'webapp', 'gateway'], kind: 'sync', duration: 4.8, seed: 0.9 },

  // 3. 5-stage case push — long multi-hop primary packet
  { ids: ['webapp', 'gateway', 'partner', 'bhn'], kind: 'sync', duration: 5.4, seed: 1.6 },

  // 3a-d. Parallel stage packets running partner → bhn at staggered phases,
  // imply stages 2-5 fanning in parallel.
  { ids: ['partner', 'bhn'], kind: 'sync', duration: 2.4, seed: 2.3 },
  { ids: ['partner', 'bhn'], kind: 'sync', duration: 2.6, seed: 2.7 },
  { ids: ['partner', 'bhn'], kind: 'sync', duration: 2.2, seed: 3.1 },

  // 3e. Document stage — Synofin presigned S3 path
  { ids: ['synofin', 'gateway', 'partner', 'bhn'], kind: 'async', duration: 7.0, seed: 3.6 },

  // 4. Pushback triage — BHN email → Gmail → email_analysis → gateway
  { ids: ['bhn', 'gmail', 'email', 'gateway'], kind: 'event', duration: 6.5, seed: 4.4 },

  // 5. Consolidated reply — gateway → partner → BHN (slow, event)
  { ids: ['gateway', 'partner', 'bhn'], kind: 'event', duration: 8.5, seed: 5.2 },

  // Post-approval PRS / UTR — slow recurring packet
  { ids: ['webapp', 'gateway', 'partner', 'bhn'], kind: 'async', duration: 9.5, seed: 6.1 },

  // Results back from partner (PRS / UTR / status) — partner → gateway
  { ids: ['partner', 'gateway'], kind: 'async', duration: 5.0, seed: 6.8 },
];

const PAIR_BOW = 0.42;

export default function PlatformFlow({ map }: Props) {
  // The hover context provider lives inside the Canvas tree so racks and
  // edges share a single hovered-node id without crossing React roots.
  return (
    <ArchitectureHoverProvider>
      <PlatformFlowScene map={map} />
    </ArchitectureHoverProvider>
  );
}

function PlatformFlowScene({ map }: Props) {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  // Build a fast id → position map by combining services + externals.
  const positions = useMemo(() => {
    const m = new Map<string, [number, number, number]>();
    for (const n of map.services) m.set(n.id, gridPos(n.col, n.row, 'service'));
    for (const n of map.externals) m.set(n.id, gridPos(n.col, n.row, 'external'));
    return m;
  }, [map]);

  // Pre-compute each flow's path as a list of 3D points.
  const flows = useMemo(
    () =>
      FLOWS.map((f) => ({
        ...f,
        path: f.ids.map<[number, number, number]>(
          (id) => positions.get(id) ?? [0, 0, 0],
        ),
      })),
    [positions],
  );

  // Assign a bow to each edge so bidirectional pairs visibly separate.
  // Both siblings receive the SAME positive bow; the perpendicular vector in
  // WireEdge flips sign when from/to swap, so the resulting control points
  // land on opposite sides of the centerline.
  const edgeBows = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of map.edges) {
      const key = [e.from, e.to].sort().join('|');
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return map.edges.map((e) => {
      const key = [e.from, e.to].sort().join('|');
      return counts[key] > 1 ? PAIR_BOW : 0;
    });
  }, [map.edges]);

  // Pointer parallax — center cursor = straight; wider sweep at the edges.
  useFrame((_, dt) => {
    if (!group.current) return;
    const targetY = pointer.x * 0.32;
    const targetX = -pointer.y * 0.18;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 2.5, dt);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, targetX, 2.5, dt);
  });

  return (
    <group ref={group}>
      {/* Services — front plane */}
      {map.services.map((n, i) => (
        <ServiceRack
          key={n.id}
          position={positions.get(n.id)!}
          label={n.label}
          subline={n.sub}
          kind={KIND_BY_ID[n.id] ?? 'service'}
          size={[1.25, 0.6, 0.16]}
          leds={4}
          seed={i * 0.6}
        />
      ))}

      {/* Externals — back plane, sized a touch smaller */}
      {map.externals.map((n, i) => (
        <ServiceRack
          key={n.id}
          position={positions.get(n.id)!}
          label={n.label}
          subline={n.sub}
          kind={KIND_BY_ID[n.id] ?? 'external'}
          size={[1.1, 0.55, 0.14]}
          leds={3}
          seed={1.3 + i * 0.5}
        />
      ))}

      {/* Edges — bowed for bidirectional pairs */}
      {map.edges.map((e, i) => {
        const from = positions.get(e.from);
        const to = positions.get(e.to);
        if (!from || !to) return null;
        return (
          <WireEdge
            key={i}
            from={from}
            to={to}
            label={e.label}
            kind={e.kind}
            opacity={0.65}
            bow={edgeBows[i]}
          />
        );
      })}

      {/* Animated packets */}
      {flows.map((f, i) => (
        <DataPacket
          key={i}
          path={f.path}
          duration={f.duration}
          seed={f.seed}
          kind={f.kind}
          size={0.075}
        />
      ))}
    </group>
  );
}
