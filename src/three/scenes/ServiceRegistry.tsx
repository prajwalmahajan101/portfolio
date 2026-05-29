import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import ServiceRack from '../primitives/ServiceRack';
import { skills } from '@/data/resume';

// One EC2 rack per skill category, arranged in two rows of three.
const POSITIONS: [number, number, number][] = [
  [-2.2,  1.0, 0],
  [ 0.0,  1.2, 0],
  [ 2.2,  1.0, 0],
  [-2.2, -1.0, 0],
  [ 0.0, -1.2, 0],
  [ 2.2, -1.0, 0],
];

export default function ServiceRegistry() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((_, dt) => {
    if (!group.current) return;
    const targetY = MathUtils.degToRad(-6) + pointer.x * 0.1;
    const targetX = -pointer.y * 0.06;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 3, dt);
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, targetX, 3, dt);
  });

  return (
    <group ref={group}>
      {skills.map((g, i) => {
        const pos = POSITIONS[i] ?? [0, 0, 0];
        return (
          <ServiceRack
            key={g.category}
            position={pos}
            label={g.category.toLowerCase()}
            subline={g.blurb}
            kind={i % 2 === 0 ? 'service' : 'datastore'}
            leds={Math.min(g.items.length, 8)}
            seed={i * 0.5}
            size={[1.9, 0.95, 0.18]}
          />
        );
      })}
    </group>
  );
}
