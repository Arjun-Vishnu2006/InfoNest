import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import { Zap, Trophy, Clock, Users, CheckCircle2, Code2, ArrowRight, Sparkles } from 'lucide-react';

export const ChallengesPage: React.FC = () => {
  const { challenges, submitChallengeSolution, currentUser } = useApp();
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [solutionCode, setSolutionCode] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unsolved' | 'solved'>('all');

  const filteredChallenges = challenges.filter(c => {
    if (activeTab === 'solved') return c.solved;
    if (activeTab === 'unsolved') return !c.solved;
    return true;
  });

  const activeChallenge = challenges.find(c => c.id === selectedChallengeId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallengeId) return;
    submitChallengeSolution(selectedChallengeId);
    setSelectedChallengeId(null);
    setSolutionCode('');
  };

  return (
    <MainLayout showRightRail={true}>
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider">
                Practice & Prove
              </span>
              <span className="text-xs font-mono text-slate-400">· Solve real engineering problems</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 font-sans">
              <Zap className="w-7 h-7 text-amber-400" />
              <span>Knowledge Challenges</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Submit code, systems architectures, and algorithmic proofs to earn Knowledge Tokens and creator peer reviews.
            </p>
          </div>

          <div className="p-3 glass-panel rounded-2xl border border-white/10 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div className="text-xs font-mono">
              <span className="text-slate-400 block">Solved by You</span>
              <span className="text-slate-100 font-bold">1 Challenge Solved</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit text-xs font-mono">
          {[
            { id: 'all', label: 'All Challenges' },
            { id: 'unsolved', label: 'Active Challenges' },
            { id: 'solved', label: 'Solved' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-black font-bold shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Challenges Stream */}
        <div className="space-y-4">
          {filteredChallenges.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 border border-white/10 text-center">
              <Zap className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="mt-4 text-lg font-bold text-white">No challenges available</h3>
              <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">There are no challenges available for this category right now.</p>
            </div>
          ) : (
            <>
            {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`glass-panel rounded-3xl p-5 sm:p-6 border transition-all space-y-4 ${
                challenge.solved
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-white/10 hover:border-amber-500/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      challenge.difficulty === 'Hard' || challenge.difficulty === 'Extreme'
                        ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                        : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                    }`}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Category: {challenge.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono self-start sm:self-auto">
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{challenge.deadline}</span>
                  </span>
                  <span className="text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                    +{challenge.rewardTokens} KT
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {challenge.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {challenge.tags.map(t => (
                  <span
                    key={t}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Submission CTA */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{challenge.participants} engineers entered</span>
                </span>

                {challenge.solved ? (
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Solved (+{challenge.rewardTokens} KT Awarded)</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setSelectedChallengeId(challenge.id);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold rounded-xl text-xs hover:scale-105 transition-transform flex items-center gap-1.5 shadow-glow-purple"
                  >
                    <Code2 className="w-4 h-4" />
                    <span>Submit Solution</span>
                  </button>
                )}
              </div>
            </div>
          ))}
            </>
          )}
        </div>

        {/* Modal for Solution Submission */}
        {activeChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-xl rounded-3xl glass-panel border border-amber-500/30 p-6 shadow-2xl bg-[#0A0C16] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-bold">
                    Submit Solution · +{activeChallenge.rewardTokens} KT
                  </span>
                  <h3 className="text-base font-bold text-white font-sans mt-0.5">
                    {activeChallenge.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedChallengeId(null)}
                  className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">
                    Your Code or System Topology Solution:
                  </label>
                  <textarea
                    value={solutionCode}
                    onChange={(e) => setSolutionCode(e.target.value)}
                    placeholder={`// Paste your optimized algorithm or architecture explanation here...\n\nfunction solve(grid, start, target) {\n  // your implementation\n}`}
                    rows={8}
                    className="w-full p-3.5 bg-black/80 border border-white/15 rounded-2xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    Automated test harness will benchmark execution in ~1.2ms
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold rounded-xl text-xs hover:scale-105 transition-transform shadow-glow-purple"
                  >
                    Verify & Claim KT
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
