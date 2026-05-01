import { useRef, useState } from 'react';
import { Upload, CheckCircle2, FileText, AlertCircle } from 'lucide-react';

export default function FileDropZone({ label, accept, acceptLabel, file, onChange, icon: Icon = FileText }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  function validate(f) {
    const ext = f.name.split('.').pop().toLowerCase();
    const allowed = accept.split(',').map((a) => a.trim().replace('.', '').toLowerCase());
    if (!allowed.includes(ext)) {
      setError(`Bu dosya türü desteklenmiyor. Kabul edilen: ${acceptLabel}`);
      return false;
    }
    setError('');
    return true;
  }

  function handleFile(f) {
    if (f && validate(f)) onChange(f);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all text-center
          ${dragOver ? 'border-blue-500 bg-blue-50' : ''}
          ${file ? 'border-green-400 bg-green-50' : !dragOver ? 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {file ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <p className="font-semibold text-green-700 text-sm break-all">{file.name}</p>
            <p className="text-xs text-green-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button
              onClick={(e) => { e.stopPropagation(); onChange(null); setError(''); }}
              className="text-xs text-slate-400 underline mt-1 hover:text-red-500"
            >
              Değiştir
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center">
              {dragOver ? (
                <Upload className="w-7 h-7 text-blue-500" />
              ) : (
                <Icon className="w-7 h-7 text-slate-400" />
              )}
            </div>
            <div>
              <p className="font-semibold text-slate-600 text-sm">Sürükle & Bırak</p>
              <p className="text-slate-400 text-xs mt-0.5">veya tıklayarak seç</p>
            </div>
            <span className="text-xs bg-slate-200 text-slate-500 px-3 py-1 rounded-full font-mono">
              {acceptLabel}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
