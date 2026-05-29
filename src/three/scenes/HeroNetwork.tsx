import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Icosahedron, Line, MeshDistortMaterial } from '@react-three/drei';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  MathUtils,
  Points,
  PointsMaterial,
  Vector3,
} from 'three';

const PARTICLE_COUNT = 2400;
const SERVICE_COUNT = 5;
const RADIUS = 4.2;

function useServicePositions() {
  return useMemo(() => {
    return Array.from({ length: SERVICE_COUNT }, (_, i) => {
      const angle = (i / SERVICE_COUNT) * Math.PI * 2;
      const y = (i % 2 === 0 ? 0.4 : -0.4) + Math.sin(i) * 0.3;
      return new Vector3(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS);
    });
  }, []);
}

function ParticleField() {
  const ref = useRef<Points>(null);

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = MathUtils.randFloat(3.2, 6.5);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5;
      positions[i * 3 + 2] = r * Math.cos(phi);
      sizes[i] = MathUtils.randFloat(0.4, 1.4);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    g.setAttribute('aSize', new BufferAttribute(sizes, 1));

    const m = new PointsMaterial({
      color: new Color('#b8ff5c'),
      size: 0.025,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    return { geometry: g, material: m };
  }, []);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.04;
    ref.current.rotation.x = Math.sin(performance.now() * 0.0001) * 0.12;
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

function ServiceNodes() {
  const positions = useServicePositions();
  const group = useRef<Group>(null);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.06;
  });

  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <group key={i} position={p}>
          <Icosahedron args={[0.32, 1]}>
            <MeshDistortMaterial
              color={i % 2 === 0 ? '#b8ff5c' : '#a48bff'}
              emissive={i % 2 === 0 ? '#b8ff5c' : '#a48bff'}
              emissiveIntensity={0.7}
              distort={0.25}
              speed={1.4}
              roughness={0.2}
              metalness={0.6}
            />
          </Icosahedron>
          <Icosahedron args={[0.55, 0]}>
            <meshBasicMaterial color={i % 2 === 0 ? '#b8ff5c' : '#a48bff'} wireframe transparent opacity={0.12} />
          </Icosahedron>
        </group>
      ))}

      {positions.map((p, i) => {
        const next = positions[(i + 1) % positions.length];
        return (
          <Line
            key={`edge-${i}`}
            points={[p, next]}
            color={'#b8ff5c'}
            transparent
            opacity={0.18}
            lineWidth={1}
          />
        );
      })}
      {positions.map((p, i) => {
        const opposite = positions[(i + 2) % positions.length];
        return (
          <Line
            key={`diag-${i}`}
            points={[p, opposite]}
            color={'#a48bff'}
            transparent
            opacity={0.08}
            lineWidth={1}
          />
        );
      })}
    </group>
  );
}

function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame((_, dt) => {
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    const docH = typeof document !== 'undefined' ? Math.max(1, document.documentElement.scrollHeight - window.innerHeight) : 1;
    const progress = MathUtils.clamp(scrollY / docH, 0, 1);

    const targetZ = MathUtils.lerp(9, 4.2, progress);
    const targetX = pointer.x * 0.6;
    const targetY = pointer.y * 0.4 + progress * 0.8;

    camera.position.x = MathUtils.damp(camera.position.x, targetX, 4, dt);
    camera.position.y = MathUtils.damp(camera.position.y, targetY, 4, dt);
    camera.position.z = MathUtils.damp(camera.position.z, targetZ, 4, dt);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroNetwork() {
  return (
    <>
      <color attach="background" args={['#07070b']} />
      <fog attach="fog" args={['#07070b', 7, 16]} />

      <ambientLight intensity={0.25} />
      <pointLight position={[6, 4, 6]} intensity={1.2} color="#b8ff5c" />
      <pointLight position={[-6, -3, -4]} intensity={0.9} color="#a48bff" />

      <ParticleField />
      <ServiceNodes />
      <CameraRig />
    </>
  );
}
