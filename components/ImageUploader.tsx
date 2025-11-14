import React, { useCallback, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface ImageUploaderProps {
  sourceImage: string | null;
  setSourceImage: (dataUri: string | null) => void;
  onEnhance: () => void;
  isLoading: boolean;
}

const EnhanceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.543l.227 1.581.227-1.581a5.25 5.25 0 00-4.634-4.634l-1.581-.227 1.581-.227a5.25 5.25 0 004.634-4.634l.227-1.581.227 1.581a5.25 5.25 0 004.634 4.634l1.581.227-1.581.227a5.25 5.25 0 00-4.634 4.634z" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ sourceImage, setSourceImage, onEnhance, isLoading }) => {
    const { t } = useTranslation();
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSourceImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files?.[0] ?? null);
    };

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };
    
    const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
    };

    const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        handleFileChange(e.dataTransfer.files?.[0] ?? null);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    }

    return (
         <div className="bg-[var(--background-secondary)] rounded-lg p-4 shadow-themed border border-[var(--border-primary)] flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{t('upload_label')}</label>
                <div 
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={triggerFileSelect}
                    className={`flex justify-center items-center w-full h-48 px-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${dragOver ? 'border-[var(--border-accent)] bg-[var(--accent-primary)]/10' : 'border-[var(--border-secondary)] hover:border-[var(--border-accent)]/80'}`}
                >
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileSelect} className="hidden" />
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-[var(--text-tertiary)]">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                            <span className="font-semibold text-[var(--accent-secondary)]">{t('upload_browse')}</span> {t('upload_drag_drop')}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)]">{t('upload_formats')}</p>
                    </div>
                </div>
            </div>

            {sourceImage && (
                <div className="flex flex-col md:flex-row items-center gap-4">
                     <div className="w-full md:w-1/3 aspect-video rounded-md overflow-hidden border border-[var(--border-secondary)]">
                         <img src={sourceImage} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-grow text-center md:text-left">
                        <p className="text-[var(--text-primary)]">{t('upload_ready')}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{t('upload_ready_subtitle')}</p>
                     </div>
                     <button
                        onClick={onEnhance}
                        disabled={isLoading || !sourceImage}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-primary)] text-[var(--text-accent)] font-semibold rounded-md hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--accent-disabled)] disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('button_enhancing')}
                            </>
                        ) : (
                            <>
                                <EnhanceIcon className="w-5 h-5" />
                                <span>{t('button_enhance')}</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};