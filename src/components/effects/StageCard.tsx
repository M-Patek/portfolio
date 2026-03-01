import React, { useRef, useState, useMemo } from 'react';
import { motion, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useMousePosition, useMobile } from '../../hooks';

// --- 全局纸质手绘滤镜库 (已优化) ---
export const PaperFilter = () => {
  const isMobile = useMobile();
  // 移动端降低复杂度
  const octaves = isMobile ? 1 : 3;
  
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
      <defs>
        <filter id="paper-texture-light">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={octaves} result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60" />
          </feDiffuseLighting>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
        <filter id="paper-texture-dark">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={octaves} result="noise" />
          <feDiffuseLighting in="noise" lightingColor="#1A1A1A" surfaceScale="2.5" diffuseConstant="1.2">
            <feDistantLight azimuth="225" elevation="40" />
          </feDiffuseLighting>
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
        <filter id="hand-drawn">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves={octaves} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={isMobile ? 3 : 5} />
        </filter>
      </defs>
    </svg>
  );
};

// --- 磁感排斥组件 (已优化：使用 normX/normY) ---
const RepellingElement = ({ springX, springY, initialX, initialY, children, factor = 30, style = {}, onClick }: any) => {
  const x = useTransform(springX, [0, 1], [factor, -factor]);
  const y = useTransform(springY, [0, 1], [factor / 2, -factor / 2]);
  return (
    <motion.div onClick={onClick} style={{ position: 'absolute', left: initialX, top: initialY, x, y, ...style }}>
      {children}
    </motion.div>
  );
};

// --- 独立避让萤火虫 (已优化：大幅减少计算链路) ---
const Firefly = ({ x, y, normX, normY }: { x: number, y: number, normX: any, normY: any }) => {
  const randomDelay = useMemo(() => Math.random() * 5, []);
  const randomDuration = useMemo(() => 3 + Math.random() * 4, []);
  
  // 直接利用 transform 链式计算，不使用额外的 useSpring 以提升 FPS
  const repelX = useTransform(normX, (v: number) => {
    const dx = v - (x / 100);
    const dist = Math.abs(dx);
    return dist < 0.15 ? (0.15 - dist) * (dx > 0 ? -150 : 150) : 0;
  });

  const repelY = useTransform(normY, (v: number) => {
    const dy = v - (y / 100);
    const dist = Math.abs(dy);
    return dist < 0.2 ? (0.2 - dist) * (dy > 0 ? -100 : 100) : 0;
  });

  return (
    <motion.div 
      style={{ 
        position: 'absolute', left: `${x}%`, top: `${y}%`, zIndex: 100, pointerEvents: 'none',
        x: repelX, y: repelY
      }}
      animate={{ 
        opacity: [0, 1, 0, 0.8, 0], 
        scale: [0.5, 1.2, 0.5, 1, 0.5],
      }}
      transition={{ 
        duration: randomDuration, 
        repeat: Infinity, 
        delay: randomDelay,
        ease: "easeInOut"
      }}
    >
      <div style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#BAF19C', boxShadow: '0 0 12px #BAF19C' }} />
    </motion.div>
  );
};

// --- Gemini 激发星星 (已优化) ---
const GeminiStar = ({ x, y, size, normX, normY }: any) => {
  const brightness = useTransform([normX, normY], ([sx, sy]: any) => {
    const dist = Math.sqrt(Math.pow(sx * 100 - x, 2) + Math.pow(sy * 100 - y, 2));
    return dist < 12 ? 0.95 : 0.6;
  });
  const dx = useTransform(normX, [0, 1], [5, -5]);
  const dy = useTransform(normY, [0, 1], [5, -5]);

  return (
    <motion.div style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, opacity: brightness, scale: brightness, x: dx, y: dy, pointerEvents: 'none' }}>
      <svg viewBox="0 0 24 24" width={size} height={size} fill="#F4E0A1">
        <path d="M12 0L14.5 9L24 12L14.5 15L12 24L9.5 15L0 12L9.5 9Z" />
      </svg>
    </motion.div>
  );
};

// ... (SmoothHillSilhouette, GrassSilhouette, House unchanged) ...

