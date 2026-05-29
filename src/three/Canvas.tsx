import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import RequestTrace from './scenes/RequestTrace';
import LiveQueue from './scenes/LiveQueue';
import ServiceRegistry from './scenes/ServiceRegistry';
import DeploymentTimeline from './scenes/DeploymentTimeline';
import OutboundPortal from './scenes/OutboundPortal';
import Effects from './postfx/Effects';
import { useActiveSection } from '@/lib/use-active-section';
import { isMobile } from '@/lib/gpu';

const SCENE_MAP: Record<string, React.ComponentType> = {
  hero: RequestTrace,
  about: LiveQueue,
  architecture: RequestTrace,
  skills: ServiceRegistry,
  experience: DeploymentTimeline,
  projects: ServiceRegistry,
  contact: OutboundPortal,
};

const SCENE_CAMERA: Record<string, [number, number, number]> = {
  hero: [0, 0.4, 6.5],
  about: [0, 0, 5.5],
  architecture: [0, 0.4, 6.5],
  skills: [0, 0, 6],
  experience: [0, 0, 5],
  projects: [0, 0, 6],
  contact: [0, 0, 4.5],
};

export default function GlobalCanvas() {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const reduced = useReducedMotion();
  const active = useActiveSection('hero');

  useEffect(() => {
    setMounted(true);
    setMobile(isMobile());
  }, []);

  if (!mounted) return null;
  // Under reduced-motion preference, still render the scene but with auto-rotate
  // disabled — done inside the scene components themselves.
  void reduced;

  const Scene = SCENE_MAP[active] ?? RequestTrace;
  const camera = SCENE_CAMERA[active] ?? [0, 0, 6];

  if (mobile) {
    // Mobile: skip R3F entirely; the terminal background + MessageQueue + EC2
    // card are plenty of "infrastructure" feel on a small screen.
    return null;
  }

  return (
    <Canvas
      key={active}
      dpr={[1, 1.7]}
      camera={{ position: camera, fov: 45 }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      frameloop="always"
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 6]} intensity={0.9} color="hsl(38, 95%, 65%)" />
      <pointLight position={[-5, -3, -4]} intensity={0.6} color="hsl(18, 90%, 55%)" />

      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          <Scene key={active} />
        </AnimatePresence>
        <Effects />
      </Suspense>
    </Canvas>
  );
}
