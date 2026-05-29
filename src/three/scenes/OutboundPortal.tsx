import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import { MeshDistortMaterial } from '@react-three/drei';
import ServiceRack from '../primitives/ServiceRack';
import MessageCard from '../primitives/MessageCard';

const QUEUE = [
  { topic: 'inbox.contact',  type: 'IntroRequest' },
  { topic: 'inbox.contact',  type: 'ConsultingAsk' },
  { topic: 'inbox.contact',  type: 'OpenRole' },
  { topic: 'inbox.contact',  type: 'TechnicalQ' },
];

export default function OutboundPortal() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame((_, dt) => {
    if (!group.current) return;
    const targetY = pointer.x * 0.12;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 3, dt);
  });

  return (
    <group ref={group}>
      {/* Queue at bottom-left */}
      <ServiceRack
        position={[-1.6, -1.4, 0]}
        label="outbound queue"
        subline="to: prajwal.mahajan101"
        kind="queue"
        leds={5}
        size={[2.2, 0.7, 0.2]}
      />

      {/* Cards drifting toward the portal */}
      <Drift cards={QUEUE} />

      {/* Portal sphere */}
      <Portal />
    </group>
  );
}

function Drift({ cards }: { cards: { topic: string; type: string }[] }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((c, i) => {
      const phase = (t * 0.3 + i * 0.6) % 4;
      // path: from (-1.6, -1.0) → portal at (1.4, 0.6), 4s loop
      const k = phase / 4;
      c.position.x = MathUtils.lerp(-1.6, 1.4, k);
      c.position.y = MathUtils.lerp(-1.0, 0.6, k);
      c.position.z = Math.sin(k * Math.PI) * 0.5;
      const scale = 0.7 + (1 - k) * 0.3;
      c.scale.setScalar(scale);
      c.traverse((node: any) => {
        if (node.material && 'opacity' in node.material && node.material.transparent) {
          node.material.opacity = (1 - Math.pow(k, 3)) * 0.9;
        }
      });
    });
  });
  return (
    <group ref={group}>
      {cards.map((c, i) => (
        <group key={i}>
          <MessageCard topic={c.topic} type={c.type} />
        </group>
      ))}
    </group>
  );
}

function Portal() {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });
  return (
    <group position={[1.4, 0.6, 0]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.55, 8]} />
        <MeshDistortMaterial
          color="hsl(38, 95%, 62%)"
          emissive="hsl(38, 95%, 50%)"
          emissiveIntensity={0.7}
          distort={0.45}
          speed={1.6}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
      {/* Outer wireframe halo */}
      <mesh>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color="hsl(38, 95%, 62%)" wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
