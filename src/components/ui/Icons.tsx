

import { motion } from 'framer-motion';

// 一个更具建筑感和工程感的通用 Logo
export const CoreLogo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="32" height="32" rx="2" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M4 20H36" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M20 4V36" stroke="currentColor" strokeWidth="2.5"/>
    <rect x="14" y="14" width="12" height="12" fill="var(--accent-claude)"/>
  </svg>
);

export const ChevronDown = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const MenuIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.line 
      x1="3" y1="6" x2="21" y2="6" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      animate={{ 
        rotate: isOpen ? 45 : 0, 
        y: isOpen ? 6 : 0,
        x1: isOpen ? 4 : 3
      }}
    />
    <motion.line 
      x1="3" y1="12" x2="21" y2="12" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      animate={{ opacity: isOpen ? 0 : 1 }}
    />
    <motion.line 
      x1="3" y1="18" x2="21" y2="18" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      animate={{ 
        rotate: isOpen ? -45 : 0, 
        y: isOpen ? -6 : 0,
        x1: isOpen ? 4 : 3
      }}
    />
  </svg>
);

export const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const XLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"/>
  </svg>
);

export const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

export const ExternalLink = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);