const SmoothHillSilhouette = ({ bottom, left, width, height, color, opacity, zIndex = 1 }: any) => (
  <svg viewBox="0 0 1000 200" width={width} height={height} style={{ position: 'absolute', bottom, left, opacity, pointerEvents: 'none', zIndex }} preserveAspectRatio="none">
    <path d="M0 200 L0 100 Q 250 20, 500 100 T 1000 100 L 1000 200 Z" fill={color} />
  </svg>
);

const GrassSilhouette = ({ bottom, left, width, height, color, opacity, filter = "url(#hand-drawn)" }: any) => (
  <svg viewBox="0 0 400 100" width={width} height={height} style={{ position: 'absolute', bottom, left, opacity, pointerEvents: 'none' }} preserveAspectRatio="none" filter={filter}>
    <path d="M0 100 L0 60 L20 80 L40 40 L60 70 L100 30 L140 85 L180 50 L220 90 L260 40 L300 70 L340 35 L380 80 L400 60 L400 100 Z" fill={color} />
  </svg>
);

const House = ({ bottom, left, scale, theme, isDistant }: any) => {
  const mainColor = theme === 'dark' ? '#1A1A1D' : (isDistant ? '#95a5a6' : '#2C3E50');
  const roofColor = theme === 'dark' ? '#080808' : (isDistant ? '#7f8c8d' : '#1D1D1F');
  const windowColor = theme === 'dark' ? '#F1C40F' : '#FFF';
  const accentColor = theme === 'dark' ? '#D35400' : (isDistant ? '#bdc3c7' : '#E67E22');

  return (
    <div style={{ position: 'absolute', bottom, left, transform: `scale(${scale})`, transformOrigin: 'bottom', pointerEvents: 'none', zIndex: 10 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" filter="url(#hand-drawn)">
        <rect x="52" y="15" width="8" height="20" fill={mainColor} />
        <rect x="50" y="12" width="12" height="4" fill={roofColor} />
        <path d="M10 35 L40 5 L70 35 Z" fill={roofColor} />
        <path d="M8 38 L40 8 L72 38 Z" fill="none" stroke={roofColor} strokeWidth="1.5" />
        <path d="M15 35 L65 35 L65 75 L15 75 Z" fill={mainColor} />
        <g transform="translate(22, 45)">
          <rect width="12" height="12" fill={windowColor} opacity={theme === 'dark' ? 0.9 : 0.6} />
          <rect width="12" height="12" fill="none" stroke={roofColor} strokeWidth="0.5" />
          <line x1="6" y1="0" x2="6" y2="12" stroke={roofColor} strokeWidth="0.5" />
          <line x1="0" y1="6" x2="12" y2="6" stroke={roofColor} strokeWidth="0.5" />
        </g>
        <g transform="translate(46, 45)">
          <rect width="12" height="12" fill={windowColor} opacity={theme === 'dark' ? 0.9 : 0.6} />
          <rect width="12" height="12" fill="none" stroke={roofColor} strokeWidth="0.5" />
          <line x1="6" y1="0" x2="6" y2="12" stroke={roofColor} strokeWidth="0.5" />
          <line x1="0" y1="6" x2="12" y2="6" stroke={roofColor} strokeWidth="0.5" />
        </g>
        <rect x="34" y="58" width="12" height="17" fill={accentColor} opacity="0.8" />
        <circle cx="43" cy="66" r="1" fill={windowColor} />
      </svg>
    </div>
  );
};

const SimpleSun = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.svg 
      viewBox="0 0 100 100" width="100" filter="url(#hand-drawn)"
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
      onClick={onClick}
    >
      <motion.circle 
        cx="50" cy="50" r="32" 
        fill="#FFD700"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

export const StageCard: React.FC<{ index: number; theme: 'light' | 'dark'; toggleTheme: () => void }> = ({ index, theme, toggleTheme }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { normX, normY } = useMousePosition();
  const isMobile = useMobile();
  
  const springX = useSpring(normX, { stiffness: 100, damping: 30 });
  const springY = useSpring(normY, { stiffness: 100, damping: 30 });

  const getLayerAnimate = (layerIdx: number) => {
    const rel = layerIdx - index;
    return {
      z: rel > 0 ? rel * -200 : rel * -400,
      opacity: rel < 0 ? 0 : 1,
      scale: rel < 0 ? 1.4 : 1,
      // 移动端减少 blur 滤镜以提升性能
      filter: isMobile ? 'none' : `blur(${Math.abs(rel) * 5}px)`
    };
  };

  const colors = {
    // 改为半透明，允许父级 glass 效果穿透
    bg: theme === 'dark' ? 'rgba(13, 13, 15, 0.3)' : 'rgba(245, 249, 255, 0.3)',
    tree: theme === 'dark' ? '#080808' : '#1D1D1F',
    grass: theme === 'dark' ? '#1A2416' : '#4D6B3C',
    horizon: theme === 'dark' ? '#161A21' : '#E0E0E0'
  };

  const cloudColor = theme === 'dark' ? '#E0E0E0' : 'white';
  const cloudOpacity = theme === 'dark' ? 0.25 : 0.6;

  const spotlightBg = useMotionTemplate`radial-gradient(circle at ${useTransform(springX, v => v*100)}% ${useTransform(springY, v => v*100)}%, rgba(255,250,200,${theme === 'dark' ? 0.12 : 0.08}) 0%, transparent 6%)`;

  const flameSkewX = useTransform(springX, [0, 1], [-15, 15]);

  return (
    <div 
      ref={cardRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      className="depth-stage-container"
      style={{ width: '100%', height: '100%', background: colors.bg, perspective: '1500px', transformStyle: 'preserve-3d', position: 'relative', overflow: 'hidden' }}
    >
      <PaperFilter />

      {/* --- LAYER 2: 第三层 (远景天空) --- */}
      <motion.div animate={getLayerAnimate(2)} style={{ position: 'absolute', inset: 0, zIndex: 1, transformStyle: 'preserve-3d', pointerEvents: 'none' }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: theme === 'dark' 
            ? 'linear-gradient(to bottom, rgba(10, 10, 12, 0.5), rgba(20, 20, 24, 0.8))' 
            : 'linear-gradient(to bottom, rgba(235, 243, 255, 0.5), rgba(255, 255, 255, 0.8))', 
          filter: theme === 'dark' ? 'url(#paper-texture-dark)' : 'url(#paper-texture-light)' 
        }} />
        
        <RepellingElement springX={springX} springY={springY} initialX="15%" initialY="15%" scale={1.5} factor={40}>
           <svg viewBox="0 0 100 50" width="180" opacity={cloudOpacity} filter="url(#hand-drawn)"><path d="M10 40 Q25 10 40 30 Q55 10 70 30 Q85 10 90 40 Z" fill={cloudColor} /></svg>
        </RepellingElement>
        <RepellingElement springX={springX} springY={springY} initialX="60%" initialY="25%" scale={1.2} factor={30}>
           <svg viewBox="0 0 100 50" width="150" opacity={cloudOpacity * 0.8} filter="url(#hand-drawn)"><path d="M10 40 Q25 10 40 30 Q55 10 70 30 Q85 10 90 40 Z" fill={cloudColor} /></svg>
        </RepellingElement>

        {theme === 'light' ? (
          <RepellingElement springX={springX} springY={springY} initialX="75%" initialY="15%" factor={50} style={{ zIndex: 100 }}>
             <SimpleSun onClick={toggleTheme} />
          </RepellingElement>
        ) : (
          <>
            <RepellingElement springX={springX} springY={springY} initialX="75%" initialY="15%" factor={40} style={{ cursor: 'pointer', pointerEvents: 'auto', zIndex: 100 }} onClick={toggleTheme}>
               <svg viewBox="0 0 100 100" width="80" filter="url(#hand-drawn)"><path d="M50 20 A30 30 0 1 0 80 50 A25 25 0 1 1 50 20" fill="#F4E0A1" /></svg>
            </RepellingElement>
            {!isMobile && [...Array(30)].map((_, i) => (
              <GeminiStar key={i} x={5 + (i * 13 + Math.sin(i)*20) % 90} y={5 + (i * 17 + Math.cos(i)*15) % 60} size={6 + (i % 8)} normX={normX} normY={normY} />
            ))}
          </>
        )}
      </motion.div>

      {/* --- LAYER 1: 连绵草原 (包含精致房子) --- */}
      <motion.div animate={getLayerAnimate(1)} style={{ position: 'absolute', inset: 0, zIndex: 2, transformStyle: 'preserve-3d', pointerEvents: 'none' }}>
        <RepellingCloud springX={springX} springY={springY} initialX="40%" initialY="20%" factor={35} scale={1.3} theme={theme} />
        
        <SmoothHillSilhouette bottom="32%" left="-20%" width="80%" height="180px" color={theme === 'dark' ? '#0A1208' : '#CCE0BC'} opacity={0.4} />
        <SmoothHillSilhouette bottom="30%" left="40%" width="90%" height="160px" color={theme === 'dark' ? '#0F1A0C' : '#DDE8D2'} opacity={0.5} />
        <SmoothHillSilhouette bottom="28%" left="-10%" width="120%" height="200px" color={theme === 'dark' ? '#141F12' : '#B8D6AF'} opacity={0.6} />
        
        <House bottom="38%" left="15%" scale={0.45} theme={theme} isDistant={true} />
        <House bottom="35%" left="48%" scale={0.4} theme={theme} isDistant={true} />
        <House bottom="36%" left="82%" scale={0.35} theme={theme} isDistant={true} />

        <div style={{ position: 'absolute', bottom: -10, width: '100%', height: '250px' }}>
           <GrassSilhouette bottom="0" left="0" width="100%" height="250px" color={colors.grass} opacity={0.9} />
           <GrassSilhouette bottom="-20px" left="-5%" width="110%" height="280px" color={colors.grass} opacity={0.7} />
        </div>

        {!isMobile && [...Array(12)].map((_, i) => (
          <Firefly key={i} x={15 + (i * 8) % 70} y={60 + (i * 11) % 30} normX={normX} normY={normY} />
        ))}
      </motion.div>

      {/* --- LAYER 0: 营地前景 --- */}
      <motion.div animate={getLayerAnimate(0)} style={{ position: 'absolute', inset: 0, zIndex: 3, transformStyle: 'preserve-3d', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '35%', background: theme === 'dark' ? '#080A0F' : '#F0F4F8', filter: theme === 'dark' ? 'url(#paper-texture-dark)' : 'url(#paper-texture-light)', pointerEvents: 'none' }} />
        
        <RepellingElement springX={springX} springY={springY} initialX="10%" initialY="15%" factor={45}>
           <svg viewBox="0 0 100 50" width="200" opacity={cloudOpacity} filter="url(#hand-drawn)"><path d="M10 40 Q25 10 40 30 Q55 10 70 30 Q85 10 90 40 Z" fill={cloudColor} /></svg>
        </RepellingElement>
        <RepellingElement springX={springX} springY={springY} initialX="65%" initialY="10%" factor={55}>
           <svg viewBox="0 0 100 50" width="220" opacity={cloudOpacity * 0.9} filter="url(#hand-drawn)"><path d="M10 40 Q25 10 40 30 Q55 10 70 30 Q85 10 90 40 Z" fill={cloudColor} /></svg>
        </RepellingElement>

        <div style={{ position: 'absolute', left: '2%', bottom: '5%', zIndex: 10 }}>
           <svg viewBox="0 0 200 350" width="320" filter="url(#hand-drawn)">
              <path d="M100 350 Q85 300 100 200" stroke={colors.tree} strokeWidth="16" fill="none" />
              <path d="M100 40 Q180 60 200 130 Q210 210 160 260 Q100 280 40 260 Q0 210 10 130 Q30 60 100 40 Z" fill={colors.tree} opacity="0.95" />
              <path d="M50 110 Q90 80 150 110 Q180 160 150 220 Q90 240 50 210 Q20 160 50 110 Z" fill={colors.tree} opacity="0.9" />
           </svg>
        </div>

        <div style={{ position: 'absolute', left: '58%', bottom: '15%', zIndex: 10 }}>
           <svg viewBox="0 0 160 60" width="180" filter="url(#hand-drawn)">
              <rect x="10" y="20" width="140" height="25" rx="12" fill="#140D07" />
              <g transform="translate(115, 5)">
                 <rect x="0" y="5" width="12" height="15" rx="2" fill={theme === 'dark' ? '#2C3E50' : '#ADB5BD'} />
                 <motion.path d="M4 0 Q6 -4 4 -8 M8 -2 Q10 -6 8 -10" stroke={theme === 'dark' ? "#FFF" : "#000"} strokeWidth="1.5" opacity="0.3" fill="none" animate={{ y: [0, -8], opacity: [0, 0.6, 0] }} transition={{ duration: 2, repeat: Infinity }} />
              </g>
           </svg>
        </div>

        <div style={{ position: 'absolute', left: '42%', bottom: '12%', zIndex: 15 }}>
           <svg viewBox="0 0 100 100" width="120" filter="url(#hand-drawn)">
              <g stroke="#1A1108" strokeWidth="7" strokeLinecap="round">
                <line x1="10" y1="95" x2="90" y2="85" /><line x1="15" y1="80" x2="85" y2="95" />
                <line x1="30" y1="75" x2="70" y2="98" /><line x1="40" y1="98" x2="60" y2="75" />
                <line x1="20" y1="88" x2="80" y2="88" opacity="0.6" /><line x1="50" y1="70" x2="50" y2="98" opacity="0.8" />
              </g>
           </svg>
           <motion.div 
             style={{ 
               position: 'absolute', left: 0, top: 0, width: 120, height: 100,
               transformOrigin: "bottom center",
               skewX: flameSkewX,
               pointerEvents: 'none'
             }}
           >
              <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ position: 'absolute', width: 140, height: 140, background: `radial-gradient(circle, #D35400 0%, transparent 70%)`, filter: 'blur(30px)', left: -10, top: -20 }} />
              <svg viewBox="0 0 100 100" width="120" filter="url(#hand-drawn)">
                <motion.path d="M50 5 Q80 45 50 85 Q20 45 50 5" fill="#C0392B" animate={{ scaleY: [1, 1.1, 0.9] }} transition={{ duration: 0.7, repeat: Infinity }} />
                <motion.path d="M50 20 Q70 50 50 80 Q30 50 50 20" fill="#E67E22" animate={{ scaleY: [1, 1.15, 0.9] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
                <motion.path d="M50 40 Q60 60 50 75 Q40 60 50 40" fill="#F1C40F" animate={{ scaleY: [1, 1.2, 0.8] }} transition={{ duration: 0.4, repeat: Infinity, delay: 0.2 }} />
              </svg>
              {!isMobile && [...Array(6)].map((_, i) => (
                <motion.div key={i} style={{ position: 'absolute', width: 2, height: 2, background: '#F39C12', borderRadius: '50%', left: `${40 + Math.random() * 20}%`, bottom: '40%' }}
                  animate={{ y: [0, -100], x: [(Math.random()-0.5)*50], opacity: [0, 1, 0] }} transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: i*0.2 }}
                />
              ))}
           </motion.div>
        </div>
      </motion.div>

      {!isMobile && <motion.div animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none', background: spotlightBg, mixBlendMode: theme === 'dark' ? 'screen' : 'soft-light' }} />}
    </div>
  );
};

const RepellingCloud = ({ springX, springY, initialX, initialY, scale = 1, factor = 30, theme }: any) => {
  const cloudColor = theme === 'dark' ? '#E0E0E0' : 'white';
  const cloudOpacity = theme === 'dark' ? 0.2 : 0.6;
  return (
    <RepellingElement springX={springX} springY={springY} initialX={initialX} initialY={initialY} factor={factor}>
       <svg viewBox="0 0 100 50" width={100 * scale} opacity={cloudOpacity} filter="url(#hand-drawn)"><path d="M10 40 Q25 10 40 30 Q55 10 70 30 Q85 10 90 40 Z" fill={cloudColor} /></svg>
    </RepellingElement>
  );
};
