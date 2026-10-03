import React, { useEffect, useState } from 'react';
import { BrainCircuit, ChevronRight, Loader2, Sparkles, UserRound } from 'lucide-react';
import { aiApi } from '../../services/api';

type Recommendation = {
  id?: string;
  title?: string;
  name?: string;
  reason: string;
};

type Recommendations = {
  summary?: string;
  whatNext?: Recommendation[];
  content?: Recommendation[];
  creators?: Recommendation[];
  goalInsights?: Array<{
    goalId: string;
    goalTitle: string;
    progressPercent: number;
    nextStep: string;
    reason: string;
  }>;
};

export const AIRecommendationsPanel: React.FC = () => {
  const [data, setData] = useState<Recommendations | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setBusy(true);
    setError('');
    try {
      const result = await aiApi.recommendations();
      setData(result?.data?.recommendations || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Recommendations are temporarily unavailable.');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { void load(); }, []);

  return (
    <section className="glass-panel rounded-3xl p-5 sm:p-6 border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-purple-950/20 to-transparent">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-300 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
            <BrainCircuit className="w-4 h-4" /> AI Learning Navigator
          </div>
          <h3 className="mt-2 text-xl font-black text-white">What Next?</h3>
          <p className="mt-1 text-xs text-slate-400">Grok checks your active goals, roadmap progress, and current InfoNest content before recommending your next steps.</p>
        </div>
        <button onClick={() => void load()} disabled={busy} className="shrink-0 p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 disabled:opacity-40" title="Refresh recommendations">
          <Sparkles className={`w-4 h-4 ${busy ? 'animate-pulse' : ''}`} />
        </button>
      </div>

      {busy && <div className="mt-5 flex items-center gap-2 text-sm text-cyan-300"><Loader2 className="w-4 h-4 animate-spin" /> Checking your learning state…</div>}
      {error && !busy && <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">{error}</div>}

      {!busy && !error && data && (
        <div className="mt-5 space-y-5">
          {data.summary && <p className="text-sm text-slate-300 leading-relaxed">{data.summary}</p>}

          {(data.goalInsights?.length || 0) > 0 && (
            <div>
              <div className="text-xs font-bold text-white mb-2">Goal monitor</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.goalInsights!.slice(0, 4).map(goal => (
                  <div key={goal.goalId} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="flex justify-between gap-3 text-xs font-semibold text-white"><span>{goal.goalTitle}</span><span className="text-cyan-300">{goal.progressPercent}%</span></div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(100, Math.max(0, goal.progressPercent))}%` }} /></div>
                    <p className="mt-2 text-[11px] text-slate-400">Next: {goal.nextStep}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4">
              <div className="text-xs font-bold text-purple-200 mb-3">Next steps</div>
              <div className="space-y-3">
                {(data.whatNext || []).slice(0, 4).map((item, index) => <div key={`${item.title}-${index}`}><div className="flex gap-2 text-sm font-semibold text-white"><ChevronRight className="w-4 h-4 text-purple-300 shrink-0" />{item.title}</div><p className="ml-6 mt-1 text-[11px] text-slate-400">{item.reason}</p></div>)}
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <div className="text-xs font-bold text-cyan-200 mb-3">Recommended content</div>
              <div className="space-y-3">
                {(data.content || []).slice(0, 4).map((item, index) => <div key={`${item.title}-${index}`}><div className="text-sm font-semibold text-white">{item.title}</div><p className="mt-1 text-[11px] text-slate-400">{item.reason}</p></div>)}
                {(data.content || []).length === 0 && <p className="text-[11px] text-slate-500">No matching content yet. Recommendations will grow as creators publish.</p>}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="text-xs font-bold text-white mb-3 flex items-center gap-2"><UserRound className="w-4 h-4 text-cyan-300" />Creators to explore</div>
              <div className="space-y-3">
                {(data.creators || []).slice(0, 4).map((item, index) => <div key={`${item.name}-${index}`}><div className="text-sm font-semibold text-white">{item.name}</div><p className="mt-1 text-[11px] text-slate-400">{item.reason}</p></div>)}
                {(data.creators || []).length === 0 && <p className="text-[11px] text-slate-500">No matching creators yet.</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
