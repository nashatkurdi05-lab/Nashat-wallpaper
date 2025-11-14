import React, { useContext, useState } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

type Language = 'en' | 'ar' | 'ku';

const languages: { code: Language; name: string, nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ku', name: 'Kurdish', nativeName: 'کوردی' },
];

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-md text-sm text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
        </svg>

        <span className="text-[var(--text-primary)]">{languages.find(l => l.code === language)?.nativeName}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-40 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-md shadow-lg z-20">
          <ul className="py-1">
            {languages.map(lang => (
              <li key={lang.code}>
                <button
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${language === lang.code ? 'bg-[var(--accent-primary)] text-[var(--text-accent)]' : 'text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]'}`}
                >
                  {lang.nativeName} ({lang.name})
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};