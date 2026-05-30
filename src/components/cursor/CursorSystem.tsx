import { useEffect } from 'react';
import { useCursorState } from './useCursorState';
import BlockCaret from './BlockCaret';
import RadarFollower from './RadarFollower';
import TrailCanvas from './TrailCanvas';
import ContextHUD from './ContextHUD';

export default function CursorSystem() {
  const state = useCursorState();

  // Hide native cursor only when our system is active (desktop + motion allowed)
  useEffect(() => {
    if (!state.active) return;
    const root = document.documentElement;
    root.classList.add('cursor-active');
    return () => root.classList.remove('cursor-active');
  }, [state.active]);

  if (!state.active) return null;

  return (
    <>
      <TrailCanvas mx={state.mx} my={state.my} velocity={state.velocity} isDown={state.isDown} />
      <RadarFollower
        rx={state.rx}
        ry={state.ry}
        gx={state.gx}
        gy={state.gy}
        scene={state.scene}
        isMoving={state.isMoving}
      />
      <BlockCaret mx={state.mx} my={state.my} hover={!!state.hover} isDown={state.isDown} />
      <ContextHUD mx={state.mx} my={state.my} hover={state.hover} />
    </>
  );
}
