import { AnimatePresence, m } from 'motion/react';
import { useEffect, useState } from 'react';

const bootLines = [
  '$ ./portfolio --boot',
  '[INFO] mounting service mesh ........... ok',
  '[INFO] connecting valkey + mqtt-broker .. ok',
  '[INFO] loading 5 case studies ........... ok',
  '[ OK ] phosphor terminal online',
];

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    let dismiss: ReturnType<typeof setTimeout>;
    const onLoad = () => {
      dismiss = setTimeout(() => setVisible(false), 1100);
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);
    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(dismiss);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (lineIdx >= bootLines.length) return;
    const t = setTimeout(() => setLineIdx((i) => i + 1), 140);
    return () => clearTimeout(t);
  }, [lineIdx, visible]);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background"
        >
          <div className="grain pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative flex flex-col gap-2 font-mono text-[11px] md:text-[13px]">
            {bootLines.slice(0, lineIdx).map((line, i) => (
              <m.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="phosphor-text whitespace-nowrap"
              >
                {line}
              </m.div>
            ))}
            {lineIdx < bootLines.length && (
              <span className="phosphor-text inline-flex items-center gap-1">
                <span className="inline-block h-3 w-[7px] animate-[terminal-cursor_1s_steps(2,end)_infinite] bg-current" />
              </span>
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
