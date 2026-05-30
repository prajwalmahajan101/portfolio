import { m, type MotionValue } from 'motion/react';

interface Props {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  hover: boolean;
  isDown: boolean;
}

export default function BlockCaret({ mx, my, hover, isDown }: Props) {
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
        zIndex: 10000,
        transform: 'translate3d(0,0,0)',
        willChange: 'transform',
      }}
    >
      <m.div
        animate={{
          scale: isDown ? 0.7 : hover ? 1.25 : 1,
          opacity: isDown ? 0.7 : 1,
        }}
        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
        style={{
          translate: '-50% -55%',
          color: 'hsl(var(--phosphor))',
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: 1,
          textShadow:
            '0 0 8px hsl(var(--phosphor) / 0.55), 0 0 18px hsl(var(--phosphor) / 0.28)',
          animation: 'caret-blink 1.05s steps(2,end) infinite',
        }}
      >
        █
      </m.div>
    </m.div>
  );
}
