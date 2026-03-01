import { memo, lazy } from 'react';

// HeroSection 作为 LCP (最大内容绘制) 组件，保持同步加载以确保首屏渲染速度
import { HeroSection as Hero } from './HeroSection';

// 非首屏 Section 采用异步加载，减小首屏 JS 体积
export const HeroSection = memo(Hero);

export const InterfaceSection = lazy(() => import('./InterfaceSection').then(m => ({ default: m.InterfaceSection })));
export const PhilosophySection = lazy(() => import('./PhilosophySection').then(m => ({ default: m.PhilosophySection })));
export const WorkSection = lazy(() => import('./WorkSection').then(m => ({ default: m.WorkSection })));
export const FooterSection = lazy(() => import('./FooterSection').then(m => ({ default: m.FooterSection })));
