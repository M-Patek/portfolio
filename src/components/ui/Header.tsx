import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, MenuIcon } from './Icons';
import { scrollUnfold } from '../effects/animations';

// --- 定义导航数据 ---
const NAV_DATA = [
  {
    label: "Explore",
    id: "explore",
    type: "mega",
    content: {
      items: [
        { label: "Top / Hero", target: "hero", desc: "The convergence of art and code" },
        { label: "Philosophy", target: "philosophy", desc: "Design principles and digital materiality" },
        { label: "Work Stage", target: "work", desc: "3D interactive showcase of projects" },
        { label: "Connect", target: "footer", desc: "Social presence and contact info" }
      ]
    }
  }
];

// --- 导航项组件 ---
const NavItem = ({ item, isActive, onHover, onLeave }: any) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    onLeave();
  };

  return (
    <li 
      className="nav-item-container"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={onLeave}
    >
      <div className={`nav-link ${isActive ? 'active' : ''}`}>
        <span>{item.label}</span>
        {item.type !== 'link' && (
          <motion.div 
            animate={{ rotate: isActive ? 180 : 0 }} 
            className="chevron-icon"
          >
            <ChevronDown />
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isActive && item.content && (
          <motion.div 
            variants={scrollUnfold}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mega-menu-wrapper"
          >
            <div className="mega-menu-inner glass">
              <div className="mega-menu-nav-grid">
                {item.content.items.map((nav: any) => (
                  <div 
                    key={nav.target} 
                    className="mega-nav-card"
                    onClick={() => scrollTo(nav.target)}
                  >
                    <span className="mega-nav-label">{nav.label}</span>
                    <p className="mega-nav-desc">{nav.desc}</p>
                    <ArrowRight size={14} className="nav-arrow" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export const Header = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = 'auto';
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleHover = (id: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveItem(id);
  };

  const handleLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveItem(null);
    }, 200);
  };

  const toggleMobileMenu = () => {
    const nextState = !isMobileMenuOpen;
    setIsMobileMenuOpen(nextState);
    document.body.style.overflow = nextState ? 'hidden' : 'auto';
  };

  return (
    <>
      <header className="site-header-fixed">
        <div className="header-inner-container">
          
          <div className="brand-zone" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="brand-name">Monetwl</span>
          </div>

          <nav className="nav-zone desktop-only">
            <ul className="nav-list">
              {NAV_DATA.map(item => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  isActive={activeItem === item.id}
                  onHover={handleHover}
                  onLeave={handleLeave}
                />
              ))}
            </ul>
          </nav>

          <div className="action-zone">
            <button className="btn-primary" onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}>
              Contact Me
              <div className="btn-shine"></div>
            </button>
            
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
              <MenuIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="mobile-menu-overlay"
            />
            
            <motion.div 
              variants={scrollUnfold}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mobile-side-menu glass"
              style={{ transformOrigin: "top right" }}
            >
              <nav className="mobile-nav">
                <div className="mobile-nav-item" onClick={() => { document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }); toggleMobileMenu(); }}>Hero</div>
                <div className="mobile-nav-item" onClick={() => { document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' }); toggleMobileMenu(); }}>Philosophy</div>
                <div className="mobile-nav-item" onClick={() => { document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }); toggleMobileMenu(); }}>Work</div>
                <div className="mobile-nav-divider" />
                <button className="mobile-btn-primary" onClick={() => { toggleMobileMenu(); document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact Me</button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .site-header-fixed {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 72px;
          z-index: 2100;
          background-color: var(--bg-claude);
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          padding: 0 40px;
        }

        .header-inner-container {
          width: 100%;
          max-width: 1360px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-zone {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .brand-name {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .nav-zone {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .nav-list {
          display: flex;
          list-style: none;
          gap: 8px;
          padding: 0;
          margin: 0;
        }

        .nav-item-container {
          position: relative;
        }

        .nav-link {
          height: 40px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-link:hover, .nav-link.active {
          color: var(--text-primary);
          background-color: var(--quote-bg);
        }

        .mega-menu-wrapper {
          position: absolute;
          top: 100%;
          left: 0;
          padding-top: 12px;
          z-index: 2001;
        }

        .mega-menu-inner {
          width: 480px;
          padding: 24px;
          border-radius: 16px;
          border-left: 3px solid rgba(217, 119, 87, 0.2);
          box-shadow: 0 30px 80px rgba(0,0,0,0.15);
          overflow: hidden;
          background: var(--glass-bg);
        }

        .mega-menu-nav-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .mega-nav-card {
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .mega-nav-card:hover {
          background: var(--quote-bg);
          transform: translateX(4px);
        }

        .mega-nav-label {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .mega-nav-desc {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .nav-arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0;
          transition: all 0.2s;
          color: var(--accent-claude);
        }

        .mega-nav-card:hover .nav-arrow {
          opacity: 1;
          right: 12px;
        }

        .action-zone {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .btn-primary {
          position: relative;
          background-color: var(--text-primary);
          color: var(--bg-claude);
          border: none;
          padding: 10px 22px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          overflow: hidden;
          font-size: 14px;
        }

        .btn-shine {
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .btn-primary:hover .btn-shine { left: 100%; }

        .mobile-menu-toggle {
          display: none;
          background: none; border: none;
          color: var(--text-primary);
          z-index: 2200;
        }

        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.2);
          backdrop-filter: blur(4px);
          z-index: 2050;
        }

        .mobile-side-menu {
          position: fixed;
          top: 80px; right: 20px;
          width: 280px;
          z-index: 2060;
          padding: 32px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mobile-nav-item {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-nav-divider {
          height: 1px;
          background: var(--glass-border);
        }

        .mobile-btn-primary {
          background: var(--text-primary);
          color: var(--bg-claude);
          border: none;
          padding: 14px;
          border-radius: 10px;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .desktop-only { display: none !important; }
          .mobile-menu-toggle { display: block; }
          .site-header-fixed { padding: 0 20px; }
          .action-zone .btn-primary { 
            display: flex !important; 
            padding: 8px 16px; 
            font-size: 13px;
            border-radius: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
