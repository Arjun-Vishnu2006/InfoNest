import React from 'react';
import { ArrowRight, Cloud, Code2, Database, Network, Server, ShieldCheck, Layers3, Users, Terminal } from 'lucide-react';
import { demoUpdates } from '../../data/demoData';

const updateIcons = { shield:ShieldCheck, code:Code2, cloud:Cloud, terminal:Terminal, layers:Layers3, users:Users, network:Network, server:Server, database:Database } as const;

export const LatestUpdates: React.FC = () => (
  <section className="space-y-3" aria-labelledby="latest-updates-heading">
    <div className="flex items-end justify-between gap-3 px-1">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-300 font-mono font-bold">Community Pulse</p>
        <h2 id="latest-updates-heading" className="text-lg sm:text-xl font-black text-white mt-1">Latest Updates</h2>
      </div>
      <span className="text-[10px] sm:text-xs text-slate-400 font-mono">{demoUpdates.length} learning updates</span>
    </div>
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 scrollbar-none" aria-label="Scrollable learning updates">
      {demoUpdates.map(update => {
        const Icon = updateIcons[update.icon as keyof typeof updateIcons] || SparklesIcon;
        return (
          <article key={update.id} className={`relative shrink-0 snap-start w-[min(82vw,300px)] sm:w-[300px] min-h-[174px] rounded-2xl p-4 border border-white/10 bg-gradient-to-br ${update.accent} overflow-hidden group hover:border-cyan-400/30 transition-colors`}>
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/[0.04] blur-xl" />
            <div className="relative flex items-center justify-between gap-3">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/25 border border-white/10 text-cyan-200"><Icon className="w-5 h-5" /></span>
              <span className="px-2 py-1 rounded-full text-[9px] uppercase tracking-wider font-mono text-slate-200 bg-black/20 border border-white/10">{update.category}</span>
            </div>
            <h3 className="relative mt-3 text-sm font-bold text-white leading-snug line-clamp-2">{update.title}</h3>
            <p className="relative mt-1 text-[11px] leading-relaxed text-slate-300 line-clamp-2">{update.description}</p>
            <div className="relative mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
              <span className="truncate">{update.source}</span><span className="shrink-0">{update.timestamp}</span>
            </div>
            <ArrowRight aria-hidden="true" className="absolute bottom-3 right-3 w-3.5 h-3.5 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </article>
        );
      })}
    </div>
  </section>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => <span className={className}>✦</span>;
