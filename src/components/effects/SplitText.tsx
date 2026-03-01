import { useRef, memo } from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useMousePosition } from '../../hooks';
import type { Variants } from 'framer-motion';

interface MagneticCharProps {
  char: string;
  factor: number;
  variants?: Variants;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}

const MagneticChar = memo(({ char, factor, variants, mouseX, mouseY }: MagneticCharProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  
  const x = useTransform(mouseX, (latestX) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const distanceX = latestX - centerX;
    
    const latestY = mouseY.get();
    const centerY = rect.top + rect.height / 2;
    const distanceY = latestY - centerY;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    const radius = 220;
    if (distance < radius) {
      const power = (radius - distance) / radius;
      return distanceX * power * factor;
    }
    return 0;
  });

  const y = useTransform(mouseY, (latestY) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const distanceY = latestY - centerY;
    
    const latestX = mouseX.get();
    const rectX = rect.left + rect.width / 2;
    const distanceX = latestX - rectX;
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    const radius = 220;
    if (distance < radius) {
      const power = (radius - distance) / radius;
      return distanceY * power * factor;
    }
    return 0;
  });

  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  return (
    <motion.span 
      ref={ref} 
      variants={variants}
      style={{ 
        x: springX, 
        y: springY, 
        display: 'inline-block', 
        whiteSpace: 'pre',
        pointerEvents: 'none'
      }}
    >
      {char}
    </motion.span>
  );
});

MagneticChar.displayName = 'MagneticChar';

interface SplitTextProps {
  text: string;
  factor?: number;
  variants?: Variants;
}

export const SplitText = memo(({ text, factor = 0.1, variants }: SplitTextProps) => {
  const { mouseX, mouseY } = useMousePosition();
  
  return (
    <>
      {text.split('').map((char, i) => (
        <MagneticChar 
          key={i} 
          char={char} 
          factor={factor} 
          variants={variants} 
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </>
  );
});

SplitText.displayName = 'SplitText';
