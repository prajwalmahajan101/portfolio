import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import PlatformFlow from '@/three/scenes/PlatformFlow';
import PlatformMap from '@/components/PlatformMap';
import { isMobile } from '@/lib/gpu';
import { useThreeColors } from '@/lib/themeColors';
import type { ArchitectureMap } from '@/data/resume';

interface Props {
  map: ArchitectureMap;
}

const STEPS = [
  { label: 'Lead intake',        sub: 'synoriq → CRE (gateway) → cases' },
  { label: 'Heimdall review',    sub: 'gateway ↔ webapp · view + edit' },
  { label: '5-stage case push',  sub: 'webapp → gateway → partner → BHN' },
  { label: 'Pushback triage',    sub: 'BHN mail → gmail → email_analysis → gateway' },
  { label: 'Consolidated reply', sub: 'resolved sub-queries → gateway → partner → BHN' },
];

interface LegendKind {
  kind: 'sync' | 'async' | 'event';
  label: string;
  style: 'solid' | 'dashed' | 'dotted';
}

const EDGE_KINDS: LegendKind[] = [
  { kind: 'sync',  label: 'sync · REST',     style: 'solid'  },
  { kind: 'async', label: 'async · queue',   style: 'dashed' },
  { kind: 'event', label: 'event · webhook', style: 'dotted' },
];

export default function ArchitectureScene({ map }: Props) {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const colors = useThreeColors();

  useEffect(() => {
    setMounted(true);
    setMobile(isMobile());
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative overflow-hidden rounded-xl border border-[hsl(var(--surface-display-border))] bg-[hsl(var(--surface-display)/0.6)] backdrop-blur-sm">
        {mounted && !mobile ? (
          <div className="aspect-[16/10] w-full min-h-[480px] md:min-h-[600px]">
            <Canvas
              dpr={[1, 1.7]}
              camera={{ position: [0, 0.6, 5.8], fov: 45 }}
              gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
              frameloop="always"
            >
              <ambientLight intensity={0.55} color={colors.ambient} />
              <pointLight position={[4, 4, 5]} intensity={0.9} color={colors.pointA} />
              <pointLight position={[-4, -2, -3]} intensity={0.55} color={colors.pointB} />

              <Suspense fallback={null}>
                <PlatformFlow map={map} />
              </Suspense>
            </Canvas>
          </div>
        ) : (
          // Mobile / SSR fallback — static SVG diagram.
          <div className="overflow-x-auto p-6 md:p-8">
            <PlatformMap map={map} className="min-w-[760px]" />
          </div>
        )}
      </div>

      {/* Edge-kind legend + hover hint */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-border/60 bg-card/40 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
        <span className="text-primary">▸ wire legend</span>
        {EDGE_KINDS.map((k) => {
          const c = colors[k.kind];
          return (
            <span key={k.kind} className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-px w-7"
                style={{
                  background:
                    k.style === 'solid'
                      ? c
                      : k.style === 'dashed'
                      ? `repeating-linear-gradient(90deg, ${c} 0 6px, transparent 6px 10px)`
                      : `repeating-linear-gradient(90deg, ${c} 0 2px, transparent 2px 6px)`,
                }}
              />
              <span style={{ color: c }}>{k.label}</span>
            </span>
          );
        })}
      </div>

      {/* Life-of-a-case legend strip */}
      <ol className="grid gap-3 sm:grid-cols-3 md:grid-cols-5">
        {STEPS.map((s, i) => (
          <li
            key={s.label}
            className="hover-rise rounded-lg border border-border/60 bg-card/50 px-3 py-2.5 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 font-mono text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-primary">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-foreground">{s.label}</span>
            </div>
            <p className="mt-1 font-mono text-[10.5px] text-muted-foreground">{s.sub}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
