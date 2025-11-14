import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center text-center text-[var(--text-error)] bg-[var(--accent-error-soft-bg)] p-6 rounded-lg border border-[var(--border-error)]">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <h3 className="text-xl font-semibold text-[var(--text-error)]">{t('error_title')}</h3>
        <p className="mt-2 text-sm max-w-md">{message}</p>
    </div>
  );
};