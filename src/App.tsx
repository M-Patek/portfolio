import { useEffect, useState, Suspense, useCallback } from 'react';
import './App.css';
import { HeroSection, PhilosophySection, WorkSection, FooterSection } from './sections';
import { ClaudeCursor } from './components/cursor/ClaudeCursor';
import { MeshGradient } from './components/effects/MeshGradient';
import { Header } from './components/ui/Header';
import { content } from './data/content';
import { MouseProvider } from './hooks/useMousePosition';

const App = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang] = useState<'cn' | 'en'>('en');
  const [activePhilosophy, setActivePhilosophy] = useState(0);
  const [activeWork, setActiveWork] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 使用 useCallback 稳定函数引用
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const t = content[lang];

  return (
    <MouseProvider>
      <div className="page-wrapper">
        <Header />
        <MeshGradient theme={theme} />
        
        <div className="grid-overlay"></div>
        {/* 统一桌面体验：始终显示自定义光标 */}
        <ClaudeCursor />
        <div className="spotlight-bg"></div>
        <div className="noise-overlay"></div>

        <HeroSection id="hero" t={t} theme={theme} toggleTheme={toggleTheme} />
        
        <Suspense fallback={<div style={{ height: '100vh' }} />}>
          <PhilosophySection 
            id="philosophy"
            t={t} 
            isMobile={false} /* 强制关闭移动端模式 */
            activePhilosophy={activePhilosophy} 
            setActivePhilosophy={setActivePhilosophy} 
          />
          
          <WorkSection 
            id="work"
            t={t} 
            lang={lang}
            theme={theme} 
            isMobile={false} /* 强制关闭移动端模式 */
            activeWork={activeWork} 
            setActiveWork={setActiveWork}
            toggleTheme={toggleTheme}
          />
          
          <FooterSection id="footer" t={t} />
        </Suspense>
      </div>
    </MouseProvider>
  );
};

export default App;
