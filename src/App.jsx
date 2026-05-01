import { useState } from 'react';
import StepIndicator from './components/StepIndicator.jsx';
import Screen1Upload from './components/Screen1Upload.jsx';
import Screen2Configure from './components/Screen2Configure.jsx';
import Screen3Results from './components/Screen3Results.jsx';
import LoadingOverlay from './components/LoadingOverlay.jsx';
import { analyzeAndGenerate } from './services/apiService.js';

const LOADING_MESSAGES = [
  'Şablon dosyan okunuyor...',
  'Renkler ve düzen analiz ediliyor...',
  'İçerik belgesi işleniyor...',
  'Slaytlar yapılandırılıyor...',
  'Versiyon 1 hazırlanıyor: Stratejik Genel Bakış...',
  'Versiyon 2 hazırlanıyor: Problem-Çözüm...',
  'Versiyon 3 hazırlanıyor: Veriye Dayalı...',
  'Son rötuşlar yapılıyor...',
];

const INITIAL_STATE = {
  pptxFile: null,
  contentFile: null,
  config: {
    title: '',
    audience: 'Üst Yönetim',
    tone: 'Profesyonel ve resmi',
    slideCount: 6,
    versionType: 'strategic',
  },
  presentationData: null,
  currentScreen: 1,
  isLoading: false,
  loadingMessage: '',
  error: null,
};

export default function App() {
  const [state, setState] = useState(INITIAL_STATE);

  function set(patch) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  async function handleGenerate() {
    set({ isLoading: true, loadingMessage: LOADING_MESSAGES[0], error: null });

    let msgIdx = 0;
    const msgTimer = setInterval(() => {
      msgIdx = Math.min(msgIdx + 1, LOADING_MESSAGES.length - 1);
      set({ loadingMessage: LOADING_MESSAGES[msgIdx] });
    }, 5000);

    try {
      const data = await analyzeAndGenerate({
        pptxFile: state.pptxFile,
        contentFile: state.contentFile,
        config: state.config,
      });
      clearInterval(msgTimer);
      set({ presentationData: data, isLoading: false, currentScreen: 3 });
    } catch (err) {
      clearInterval(msgTimer);
      set({ isLoading: false, error: err.message });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Sabit header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              Sunum Oluşturucu
            </h1>
            <p className="text-xs text-slate-400 font-medium">AI ile Kurumsal Sunum Üreticisi</p>
          </div>
          <StepIndicator currentScreen={state.currentScreen} />
        </div>
      </header>

      {/* Yükleme katmanı */}
      {state.isLoading && <LoadingOverlay message={state.loadingMessage} />}

      {/* Ana içerik */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {state.currentScreen === 1 && (
          <Screen1Upload
            pptxFile={state.pptxFile}
            contentFile={state.contentFile}
            onPptxChange={(file) => set({ pptxFile: file })}
            onContentChange={(file) => set({ contentFile: file })}
            onNext={() => set({ currentScreen: 2, error: null })}
            error={state.error}
          />
        )}

        {state.currentScreen === 2 && (
          <Screen2Configure
            config={state.config}
            onChange={(config) => set({ config })}
            onBack={() => set({ currentScreen: 1, error: null })}
            onGenerate={handleGenerate}
            error={state.error}
          />
        )}

        {state.currentScreen === 3 && (
          <Screen3Results
            presentationData={state.presentationData}
            onStartOver={() => setState(INITIAL_STATE)}
            onBack={() => set({ currentScreen: 2, error: null })}
          />
        )}
      </main>
    </div>
  );
}
