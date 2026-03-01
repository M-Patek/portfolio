import React, { createContext, useContext, useEffect } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';

interface MouseContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  // 归一化坐标 (0-1)
  normX: MotionValue<number>;
  normY: MotionValue<number>;
}

const MouseContext = createContext<MouseContextType | null>(null);

export const MouseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      normX.set(e.clientX / window.innerWidth);
      normY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, normX, normY]);

  return (
    <MouseContext.Provider value={{ mouseX, mouseY, normX, normY }}>
      {children}
    </MouseContext.Provider>
  );
};

export const useMousePosition = () => {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error('useMousePosition must be used within a MouseProvider');
  }
  return context;
};
