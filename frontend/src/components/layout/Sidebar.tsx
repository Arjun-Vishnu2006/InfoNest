import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  Map,
  BookOpen,
  Target,
  Bookmark,
  Users,
  LayoutDashboard,
  FolderKanban,
  Edit3,
  PlusSquare,
  Flame,
  Settings,
  GitPullRequest,
  Layers,
  Radio,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';

export const Sidebar: React.FC = () => {
  const { role, currentUser } = useApp();

  const studentNavItems = [
    { to: '/feed', label: 'The Nest', icon: Sparkles },
    { to: '/explore', label: 'Explore Cosmos', icon: Compass },
    { to: '/roadmaps', label: 'Learning Roadmaps', icon: Map, badge: '3 active' },
    { to: '/courses', label: 'Course Vault', icon: BookOpen, badge: 'Vault' },
    { to: '/missions', label: 'Learning Missions', icon: Target, badge: 'New' },
    { to: '/orbit-rooms', label: 'Orbit Rooms', icon: Radio, badge: 'Live' },
    { to: '/challenges', label: 'Knowledge Challenges', icon: Zap },
    { to: '/goals', label: 'My Goals & Progress', icon: Layers, badge: '2 today' },
    { to: '/saved', label: 'Saved Vault', icon: Bookmark, badge: '12' },
    { to: '/profile', label: 'My Professional Profile', icon: Users },
  ];

  const creatorNavItems = [
    { to: '/creator/dashboard', label: 'Creator Pulse & Analytics', icon: LayoutDashboard },
    { to: '/creator/content', label: 'Content Manager', icon: FolderKanban },
    { to: '/creator/studio', label: 'Publishing Studio', icon: Edit3, badge: 'Studio' },
    { to: '/create/post', label: 'Create Post Drop', icon: PlusSquare },
    { to: '/create/course', label: 'Create Course Wizard', icon: BookOpen },
    { to: '/create/roadmap', label: 'Create Roadmap', icon: Layers },
    { to: '/feed', label: 'Switch to The Nest', icon: Sparkles },
  ];

  const items = role === 'creator' ? creatorNavItems : studentNavItems;

  return (
    <aside className="w-64 xl:w-72 shrink-0 hidden lg:flex flex-col gap-5 py-6 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto scrollbar-none">
      {/* Navigation List */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-widest text-slate-400 flex items-center justify-between">
          <span>{role === 'creator' ? 'Creator Studio' : 'Universe Navigation'}</span>
          {role === 'creator' && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Pro Studio
            </span>
          )}
        </div>

        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => sounds.playClick()}
              className={({ isActive }) =>
                `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/35 to-indigo-600/25 text-white border border-purple-500/40 shadow-glow-purple'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-purple-300'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${
                        item.badge === 'Live'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse'
                          : item.badge === '3 active'
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                          : item.badge === 'New'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                          : 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* SIGNATURE INFONEST FEATURE: LEARNING PULSE */}
      {role === 'student' && (
        <div className="glass-panel rounded-2xl p-4 border border-purple-500/20 relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl -z-10 group-hover:bg-purple-600/20 transition-all" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                LEARNING PULSE
              </span>
            </div>
            <span className="text-[11px] font-mono text-purple-300 font-semibold">Today: 72%</span>
          </div>

          {/* Animated SVG Pulse Line */}
          <div className="w-full h-8 my-1 flex items-center justify-center">
            <svg className="w-full h-full text-cyan-400/80" viewBox="0 0 200 30" fill="none">
              <path
                d="M0 15 H50 L60 5 L70 25 L80 10 L90 20 L100 15 H200"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70 animate-[pulse_2s_ease-in-out_infinite]"
              />
            </svg>
          </div>

          {/* Pulse Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-white/5">
            <div>
              <span className="text-[10px] text-slate-400 block">Weekly Pace</span>
              <span className="text-slate-200 font-bold">9.5h / 12h</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Tokens</span>
              <span className="text-amber-300 font-bold">4,250 KT</span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-white/5">
            <span className="text-[10px] text-slate-400 block font-mono">Current Mission:</span>
            <p className="text-[11px] text-slate-200 font-medium truncate mt-0.5">
              Complete System Design Module 4
            </p>
          </div>
        </div>
      )}

      {/* LEARNING STREAK CARD */}
      {role === 'student' && (
        <div className="glass-panel rounded-2xl p-4 border border-amber-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -z-10 group-hover:bg-amber-500/20 transition-all" />
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono font-bold">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
              <span>LEARNING STREAK</span>
            </div>
            <span className="text-xs font-mono font-extrabold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              14 DAYS
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Keep the momentum going. Progress toward <span className="text-amber-300 font-mono font-bold">+50 Knowledge Tokens</span>.
          </p>

          <NavLink
            to="/goals"
            onClick={() => sounds.playClick()}
            className="w-full block py-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-500/40 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-500/30 transition-all text-center group-hover:shadow-glow-purple"
          >
            View My Progress →
          </NavLink>
        </div>
      )}

      {/* Quick Stats Pill */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div>
          <span className="block text-slate-200 font-bold">{currentUser.enrolledCoursesCount}</span>
          <span className="text-[10px]">Enrolled</span>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <span className="block text-slate-200 font-bold">{currentUser.activeRoadmapsCount}</span>
          <span className="text-[10px]">Roadmaps</span>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div>
          <span className="block text-amber-300 font-bold">{currentUser.knowledgeTokens.toLocaleString()}</span>
          <span className="text-[10px]">Tokens</span>
        </div>
      </div>
    </aside>
  );
};
