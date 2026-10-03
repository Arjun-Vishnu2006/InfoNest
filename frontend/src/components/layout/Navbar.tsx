import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Volume2,
  VolumeX,
  Radio,
  PlusCircle,
  Zap,
  GraduationCap,
  Bell,
  SlidersHorizontal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const {
    role,
    setRole,
    currentUser,
    isMuted,
    toggleMute,
    isAmbientPlaying,
    toggleAmbient,
    unreadNotificationsCount
  } = useApp();

  const [localSearch, setLocalSearch] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    const term = localSearch.trim();
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : '/search');
  };

  const handleRoleToggle = (newRole: 'student' | 'creator') => {
    setRole(newRole);
    if (newRole === 'creator') {
      navigate('/creator/dashboard');
    } else {
      navigate('/feed');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-white/10 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-20 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link
          to="/feed"
          onClick={() => sounds.playClick()}
          className="flex items-center gap-3 group select-none shrink-0"
        >
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-glow-purple group-hover:scale-105 transition-transform duration-300 overflow-hidden">
            <img src="/infonest-logo.png" alt="InfoNest" className="w-full h-full object-cover rounded-[15px]" />
            <div className="absolute -inset-1 bg-purple-500/20 rounded-2xl blur-sm -z-10 group-hover:bg-purple-500/40 transition-colors" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
              Info<span className="text-gradient-purple">Nest</span>
              <span className="text-[10px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 ml-1">
                Cosmos
              </span>
            </span>
            <p className="text-[11px] font-mono text-slate-400 -mt-0.5 hidden sm:block">
              Learn Together. Share Freely. Grow Further.
            </p>
          </div>
        </Link>

        {/* Global Search */}
        <form onSubmit={handleSearchSubmit} className="flex-none w-[clamp(210px,24vw,280px)] hidden lg:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-400 transition-colors" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search knowledge, creators, courses, roadmaps..."
              className="w-full pl-10 pr-12 py-2.5 bg-white/5 border border-white/10 rounded-full text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.08] focus:ring-2 focus:ring-purple-500/20 transition-all shadow-inner"
            />
            <button type="submit" aria-label="Search" title="Search" className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full text-slate-300 hover:text-white hover:bg-purple-500/20 transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right HUD Controls */}
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate('/search')} aria-label="Open search" title="Search" className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
          {/* Knowledge Space Indicator */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cosmos Online</span>
          </div>
          {/* Ambient Cosmic Sound Visualizer */}
          <button
            onClick={() => {
              sounds.playClick();
              toggleAmbient();
            }}
            title={isAmbientPlaying ? 'Mute Space Drone' : 'Play Ambient Space Drone'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${
              isAmbientPlaying
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-glow-cyan'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isAmbientPlaying ? 'animate-pulse text-cyan-400' : ''}`} />
            <span className="hidden lg:inline">Space Drone</span>
            {isAmbientPlaying && (
              <span className="flex items-end gap-[2px] h-3">
                <span className="w-[2px] h-2 bg-cyan-400 animate-[pulse_0.6s_ease-in-out_infinite]" />
                <span className="w-[2px] h-3 bg-cyan-400 animate-[pulse_0.9s_ease-in-out_infinite_0.2s]" />
                <span className="w-[2px] h-1.5 bg-cyan-400 animate-[pulse_0.7s_ease-in-out_infinite_0.4s]" />
              </span>
            )}
          </button>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={() => {
              toggleMute();
              if (isMuted) sounds.playClick();
            }}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
          </button>

          {/* Role Switcher (Learner ↔ Creator) */}
          <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10">
            <button
              onClick={() => handleRoleToggle('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                role === 'student'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Learner</span>
            </button>
            <button
              onClick={() => handleRoleToggle('creator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                role === 'creator'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Creator</span>
            </button>
          </div>

          {/* Create Shortcut for Creators */}
          {role === 'creator' && (
            <Link
              to="/create/post"
              onClick={() => sounds.playClick()}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-xl text-xs font-semibold hover:opacity-90 shadow-glow-cyan transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Drop</span>
            </Link>
          )}

          {/* Knowledge Tokens Pill */}
          <Link
            to="/goals"
            onClick={() => sounds.playClick()}
            title="Knowledge Tokens earned from learning. View personal goals."
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono hover:bg-amber-500/20 transition-colors"
          >
            <span className="text-sm">💎</span>
            <span className="font-bold">{currentUser.knowledgeTokens.toLocaleString()}</span>
            <span className="text-[10px] text-amber-400/70">KT</span>
          </Link>

          {/* Notifications Bell */}
          <Link
            to="/notifications"
            onClick={() => sounds.playClick()}
            title="Notifications"
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white flex items-center justify-center ring-2 ring-[#08090E]">
                {unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* User Profile + Login/Logout Menu */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => { sounds.playClick(); setProfileOpen((v) => !v); }}
              title="Account menu"
              className="relative group flex items-center gap-2 rounded-xl p-1 hover:bg-white/5 transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-500/40 group-hover:ring-purple-400 transition-all"
              />
              <span className="absolute bottom-0 left-7 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#08090E]" />
              <span className="hidden lg:block text-xs text-slate-300">{currentUser.name}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-12 w-56 rounded-2xl border border-white/10 bg-[#0c1020]/95 backdrop-blur-xl shadow-2xl p-2 z-50">
                <Link
                  to="/profile"
                  onClick={() => { sounds.playClick(); setProfileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-white/10"
                >
                  <span>👤</span><span>My Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => { sounds.playClick(); setProfileOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-200 hover:bg-white/10"
                >
                  <span>⚙️</span><span>Settings</span>
                </Link>
                <div className="my-1 border-t border-white/10" />
                <button
                  type="button"
                  onClick={async () => {
                    sounds.playClick();
                    setProfileOpen(false);
                    await logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-300 hover:bg-rose-500/10 text-left"
                >
                  <span>↪</span><span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
