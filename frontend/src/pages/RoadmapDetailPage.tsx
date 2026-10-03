import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { RoadmapConstellation3D } from '../components/3d/RoadmapConstellation3D';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import {
  Layers,
  CheckCircle2,
  Circle,
  Lock,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Award,
  Clock
} from 'lucide-react';

export const RoadmapDetailPage: React.FC = () => {
  const { roadmapId } = useParams<{ roadmapId: string }>();
  const { roadmaps, toggleMilestoneComplete, cloneRoadmapToMyGoals } = useApp();

  const roadmap = roadmaps.find(r => r.id === roadmapId) || roadmaps[0];

  if (!roadmap || !roadmap.milestones || roadmap.milestones.length === 0) {
    return (
      <MainLayout showRightRail={false}>
        <div className="text-center py-24 glass-panel rounded-3xl border border-white/10 space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Roadmap not found</h3>
          <p className="text-xs text-slate-400">This roadmap doesn't exist or hasn't been loaded yet.</p>
          <Link to="/roadmaps" className="inline-block mt-4 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-500">← Back to Roadmaps</Link>
        </div>
      </MainLayout>
    );
  }

  const [selectedMilestoneId, setSelectedMilestoneId] = useState(roadmap.milestones[0].id);

  const selectedMilestone = roadmap.milestones.find(m => m.id === selectedMilestoneId) || roadmap.milestones[0];

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-8">
        {/* Back Link & Header */}
        <div className="space-y-4">
          <Link
            to="/roadmaps"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Roadmaps</span>
          </Link>

          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-black flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  {roadmap.category}
                </span>
                <span className="text-xs font-mono text-purple-300">
                  ⭐ {roadmap.clonesCount.toLocaleString()} Students Enrolled
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {roadmap.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
                {roadmap.description}
              </p>
            </div>

            <button
              onClick={() => cloneRoadmapToMyGoals(roadmap)}
              className="shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl text-xs shadow-glow-cyan transition-all self-start md:self-center"
            >
              <Layers className="w-4 h-4" />
              <span>Adopt to My Goals</span>
            </button>
          </div>
        </div>

        {/* 3D Milestone Constellation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Interactive 3D Constellation Cosmos
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Drag to rotate · Click any 3D node to inspect
            </span>
          </div>
          <RoadmapConstellation3D
            milestones={roadmap.milestones}
            activeMilestoneId={selectedMilestoneId}
            onSelectMilestone={(id) => setSelectedMilestoneId(id)}
            height={340}
          />
        </div>

        {/* Milestone Sequence & Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Milestone Phases */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Milestone Progression
              </h3>
              <span className="text-xs font-mono text-emerald-400">
                {roadmap.completedMilestones}/{roadmap.totalMilestones} Completed
              </span>
            </div>

            <div className="space-y-3">
              {roadmap.milestones.map((m, idx) => {
                const isSelected = m.id === selectedMilestoneId;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      sounds.playClick();
                      setSelectedMilestoneId(m.id);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? 'bg-purple-950/30 border-purple-500/50 shadow-glow-purple'
                        : 'bg-white/[0.03] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMilestoneComplete(roadmap.id, m.id);
                      }}
                      className="mt-0.5 shrink-0"
                    >
                      {m.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                      ) : m.status === 'in-progress' ? (
                        <Circle className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-600" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-slate-500">Phase {idx + 1}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.2 rounded uppercase ${
                            m.status === 'completed'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                              : m.status === 'in-progress'
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : 'bg-white/5 text-slate-500'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">{m.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{m.description}</p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.skills.map(s => (
                          <span key={s} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Node Inspector & Certificate Path */}
          <div className="space-y-6">
            {/* Selected Node Details */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Inspecting Milestone
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ~{selectedMilestone.estimatedHours} hrs
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1.5">{selectedMilestone.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedMilestone.description}</p>
              </div>

              {selectedMilestone.projectIdea && (
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                  <span className="font-bold text-purple-300 block mb-0.5">Recommended Project:</span>
                  {selectedMilestone.projectIdea}
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Required Masterclasses
                </span>
                {selectedMilestone.recommendedLectures.map((lec, i) => (
                  <Link
                    key={i}
                    to="/lecture/lec_1"
                    onClick={() => sounds.playClick()}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs text-slate-200 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate group-hover:text-purple-300">{lec}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">Watch →</span>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => toggleMilestoneComplete(roadmap.id, selectedMilestone.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedMilestone.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-purple-600 to-emerald-500 text-white shadow-glow-emerald hover:opacity-95'
                }`}
              >
                {selectedMilestone.status === 'completed'
                  ? '✓ Completed (+250 Tokens Awarded)'
                  : 'Mark Milestone Complete (+250 KT)'}
              </button>
            </div>

            {/* Certificate Path Info */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
                <Award className="w-4 h-4" />
                <span>CERTIFICATE TRAJECTORY</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete all {roadmap.totalMilestones} phases to unlock the {roadmap.certificatePath}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
