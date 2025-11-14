import React, { useContext, useState } from 'react';
import { ThemeContext, themes } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

const ThemeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402a3.75 3.75 0 00-.625-6.25a3.75 3.75 0 00-6.25-.625l-6.402 6.401a3.75 3.75 0 000 5.304zm12.002 0a3.75 3.75 0 005.304 0l-6.401-6.402a3.75 3.75 0 00-5.304-5.304 3.75 3.75 0 00-5.304 0l-1.494 1.493a3.75 3.75 0 000 5.304l6.401 6.402z" />
    </svg>
);

export const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center p-2 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-md text-[var(--text-secondary)] hover:bg-[var(--background-tertiary)]"
                aria-label={t('theme_change_label')}
            >
                <ThemeIcon className="w-5 h-5" />
            </button>

            {isOpen && (
                <div 
                    className="absolute top-full ltr:right-0 rtl:left-0 mt-2 w-48 bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-md shadow-lg z-50"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <ul className="py-1 max-h-60 overflow-y-auto">
                        {themes.map(themeItem => (
                            <li key={themeItem.id}>
                                <button
                                    onClick={() => {
                                        setTheme(themeItem.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${theme === themeItem.id ? 'bg-[var(--accent-primary)] text-[var(--text-accent)]' : 'text-[var(--text-primary)] hover:bg-[var(--background-tertiary)]'}`}
                                >
                                    {t(themeItem.nameKey)}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
