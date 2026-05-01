import { Presentation, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import FileDropZone from './FileDropZone.jsx';

export default function Screen1Upload({ pptxFile, contentFile, onPptxChange, onContentChange, onNext, error }) {
  const canProceed = pptxFile && contentFile;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Dosyalarını Yükle</h2>
        <p className="text-slate-500 text-sm">
          Kurumsal PowerPoint şablonunu ve sunum içeriğini yükle. Yapay zeka şablonun renklerini,
          fontlarını ve düzenini analiz ederek içeriğini otomatik olarak yapılandıracak.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FileDropZone
          label="PowerPoint Şablonu"
          accept=".pptx"
          acceptLabel=".pptx"
          file={pptxFile}
          onChange={onPptxChange}
          icon={Presentation}
        />
        <FileDropZone
          label="İçerik Belgesi"
          accept=".pdf,.docx,.txt"
          acceptLabel=".pdf .docx .txt"
          file={contentFile}
          onChange={onContentChange}
          icon={FileText}
        />
      </div>

      {/* Bilgi kutusu */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-700 font-semibold mb-1">Nasıl çalışır?</p>
        <ul className="text-xs text-blue-600 space-y-1 list-disc list-inside">
          <li>Şablon dosyandan renk paleti, font ve düzen stilini çıkarırız</li>
          <li>İçerik belgende ne varsa yapay zeka onu slaytlara dönüştürür</li>
          <li>Birbirinden farklı vurguya sahip 3 versiyon üretilir</li>
          <li>Her versiyonu indir ve PowerPoint'te aç</li>
        </ul>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all
            ${canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          İleri: Yapılandır
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
