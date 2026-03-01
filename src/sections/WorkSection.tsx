import React from 'react';
import { motion } from 'framer-motion';
import { ProximityRiseText, statelyReveal, StageCard } from '../components/effects';
import type { Content, Language } from '../types';

interface WorkSectionProps {
  t: Content;
  lang: Language;
  theme: 'light' | 'dark';
  isMobile: boolean;
  activeWork: number;
  setActiveWork: (index: number) => void;
  toggleTheme: () => void;
  id?: string;
}

export const WorkSection: React.FC<WorkSectionProps> = ({
  t,
  theme,
  activeWork,
  toggleTheme,
  id,
}) => {
  return (
    <section id={id} className="philosophy-section-container work-theater-container">
      <div className="section-header-left">
        <motion.h2 
          variants={statelyReveal} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)' }}
        >
          <ProximityRiseText text={t.practiceTitle} />
        </motion.h2>
      </div>

      <div className="theater-stack-wrapper" style={{ marginTop: '0' }}>
        <div className="theater-stack depth-theater-mode">
           <div className="stage-theater-frame glass" style={{ padding: 0, overflow: 'hidden', pointerEvents: 'auto' }}>
              <StageCard index={activeWork} theme={theme} toggleTheme={toggleTheme} />
           </div>
        </div>
      </div>
    </section>
  );
};
