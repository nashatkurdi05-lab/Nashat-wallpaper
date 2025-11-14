import React, { useState, useCallback, useContext, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { WallpaperDisplay } from './components/WallpaperDisplay';
import { Footer } from './components/Footer';
import { History } from './components/History';
import { ImageUploader } from './components/ImageUploader';
import { AuthModal } from './components/AuthModal';
import { generateWallpaper, upscaleWallpaper, enhanceImage } from './services/geminiService';
import { useTranslation } from './hooks/useTranslation';
import { LanguageContext } from './contexts/LanguageContext';
import { AuthContext, HistoryItem } from './contexts/AuthContext';

type Mode = 'generate' | 'enhance';
type AuthMode = 'login' | 'signup';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useContext(LanguageContext);
  const { currentUser, history, addHistoryItem } = useContext(AuthContext);

  // Shared state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // UI State
  const [mode, setMode] = useState<Mode>('generate');
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  
  // --- Generation Mode State ---
  const [prompt, setPrompt] = useState<string>('A synthwave sunset over a vast digital ocean, 4K, detailed');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [style, setStyle] = useState<string>('Digital Art');
  const [isUpscaling, setIsUpscaling] = useState<boolean>(false);
  const [isUpscaled, setIsUpscaled] = useState<boolean>(false);

  // --- Enhance Mode State ---
  const [sourceImage, setSourceImage] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' || language === 'ku' ? 'rtl' : 'ltr';
  }, [language]);

  const resetState = () => {
    setError(null);
    setImageUrl(null);
    setIsUpscaled(false);
  };
  
  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  }

  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;
    setIsLoading(true);
    resetState();
    
    try {
      const url = await generateWallpaper(prompt, negativePrompt, aspectRatio, style);
      setImageUrl(url);
      
      if (currentUser) {
        const newHistoryItem = { prompt, negativePrompt };
        addHistoryItem(newHistoryItem);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : t('error_unexpected'));
    } finally {
      setIsLoading(false);
    }
  }, [prompt, negativePrompt, aspectRatio, style, isLoading, currentUser, addHistoryItem, t]);

  const handleEnhance = useCallback(async () => {
    if (!sourceImage || isLoading) return;
    setIsLoading(true);
    resetState();

    try {
      const url = await enhanceImage(sourceImage);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error_unexpected_enhance'));
    } finally {
      setIsLoading(false);
    }
  }, [sourceImage, isLoading, t]);
  
  const handleUpscale = useCallback(async () => {
    if (!imageUrl || isUpscaling || isUpscaled) return;
    setIsUpscaling(true);
    setError(null);

    try {
      const upscaledUrl = await upscaleWallpaper(imageUrl, prompt);
      setImageUrl(upscaledUrl);
      setIsUpscaled(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error_unexpected_upscale'));
    } finally {
      setIsUpscaling(false);
    }
  }, [imageUrl, prompt, isUpscaling, isUpscaled, t]);

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setPrompt(item.prompt);
    setNegativePrompt(item.negativePrompt);
    setMode('generate');
  }, []);

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    resetState();
    setSourceImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--background-gradient-from)] via-[var(--background-gradient-via)] to-[var(--background-gradient-to)] text-[var(--text-primary)] font-sans flex flex-col">
      <Header onAuthClick={openAuthModal} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex border-b border-[var(--border-primary)]">
              <button
                onClick={() => handleModeChange('generate')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'generate' ? 'border-b-2 border-[var(--border-accent)] text-[var(--text-accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-accent)]'}`}
              >
                {t('tab_generate')}
              </button>
              <button
                onClick={() => handleModeChange('enhance')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${mode === 'enhance' ? 'border-b-2 border-[var(--border-accent)] text-[var(--text-accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-accent)]'}`}
              >
                {t('tab_enhance')}
              </button>
            </div>
            
            {mode === 'generate' ? (
              <PromptInput
                prompt={prompt}
                setPrompt={setPrompt}
                negativePrompt={negativePrompt}
                setNegativePrompt={setNegativePrompt}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                stylePreset={style}
                setStylePreset={setStyle}
                onSubmit={handleGenerate}
                isLoading={isLoading}
              />
            ) : (
               <ImageUploader
                sourceImage={sourceImage}
                setSourceImage={setSourceImage}
                onEnhance={handleEnhance}
                isLoading={isLoading}
               />
            )}
            
            <WallpaperDisplay
              imageUrl={imageUrl}
              isLoading={isLoading}
              error={error}
              prompt={prompt}
              isUpscaling={isUpscaling}
              isUpscaled={isUpscaled}
              onUpscale={handleUpscale}
              showUpscale={mode === 'generate'}
            />
          </div>
          <div className="lg:col-span-1">
            <History
              history={history}
              onSelect={handleSelectHistory}
              isLoading={isLoading}
              onAuthRequest={() => openAuthModal('login')}
            />
          </div>
        </div>
      </main>
      <Footer />
      {isAuthModalOpen && <AuthModal mode={authMode} onClose={() => setAuthModalOpen(false)} />}
    </div>
  );
};

export default App;