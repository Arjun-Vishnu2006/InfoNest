import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import { Target, CheckCircle2, Circle, Award, Sparkles, Trophy, Calendar, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MissionsPage: React.FC = () => {
  const { learningMissions, toggleMissionTask, claimMissionReward, currentUser } = useApp();
  const [missionTab, setMissionTab] = useState<'all' | 'daily' | 'weekly' | 'roadmap'>('all');

  const filteredMissions = learningMissions.filter(m => {
    if (missionTab === 'all') return true;
    return m.type === missionTab;
  });

  return (
    <MainLayout showRightRail={true}>
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold uppercase tracking-wider">
                Signature System
              </span>
              <span className="text-xs font-mono text-slate-400">· Turn study goals into daily momentum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 font-sans">
              <Target className="w-7 h-7 text-emerald-400" />
              <span>Learning Missions</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Daily & weekly actionable tasks. Earn Knowledge Tokens, badges, and verified Knowledge Proofs.
            </p>
          </div>

          <div className="p-3 glass-panel rounded-2xl border border-amber-500/30 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl">
              💎
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Reward Vault</span>
              <span className="text-sm font-mono font-bold text-amber-300">
                {currentUser.knowledgeTokens.toLocaleString()} KT
              </span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10 w-fit text-xs font-mono">
          {[
            { id: 'all', label: 'All Missions' },
            { id: 'daily', label: 'Daily (Reset in 8h)' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'roadmap', label: 'Roadmap Target' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setMissionTab(tab.id as any);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                missionTab === tab.id
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Missions List */}
        <div className="space-y-4">
          {filteredMissions.length === 0 ? (
            <div className="glass-panel rounded-3xl p-10 border border-white/10 text-center">
              <Target className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="mt-4 text-lg font-bold text-white">No active missions</h3>
              <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">Check back later for new learning missions and daily refreshes.</p>
            </div>
          ) : (
            <>
            {filteredMissions.map((mission) => {
              const isAllDone = mission.progress === mission.total;

            return (
              <div
                key={mission.id}
                className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-emerald-500/30 transition-all space-y-4 relative overflow-hidden"
              >
                {/* Background glow when completed */}
                {isAllDone && (
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-bold ${
                        mission.type === 'daily'
                          ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          : mission.type === 'weekly'
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {mission.type} mission
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Progress: {mission.progress} / {mission.total} tasks
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20 self-start sm:self-auto">
                    +{mission.rewardTokens} Knowledge Tokens
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {mission.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                  />
                </div>

                {/* Checklist */}
                <div className="space-y-2 pt-1">
                  {mission.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleMissionTask(mission.id, task.id)}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all flex items-center justify-between group select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-slate-300" />
                        )}
                        <span
                          className={`text-xs font-medium transition-colors ${
                            task.completed ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {task.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Footer */}
                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <span className="text-[11px] font-mono text-slate-400">
                    {isAllDone ? 'All tasks complete!' : `${mission.total - mission.progress} tasks remaining`}
                  </span>

                  {isAllDone && !mission.claimed ? (
                    <button
                      onClick={() => claimMissionReward(mission.id)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold rounded-xl text-xs shadow-glow-emerald hover:scale-105 transition-transform flex items-center gap-1.5 animate-bounce"
                    >
                      <Trophy className="w-4 h-4" />
                      <span>Claim +{mission.rewardTokens} Knowledge Tokens!</span>
                    </button>
                  ) : mission.claimed ? (
                    <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reward Claimed</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        mission.tasks.forEach(task => {
                          if (!task.completed) {
                            toggleMissionTask(mission.id, task.id);
                          }
                        });
                      }}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-xs font-mono transition-colors"
                    >
                      Mark All Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
