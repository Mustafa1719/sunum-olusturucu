import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

const AUDIENCES = ['Yönetim Kurulu', 'Üst Yönetim', 'Proje Ekibi', 'Müşteriler', 'Yatırımcılar', 'Tüm Çalışanlar'];

const TONES = [
  { value: 'Profesyonel ve resmi', label: 'Resmi', desc: 'Kurumsal ve ciddi bir dil' },
  { value: 'Güvenli ve doğrudan', label: 'Doğrudan', desc: 'Net, özlü ve kararlı' },
  { value: 'Etkileşimli ve samimi', label: 'Samimi', desc: 'Sıcak ve yaklaşılabilir' },
];

const VERSIONS = [
  {
    value: 'strategic',
    label: 'Stratejik Genel Bakış',
    desc: 'Büyük resimden detaya iner',
    icon: '🗺️',
  },
  {
    value: 'problem-solution',
    label: 'Problem-Çözüm',
    desc: 'Zorluğu gösterir, çözümle biter',
    icon: '🎯',
  },
  {
    value: 'data-first',
    label: 'Veriye Dayalı',
    desc: 'Sayı ve kanıtlarla başlar',
    icon: '📊',
  },
];

export default function Screen2Configure({ config, onChange, onBack, onGenerate, error }) {
  function update(key, value) {
    onChange({ ...config, [key]: value });
  }

  const selectedVersion = VERSIONS.find((v) => v.value === config.versionType) || VERSIONS[0];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Sunumunu Yapılandır</h2>
        <p className="text-slate-500 text-sm">
          Hangi anlatı yapısıyla sunum oluşturulacağını seç. Her versiyon aynı içeriği farklı bir perspektiften ele alır.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">

        {/* Versiyon tipi */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-3">
            Sunum Versiyonu
          </label>
          <div className="grid grid-cols-1 gap-3">
            {VERSIONS.map((v) => (
              <button
                key={v.value}
                onClick={() => update('versionType', v.value)}
                className={`
                  border-2 rounded-xl p-4 text-left transition-all flex items-center gap-4
                  ${config.versionType === v.value || (!config.versionType && v.value === 'strategic')
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                  }
                `}
              >
                <span className="text-2xl">{v.icon}</span>
                <div>
                  <p className={`text-sm font-bold ${config.versionType === v.value ? 'text-blue-700' : 'text-slate-700'}`}>
                    {v.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{v.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Her versiyonu ayrı ayrı oluşturabilirsin. İstediğin kadar tekrarlayabilirsin.
          </p>
        </div>

        {/* Başlık */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Sunum Başlığı
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder='Örn: "2025 Q3 Strateji Sunumu"'
            maxLength={120}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{config.title.length}/120</p>
        </div>

        {/* Hedef kitle */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Hedef Kitle
          </label>
          <select
            value={config.audience}
            onChange={(e) => update('audience', e.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {AUDIENCES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* İletişim tonu */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-3">
            İletişim Tonu
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => update('tone', t.value)}
                className={`
                  border-2 rounded-xl p-3 text-left transition-all
                  ${config.tone === t.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                  }
                `}
              >
                <p className={`text-sm font-bold ${config.tone === t.value ? 'text-blue-700' : 'text-slate-700'}`}>
                  {t.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Slayt sayısı */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-2">
            Slayt Sayısı
            <span className="ml-2 text-blue-600 font-black">{config.slideCount}</span>
          </label>
          <input
            type="range"
            min={4}
            max={10}
            value={config.slideCount}
            onChange={(e) => update('slideCount', Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>4 (Kısa)</span>
            <span>7 (Orta)</span>
            <span>10 (Detaylı)</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-4">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-600 border border-slate-300 hover:bg-slate-50 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </button>

        <button
          onClick={onGenerate}
          className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          {selectedVersion.icon} {selectedVersion.label} Oluştur
          <span className="text-blue-200 font-normal">(~15-20 sn)</span>
        </button>
      </div>
    </div>
  );
}
