import React, { useState, useContext } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import * as mockAuthService from '../services/mockAuthService';
import { AuthContext } from '../contexts/AuthContext';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose }) => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);

  const [currentMode, setCurrentMode] = useState(mode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (currentMode === 'login') {
        await mockAuthService.login(username, password);
      } else {
        await mockAuthService.signup(username, password);
      }
      login(username); // Update context and session
      onClose(); // Close modal on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const switchMode = () => {
      setCurrentMode(prev => prev === 'login' ? 'signup' : 'login');
      setError(null);
  }

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="bg-[var(--background-secondary)] border border-[var(--border-primary)] rounded-lg shadow-xl w-full max-w-sm p-8 animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
            <h2 id="auth-modal-title" className="text-2xl font-bold text-[var(--text-primary)]">
                {currentMode === 'login' ? t('auth_login_title') : t('auth_signup_title')}
            </h2>
            <button onClick={onClose} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        {error && (
            <div className="bg-[var(--accent-error-soft-bg)] text-[var(--text-error)] border border-[var(--border-error)] text-sm p-3 rounded-md mb-4">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('auth_username_label')}</label>
                <input 
                    type="text" 
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    className="w-full p-3 bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-colors text-[var(--text-primary)]"
                />
            </div>
            <div>
                <label htmlFor="password"  className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('auth_password_label')}</label>
                <input 
                    type="password" 
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={4}
                    className="w-full p-3 bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-colors text-[var(--text-primary)]"
                />
            </div>
            <button 
                type="submit"
                disabled={isLoading || !username || password.length < 4}
                className="w-full flex justify-center py-3 px-4 bg-[var(--accent-primary)] text-[var(--text-accent)] font-semibold rounded-md hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--accent-disabled)] disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  currentMode === 'login' ? t('auth_login_cta') : t('auth_signup_cta')
                )}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button onClick={switchMode} className="text-sm text-[var(--accent-secondary)] hover:underline">
                 {currentMode === 'login' ? t('auth_switch_to_signup') : t('auth_switch_to_login')}
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};