import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils, Group } from 'three';
import ServiceRack from '../primitives/ServiceRack';
import WireEdge from '../primitives/WireEdge';
import DataPacket from '../primitives/DataPacket';

// Six EC2 racks arranged in space. Positions roughly mirror the Architecture
// section so the 2D sequence and 3D scene tell the same story.
const RACKS = [
  { id: 'client',   pos: [-3.2,  0.4, 0.0] as const, label: 'client',        sub: 't3.borrower', kind: 'client'    as const },
  { id: 'gateway',  pos: [-1.5,  0.8, 0.6] as const, label: 'gateway',       sub: 'i-gw-0a3f',   kind: 'service'   as const },
  { id: 'valkey',   pos: [ 0.0,  1.6, 0.0] as const, label: 'valkey',        sub: 'rate.limit',  kind: 'datastore' as const },
  { id: 'push',     pos: [ 1.5,  0.4,-0.4] as const, label: 'partner-push',  sub: 'async',       kind: 'queue'     as const },
  { id: 'pg',       pos: [ 3.0,  0.0, 0.4] as const, label: 'postgres',      sub: 'durable_id',  kind: 'datastore' as const },
  { id: 'lambda',   pos: [-1.5, -1.2,-0.2] as const, label: 'lambda-triage', sub: 'mail.classify', kind: 'external'  as const },
];

const EDGES: { from: string; to: string; label: string; kind: 'sync'|'async'|'event' }[] = [
  { from: 'client',  to: 'gateway', label: 'POST /apply',  kind: 'sync' },
  { from: 'gateway', to: 'valkey',  label: 'rate.limit',   kind: 'sync' },
  { from: 'gateway', to: 'pg',      label: 'commit',       kind: 'sync' },
  { from: 'gateway', to: 'push',    label: 'enqueue',      kind: 'async' },
  { from: 'push',    to: 'pg',      label: 'durable_id',   kind: 'sync' },
  { from: 'lambda',  to: 'gateway', label: 'mail.event',   kind: 'event' },
];

const rackPos = (id: string): [number, number, number] => {
  const r = RACKS.find((x) => x.id === id);
  return r ? [...r.pos] : [0, 0, 0];
};

// Three packet loops: the main request path, a partner-push side-channel,
// and the async mail callback.
const PACKET_PATHS: { kind: 'sync'|'async'|'event'; ids: string[]; duration: number; seed: number }[] = [
  { kind: 'sync',  ids: ['client', 'gateway', 'valkey', 'gateway', 'pg', 'gateway', 'client'], duration: 7.5, seed: 0 },
  { kind: 'async', ids: ['gateway', 'push', 'pg', 'gateway'], duration: 6.0, seed: 2.1 },
  { kind: 'event', ids: ['lambda', 'gateway'], duration: 5.0, seed: 4.3 },
];

export default function RequestTrace() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((_, dt) => {
    if (!group.current) return;
    // Subtle pointer-driven parallax + slow auto-orbit.
    const targetY = MathUtils.degToRad(-12) + pointer.x * 0.12;
    const targetX = MathUtils.degToRad(-6) + -pointer.y * 0.08;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 3, dt);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, targetX, 3, dt);
  });

  const packetData = useMemo(
    () =>
      PACKET_PATHS.map((p, i) => ({
        kind: p.kind,
        duration: p.duration,
        seed: p.seed + i * 0.7,
        path: p.ids.map(rackPos),
      })),
    [],
  );

  return (
    <group ref={group}>
      {RACKS.map((r, i) => (
        <ServiceRack
          key={r.id}
          position={[...r.pos]}
          label={r.label}
          subline={r.sub}
          kind={r.kind}
          leds={4}
          seed={i * 0.7}
        />
      ))}

      {EDGES.map((e, i) => (
        <WireEdge
          key={i}
          from={rackPos(e.from)}
          to={rackPos(e.to)}
          label={e.label}
          kind={e.kind}
          opacity={0.42}
        />
      ))}

      {packetData.map((p, i) => (
        <DataPacket key={i} path={p.path} duration={p.duration} seed={p.seed} kind={p.kind} />
      ))}
    </group>
  );
}
