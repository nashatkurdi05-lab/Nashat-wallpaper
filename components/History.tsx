import React, { useContext } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { AuthContext, HistoryItem } from '../contexts/AuthContext';

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  isLoading: boolean;
  onAuthRequest: () => void;
}

const ReuseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.696v4.992h-4.992m0 0-3.181-3.183a8.25 8.25 0 0 1 11.667 0l3.181 3.183" />
    </svg>
);

const AuthPrompt: React.FC<{ onAuthRequest: () => void }> = ({ onAuthRequest }) => {
    const { t } = useTranslation();
    return (
        <div className="text-center text-[var(--text-tertiary)] pt-8 flex flex-col items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-2 text-[var(--background-quaternary)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <p className="font-semibold text-[var(--text-secondary)]">{t('history_auth_prompt_title')}</p>
            <p className="text-sm">{t('history_auth_prompt_subtitle')}</p>
            <button
                onClick={onAuthRequest}
                className="mt-2 px-4 py-2 text-sm font-medium bg-[var(--accent-primary)] text-[var(--text-accent)] rounded-md hover:bg-[var(--accent-primary-hover)] transition-colors"
            >
                {t('button_login_signup')}
            </button>
        </div>
    );
};

export const History: React.FC<HistoryProps> = ({ history, onSelect, isLoading, onAuthRequest }) => {
  const { t } = useTranslation();
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="bg-[var(--background-secondary)] rounded-lg p-4 shadow-themed border border-[var(--border-primary)] h-full">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 border-b border-[var(--border-primary)] pb-2">
        {t('history_title')}
      </h2>
      {!currentUser ? (
        <AuthPrompt onAuthRequest={onAuthRequest} />
      ) : history.length === 0 ? (
        <div className="text-center text-[var(--text-tertiary)] pt-8">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto mb-4 text-[var(--background-quaternary)]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p>{t('history_empty')}</p>
        </div>
      ) : (
        <ul className="space-y-2 max-h-[600px] overflow-y-auto ltr:pr-2 rtl:pl-2">
          {history.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => onSelect(item)}
                disabled={isLoading}
                className="w-full text-left p-3 bg-[var(--background-primary)]/50 rounded-md border border-[var(--border-primary)] hover:bg-[var(--accent-primary)]/10 hover:border-[var(--border-accent)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative"
              >
                <p className="text-sm font-medium text-[var(--text-secondary)] truncate group-hover:text-[var(--text-primary)]">
                  {item.prompt}
                </p>
                {item.negativePrompt && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-1 truncate">
                    <span className="font-semibold">{t('history_avoid_label')}:</span> {item.negativePrompt}
                  </p>
                )}
                 <div className="absolute top-2 ltr:right-2 rtl:left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ReuseIcon className="w-4 h-4 text-[var(--accent-secondary)]" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};