import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, type Mesh, MathUtils, Vector3 } from 'three';
import { useMemo } from 'react';
import { useThreeColors } from '@/lib/themeColors';

export type PacketKind = 'sync' | 'async' | 'event';

interface Props {
  /** ordered control points the packet travels through, looping back to start */
  path: [number, number, number][];
  /** how long one loop takes, in seconds */
  duration?: number;
  /** seed for staggered start phase */
  seed?: number;
  kind?: PacketKind;
  size?: number;
}

export default function DataPacket({
  path,
  duration = 6,
  seed = 0,
  kind = 'sync',
  size = 0.085,
}: Props) {
  const ref = useRef<Mesh>(null);
  const colors = useThreeColors();

  const curve = useMemo(() => {
    const pts = path.map(([x, y, z]) => new Vector3(x, y, z));
    return new CatmullRomCurve3(pts, true, 'centripetal', 0.4);
  }, [path]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime + seed) / duration) % 1;
    const p = curve.getPoint(t);
    ref.current.position.copy(p);
    const scale = 0.85 + Math.sin(t * Math.PI * 4) * 0.15;
    ref.current.scale.setScalar(MathUtils.lerp(0.9, 1.2, scale));
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color={colors[kind]} />
    </mesh>
  );
}
