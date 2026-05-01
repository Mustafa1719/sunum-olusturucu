export default function StepIndicator({ currentScreen }) {
  const steps = [
    { n: 1, label: 'Yükle' },
    { n: 2, label: 'Ayarla' },
    { n: 3, label: 'Sonuçlar' },
  ];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const done = currentScreen > step.n;
        const active = currentScreen === step.n;
        return (
          <div key={step.n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  done
                    ? 'bg-green-500 text-white'
                    : active
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-400'
                }`}
              >
                {done ? '✓' : step.n}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? 'text-blue-600' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 h-0.5 mx-1 mb-4 ${done ? 'bg-green-400' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
