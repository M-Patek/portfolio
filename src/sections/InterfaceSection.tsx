import React from 'react';
import { motion } from 'framer-motion';
import { ProximityRiseText, statelyReveal } from '../components/effects';
import type { Theme, Content } from '../types';

interface InterfaceSectionProps {
  t: Content;
  theme: Theme;
  toggleTheme: () => void;
  toggleLang?: () => void;
  id?: string;
}

export const InterfaceSection: React.FC<InterfaceSectionProps> = ({
  t,
  theme,
  toggleTheme,
  toggleLang,
  id,
}) => {
  return (
    <section id={id} className="single-window-section" style={{ flexDirection: 'column', alignItems: 'center' }}>
      <div className="section-header-left">
        <motion.h2 
          variants={statelyReveal} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)', marginBottom: '40px' }}
        >
          <ProximityRiseText text={t.windowTitle} />
        </motion.h2>
      </div>
      <motion.div 
        className="code-window single-interface" 
        variants={statelyReveal} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        whileHover={{ y: -10 }}
      >
        <div className="code-header">
          <div className="code-dots">
            <div className="control-dot red"></div>
            <div className="control-dot yellow"></div>
            <div className="control-dot green"></div>
          </div>
          <div className="code-title">humanist.interface.ts</div>
        </div>
        <div className="code-content">
          <div className="settings-item">
            <span className="key">interface</span> <span className="method">ClaudeAesthetic</span> &#123;<br />
            &nbsp;&nbsp;mode: <span className="string interactive-toggle" onClick={toggleTheme}>"{theme}"</span>;<br />
            &nbsp;&nbsp;localization: <span className="string interactive-toggle" onClick={toggleLang}>"EN"</span>;<br />
            &nbsp;&nbsp;philosophy: <span className="string">"Humanist Design"</span>;<br />
            &#125;<br /><br />
            <span className="comment">// Click mode property to toggle system theme</span><br />
            <span className="key">const</span> <span className="method">render</span> = (ctx) =&gt; ctx.<span className="method">merge</span>(Aesthetic.philosophy);
          </div>
        </div>
      </motion.div>
    </section>
  );
};
