import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import { Settings, Volume2, VolumeX, Radio, Zap, Shield, Sparkles, Moon } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    isMuted,
    toggleMute,
    isAmbientPlaying,
    toggleAmbient,
    role,
    setRole,
    currentUser
  } = useApp();

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full max-w-3xl space-y-6">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-2 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-black">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-300">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Application Settings</h1>
          <p className="text-xs text-slate-400">Configure your cyber-luxury audio experience, workspace modes, and notifications.</p>
        </div>

        {/* Audio Experience Settings */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-cyan-400" />
            <span>Procedural Audio & Atmosphere</span>
          </h3>

          <div className="space-y-4">
            {/* Tactile Sound FX Toggle */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Tactile Feedback Sounds</h4>
                <p className="text-xs text-slate-400 mt-0.5">Synthesized mechanical clicks, like pops, and triumph fanfares.</p>
              </div>
              <button
                onClick={toggleMute}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  !isMuted
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}
              >
                {!isMuted ? 'ENABLED' : 'MUTED'}
              </button>
            </div>

            {/* Ambient Space Drone */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Futuristic Space Drone Atmosphere</h4>
                <p className="text-xs text-slate-400 mt-0.5">Subtle harmonic low-frequency synthesizer for focus and immersion.</p>
              </div>
              <button
                onClick={toggleAmbient}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  isAmbientPlaying
                    ? 'bg-cyan-500 text-black shadow-glow-cyan'
                    : 'bg-white/5 text-slate-400 border border-white/10'
                }`}
              >
                {isAmbientPlaying ? 'ACTIVE' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Workspace Mode */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>Default Workspace Mode</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setRole('student')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                role === 'student'
                  ? 'bg-purple-600/20 border-purple-500 text-white shadow-glow-purple'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <h4 className="text-sm font-bold text-white mb-1">🎓 Learner Mode</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Feed, Course Vault, 3D Roadmaps, Goal Tracking, and personalized study cosmos.
              </p>
            </button>

            <button
              onClick={() => setRole('creator')}
              className={`p-5 rounded-2xl border text-left transition-all ${
                role === 'creator'
                  ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-glow-cyan'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <h4 className="text-sm font-bold text-white mb-1">⚡ Creator Mode</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Publishing Studio, Creator Analytics, Content Manager, and token royalty metrics.
              </p>
            </button>
          </div>
        </div>

        {/* Identity & Security */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Account Identity</span>
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono pt-1">
            <span>Signed in as: <strong className="text-white">{currentUser.name}</strong> ({currentUser.handle})</span>
            <span className="text-cyan-400">Verified Scholar</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
