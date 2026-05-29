import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import LogStream from './scenes/LogStream';
import Effects from './postfx/Effects';
import { useActiveSection } from '@/lib/use-active-section';
import { isMobile } from '@/lib/gpu';

// One unified scene across every section: a slow vertical stream of phosphor
// log lines that reads as ambient infrastructure telemetry. We keep the active
// section value around for subtle camera zoom variations but the scene itself
// is shared, so there are no jarring per-section swaps.
const SECTION_CAMERA_Z: Record<string, number> = {
  hero: 6.4,
  about: 5.8,
  architecture: 6.2,
  skills: 6.0,
  experience: 5.6,
  projects: 6.0,
  contact: 5.2,
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
  void reduced;

  if (mobile) return null;

  const cameraZ = SECTION_CAMERA_Z[active] ?? 6;

  return (
    <Canvas
      dpr={[1, 1.7]}
      camera={{ position: [0, 0, cameraZ], fov: 45 }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
      frameloop="always"
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 6]} intensity={0.7} color="hsl(38, 95%, 65%)" />
      <pointLight position={[-5, -3, -4]} intensity={0.5} color="hsl(18, 90%, 55%)" />

      <Suspense fallback={null}>
        <LogStream />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
