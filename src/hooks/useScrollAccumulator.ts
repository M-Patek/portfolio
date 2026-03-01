import { useRef, useEffect } from 'react';

interface UseScrollAccumulatorProps {
  containerRef: React.RefObject<HTMLElement>;
  isMobile: boolean;
  activePhilosophy: number;
  setActivePhilosophy: (index: number) => void;
  maxIndex: number;
}

export const useScrollAccumulator = ({
  containerRef,
  isMobile,
  activePhilosophy,
  setActivePhilosophy,
  maxIndex,
}: UseScrollAccumulatorProps) => {
  const scrollAccumulator = useRef(0);
  const isAnimating = useRef(false);
  const lastScrollTime = useRef(0);
  const activeIndexRef = useRef(activePhilosophy);

  useEffect(() => {
    activeIndexRef.current = activePhilosophy;
  }, [activePhilosophy]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || isMobile) return;

    const handleWheel = (e: WheelEvent) => {
      const delta = e.deltaY;
      const now = Date.now();
      const currentIdx = activeIndexRef.current;

      // --- 关键增强：边界判断与拦截分离 ---
      
      // 1. 如果还在卡片切换逻辑内（不在第一张向上或最后一张向下），则【必须】拦截
      const isAtStartScrollingUp = currentIdx === 0 && delta < 0;
      const isAtEndScrollingDown = currentIdx === maxIndex && delta > 0;
      
      if (!isAtStartScrollingUp && !isAtEndScrollingDown) {
        if (e.cancelable) e.preventDefault();
      } else {
        // 到达边界，释放给浏览器原生滚动
        return;
      }

      // 2. 处于动画冷却期时，我们已经拦截了事件，此时直接退出处理函数
      if (isAnimating.current) return;

      // --- 核心累加算法 ---
      if (now - lastScrollTime.current > 50 || (delta * scrollAccumulator.current < 0)) {
        scrollAccumulator.current = 0;
      }
      lastScrollTime.current = now;
      scrollAccumulator.current += delta;

      // 稍微调大一点阈值 (70)，以防微小抖动触发切换
      const threshold = 70;
      if (Math.abs(scrollAccumulator.current) >= threshold) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;
        const nextIndex = currentIdx + direction;

        if (nextIndex >= 0 && nextIndex <= maxIndex) {
          isAnimating.current = true;
          setActivePhilosophy(nextIndex);
          scrollAccumulator.current = 0;
          // 增加到 500ms 冷却，确保动画彻底完成前不会接收下一次滚动
          setTimeout(() => { isAnimating.current = false; }, 500);
        }
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, [isMobile, maxIndex, setActivePhilosophy, containerRef]);

  return { scrollAccumulator };
};
