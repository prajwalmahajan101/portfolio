import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import HeroNetwork from './scenes/HeroNetwork';
import Effects from './postfx/Effects';
import { isMobile } from '@/lib/gpu';

export default function GlobalCanvas() {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMobile(isMobile());
  }, []);

  if (!mounted) return null;

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 9], fov: 45 }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Suspense fallback={null}>
        <HeroNetwork />
        {!mobile && <Effects />}
      </Suspense>
    </Canvas>
  );
}
