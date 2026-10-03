import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl glass-panel border backdrop-blur-xl shadow-2xl transition-all animate-[fadeIn_0.25s_ease-out] ${
              toast.type === 'success'
                ? 'border-emerald-500/30 bg-[#091410]/90 text-emerald-200'
                : toast.type === 'warning'
                ? 'border-amber-500/30 bg-[#161208]/90 text-amber-200'
                : 'border-purple-500/30 bg-[#100D1C]/90 text-purple-200'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : toast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-purple-400 shrink-0" />
              )}
              <span className="text-xs font-medium leading-snug">{toast.message}</span>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
