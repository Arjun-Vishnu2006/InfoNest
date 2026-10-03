import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { RoadmapConstellation3D } from '../components/3d/RoadmapConstellation3D';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import { Layers, Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const RoadmapsPage: React.FC = () => {
  const { roadmaps, cloneRoadmapToMyGoals } = useApp();
  const [activeRoadmapIndex, setActiveRoadmapIndex] = useState(0);
  const currentRoadmap = roadmaps[activeRoadmapIndex] || roadmaps[0];
  const [selectedMilestoneId, setSelectedMilestoneId] = useState('');

  if (!currentRoadmap) {
    return (
      <MainLayout showRightRail={false}>
        <div className="w-full space-y-6">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 text-center">
            <Layers className="w-10 h-10 text-cyan-300 mx-auto" />
            <h1 className="mt-4 text-2xl font-black text-white">Learning Roadmaps</h1>
            <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">No sample roadmaps are loaded. Creators can build and publish the first roadmap from the Creator workspace.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-10">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-black">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Learning Cosmos</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Learning Roadmaps
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Turn curiosity into a trajectory. Follow step-by-step verified engineering milestones, verify skills in production projects, and clone battle-tested curriculums directly into your goal rhythm.
            </p>
          </div>
        </div>

        {/* 3D Roadmap Constellation Canvas */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>3D Constellation: {currentRoadmap.title}</span>
            </div>
            {/* Roadmap Switcher Tabs */}
            <div className="flex gap-2 text-xs font-mono">
              {roadmaps.map((rm, idx) => (
                <button
                  key={rm.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveRoadmapIndex(idx);
                    setSelectedMilestoneId(rm.milestones[0].id);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    activeRoadmapIndex === idx
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-cyan'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {rm.category.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <RoadmapConstellation3D
            milestones={currentRoadmap.milestones}
            activeMilestoneId={selectedMilestoneId || currentRoadmap.milestones[0]?.id || ''}
            onSelectMilestone={(id) => setSelectedMilestoneId(id)}
            height={380}
          />
        </div>

        {/* Roadmaps Catalog */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Curated Milestone Trajectories</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((rm) => (
              <div
                key={rm.id}
                className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4 group hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">
                      {rm.level}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ⏱ {rm.estimatedWeeks} Weeks
                    </span>
                  </div>

                  <Link
                    to={`/roadmap/${rm.id}`}
                    onClick={() => sounds.playClick()}
                    className="text-base font-bold text-white group-hover:text-purple-300 transition-colors block"
                  >
                    {rm.title}
                  </Link>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {rm.description}
                  </p>

                  <div className="space-y-1 pt-3">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Milestones Completed</span>
                      <span className="text-emerald-400">{rm.completedMilestones}/{rm.totalMilestones}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full"
                        style={{ width: `${(rm.completedMilestones / rm.totalMilestones) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <button
                    onClick={() => cloneRoadmapToMyGoals(rm)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white border border-white/10 transition-colors"
                  >
                    + Clone Goal
                  </button>

                  <Link
                    to={`/roadmap/${rm.id}`}
                    onClick={() => sounds.playClick()}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-glow-purple flex items-center gap-1 hover:opacity-95"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
