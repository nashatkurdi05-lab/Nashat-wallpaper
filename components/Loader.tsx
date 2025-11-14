import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const Loader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center text-center text-[var(--text-secondary)] gap-4">
        <div className="w-16 h-16 border-4 border-t-4 border-[var(--border-secondary)] border-t-[var(--border-accent)] rounded-full animate-spin"></div>
        <h3 className="text-xl font-semibold mt-4 tracking-wider text-[var(--text-primary)]">{t('loader_title')}</h3>
        <p className="max-w-xs">{t('loader_subtitle')}</p>
    </div>
  );
};