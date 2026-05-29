import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import ServiceRack from '../primitives/ServiceRack';
import WireEdge from '../primitives/WireEdge';
import DataPacket from '../primitives/DataPacket';
import { experience } from '@/data/resume';

// Four boxes left → right, chronological from oldest role on the left.
// We reverse the experience array (latest-first → oldest-first).
const CHRONO = [...experience].reverse();
const X_SPACING = 1.7;

export default function DeploymentTimeline() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((_, dt) => {
    if (!group.current) return;
    const targetY = pointer.x * 0.08;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 3, dt);
  });

  const positions: [number, number, number][] = CHRONO.map((_, i) => [
    (i - (CHRONO.length - 1) / 2) * X_SPACING,
    0,
    0,
  ]);

  const packetPath: [number, number, number][] = positions.length
    ? [...positions, positions[0]]
    : [[0, 0, 0]];

  return (
    <group ref={group}>
      {CHRONO.map((role, i) => (
        <ServiceRack
          key={role.company}
          position={positions[i]}
          label={role.company.toLowerCase()}
          subline={`${role.start} → ${role.end}`}
          kind={i === CHRONO.length - 1 ? 'service' : 'external'}
          leds={3}
          seed={i * 0.4}
          size={[1.5, 0.85, 0.18]}
        />
      ))}

      {positions.slice(0, -1).map((p, i) => (
        <WireEdge key={i} from={p} to={positions[i + 1]} label="git push" kind="async" opacity={0.5} />
      ))}

      {/* Build artifact crawls left → right (and loops back) */}
      <DataPacket path={packetPath} duration={9} kind="sync" />
    </group>
  );
}
