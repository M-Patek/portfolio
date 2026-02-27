import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { Mail, Folder, Github, ExternalLink, Monitor, Shield } from 'lucide-react';
import './App.css';

// X (formerly Twitter) Icon Component
const XIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// 1. Magnetic Character Component
const MagneticChar = ({ children, factor = 0.1 }: { children: string, factor?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const calculateDistance = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
      const radius = 220;
      if (distance < radius) {
        const power = (radius - distance) / radius;
        x.set(distanceX * power * factor);
        y.set(distanceY * power * factor);
      } else {
        x.set(0); y.set(0);
      }
    };
    window.addEventListener('mousemove', calculateDistance);
    return () => window.removeEventListener('mousemove', calculateDistance);
  }, [factor]);

  return (
    <motion.span ref={ref} style={{ x: springX, y: springY, display: 'inline-block', whiteSpace: 'pre' }}>
      {children}
    </motion.span>
  );
};

const SplitText = ({ text, factor }: { text: string, factor?: number }) => {
  return (
    <>
      {text.split('').map((char, i) => (
        <MagneticChar key={i} factor={factor}>{char}</MagneticChar>
      ))}
    </>
  );
};

// 2. Magnetic Component
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ x: springX, y: springY }}>
      {children}
    </motion.div>
  );
};

// 3. Proximity Rise Component for individual characters
const ProximityRiseChar = ({ children }: { children: string }) => {
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
      } else {
        y.set(0);
      }
    };
    window.addEventListener('mousemove', calculateDistance);
    return () => window.removeEventListener('mousemove', calculateDistance);
  }, []);

  return (
    <motion.span ref={ref} style={{ y: springY, display: 'inline-block', whiteSpace: 'pre' }}>
      {children}
    </motion.span>
  );
};

const ProximityRiseText = ({ text }: { text: string }) => (
  <>
    {text.split('').map((char, i) => (
      <ProximityRiseChar key={i}>{char}</ProximityRiseChar>
    ))}
  </>
);

// 4. Claude Cursor
const ClaudeCursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px) or (pointer: coarse)').matches);
    checkMobile();
    const moveMouse = (e: MouseEvent) => {
      if (isMobile) return;
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };
    window.addEventListener('mousemove', moveMouse);
    return () => window.removeEventListener('mousemove', moveMouse);
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <motion.div className="custom-cursor" style={{ x: mouseX, y: mouseY }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <path d="M0 0 L0 16.37 L4.44 11.93 L7.84 19.37 L11.24 17.81 L7.84 10.37 L13.33 10.37 Z" fill="var(--cursor-color)"/>
      </svg>
    </motion.div>
  );
};

const statelyReveal: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

const MeshGradient = ({ theme }: { theme: 'light' | 'dark' }) => (
  <div className="mesh-gradient-container" data-theme={theme}>
    <div className="mesh-ball ball-1"></div>
    <div className="mesh-ball ball-2"></div>
    <div className="mesh-ball ball-3"></div>
  </div>
);

