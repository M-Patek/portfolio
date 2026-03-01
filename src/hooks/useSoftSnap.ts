import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export const useSoftSnap = () => {
  const scrollTimeoutRef = useRef<number | null>(null);
  const isSnappingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isSnappingRef.current) return;

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      // 进一步增加静止检测时间到 250ms，确保浏览器惯性滚动彻底停止
      scrollTimeoutRef.current = window.setTimeout(() => {
        performSoftSnap();
      }, 250);
    };

    const performSoftSnap = () => {
      const currentY = window.scrollY;
      const viewportHeight = window.innerHeight;

      // --- 关键改进 1: 首页意图识别 ---
      // 如果离顶部已经有一小段距离（>40px）且还没到下个区块，系统必须“放手”
      // 这里的 40% 视口高度是“自由区”，不进行任何吸附，防止回弹
      if (currentY > 40 && currentY < viewportHeight * 0.4) {
        return;
      }

      const sections = document.querySelectorAll('.page-wrapper > section');
      let targetSectionY = -1;
      let minDistance = 100; // 默认吸附半径

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const offset = rect.top;
        const distance = Math.abs(offset);

        // --- 关键改进 2: 分级吸附半径 ---
        let triggerRadius = minDistance;
        if (index === 0) triggerRadius = 40; // 首页极其克制，只有快到家了才吸附

        if (distance < triggerRadius) {
          minDistance = distance;
          targetSectionY = currentY + offset;
        }
      });

      // --- 关键改进 3: 超慢速丝滑曲线 ---
      if (targetSectionY !== -1 && Math.abs(currentY - targetSectionY) > 5) {
        isSnappingRef.current = true;
        
        // 计算一个基于距离的弹性时长，距离越短越缓慢
        const baseDuration = 2.5;
        
        animate(currentY, targetSectionY, {
          type: "tween",
          // [0.16, 1, 0.3, 1] 是一种极度优雅的减速曲线，结尾几乎是飘进去的
          ease: [0.16, 1, 0.3, 1], 
          duration: baseDuration,
          onUpdate: (latest) => window.scrollTo(0, latest),
          onComplete: () => {
            isSnappingRef.current = false;
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const interruptSnap = () => {
      if (isSnappingRef.current) {
        isSnappingRef.current = false;
      }
    };
    window.addEventListener('wheel', interruptSnap, { passive: true });
    window.addEventListener('touchstart', interruptSnap, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', interruptSnap);
      window.removeEventListener('touchstart', interruptSnap);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);
};
