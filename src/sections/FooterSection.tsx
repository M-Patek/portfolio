import React from 'react';
import { motion } from 'framer-motion';
import { Github, Mail } from 'lucide-react';
import { Magnetic, ProximityRiseText, SplitText, statelyReveal } from '../components/effects';
import { XLogo } from '../components/ui/Icons';
import type { Content } from '../types';

interface FooterSectionProps {
  t: Content;
  id?: string;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ t, id }) => {
  return (
    <section id={id} style={{ textAlign: 'center', margin: '150px 0 250px 0' }}>
      <motion.h2 
        variants={statelyReveal} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }} 
        style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)', marginBottom: '40px' }}
      >
        <ProximityRiseText text={t.resonance} />
      </motion.h2>
      <div style={{ display: 'flex', gap: '50px', justifyContent: 'center', marginBottom: '60px' }}>
        <Magnetic>
          <motion.a 
            whileHover={{ scale: 1.25, color: 'var(--accent-claude)' }} 
            href="https://github.com/M-Patek" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Github size={32} />
          </motion.a>
        </Magnetic>
        <Magnetic>
          <motion.a 
            whileHover={{ scale: 1.25, color: 'var(--accent-claude)' }} 
            href="https://x.com/M_I3reak" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <XLogo size={32} />
          </motion.a>
        </Magnetic>
        <Magnetic>
          <motion.a 
            whileHover={{ scale: 1.25, color: 'var(--accent-claude)' }} 
            href="mailto:monetwl@outlook.com"
          >
            <Mail size={32} />
          </motion.a>
        </Magnetic>
      </div>
      <motion.div className="bottom-philosophy-quote">
        <SplitText text={t.bottomQuote} factor={0.08} />
      </motion.div>
    </section>
  );
};
