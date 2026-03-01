import { useRef, memo } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { SplitText, sequenceReveal, wordReveal, floatUpReveal } from '../components/effects';
import { useMousePosition } from '../hooks';
import type { Content, Theme } from '../types';

// --- 本地纸质滤镜 (仅对首页生效) ---
const LocalPaperFilter = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
    <defs>
      <filter id="hero-paper-light">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
        <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      <filter id="hero-paper-dark">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
        <feDiffuseLighting in="noise" lightingColor="#1A1A1A" surfaceScale="2.5" diffuseConstant="1.2">
          <feDistantLight azimuth="225" elevation="40" />
        </feDiffuseLighting>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      <filter id="hero-hand-drawn">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
      </filter>
    </defs>
  </svg>
);

// --- 磁吸/避让基础组件 (支持独立物理参数) ---
const RepellingElement = ({ springX, springY, initialX, initialY, children, factor = 30, style = {} }: any) => {
  const x = useTransform(springX, [0, 1], [factor, -factor]);
  const y = useTransform(springY, [0, 1], [factor / 2, -factor / 2]);
  
  return (
    <motion.div 
      style={{ position: 'absolute', left: initialX, top: initialY, x, y, ...style }}
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 1, 0, -1, 0]
        }}
        transition={{
          duration: 10 + Math.random() * 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// --- 星星组件 ---
const GeminiStar = ({ x, y, size, springX, springY }: any) => {
  const brightness = useTransform([springX, springY], ([sx, sy]: any) => {
    const dist = Math.sqrt(Math.pow(sx * 100 - x, 2) + Math.pow(sy * 100 - y, 2));
    return dist < 15 ? 0.95 : 0.4;
  });
  const dx = useTransform(springX, [0, 1], [8, -8]);
  const dy = useTransform(springY, [0, 1], [8, -8]);

  return (
    <motion.div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, opacity: brightness, scale: brightness, x: dx, y: dy, pointerEvents: 'none' }}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#F4E0A1">
        <path d="M12 0L14.5 9L24 12L14.5 15L12 24L9.5 15L0 12L9.5 9Z" />
      </svg>
    </motion.div>
  );
};

// --- 云朵组件 ---
const RepellingCloud = ({ normX, normY, initialX, initialY, scale = 1, factor = 30, theme, stiffness = 60, damping = 20 }: any) => {
  const cloudColor = theme === 'dark' ? '#E0E0E0' : '#D97757';
  const cloudOpacity = theme === 'dark' ? 0.15 : 0.25;
  const springX = useSpring(normX, { stiffness, damping });
  const springY = useSpring(normY, { stiffness, damping });

  return (
    <RepellingElement springX={springX} springY={springY} initialX={initialX} initialY={initialY} factor={factor}>
       <svg viewBox="0 0 100 50" width={120 * scale} opacity={cloudOpacity} filter="url(#hero-hand-drawn)">
         <path d="M10 40 Q25 10 40 30 Q55 10 70 30 Q85 10 90 40 Z" fill={cloudColor} />
       </svg>
    </RepellingElement>
  );
};

interface HeroSectionProps {
  t: Content;
  theme: Theme;
  toggleTheme: () => void;
  id?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = memo(({ theme, toggleTheme, id }) => {
  const containerRef = useRef<HTMLElement>(null);
  const { normX, normY } = useMousePosition();
  
  const starSpringX = useSpring(normX, { stiffness: 80, damping: 25 });
  const starSpringY = useSpring(normY, { stiffness: 80, damping: 25 });

  return (
    <section ref={containerRef} id={id} className="hero-full-screen left-aligned-hero" style={{ overflow: 'hidden', position: 'relative' }}>
      <LocalPaperFilter />
      
      <div className="hero-celestial-bg" style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: -1, 
        background: theme === 'dark' ? 'linear-gradient(to bottom, #0A0A0C, #141418)' : 'linear-gradient(to bottom, #EBF3FF, #FFFFFF)',
        filter: theme === 'dark' ? 'url(#hero-paper-dark)' : 'url(#hero-paper-light)' 
      }} />

      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: '60vh', 
        background: 'linear-gradient(to bottom, transparent 0%, var(--bg-claude) 100%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <RepellingCloud normX={normX} normY={normY} initialX="12%" initialY="18%" factor={60} stiffness={30} damping={10} theme={theme} />
      <RepellingCloud normX={normX} normY={normY} initialX="72%" initialY="28%" factor={25} stiffness={120} damping={40} scale={0.9} theme={theme} />
      <RepellingCloud normX={normX} normY={normY} initialX="60%" initialY="62%" factor={45} stiffness={50} damping={20} scale={0.7} theme={theme} />

      {theme === 'dark' && [...Array(30)].map((_, i) => (
        <GeminiStar 
          key={i} 
          x={5 + (i * 13 + Math.sin(i)*20) % 90} 
          y={5 + (i * 17 + Math.cos(i)*15) % 60} 
          size={6 + (i % 8)} 
          springX={starSpringX} 
          springY={starSpringY} 
        />
      ))}

      <div style={{ position: 'absolute', top: '120px', right: '100px', zIndex: 100, cursor: 'pointer' }} onClick={toggleTheme}>
        <RepellingElement springX={starSpringX} springY={starSpringY} initialX="0" initialY="0" factor={20}>
          {theme === 'light' ? (
            <motion.svg viewBox="0 0 100 100" width="80" filter="url(#hero-hand-drawn)">
              <motion.circle 
                cx="50" cy="50" r="32" fill="#EAB67E" 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>
          ) : (
            <svg viewBox="0 0 100 100" width="70" filter="url(#hand-drawn)">
              <path d="M50 20 A30 30 0 1 0 80 50 A25 25 0 1 1 50 20" fill="#F4E0A1" />
            </svg>
          )}
        </RepellingElement>
      </div>

      <div className="hero-content">
        <motion.div variants={sequenceReveal} initial="hidden" animate="visible" className="title-wrapper">
          <h1 className="main-title" style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1', gap: '0.2em', textAlign: 'left', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.85em', fontWeight: 300, letterSpacing: '-0.02em', opacity: 0.9, textAlign: 'left' }}>
              <SplitText text="Convergence of" factor={0.08} variants={wordReveal} />
            </span>
            <span style={{ fontSize: '1.1em', fontWeight: 500, letterSpacing: '-0.03em', textAlign: 'left' }}>
              <SplitText text="Art & Engineering" factor={0.12} variants={wordReveal} />
            </span>
          </h1>
          <motion.div variants={floatUpReveal} className="subtitle-text" style={{ 
            marginTop: '2.5rem', 
            fontSize: '1rem', 
            fontWeight: 200, 
            opacity: theme === 'light' ? 0.95 : 0.6,
            letterSpacing: '0.2em', 
            textAlign: 'left',
            alignSelf: 'flex-start',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <SplitText text="Code is brush, aesthetics is logic" factor={0.02} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';
