import React from 'react';
import { Loader } from './Loader';
import { ErrorDisplay } from './ErrorDisplay';
import { useTranslation } from '../hooks/useTranslation';

interface WallpaperDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  prompt: string;
  isUpscaling: boolean;
  isUpscaled: boolean;
  onUpscale: () => void;
  showUpscale?: boolean;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.321h5.365c.527 0 .734.686.363 1.003l-4.33 3.159a.562.562 0 0 0-.182.635l1.634 5.057c.134.414-.383.78-.748.525l-4.51-3.292a.563.563 0 0 0-.622 0l-4.51 3.292c-.365.255-.883-.111-.748-.525l1.634-5.057a.562.562 0 0 0-.182-.635l-4.33-3.159a.562.562 0 0 1 .363-1.003h5.365a.563.563 0 0 0 .475-.321l2.125-5.111Z" />
    </svg>
);

const Placeholder: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="text-center text-[var(--text-tertiary)] flex flex-col items-center justify-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-24 h-24 text-[var(--background-quaternary)]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            <h3 className="text-xl font-semibold text-[var(--text-secondary)]">{t('placeholder_title')}</h3>
            <p>{t('placeholder_subtitle')}</p>
        </div>
    );
};

export const WallpaperDisplay: React.FC<WallpaperDisplayProps> = ({ imageUrl, isLoading, error, prompt, isUpscaling, isUpscaled, onUpscale, showUpscale = false }) => {
  const { t } = useTranslation();
  
  const getFileName = () => {
    return prompt
      .substring(0, 50)
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase() + '_wallpaper.png';
  }

  return (
    <div className="w-full aspect-[16/9] bg-[var(--background-tertiary)]/50 rounded-lg shadow-themed border border-[var(--border-primary)] flex items-center justify-center p-2 relative overflow-hidden">
      {isLoading && <Loader />}
      {error && !isLoading && <ErrorDisplay message={error} />}
      {!isLoading && !error && !imageUrl && <Placeholder />}
      {imageUrl && !isLoading && !error && (
        <>
            <img
                src={imageUrl}
                alt={prompt}
                className="object-contain w-full h-full rounded-md animate-fade-in"
            />
            {isUpscaling && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-md backdrop-blur-sm z-10">
                    <div className="flex flex-col items-center justify-center text-center text-white/90 gap-4">
                        <div className="w-12 h-12 border-4 border-t-4 border-[var(--border-secondary)] border-t-[var(--border-accent)] rounded-full animate-spin"></div>
                        <h3 className="text-lg font-semibold tracking-wider">{t('upscaling_message')}</h3>
                    </div>
                </div>
            )}
            <div className="absolute bottom-4 ltr:right-4 rtl:left-4 flex items-center gap-3 z-20">
                 {showUpscale && isUpscaled && (
                    <div className="bg-[var(--accent-success-soft-bg)] text-[var(--accent-success-soft-text)] py-2 px-4 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm border border-white/20">
                        <StarIcon className="w-5 h-5 text-[var(--accent-success)]" />
                        <span>{t('button_upscaled')}</span>
                    </div>
                )}
                {showUpscale && !isUpscaled && (
                    <button
                        onClick={onUpscale}
                        disabled={isUpscaling}
                        className="bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-purple-500 transition-colors backdrop-blur-sm border border-white/20 disabled:bg-purple-800 disabled:cursor-wait"
                    >
                        <StarIcon className="w-5 h-5" />
                        <span>{t('button_upscale')}</span>
                    </button>
                )}
                <a
                    href={imageUrl}
                    download={getFileName()}
                    className="bg-[var(--background-primary)]/70 text-[var(--text-accent)] py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-[var(--background-primary)]/90 transition-colors backdrop-blur-sm border border-white/20"
                >
                    <DownloadIcon className="w-5 h-5"/>
                    <span>{t('button_download')}</span>
                </a>
            </div>
        </>
      )}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};