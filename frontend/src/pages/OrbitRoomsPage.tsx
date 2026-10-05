import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import { Radio, Users, Sparkles, MessageSquare, ArrowRight, ShieldCheck, Flame, X } from 'lucide-react';

export const OrbitRoomsPage: React.FC = () => {
  const { orbitRooms, joinOrbitRoom } = useApp();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const activeRoom = orbitRooms.find(r => r.id === selectedRoomId) || orbitRooms[0];

  return (
    <MainLayout showRightRail={true}>
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold uppercase tracking-wider">
                Focused Communities
              </span>
              <span className="text-xs font-mono text-slate-400">· Not normal chat rooms — topic hubs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2 font-sans">
              <Radio className="w-7 h-7 text-cyan-400" />
              <span>Orbit Rooms</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Domain-specific learning communities where students and creators collaborate around frontier subjects.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-panel border border-white/10 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">1,716 Engineers Active in Orbit</span>
          </div>
        </div>

        {/* Orbit Rooms Grid */}
        {orbitRooms.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 border border-white/10 text-center">
            <Radio className="w-10 h-10 text-cyan-400 mx-auto" />
            <h3 className="mt-4 text-lg font-bold text-white">No Orbit Rooms</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">There are no active orbit rooms at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orbitRooms.map((room) => (
            <div
              key={room.id}
              className={`glass-panel rounded-3xl p-5 border transition-all space-y-4 relative overflow-hidden group ${
                selectedRoomId === room.id
                  ? 'border-cyan-500/50 shadow-glow-cyan bg-white/[0.04]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                    {room.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-sans group-hover:text-cyan-300 transition-colors">
                      {room.name}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      {room.tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>{room.activeNow} live</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {room.description}
              </p>

              {/* Topics Pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                  Core Specializations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {room.topTopics.map((topic) => (
                    <span
                      key={topic}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 border border-white/5"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Drop */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Pinned Discussion Drop</span>
                </span>
                <p className="text-xs font-semibold text-slate-200 truncate">
                  "{room.recentDropTitle}"
                </p>
              </div>

              {/* Enter Room Action */}
              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <span className="text-[11px] font-mono text-slate-400">
                  {room.membersCount.toLocaleString()} Members
                </span>

                <button
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    joinOrbitRoom(room.id);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-glow-cyan transition-all flex items-center gap-1.5"
                >
                  <span>Enter Orbit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
      {activeRoom && selectedRoomId && <div role="dialog" aria-modal="true" aria-label={activeRoom.name} className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="w-full max-w-3xl glass-panel rounded-3xl border border-cyan-400/30 overflow-hidden shadow-2xl">
          <header className="p-5 border-b border-white/10 flex justify-between items-center"><div><p className="text-xs uppercase tracking-widest text-cyan-300">{activeRoom.activeNow ? '● LIVE · Presentation session' : activeRoom.tag}</p><h2 className="text-xl font-bold text-white mt-1">{activeRoom.name}</h2></div><button onClick={()=>setSelectedRoomId(null)} aria-label="Close session" className="p-2 rounded-xl bg-white/5"><X className="w-5 h-5"/></button></header>
          <div className="aspect-video bg-gradient-to-br from-slate-900 via-indigo-950 to-cyan-950 flex flex-col items-center justify-center text-center p-8"><Radio className="w-12 h-12 text-cyan-300 mb-3 animate-pulse"/><p className="text-white text-lg font-semibold">{activeRoom.activeNow ? 'Live learning session is in progress' : 'You are registered for this session'}</p><p className="text-sm text-slate-300 mt-2 max-w-lg">{activeRoom.description} This presentation-safe session is simulated and does not require a stream host.</p><p className="text-xs text-cyan-200 mt-5">{activeRoom.activeNow.toLocaleString()} learners watching</p></div>
          <div className="p-4 flex items-center justify-between text-xs text-slate-400"><span>Session chat · Welcome! Share a question with the group.</span><button onClick={()=>setSelectedRoomId(null)} className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-semibold">Leave session</button></div>
        </div>
      </div>}
    </MainLayout>
  );
};
