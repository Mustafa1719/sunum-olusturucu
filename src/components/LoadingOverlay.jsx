export default function LoadingOverlay({ message }) {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-2">Yapay Zeka Çalışıyor</h3>
        <p className="text-slate-500 text-sm leading-relaxed min-h-[2.5rem] transition-all duration-500">
          {message || 'Lütfen bekleyin...'}
        </p>

        <p className="text-xs text-slate-400 mt-4">Bu işlem 20-60 saniye sürebilir</p>
      </div>
    </div>
  );
}
