import { useEffect, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface ProximityRiseCharProps {
  char: string;
}

const ProximityRiseChar = memo(({ char }: ProximityRiseCharProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 120, damping: 15 });

  useEffect(() => {
    const calculateDistance = (e: MouseEvent) => {
      if (!ref.current || window.matchMedia('(max-width: 768px)').matches) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2);
      const radius = 250;
      
      if (distance < radius) {
        const power = Math.pow((radius - distance) / radius, 1.5);
        y.set(-35 * power); 
      } else if (y.get() !== 0) {
        y.set(0);
      }
    };

    window.addEventListener('mousemove', calculateDistance, { passive: true });
    return () => window.removeEventListener('mousemove', calculateDistance);
  }, [y]);

  return (
    <motion.span
      ref={ref}
      style={{ y: springY, display: 'inline-block', whiteSpace: 'pre' }}
    >
      {char}
    </motion.span>
  );
});

ProximityRiseChar.displayName = 'ProximityRiseChar';

interface ProximityRiseTextProps {
  text: string;
}

export const ProximityRiseText = memo(({ text }: ProximityRiseTextProps) => {
  return (
    <>
      {text.split('').map((char, i) => (
        <ProximityRiseChar key={i} char={char} />
      ))}
    </>
  );
});

ProximityRiseText.displayName = 'ProximityRiseText';
