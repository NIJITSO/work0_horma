'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
  t: (ar: string, fr: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // French is now the default
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    // 1. Check cookies first
    const cookieLang = getCookie('alhurra_lang') as Language;
    if (cookieLang === 'ar' || cookieLang === 'fr') {
      setLanguageState(cookieLang);
      return;
    }

    // 2. Check localStorage as fallback
    const saved = localStorage.getItem('alhurra_lang') as Language;
    if (saved === 'ar' || saved === 'fr') {
      setLanguageState(saved);
      setCookie('alhurra_lang', saved);
    } else {
      // Default to French and store preference
      setCookie('alhurra_lang', 'fr');
      localStorage.setItem('alhurra_lang', 'fr');
    }
  }, []);

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    setCookie('alhurra_lang', language);
    localStorage.setItem('alhurra_lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setCookie('alhurra_lang', lang);
    localStorage.setItem('alhurra_lang', lang);
  };

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRtl = language === 'ar';

  const t = (ar: string, fr: string) => (language === 'ar' ? ar : fr);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
