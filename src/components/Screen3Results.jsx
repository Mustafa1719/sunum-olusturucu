import { useState } from 'react';
import { Download, ChevronDown, ChevronUp, RotateCcw, CheckCircle2 } from 'lucide-react';
import { buildAndDownloadPptx } from '../services/pptxBuilder.js';

function ColorSwatch({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-5 h-5 rounded-full border border-slate-200 shadow-sm flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-mono text-slate-500">{color}</span>
      <span className="text-xs text-slate-400">({label})</span>
    </div>
  );
}

function SlidePreview({ slides }) {
  const typeLabels = {
    title: 'Başlık',
    agenda: 'Gündem',
    'section-divider': 'Bölüm Ayracı',
    content: 'İçerik',
    'two-column': 'İki Kolon',
    'data-highlight': 'Veri Vurgusu',
    quote: 'Alıntı',
    closing: 'Kapanış',
  };

  return (
    <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Slayt Listesi</p>
      </div>
      <div className="divide-y divide-slate-100">
        {slides.map((slide, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3">
            <span className="text-xs font-mono text-slate-400 w-6 text-right flex-shrink-0">{i + 1}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md font-medium flex-shrink-0">
              {typeLabels[slide.type] || slide.type}
            </span>
            <span className="text-sm text-slate-700 leading-snug">{slide.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VersionCard({ version, theme, index }) {
  const [expanded, setExpanded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const colors = ['blue', 'purple', 'emerald'];
  const color = colors[index % colors.length];
  const colorMap = {
    blue: { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    emerald: { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  };
  const c = colorMap[color];

  async function handleDownload() {
    setDownloading(true);
    try {
      await buildAndDownloadPptx(version, theme);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      alert('İndirme sırasında hata oluştu: ' + err.message);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className={`bg-white border-2 ${c.border} rounded-2xl shadow-sm overflow-hidden`}>
      {/* Renk şeridi */}
      <div className={`${c.bg} px-5 py-4`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Versiyon {index + 1}
            </p>
            <h3 className="text-white font-black text-lg leading-tight">{version.title}</h3>
          </div>
          <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-lg">
            {version.slides?.length || 0} slayt
          </span>
        </div>
      </div>

      <div className="p-5">
        <p className="text-slate-500 text-sm mb-4 leading-relaxed">{version.description}</p>

        {/* İndir butonu */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`
            w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all
            ${downloaded
              ? 'bg-green-500 text-white'
              : downloading
              ? 'bg-slate-200 text-slate-400 cursor-wait'
              : `${c.bg} text-white hover:opacity-90 shadow-md`
            }
          `}
        >
          {downloaded ? (
            <><CheckCircle2 className="w-4 h-4" /> İndirildi!</>
          ) : downloading ? (
            <><div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" /> Oluşturuluyor...</>
          ) : (
            <><Download className="w-4 h-4" /> .pptx İndir</>
          )}
        </button>

        {/* Önizleme toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1 mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Gizle' : 'Slayt listesini gör'}
        </button>

        {expanded && version.slides && <SlidePreview slides={version.slides} />}
      </div>
    </div>
  );
}

export default function Screen3Results({ presentationData, onStartOver, onBack }) {
  if (!presentationData) return null;

  const { templateTheme, contentSummary, versions } = presentationData;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Sunumların Hazır!</h2>
        <p className="text-slate-500 text-sm">
          3 farklı versiyonu incele ve beğendiğini indir. Her dosya PowerPoint veya Google Slides'ta açılır.
        </p>
      </div>

      {/* Tespit edilen tema */}
      {templateTheme && (
        <div className="bg-slate-800 text-white rounded-2xl p-5 mb-6">
          <p className="text-sm font-bold text-slate-300 mb-3">Şablondan Tespit Edilen Tema</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ColorSwatch color={templateTheme.primaryColor} label="Birincil" />
            <ColorSwatch color={templateTheme.secondaryColor} label="İkincil" />
            <ColorSwatch color={templateTheme.accentColor || templateTheme.secondaryColor} label="Vurgu" />
            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded font-mono">
                {templateTheme.fontStyle}
              </span>
              <span className="text-xs text-slate-400">{templateTheme.layoutStyle}</span>
            </div>
          </div>
        </div>
      )}

      {/* Kilit mesajlar */}
      {contentSummary?.keyMessages?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-bold text-amber-700 mb-2">İçerik Belgesinden Çıkarılan Kilit Mesajlar</p>
          <ul className="space-y-1">
            {contentSummary.keyMessages.map((msg, i) => (
              <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="text-amber-500 font-bold flex-shrink-0">•</span>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Versiyon kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {(versions || []).map((version, i) => (
          <VersionCard key={version.id || i} version={version} theme={templateTheme} index={i} />
        ))}
      </div>

      {/* Aksiyon butonları */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-blue-700 border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          Başka Versiyon Oluştur
        </button>
        <button
          onClick={onStartOver}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-600 border border-slate-300 hover:bg-slate-50 transition-all"
        >
          Yeni Sunum Başlat
        </button>
      </div>
    </div>
  );
}
