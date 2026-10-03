import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { Users, Star, UserPlus, UserCheck, Sparkles, BookOpen, Layers } from 'lucide-react';
import { sounds } from '../services/soundManager';

export const CreatorsPage: React.FC = () => {
  const { creators, toggleFollowCreator } = useApp();
  const [filterSpecialty, setFilterSpecialty] = useState('All');

  const specialties = ['All', 'Reasoning Models', 'High-Throughput', '3D Web', 'ZK-SNARKs', 'React 19'];

  const filteredCreators = filterSpecialty === 'All'
    ? creators
    : creators.filter(c => c.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()) || c.expertiseTags.some(t => t.toLowerCase().includes(filterSpecialty.toLowerCase())));

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-2 bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-black">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
            <Users className="w-3.5 h-3.5" />
            <span>Frontier Creators & Researchers</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Discover Verified Educators
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Follow research scientists, principal architects, and creative technologists sharing deep technical insights, masterclasses, and roadmaps.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => {
                sounds.playClick();
                setFilterSpecialty(spec);
              }}
              className={`px-4 py-2 rounded-xl border transition-all ${
                filterSpecialty === spec
                  ? 'bg-purple-600 border-purple-500 text-white shadow-glow-purple'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Creators Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl border border-white/10">
            <div className="text-4xl mb-4">👩‍🏫</div>
            <h3 className="text-lg font-bold text-white mb-2">No creators available yet</h3>
            <p className="text-sm text-slate-400">Be the first creator to share knowledge on InfoNest!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map(creator => (
              <div
                key={creator.id}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all duration-300"
              >
                <div>
                  {/* Cover Image */}
                  <div className="h-28 w-full bg-slate-900 relative overflow-hidden">
                    <img src={creator.coverImage} alt={creator.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F121C] via-black/40 to-transparent" />
                    <span className="absolute top-3 right-3 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-cyan-300">
                      Score: {creator.knowledgeScore}
                    </span>
                  </div>

                  {/* Avatar & Bio */}
                  <div className="p-5 pt-0 relative space-y-3">
                    <div className="-mt-10 flex items-end justify-between mb-2">
                      <Link
                        to={`/creator/${creator.username}`}
                        onClick={() => sounds.playClick()}
                        className="relative block"
                      >
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-[#0F121C] shadow-xl group-hover:ring-purple-500/50 transition-all"
                        />
                        {creator.verified && (
                          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-xs text-black font-bold ring-2 ring-[#0F121C]">
                            ✓
                          </span>
                        )}
                      </Link>

                      <button
                        onClick={() => toggleFollowCreator(creator.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          creator.isFollowed
                            ? 'bg-white/5 text-slate-300 border border-white/10 hover:border-rose-500/30 hover:text-rose-400'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple hover:scale-105'
                        }`}
                      >
                        {creator.isFollowed ? 'Following' : '+ Follow'}
                      </button>
                    </div>

                    <div>
                      <Link
                        to={`/creator/${creator.username}`}
                        onClick={() => sounds.playClick()}
                        className="text-base font-bold text-white hover:text-purple-300 transition-colors"
                      >
                        {creator.name}
                      </Link>
                      <p className="text-xs text-slate-400 font-mono">{creator.handle}</p>
                      <p className="text-xs text-purple-300/90 font-mono mt-0.5">{creator.role}</p>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {creator.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {creator.expertiseTags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats Footer */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{creator.followersCount.toLocaleString()} followers</span>
                  <span>{creator.studentCount.toLocaleString()} students</span>
                  <Link
                    to={`/creator/${creator.username}`}
                    onClick={() => sounds.playClick()}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    View Cosmos →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
