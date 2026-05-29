import { useMemo, useRef } from 'react';
import { Edges, Text } from '@react-three/drei';
import { type Group, Color } from 'three';
import { useFrame } from '@react-three/fiber';
import { useThreeColors } from '@/lib/themeColors';

export type RackKind = 'service' | 'datastore' | 'queue' | 'client' | 'external';

interface Props {
  position?: [number, number, number];
  size?: [number, number, number];
  label: string;
  subline?: string;
  kind?: RackKind;
  /** number of LEDs to render along the bottom edge */
  leds?: number;
  /** seed for staggered LED blink phases */
  seed?: number;
}

/**
 * EC2-style wireframe box. Passive display — no hover interactions.
 */
export default function ServiceRack({
  position = [0, 0, 0],
  size = [1.6, 0.9, 0.2],
  label,
  subline,
  kind = 'service',
  leds = 4,
  seed = 0,
}: Props) {
  const ref = useRef<Group>(null);
  const colors = useThreeColors();
  const color = colors[kind];

  // Idle bob — keeps the scene feeling alive without any pointer reactivity.
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + seed) * 0.015;
  });

  const ledColor = useMemo(() => new Color(color), [color]);

  return (
    <group ref={ref} position={position}>
      {/* Glass body */}
      <mesh>
        <boxGeometry args={size} />
        <meshBasicMaterial color={color} transparent opacity={0.05} />
        <Edges color={color} threshold={1} />
      </mesh>

      {/* Label band on the front face */}
      <Text
        position={[0, size[1] / 2 - 0.13, size[2] / 2 + 0.001]}
        fontSize={0.105}
        color={color}
        anchorX="left"
        anchorY="middle"
      >
        {`▸ ${label}`}
      </Text>

      {subline && (
        <Text
          position={[0, size[1] / 2 - 0.28, size[2] / 2 + 0.001]}
          fontSize={0.072}
          color={color}
          anchorX="left"
          anchorY="middle"
          fillOpacity={0.7}
        >
          {subline}
        </Text>
      )}

      {/* LEDs along the bottom */}
      <group position={[-size[0] / 2 + 0.18, -size[1] / 2 + 0.1, size[2] / 2 + 0.001]}>
        {Array.from({ length: leds }).map((_, i) => (
          <LED key={i} index={i} seed={seed} color={ledColor} />
        ))}
      </group>

      {/* Kind tag on the right edge */}
      <Text
        position={[size[0] / 2 - 0.05, -size[1] / 2 + 0.1, size[2] / 2 + 0.001]}
        fontSize={0.058}
        color={color}
        anchorX="right"
        anchorY="middle"
        fillOpacity={0.5}
      >
        {kind.toUpperCase()}
      </Text>
    </group>
  );
}

function LED({
  index,
  seed,
  color,
}: {
  index: number;
  seed: number;
  color: Color;
}) {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 1.8 + seed + index * 0.7;
    const on = Math.sin(t) > 0;
    ref.current.opacity = on ? 1 : 0.2;
  });
  return (
    <mesh position={[index * 0.12, 0, 0]}>
      <circleGeometry args={[0.025, 12]} />
      <meshBasicMaterial ref={ref} color={color} transparent opacity={0.6} />
    </mesh>
  );
}