const content = {
  cn: {
    title: "艺术与工程的交汇点",
    subtitle: "—— 代码是笔触，美学是逻辑",
    windowTitle: "选择你的旅途",
    philosophyTitle: "哲学与范式",
    practiceTitle: "实践与探索",
    resonance: "共鸣",
    bottomQuote: "代码是冰冷的逻辑，而设计是温暖的诗意。 —— 我们在 0 与 1 的缝隙中寻找灵魂。",
    chapter1: { tag: "Chapter 01 / Dialogue", title: "设计即对话：Claude 的人文余温", text: "设计不应只是指令的堆砌，而是一场跨越维度的对话。在 Claude 的设计逻辑中，我们寻找一种深沉的“倾听感”。正如纸张承载墨迹，屏幕亦应承载情感。", quote: "真正的简洁，不是消除复杂，而是驯服它。让机器在理解逻辑的同时，学会理解沉默。" },
    chapter2: { tag: "Chapter 02 / Materiality", title: "数字的物理性：Apple 的玻璃哲学", text: "玻璃、阴影、动态模糊——Apple 用像素复刻了物理世界的直觉。每一处模糊背后，都是对用户感官的尊重。我们追求的不仅是美，更是一种“触手可及”的真实感。", desc: "在 0 与 1 的绝对精确之间，模糊性赋予了界面以生命力，正如真实世界中没有绝对的边界。" },
    chapter3: { tag: "Chapter 03 / The Silence", title: "留白的艺术：少，即是无限", text: "当所有人都试图填满空间时，我们选择留白。留白不是空白，而是给思考留出的呼吸窗口。在极致的极简中，用户才能找到真正的自由。", footer: "对设计、技术与人文的思考。" },
    projectDesc: "探索如何将设计哲学转化为可被感知、可被触碰的数字实体。每一个像素都经过深思熟虑。"
  },
  en: {
    title: "Convergence of Art & Engineering",
    subtitle: "—— Code is brush, aesthetics is logic",
    windowTitle: "Choose Your Journey",
    philosophyTitle: "Philosophy & Paradigms",
    practiceTitle: "Practice & Exploration",
    resonance: "Resonance",
    bottomQuote: "Code is cold logic, while design is warm poetry. —— Finding the soul in the gaps of 0 and 1.",
    chapter1: { tag: "Chapter 01 / Dialogue", title: "Design as Dialogue: Claude's Humanism", text: "Design shouldn't be a pile of instructions, but a dialogue across dimensions. In Claude's logic, we seek a deep 'sense of listening'. Just as paper carries ink, screens should carry emotion.", quote: "True simplicity is not the absence of complexity, but the taming of it. Letting machines learn to understand silence while understanding logic." },
    chapter2: { tag: "Chapter 02 / Materiality", title: "Digital Materiality: Apple's Glass Philosophy", text: "Glass, shadows, motion blur—Apple replicates physical intuition with pixels. Behind every blur is respect for the user's senses. We pursue not just beauty, but a 'reachable' sense of reality.", desc: "Between the absolute precision of 0 and 1, ambiguity gives life to the interface, just as there are no absolute boundaries in the real world." },
    chapter3: { tag: "Chapter 03 / The Silence", title: "Art of Negative Space: Less is Infinite", text: "When everyone tries to fill the space, we choose to leave it blank. Negative space is not empty, but a breathing window for thought. In extreme minimalism, users find true freedom.", footer: "Reflections on Design, Technology, and Humanism." },
    projectDesc: "Exploring how to transform design philosophy into tangible digital entities. Every pixel is carefully considered."
  }
};

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'cn' | 'en'>('cn');
  const [activePhilosophy, setActivePhilosophy] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const isHoveringRef = useRef(false);
  const activeIndexRef = useRef(0);
  const scrollAccumulator = useRef(0);
  const isAnimating = useRef(false);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => { activeIndexRef.current = activePhilosophy; }, [activePhilosophy]);
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const t = content[lang];

  useEffect(() => {
    const handleGlobalWheel = (e: WheelEvent) => {
      if (!isHoveringRef.current || isMobile) return;
      const delta = e.deltaY;
      const now = Date.now();
      
      if (activeIndexRef.current === 0 && delta < 0) return;
      if (activeIndexRef.current === 2 && delta > 0) return;

      e.preventDefault();
      if (isAnimating.current) return;

      if (now - lastScrollTime.current > 100 || (delta * scrollAccumulator.current < 0)) {
        scrollAccumulator.current = 0;
      }
      lastScrollTime.current = now;
      scrollAccumulator.current += delta;

      const threshold = 100;
      if (Math.abs(scrollAccumulator.current) >= threshold) {
        const direction = scrollAccumulator.current > 0 ? 1 : -1;
        const nextIndex = activeIndexRef.current + direction;

        if (nextIndex >= 0 && nextIndex <= 2) {
          isAnimating.current = true;
          setActivePhilosophy(nextIndex);
          scrollAccumulator.current = 0;
          setTimeout(() => { isAnimating.current = false; }, 400);
        }
      }
    };
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleGlobalWheel);
  }, [isMobile]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLang = () => setLang(prev => prev === 'cn' ? 'en' : 'cn');

  const projects = [
    { title: lang === 'cn' ? "数字实验室 001" : "Digital Lab 001", icon: <Monitor size={28} />, tech: "Motion Engineering", tag: "Design" },
    { title: lang === 'cn' ? "数字实验室 002" : "Digital Lab 002", icon: <Shield size={28} />, tech: "Visual Philosophy", tag: "Library" },
    { title: lang === 'cn' ? "数字实验室 003" : "Digital Lab 003", icon: <Folder size={28} />, tech: "Human Interaction", tag: "Core" }
  ];

  const cardAnimation = (index: number) => {
    if (isMobile) return {}; // Mobile uses native scroll
    return {
      x: activePhilosophy > index ? '-130%' : 0,
      y: activePhilosophy === index ? 0 : (index - activePhilosophy) * 20 + 20,
      scale: activePhilosophy === index ? 1 : 1 - Math.abs(index - activePhilosophy) * 0.05,
      opacity: activePhilosophy > index ? 0 : 1 - Math.abs(index - activePhilosophy) * 0.2,
      zIndex: 100 - index,
      rotateY: activePhilosophy === index ? 0 : -5 * (index - activePhilosophy)
    };
  };

  return (
    <div className="page-wrapper">
      <MeshGradient theme={theme} />
      <div className="grid-overlay"></div>
      <ClaudeCursor />
      <div className="spotlight-bg"></div>
      <div className="noise-overlay"></div>

      <section className="hero-full-screen">
        <div className="hero-content">
          <motion.div variants={statelyReveal} initial="hidden" animate="visible" className="title-wrapper">
            <h1 className="main-title"><SplitText text={t.title} factor={0.15} /></h1>
            <span className="subtitle-text">
              <span className="subtitle-dash"><SplitText text="——" factor={0.2} /></span>
              <SplitText text={t.subtitle.substring(3)} factor={0.1} />
            </span>
          </motion.div>
        </div>
      </section>

      <section className="single-window-section" style={{ flexDirection: 'column', alignItems: 'center' }}>
        <div className="section-header-left">
          <motion.h2 variants={statelyReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)', marginBottom: '40px' }}>
            <ProximityRiseText text={t.windowTitle} />
          </motion.h2>
        </div>
        <motion.div className="code-window single-interface" variants={statelyReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -10 }}>
          <div className="code-header">
            <div className="code-dots"><div className="control-dot red"></div><div className="control-dot yellow"></div><div className="control-dot green"></div></div>
            <div className="code-title">humanist.interface.ts</div>
          </div>
          <div className="code-content">
            <div className="settings-item">
              <span className="key">interface</span> <span className="method">ClaudeAesthetic</span> &#123;<br />
              &nbsp;&nbsp;mode: <span className="string interactive-toggle" onClick={toggleTheme}>"{theme}"</span>;<br />
              &nbsp;&nbsp;localization: <span className="string interactive-toggle" onClick={toggleLang}>"{lang.toUpperCase()}"</span>;<br />
              &nbsp;&nbsp;philosophy: <span className="string">"Humanist Design"</span>;<br />
              &#125;<br /><br />
              <span className="comment">// {lang === 'cn' ? '点击属性值切换系统偏好' : 'Click property values to toggle system preferences'}</span><br />
              <span className="key">const</span> <span className="method">render</span> = (ctx) =&gt; ctx.<span className="method">merge</span>(Aesthetic.philosophy);
            </div>
          </div>
        </motion.div>
      </section>

      <section className="philosophy-section-container">
        <div className="section-header-left">
          <motion.h2 variants={statelyReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)' }}>
            <ProximityRiseText text={t.philosophyTitle} />
          </motion.h2>
        </div>
        <div className={`philosophy-stack-wrapper ${isMobile ? 'mobile-scroll' : ''}`} onMouseEnter={() => { isHoveringRef.current = true; }} onMouseLeave={() => { isHoveringRef.current = false; scrollAccumulator.current = 0; }}>
          <motion.div className="philosophy-card glass stacked" animate={cardAnimation(0)} transition={{ type: 'spring', stiffness: 200, damping: 25 }} whileHover={!isMobile && activePhilosophy === 0 ? { y: -8 } : {}}>
            <span className="manifesto-tag">{t.chapter1.tag}</span>
            <h2 className="manifesto-title" style={{ color: 'var(--accent-claude)' }}>{t.chapter1.title}</h2>
            <div className="manifesto-text">
              <p>{t.chapter1.text}</p>
              <div className="quote-accent grey-quote-bg">
                <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>"{t.chapter1.quote}"</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="philosophy-card glass stacked" animate={cardAnimation(1)} transition={{ type: 'spring', stiffness: 200, damping: 25 }} whileHover={!isMobile && activePhilosophy === 1 ? { y: -8 } : {}}>
            <span className="manifesto-tag">{t.chapter2.tag}</span>
            <h2 className="manifesto-title" style={{ color: 'var(--accent-claude)' }}>{t.chapter2.title}</h2>
            <div className="manifesto-text"><p>{t.chapter2.text}</p><p style={{ marginTop: '24px' }}>{t.chapter2.desc}</p></div>
          </motion.div>
          <motion.div className="philosophy-card glass stacked" animate={cardAnimation(2)} transition={{ type: 'spring', stiffness: 200, damping: 25 }} whileHover={!isMobile && activePhilosophy === 2 ? { y: -8 } : {}}>
            <span className="manifesto-tag">{t.chapter3.tag}</span>
            <h2 className="manifesto-title" style={{ color: 'var(--accent-claude)' }}>{t.chapter3.title}</h2>
            <div className="manifesto-text"><p>{t.chapter3.text}</p><div className="manifesto-footer">{t.chapter3.footer}</div></div>
          </motion.div>
        </div>
      </section>

      <section id="work" style={{ alignItems: 'flex-start' }}>
        <div className="section-header-left">
          <motion.h2 variants={statelyReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)', marginBottom: '40px' }}>
            <ProximityRiseText text={t.practiceTitle} />
          </motion.h2>
        </div>
        <div className="projects-grid">
          {projects.map((project, i) => (
            <motion.div key={i} variants={statelyReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -12 }} className="project-card glass">
              <span className="project-tag">{project.tag}</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ color: 'var(--accent-claude)' }}>{project.icon}</div>
                <ExternalLink size={20} color="var(--text-secondary)" />
              </div>
              <h3 style={{ marginBottom: '16px', fontSize: '1.5rem', fontWeight: '600' }}>{project.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '28px', lineHeight: '1.8' }}>{t.projectDesc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', margin: '150px 0 250px 0' }}>
        <motion.h2 variants={statelyReveal} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.2rem, 5vw, 3rem)', marginBottom: '40px' }}>
          <ProximityRiseText text={t.resonance} />
        </motion.h2>
        <div style={{ display: 'flex', gap: '50px', justifyContent: 'center', marginBottom: '60px' }}>
          <Magnetic><motion.a whileHover={{ scale: 1.25, color: 'var(--accent-claude)' }} href="https://github.com/M-Patek" target="_blank" rel="noopener noreferrer"><Github size={32} /></motion.a></Magnetic>
          <Magnetic><motion.a whileHover={{ scale: 1.25, color: 'var(--accent-claude)' }} href="https://x.com/M_I3reak" target="_blank" rel="noopener noreferrer"><XIcon size={32} /></motion.a></Magnetic>
          <Magnetic><motion.a whileHover={{ scale: 1.25, color: 'var(--accent-claude)' }} href="mailto:monetwl@outlook.com"><Mail size={32} /></motion.a></Magnetic>
        </div>
        <motion.div className="bottom-philosophy-quote">
          <SplitText text={t.bottomQuote} factor={0.08} />
        </motion.div>
      </section>
    </div>
  );
}

export default App;
