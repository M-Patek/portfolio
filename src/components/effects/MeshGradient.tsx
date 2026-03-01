import React from 'react';
import type { Theme } from '../../types';

interface MeshGradientProps {
  theme: Theme;
}

export const MeshGradient: React.FC<MeshGradientProps> = ({ theme }) => (
  <div className="mesh-gradient-container" data-theme={theme}>
    <div className="mesh-ball ball-1"></div>
    <div className="mesh-ball ball-2"></div>
    <div className="mesh-ball ball-3"></div>
  </div>
);
