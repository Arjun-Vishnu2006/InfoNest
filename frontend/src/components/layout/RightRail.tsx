import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, UserPlus, UserCheck, Plus, Target, CheckCircle2, Circle, CloudSun, ArrowUpRight, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';


export const RightRail: React.FC = () => {
  const {
    goals,
    logStudyHours,
    toggleFollowCreator,
    creators,
    learningMissions,
    toggleMissionTask,
    claimMissionReward
  } = useApp();

  const [hoveredCreatorId, setHoveredCreatorId] = useState<string | null>(null);

  const primaryGoal = goals[0];
  const dailyMission = learningMissions.find(m => m.type === 'daily') || learningMissions[0];

  const trendingTags = [
    'ReasoningAI',
    'DistributedSystems',
    'Kafka',
    'WebGPU',
    'ZKProofs',
    'SystemArchitecture',
    'GenerativeAI',
    'React',
    'Cybersecurity'
  ];

  const progressPercent = primaryGoal
    ? Math.min(100, Math.round((primaryGoal.loggedHoursThisWeek / primaryGoal.targetHoursPerWeek) * 100))
    : 79;

  return (
    <aside className="w-80 shrink-0 hidden xl:flex flex-col gap-5 py-6 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-none">
      {/* 1. Weekly Goal Pace */}
      {primaryGoal && (
        <div className="glass-panel rounded-2xl p-4 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              Weekly Goal Pace
            </span>
            <span className="text-xs font-mono font-semibold text-slate-300">
              9.5h / 12h
            </span>
          </div>

          <div className="flex items-center gap-4 my-2">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-500 transition-all duration-700 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-mono font-bold text-white">
                {progressPercent}%
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-100 truncate">
                Full-Stack Generative AI Architect
              </h4>
              <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                2h 30m remaining this week
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
            <button
              onClick={() => logStudyHours(primaryGoal.id, 1)}
              className="flex-1 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl text-xs font-medium flex items-center justify-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log 1h Study</span>
            </button>
            <Link
              to="/goals"
              onClick={() => sounds.playClick()}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-medium border border-white/10 transition-all flex items-center"
            >
              Open Goals
            </Link>
          </div>
        </div>
      )}

      {/* 2. SIGNATURE FEATURE: DAILY LEARNING MISSION */}
      {dailyMission && (
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>TODAY'S MISSION</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
              +{dailyMission.rewardTokens} KT
            </span>
          </div>

          <h4 className="text-xs font-semibold text-slate-100 mb-2.5">
            "{dailyMission.title}"
          </h4>

          {/* Interactive Checklist */}
          <div className="space-y-1.5 mb-3">
            {dailyMission.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleMissionTask(dailyMission.id, task.id)}
                className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group select-none"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5 group-hover:text-slate-300" />
                )}
                <span
                  className={`text-[11px] leading-tight transition-colors ${
                    task.completed ? 'line-through text-slate-500' : 'text-slate-300'
                  }`}
                >
                  {task.title}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono">
            <span className="text-slate-400">
              Progress: <strong className="text-emerald-400">{dailyMission.progress}/{dailyMission.total}</strong>
            </span>
            {dailyMission.completed && !dailyMission.claimed ? (
              <button
                onClick={() => claimMissionReward(dailyMission.id)}
                className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-bold rounded-lg text-xs shadow-glow-emerald animate-pulse"
              >
                Claim +{dailyMission.rewardTokens} KT
              </button>
            ) : (
              <Link
                to="/missions"
                onClick={() => sounds.playClick()}
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>Start Mission →</span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 3. TOP FRONTIER CREATORS (with hover preview) */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              TOP FRONTIER CREATORS
            </h3>
          </div>
          <Link
            to="/creators"
            onClick={() => sounds.playClick()}
            className="text-[11px] font-mono text-purple-400 hover:text-purple-300"
          >
            View All →
          </Link>
        </div>

        <div className="space-y-3">
          {creators.length === 0 ? (
            <div className="text-center py-4 rounded-xl border border-white/5 bg-white/5">
              <span className="text-xs text-slate-400">No creators found</span>
            </div>
          ) : (
            creators.slice(0, 4).map((creator) => (
              <div
                key={creator.id}
                className="relative flex items-center justify-between gap-3 group"
                onMouseEnter={() => setHoveredCreatorId(creator.id)}
                onMouseLeave={() => setHoveredCreatorId(null)}
              >
                <Link
                  to={`/creator/${creator.username}`}
                  onClick={() => sounds.playClick()}
                  className="flex items-center gap-2.5 min-w-0 flex-1"
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-purple-400 transition-all shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-200 truncate group-hover:text-purple-300 transition-colors">
                        {creator.name}
                      </span>
                      {creator.verified && <span className="text-[10px] text-cyan-400">✓</span>}
                    </div>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {creator.specialty}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-purple-400">
                      <Award className="w-3 h-3" />
                      <span>KS {creator.knowledgeScore || 8420}</span>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => toggleFollowCreator(creator.id)}
                  className={`p-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
                    creator.isFollowed
                      ? 'bg-white/5 text-slate-400 border border-white/10 hover:bg-rose-500/10 hover:text-rose-400'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                  }`}
                  title={creator.isFollowed ? 'Unfollow' : 'Follow Creator'}
                >
                  {creator.isFollowed ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                </button>

                {/* Creator Hover Preview Card */}
                {hoveredCreatorId === creator.id && (
                  <div className="absolute right-0 top-12 z-50 w-64 p-3.5 glass-panel rounded-2xl border border-purple-500/30 shadow-2xl space-y-2 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Followers: <strong className="text-white">{(creator.followersCount / 1000).toFixed(1)}k</strong></span>
                      <span className="text-cyan-300 font-bold">KS {creator.knowledgeScore || 8420}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {creator.bio}
                    </p>
                    <div className="pt-1.5 border-t border-white/5 text-[10px] font-mono text-purple-300 truncate">
                      ✦ Recent Drop: RAG failure analysis
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. SIGNATURE FEATURE: KNOWLEDGE WEATHER */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-1.5 mb-2.5">
          <CloudSun className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
            Knowledge Weather
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="col-span-2 text-center py-3 text-slate-500 text-[11px]">No trending data yet</div>
        </div>
      </div>

      {/* 5. Trending Topics Tags */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
          Trending Topics
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {trendingTags.map((tag) => (
            <Link
              key={tag}
              to={`/search?q=${encodeURIComponent(tag)}`}
              onClick={() => sounds.playClick()}
              className="text-xs px-2.5 py-1 rounded-lg border font-mono bg-white/5 text-slate-300 border-white/5 hover:border-purple-500/40 hover:text-purple-300 hover:bg-purple-500/10 transition-all"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-2 text-[11px] font-mono text-slate-500 space-y-1">
        <p>© 2026 InfoNest. Your Knowledge Universe.</p>
        <div className="flex gap-3 text-slate-400">
          <Link to="/explore" className="hover:text-purple-400">Cosmos</Link>
          <span>·</span>
          <Link to="/courses" className="hover:text-purple-400">Vault</Link>
          <span>·</span>
          <Link to="/missions" className="hover:text-purple-400">Missions</Link>
          <span>·</span>
          <Link to="/orbit-rooms" className="hover:text-purple-400">Orbit</Link>
        </div>
      </div>
    </aside>
  );
};
