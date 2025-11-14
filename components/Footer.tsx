import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="w-full py-4 mt-8">
      <div className="container mx-auto text-center text-sm text-[var(--text-tertiary)]">
        <p>{t('footer_text')}</p>
      </div>
    </footer>
  );
};