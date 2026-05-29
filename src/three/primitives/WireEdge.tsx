import { Line, Text } from '@react-three/drei';
import { QuadraticBezierCurve3, Vector3 } from 'three';
import { useMemo } from 'react';
import { useThreeColors } from '@/lib/themeColors';

export type EdgeKind = 'sync' | 'async' | 'event';

interface Props {
  from: [number, number, number];
  to: [number, number, number];
  label?: string;
  kind?: EdgeKind;
  /** Base resting opacity for the visible line. Default 0.65. */
  opacity?: number;
  /** 0 = at `from`, 1 = at `to`. Position along the curve for the label. */
  labelT?: number;
  /**
   * Perpendicular bow displacement of the curve's control point (world units).
   * Bidirectional pairs use +bow / -bow so the two curves visibly separate
   * without changing endpoints. 0 = straight line.
   */
  bow?: number;
}

export default function WireEdge({
  from,
  to,
  label,
  kind = 'sync',
  opacity = 0.65,
  labelT = 0.5,
  bow = 0,
}: Props) {
  const colors = useThreeColors();
  const color = colors[kind];
  const dashed = kind !== 'sync';

  // Sampled curve + label anchor (with perpendicular outward offset so labels
  // sit *off* the wire instead of on top of it).
  const { points, labelPos } = useMemo(() => {
    const f = new Vector3(...from);
    const t = new Vector3(...to);
    const mid = new Vector3().addVectors(f, t).multiplyScalar(0.5);

    const dir = new Vector3().subVectors(t, f);
    dir.z = 0;
    const perp = new Vector3(-dir.y, dir.x, 0);
    if (perp.lengthSq() > 1e-6) perp.normalize();
    else perp.set(0, 1, 0);

    if (bow !== 0) mid.addScaledVector(perp, bow);
    mid.z = (f.z + t.z) / 2;

    const curve = new QuadraticBezierCurve3(f, mid, t);
    const samples = curve.getPoints(28);
    const anchor = curve.getPointAt(labelT);
    const sign = bow === 0 ? 1 : bow > 0 ? 1 : -1;
    anchor.addScaledVector(perp, 0.14 * sign);
    if (bow === 0) anchor.y += 0.05;
    return { points: samples, labelPos: anchor.toArray() as [number, number, number] };
  }, [from, to, bow, labelT]);

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={1.4}
        transparent
        opacity={opacity}
        dashed={dashed}
        dashSize={dashed ? 0.09 : 0}
        gapSize={dashed ? 0.06 : 0}
      />
      {label && (
        <Text
          position={labelPos}
          fontSize={0.072}
          color={color}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.7}
        >
          {label}
        </Text>
      )}
    </group>
  );
}
