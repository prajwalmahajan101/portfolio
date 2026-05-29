import { Line, Text } from '@react-three/drei';
import { Vector3 } from 'three';
import { useMemo } from 'react';

export type EdgeKind = 'sync' | 'async' | 'event';

const KIND_COLOR: Record<EdgeKind, string> = {
  sync:  'hsl(38, 95%, 62%)',
  async: 'hsl(95, 50%, 60%)',
  event: 'hsl(18, 90%, 60%)',
};

interface Props {
  from: [number, number, number];
  to: [number, number, number];
  label?: string;
  kind?: EdgeKind;
  opacity?: number;
}

export default function WireEdge({ from, to, label, kind = 'sync', opacity = 0.5 }: Props) {
  const points = useMemo(() => {
    return [new Vector3(...from), new Vector3(...to)];
  }, [from, to]);
  const mid: [number, number, number] = useMemo(() => [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2 + 0.06,
    (from[2] + to[2]) / 2,
  ], [from, to]);

  const color = KIND_COLOR[kind];
  const dashed = kind !== 'sync';

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={1}
        transparent
        opacity={opacity}
        dashed={dashed}
        dashSize={dashed ? 0.08 : 0}
        gapSize={dashed ? 0.06 : 0}
      />
      {label && (
        <Text
          position={mid}
          fontSize={0.05}
          color={color}
          anchorX="center"
          anchorY="bottom"
          fillOpacity={0.6}
        >
          {label}
        </Text>
      )}
    </group>
  );
}
