import { useTheme } from '@/components/theme-provider';

/**
 * Resolved HSL color strings for the 3D scenes. R3F can't subscribe to CSS
 * custom properties directly (the WebGL renderer wants plain strings/numbers),
 * so we mirror the dark/light token palettes here and pick one set per render.
 *
 * Dark = bright phosphor on charcoal monitor.
 * Light = dark amber / moss / ember on cream paper — readable without glare.
 */
export interface ThreeColors {
  // edge kinds
  sync: string;
  async: string;
  event: string;
  // rack kinds
  service: string;
  datastore: string;
  queue: string;
  client: string;
  external: string;
  // scene lights
  ambient: string;
  pointA: string;
  pointB: string;
  // cursor cube
  cursorCube: string;
  // background outline for text against scene
  textOutline: string;
}

const DARK: ThreeColors = {
  sync:       'hsl(38, 95%, 62%)',
  async:      'hsl(95, 50%, 60%)',
  event:      'hsl(18, 90%, 60%)',
  service:    'hsl(38, 95%, 62%)',
  datastore:  'hsl(28, 80%, 55%)',
  queue:      'hsl(18, 90%, 60%)',
  client:     'hsl(95, 50%, 60%)',
  external:   'hsl(48, 85%, 65%)',
  ambient:    'hsl(38, 25%, 80%)',
  pointA:     'hsl(38, 95%, 70%)',
  pointB:     'hsl(18, 90%, 60%)',
  cursorCube: 'hsl(38, 95%, 62%)',
  textOutline:'hsl(30, 18%, 7%)',
};

const LIGHT: ThreeColors = {
  sync:       'hsl(22, 75%, 32%)',
  async:      'hsl(120, 35%, 28%)',
  event:      'hsl(14, 75%, 36%)',
  service:    'hsl(22, 75%, 32%)',
  datastore:  'hsl(18, 65%, 36%)',
  queue:      'hsl(14, 75%, 36%)',
  client:     'hsl(120, 35%, 28%)',
  external:   'hsl(30, 65%, 38%)',
  ambient:    'hsl(38, 30%, 45%)',
  pointA:     'hsl(38, 60%, 55%)',
  pointB:     'hsl(22, 60%, 45%)',
  cursorCube: 'hsl(22, 75%, 32%)',
  textOutline:'hsl(38, 28%, 93%)',
};

export function useThreeColors(): ThreeColors {
  const { theme } = useTheme();
  return theme === 'dark' ? DARK : LIGHT;
}
