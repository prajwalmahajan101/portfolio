import { Edges, Text } from '@react-three/drei';

interface Props {
  position?: [number, number, number];
  topic: string;
  type: string;
  color?: string;
}

export default function MessageCard({ position = [0, 0, 0], topic, type, color = 'hsl(38, 95%, 62%)' }: Props) {
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[1.4, 0.32]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
        <Edges color={color} threshold={1} />
      </mesh>
      <Text position={[-0.65, 0.06, 0.01]} fontSize={0.05} color={color} anchorX="left" anchorY="middle">
        ▸ {topic}
      </Text>
      <Text position={[-0.65, -0.06, 0.01]} fontSize={0.045} color={color} anchorX="left" anchorY="middle" fillOpacity={0.6}>
        type={type}
      </Text>
    </group>
  );
}
