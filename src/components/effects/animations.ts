import type { Variants } from 'framer-motion';

// 基础动效 - 保持兼容性
export const statelyReveal: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

// 提速后的序列显现 - 用于标题
export const sequenceReveal: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.4, 
      ease: "linear",
      staggerChildren: 0.025 // 大幅提速，显现更干脆
    } 
  }
};

// 单词/字符级显现
export const wordReveal: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.3 } 
  }
};

// 上浮渐显 - 用于副标题
export const floatUpReveal: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
      delay: 0.4 // 随标题提速而提前触发
    } 
  }
};

// 卷轴展开动画 - 深度优化版 (修复模糊在动画期间失效)
export const scrollUnfold: Variants = {
  hidden: { 
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.2, ease: "easeOut" }
  },
  visible: { 
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.2, ease: "easeIn" }
  }
};
