import { useState } from 'react';
import type { Language } from '../types';

export const useLanguage = (initialLang: Language = 'cn') => {
  const [lang, setLang] = useState<Language>(initialLang);

  const toggleLang = () => {
    setLang((prev) => (prev === 'cn' ? 'en' : 'cn'));
  };

  return { lang, setLang, toggleLang };
};
