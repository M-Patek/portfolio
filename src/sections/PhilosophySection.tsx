import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ProximityRiseText, statelyReveal } from '../components/effects';
import { useScrollAccumulator } from '../hooks';
import type { Content } from '../types';

interface PhilosophySectionProps {
  t: Content;
  isMobile: boolean;
  activePhilosophy: number;
  setActivePhilosophy: (index: number) => void;
  id?: string;
}

export const PhilosophySection: React.FC<PhilosophySectionProps> = ({
  t,
  isMobile,
  activePhilosophy,
  setActivePhilosophy,
  id,
}) => {
  // 建立容器 Ref
  const stackContainerRef = useRef<HTMLElement>(null);
  
  useScrollAccumulator({
    containerRef: stackContainerRef as React.RefObject<HTMLElement>,
    isMobile,
    activePhilosophy,
    setActivePhilosophy,
    maxIndex: 2,
  });

  const cardAnimation = (index: number) => {
    if (isMobile) return {};
    return {
      x: activePhilosophy > index ? '-130%' : 0,
      y: activePhilosophy === index ? 0 : (index - activePhilosophy) * 20 + 20,
      scale: activePhilosophy === index ? 1 : 1 - Math.abs(index - activePhilosophy) * 0.05,
      opacity: activePhilosophy > index ? 0 : 1 - Math.abs(index - activePhilosophy) * 0.2,
      zIndex: 100 - index,
      rotateY: activePhilosophy === index ? 0 : -5 * (index - activePhilosophy)
    };
  };

  return (
    <section ref={stackContainerRef} id={id} className="philosophy-section-container" style={{ position: 'relative', zIndex: 1 }}>
      <div className="section-header-left">
        <motion.h2 
          variants={statelyReveal} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)' }}
        >
          <ProximityRiseText text={t.philosophyTitle} />
        </motion.h2>
      </div>
      <div 
        className={`philosophy-stack-wrapper ${isMobile ? 'mobile-scroll' : ''}`}
      >
        {/* 关键修复：添加高度占位元素，确保父容器能自适应包裹绝对定位的卡片内容 */}
        {!isMobile && (
          <div className="philosophy-card-spacer" style={{ visibility: 'hidden', pointerEvents: 'none', position: 'relative', width: '100%', padding: '80px 60px' }}>
            <h2 className="manifesto-title">{t.chapter1.title}</h2>
            <div className="manifesto-text">
              <p>{t.chapter1.text}</p>
              <div className="quote-accent grey-quote-bg">
                <p>"{t.chapter1.quote}"</p>
              </div>
            </div>
          </div>
        )}

        <motion.div 
          className="philosophy-card glass stacked" 
          animate={cardAnimation(0)} 
          transition={{ type: 'spring', stiffness: 200, damping: 25 }} 
          whileHover={!isMobile && activePhilosophy === 0 ? { y: -8 } : {}}
        >
          <span className="manifesto-tag">{t.chapter1.tag}</span>
          <h2 className="manifesto-title" style={{ color: 'var(--accent-claude)' }}>{t.chapter1.title}</h2>
          <div className="title-divider" style={{ width: '40px', height: '2px', background: 'var(--accent-claude)', margin: '16px 0 24px 0', opacity: 0.6 }}></div>
          <div className="manifesto-text">
            <p>{t.chapter1.text}</p>
            <div className="quote-accent grey-quote-bg">
              <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>"{t.chapter1.quote}"</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="philosophy-card glass stacked" 
          animate={cardAnimation(1)} 
          transition={{ type: 'spring', stiffness: 200, damping: 25 }} 
          whileHover={!isMobile && activePhilosophy === 1 ? { y: -8 } : {}}
        >
          <span className="manifesto-tag">{t.chapter2.tag}</span>
          <h2 className="manifesto-title" style={{ color: 'var(--accent-claude)' }}>{t.chapter2.title}</h2>
          <div className="title-divider" style={{ width: '40px', height: '2px', background: 'var(--accent-claude)', margin: '16px 0 24px 0', opacity: 0.6 }}></div>
          <div className="manifesto-text">
            <p>{t.chapter2.text}</p>
            <p style={{ marginTop: '24px' }}>{t.chapter2.desc}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="philosophy-card glass stacked" 
          animate={cardAnimation(2)} 
          transition={{ type: 'spring', stiffness: 200, damping: 25 }} 
          whileHover={!isMobile && activePhilosophy === 2 ? { y: -8 } : {}}
        >
          <span className="manifesto-tag">{t.chapter3.tag}</span>
          <h2 className="manifesto-title" style={{ color: 'var(--accent-claude)' }}>{t.chapter3.title}</h2>
          <div className="title-divider" style={{ width: '40px', height: '2px', background: 'var(--accent-claude)', margin: '16px 0 24px 0', opacity: 0.6 }}></div>
          <div className="manifesto-text">
            <p>{t.chapter3.text}</p>
            <div className="manifesto-footer">{t.chapter3.footer}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
