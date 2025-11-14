import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'amoled' | 'neon' | 'glass' | 'aurora' | 'rose' | 'cyberpunk' | 'forest' | 'sand';

export const themes: { id: Theme; nameKey: string }[] = [
    { id: 'light', nameKey: 'theme_light' },
    { id: 'dark', nameKey: 'theme_dark' },
    { id: 'amoled', nameKey: 'theme_amoled' },
    { id: 'neon', nameKey: 'theme_neon' },
    { id: 'glass', nameKey: 'theme_glass' },
    { id: 'aurora', nameKey: 'theme_aurora' },
    { id: 'rose', nameKey: 'theme_rose' },
    { id: 'cyberpunk', nameKey: 'theme_cyberpunk' },
    { id: 'forest', nameKey: 'theme_forest' },
    { id: 'sand', nameKey: 'theme_sand' },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
});

const THEME_STORAGE_KEY = 'ai_wallpaper_theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (storedTheme && themes.some(t => t.id === storedTheme)) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error("Failed to load theme from local storage:", error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Failed to save theme to local storage:", error);
    }
  }, [theme]);
  
  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
