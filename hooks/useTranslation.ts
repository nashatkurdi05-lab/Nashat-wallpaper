import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const useTranslation = () => {
  const { translations } = useContext(LanguageContext);

  // FIX: Updated the `t` function to support an optional `replacements` argument for string interpolation, resolving the error in Header.tsx where it was called with two arguments.
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translation = translation.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), String(replacements[placeholder]));
      });
    }
    return translation;
  };

  return { t };
};
