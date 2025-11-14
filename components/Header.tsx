import React, { useContext } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeSwitcher } from './ThemeSwitcher';

type AuthMode = 'login' | 'signup';

const BananaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M15.33,16.25C15.33,16.25 15.28,16.21 15.28,16.21C15.27,16.21 15.22,16.17 15.22,16.17C14.88,15.92 14.54,15.68 14.2,15.44C12.5,14.25 11.2,12.58 10.33,10.75C9.03,8.04 9.18,5.08 10.75,2.75C10.9,2.5 11.05,2.5 11.25,2.7C11.45,2.88 11.5,3.03 11.38,3.23C10.06,5.29 9.92,7.86 11.05,10.25C11.83,11.89 12.97,13.4 14.47,14.5C14.78,14.72 15.09,14.93 15.4,15.15C15.4,15.15 15.45,15.19 15.45,15.19C15.5,15.19 15.55,15.23 15.55,15.23C15.8,15.4 16.07,15.59 16.34,15.79C17.41,16.59 18.5,17.43 19.5,18.43C20.75,19.68 21.25,21.33 20.8,22.8C20.65,23.33 20.1,23.63 19.58,23.48C19.05,23.33 18.75,22.8 18.9,22.28C19.2,21.23 18.88,20.13 18.05,19.3C17.2,18.45 16.28,17.72 15.33,16.96C15.33,16.96 15.28,16.92 15.28,16.92C15.27,16.92 15.22,16.88 15.22,16.88C15.22,16.88 15.22,16.88 15.22,16.88L15.33,16.25M6.5,12.25C6.5,12.25 6.5,12.25 6.5,12.25C6.5,12.25 6.5,12.25 6.5,12.25L6.5,12.25Z" />
  </svg>
);

export const Header: React.FC<{onAuthClick: (mode: AuthMode) => void}> = ({ onAuthClick }) => {
  const { t } = useTranslation();
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <header className="bg-[var(--backdrop-blur-color)] backdrop-blur-sm border-b border-[var(--border-primary)] sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-wide">
              {t('app_title')}
            </h1>
            <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs font-semibold">
              <BananaIcon className="w-4 h-4" />
              <span>{t('model_name')}</span>
            </div>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-1 hidden md:block">
            {t('app_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <div className="w-px h-6 bg-[var(--border-primary)]"></div>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[var(--text-secondary)] hidden sm:inline">{t('welcome_user', { name: currentUser.username })}</span>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-sm font-medium bg-[var(--background-tertiary)] text-[var(--text-secondary)] rounded-md hover:bg-[var(--background-quaternary)] transition-colors"
              >
                {t('button_logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAuthClick('login')}
                className="px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] rounded-md hover:bg-[var(--background-secondary)] transition-colors"
              >
                {t('button_login')}
              </button>
              <button
                onClick={() => onAuthClick('signup')}
                className="px-4 py-1.5 text-sm font-medium bg-[var(--accent-primary)] text-[var(--text-accent)] rounded-md hover:bg-[var(--accent-primary-hover)] transition-colors"
              >
                {t('button_signup')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};