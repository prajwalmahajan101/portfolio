import { createContext, useState, type ReactNode } from 'react';

interface Ctx {
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
}

const ArchitectureHoverContext = createContext<Ctx>({
  hoveredNodeId: null,
  setHoveredNodeId: () => {},
});

export function ArchitectureHoverProvider({ children }: { children: ReactNode }) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  return (
    <ArchitectureHoverContext.Provider value={{ hoveredNodeId, setHoveredNodeId }}>
      {children}
    </ArchitectureHoverContext.Provider>
  );
}
