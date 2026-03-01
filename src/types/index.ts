export type Theme = 'light' | 'dark';
export type Language = 'cn' | 'en';

export interface Project {
  title: string;
  icon: React.ReactNode;
  tech: string;
  tag: string;
}

export interface Chapter {
  tag: string;
  title: string;
  text: string;
  quote?: string;
  desc?: string;
  footer?: string;
}

export interface Content {
  title: string;
  subtitle: string;
  windowTitle: string;
  philosophyTitle: string;
  practiceTitle: string;
  resonance: string;
  bottomQuote: string;
  chapter1: Chapter;
  chapter2: Chapter;
  chapter3: Chapter;
  projectDesc: string;
}
