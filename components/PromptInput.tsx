import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  stylePreset: string;
  setStylePreset: (style: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const MagicWandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 1 .879 16.5a2.25 2.25 0 0 1 2.475-2.118 3 3 0 0 0 5.78-1.128ZM9.53 16.122a3 3 0 0 0 5.78 1.128 2.25 2.25 0 0 1 2.475 2.118 2.25 2.25 0 0 1-2.475 2.118 3 3 0 0 0-5.78-1.128ZM15.879 5.879a3 3 0 0 0-4.242 0l-7.5 7.5a3 3 0 0 0 0 4.242 3 3 0 0 0 4.242 0l7.5-7.5a3 3 0 0 0 0-4.242Z" />
    </svg>
);

const OptionButton: React.FC<{ label: string; value: string; selectedValue: string; onClick: (value: string) => void; disabled: boolean; }> = ({ label, value, selectedValue, onClick, disabled }) => (
    <button
        onClick={() => onClick(value)}
        disabled={disabled}
        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors border ${
            selectedValue === value
                ? 'bg-[var(--accent-primary)] border-[var(--border-accent)] text-[var(--text-accent)]'
                : 'bg-[var(--background-tertiary)] border-[var(--border-secondary)] hover:bg-[var(--background-quaternary)]'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
        {label}
    </button>
);


export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, negativePrompt, setNegativePrompt, aspectRatio, setAspectRatio, stylePreset, setStylePreset, onSubmit, isLoading }) => {
  const { t } = useTranslation();
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      onSubmit();
    }
  };
  
  const aspectRatios = { '16:9': t('aspect_ratio_widescreen'), '9:16': t('aspect_ratio_portrait'), '1:1': t('aspect_ratio_square'), '4:3': '4:3' };
  const stylePresets = { 'Photorealistic': t('style_photorealistic'), 'Digital Art': t('style_digital_art'), 'Anime': t('style_anime'), 'Synthwave': t('style_synthwave') };

  return (
    <div className="bg-[var(--background-secondary)] rounded-lg p-4 shadow-themed border border-[var(--border-primary)] flex flex-col gap-4">
      {/* Main Prompt */}
      <div>
        <label htmlFor="prompt-input" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          {t('prompt_label')}
        </label>
        <div className="relative">
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('prompt_placeholder')}
            className="w-full h-24 p-3 ltr:pr-40 rtl:pl-40 bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-colors text-[var(--text-primary)] resize-none"
            disabled={isLoading}
          />
          <div className="absolute top-0 ltr:right-0 rtl:left-0 h-full p-2 flex items-center">
              <button
                  onClick={onSubmit}
                  disabled={isLoading || !prompt.trim()}
                  className="flex items-center justify-center gap-2 h-full px-6 bg-[var(--accent-primary)] text-[var(--text-accent)] font-semibold rounded-md hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--accent-disabled)] disabled:cursor-not-allowed transition-all duration-200 ease-in-out transform hover:scale-105 disabled:scale-100 shadow-md hover:shadow-lg disabled:shadow-none"
              >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin ltr:-ml-1 ltr:mr-3 rtl:-mr-1 rtl:ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('button_generating')}
                    </>
                  ) : (
                    <>
                      <MagicWandIcon className="w-5 h-5" />
                      <span>{t('button_generate')}</span>
                    </>
                  )}
              </button>
          </div>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] mt-2 text-right">
          {t('prompt_tip')}
        </p>
      </div>

      {/* Negative Prompt */}
      <div>
          <label htmlFor="negative-prompt-input" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {t('negative_prompt_label')} <span className="text-[var(--text-tertiary)]">({t('optional')})</span>
          </label>
          <textarea
              id="negative-prompt-input"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder={t('negative_prompt_placeholder')}
              className="w-full h-20 p-3 bg-[var(--background-primary)] border border-[var(--border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--border-accent)] focus:border-[var(--border-accent)] transition-colors text-[var(--text-primary)] resize-none"
              disabled={isLoading}
          />
      </div>
      
      {/* Generation Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('aspect_ratio_label')}</label>
          <div className="flex flex-wrap gap-2">
             {Object.entries(aspectRatios).map(([value, label]) => (
                <OptionButton key={value} label={label} value={value} selectedValue={aspectRatio} onClick={setAspectRatio} disabled={isLoading} />
             ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('style_preset_label')}</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stylePresets).map(([value, label]) => (
                <OptionButton key={value} label={label} value={value} selectedValue={stylePreset} onClick={setStylePreset} disabled={isLoading} />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};