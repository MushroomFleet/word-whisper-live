import { useState, useEffect } from 'react';

export type Theme = 'modern-dark' | 'retro-console';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('careless-live-theme');
    return (saved as Theme) || 'modern-dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-retro');
    
    // Apply new theme
    if (theme === 'retro-console') {
      root.classList.add('theme-retro');
    }
    
    // Save to localStorage
    localStorage.setItem('careless-live-theme', theme);
  }, [theme]);

  return { theme, setTheme };
};