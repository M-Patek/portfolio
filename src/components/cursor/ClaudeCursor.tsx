import { useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useMousePosition } from '../../hooks';

export const ClaudeCursor = memo(() => {
  // 直接接入全局鼠标状态，消除重复监听
  const { mouseX, mouseY } = useMousePosition();

  useEffect(() => {
    // 同步 CSS 变量，用于背景光源等特效
    const syncCSSVars = () => {
      const xPct = (mouseX.get() / window.innerWidth) * 100;
      const yPct = (mouseY.get() / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${xPct}%`);
      document.documentElement.style.setProperty('--mouse-y', `${yPct}%`);
    };

    const unsubscribeX = mouseX.on("change", syncCSSVars);
    return () => {
      unsubscribeX();
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div 
      className="custom-cursor" 
      style={{ 
        x: mouseX, 
        y: mouseY,
        pointerEvents: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        transition: 'none' 
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <path d="M0 0 L0 16.37 L4.44 11.93 L7.84 19.37 L11.24 17.81 L7.84 10.37 L13.33 10.37 Z" fill="var(--cursor-color)"/>
      </svg>
    </motion.div>
  );
});

ClaudeCursor.displayName = 'ClaudeCursor';
