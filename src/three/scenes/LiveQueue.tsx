import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, MathUtils } from 'three';
import ServiceRack from '../primitives/ServiceRack';
import MessageCard from '../primitives/MessageCard';

const TOPICS = [
  { topic: 'co-lending.outbound', type: 'AppSubmitted' },
  { topic: 'fleet.amr.state',     type: 'ZoneChanged' },
  { topic: 'gateway.audit',       type: 'WebhookSigned' },
  { topic: 'rag.embedding.upsert', type: 'ClauseExtracted' },
  { topic: 'aa.consent.granted',  type: 'ConsentRenewed' },
];

const CARD_COUNT = 6;
const SPACING = 0.45;
const LOOP = SPACING * (CARD_COUNT + 1);

export default function LiveQueue() {
  const group = useRef<Group>(null);
  const { pointer } = useThree();

  // Pre-allocate per-card seed offsets so they don't all blink in sync.
  const seeds = useMemo(() => Array.from({ length: CARD_COUNT }, (_, i) => i * 0.6), []);

  useFrame((_, dt) => {
    if (!group.current) return;
    const targetY = MathUtils.degToRad(-8) + pointer.x * 0.08;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetY, 3, dt);
  });

  return (
    <group ref={group}>
      {/* Producer rack — bottom */}
      <ServiceRack
        position={[0, -2.0, 0]}
        label="producer · gateway"
        subline="emit → topic"
        kind="service"
        size={[2.4, 0.7, 0.2]}
        leds={6}
        seed={0}
      />

      {/* Consumer rack — top */}
      <ServiceRack
        position={[0, 2.0, 0]}
        label="consumer · worker"
        subline="ack ✓ 10k+/s"
        kind="service"
        size={[2.4, 0.7, 0.2]}
        leds={6}
        seed={1.4}
      />

      {/* Stream of message cards flowing upward */}
      <FlowingCards seeds={seeds} />
    </group>
  );
}

function FlowingCards({ seeds }: { seeds: number[] }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const offset = (t * 0.4 + i * SPACING) % LOOP;
      child.position.y = -1.4 + offset;
      // fade in at the bottom, fade out near the top
      const visibleStart = 0.1;
      const visibleEnd = LOOP - 0.4;
      const fadeIn = Math.min(1, (offset - visibleStart) / 0.5);
      const fadeOut = Math.min(1, (visibleEnd - offset) / 0.5);
      const opacity = Math.max(0, Math.min(fadeIn, fadeOut));
      child.traverse((node: any) => {
        if (node.material && 'opacity' in node.material && node.material.transparent) {
          node.material.opacity = node.userData.baseOpacity * opacity;
        }
      });
    });
  });

  return (
    <group ref={group}>
      {seeds.map((_, i) => {
        const data = TOPICS[i % TOPICS.length];
        return (
          <group key={i} userData={{ baseOpacity: 0.9 }}>
            <MessageCard topic={data.topic} type={data.type} />
          </group>
        );
      })}
    </group>
  );
}
