import { AnimatePresence, m, type MotionValue } from 'motion/react';
import type { CursorHoverTarget } from './cursor.types';

interface Props {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  hover: CursorHoverTarget | null;
}

export default function ContextHUD({ mx, my, hover }: Props) {
  return (
    <m.div
      aria-hidden
      style={{
        x: mx,
        y: my,
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10001,
      }}
    >
      <AnimatePresence>
        {hover && (
          <m.div
            key={hover.label}
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              padding: '5px 9px',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.04em',
              lineHeight: 1.1,
              color: 'hsl(var(--phosphor))',
              background: 'hsl(var(--background) / 0.78)',
              backdropFilter: 'blur(8px) saturate(140%)',
              border: '1px solid hsl(var(--phosphor) / 0.32)',
              borderRadius: 4,
              whiteSpace: 'nowrap',
              boxShadow: '0 0 18px hsl(var(--phosphor) / 0.15)',
              textShadow: '0 0 6px hsl(var(--phosphor) / 0.4)',
            }}
          >
            <span style={{ opacity: 0.65, marginRight: 4 }}>{kindGlyph(hover.kind)}</span>
            {hover.label}
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

function kindGlyph(kind: CursorHoverTarget['kind']): string {
  switch (kind) {
    case 'link': return '→';
    case 'button': return '▸';
    case 'card': return '▤';
    default: return '·';
  }
}
