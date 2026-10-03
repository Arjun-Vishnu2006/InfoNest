import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { FeedCard } from '../components/feed/FeedCard';
import { HolographicCard3D } from '../components/3d/HolographicCard3D';
import { sounds } from '../services/soundManager';
import {
  Users,
  Star,
  Award,
  BookOpen,
  Layers,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Activity,
  Zap,
  Compass,
  Flame,
  ShieldCheck,
  Radio
} from 'lucide-react';

export const CreatorProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { creators, posts, courses, roadmaps, toggleFollowCreator, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'posts' | 'courses' | 'roadmaps' | 'resources'>('posts');

  const creator = creators.find(c => c.username === username) || creators[0];

  const creatorPosts = posts.filter(p => p.creator.id === creator.id || p.creator.username === creator.username);
  const creatorCourses = courses.filter(c => c.creator.id === creator.id || c.creator.username === creator.username);
  const creatorRoadmaps = roadmaps; // Filtered or related

  const handleShare = () => {
    sounds.playClick();
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Link to ${creator.name}'s profile copied!`);
  };

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-8">
        {/* Profile Header Banner */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 relative">
          {/* Cover Photo */}
          <div className="h-48 sm:h-64 w-full bg-slate-900 relative overflow-hidden">
            <img src={creator.coverImage} alt={creator.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090B12] via-black/40 to-transparent" />
          </div>

          {/* Profile Details Bar */}
          <div className="px-6 sm:px-10 pb-8 relative -mt-16 sm:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="relative shrink-0">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-[#090B12] shadow-2xl"
                />
                {creator.verified && (
                  <span className="absolute bottom-1 right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs text-black font-bold ring-2 ring-[#090B12]">
                    ✓
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{creator.name}</h1>
                  <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    {creator.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">{creator.handle}</p>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed pt-1">{creator.bio}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleFollowCreator(creator.id)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  creator.isFollowed
                    ? 'bg-white/5 text-slate-300 border border-white/10 hover:border-rose-500/30 hover:text-rose-400'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-glow-purple hover:scale-105'
                }`}
              >
                {creator.isFollowed ? 'Following' : '+ Follow Educator'}
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                title="Share profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="px-6 sm:px-10 py-4 bg-white/[0.02] border-t border-white/5 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-400">
            <div>
              <span className="block text-slate-100 text-sm font-bold">{creator.followersCount.toLocaleString()}</span>
              <span>Followers</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="block text-slate-100 text-sm font-bold">{creator.studentCount.toLocaleString()}</span>
              <span>Active Students</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="block text-slate-100 text-sm font-bold">{creator.totalLectures}</span>
              <span>Lectures</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="block text-amber-400 text-sm font-bold">★ {creator.rating}</span>
              <span>Rating</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="block text-cyan-400 text-sm font-bold">{creator.knowledgeScore}</span>
              <span>Knowledge Score</span>
            </div>
          </div>
        </div>

        {/* Creator Pulse & Live Orbit Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Creator Pulse Metrics */}
          <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-950/20 via-slate-900/40 to-slate-950 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Creator Pulse</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Last 30 Days
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">+24.8% velocity</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">Learners Joined</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">+2,410</span>
                <span className="text-[10px] text-emerald-400 font-mono">↑ 18%</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">Lecture Streams</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">14.2K</span>
                <span className="text-[10px] text-purple-400 font-mono">↑ 32%</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">Retention Rate</span>
                <span className="text-sm font-bold text-cyan-300 font-mono mt-0.5 block">98.4%</span>
                <span className="text-[10px] text-slate-400 font-mono">Top 2%</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-[10px] font-mono text-slate-400 block">Verified Answers</span>
                <span className="text-sm font-bold text-amber-300 font-mono mt-0.5 block">412</span>
                <span className="text-[10px] text-amber-400 font-mono">100% Validated</span>
              </div>
            </div>

            {/* Specialties Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
              <span className="text-[10px] font-mono text-slate-400">Frontier Badges:</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-200">
                ⚡ Systems Architect
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-200">
                🧠 PRM Reasoning
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-200">
                🛡️ Verified Scholar
              </span>
            </div>
          </div>

          {/* Live Orbit Room Card */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-slate-900/40 to-slate-950 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold animate-pulse">
                  <Radio className="w-3 h-3 text-rose-400" />
                  ORBIT ROOM ACTIVE
                </span>
                <span className="text-xs font-mono text-slate-400">28 listeners</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                Deep Dive: Reasoning Trees & Real-time Verifiers
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2">
                Join live audio session with {creator.name} to discuss architectural challenges.
              </p>
            </div>

            <Link
              to="/orbit-rooms"
              onClick={() => sounds.playClick()}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-mono flex items-center justify-center gap-2 transition-all shadow-glow-cyan"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Tune In to Orbit Room</span>
            </Link>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-white/10 text-xs font-mono">
          {[
            { id: 'posts', label: `Posts & Drops (${creatorPosts.length})` },
            { id: 'courses', label: `Masterclasses (${creatorCourses.length})` },
            { id: 'roadmaps', label: `Roadmaps (${creatorRoadmaps.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-6 py-3.5 border-b-2 font-medium transition-all ${
                activeTab === tab.id
                  ? 'border-purple-400 text-purple-300 font-bold bg-purple-500/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Views */}
        {activeTab === 'posts' && (
          <div className="space-y-6 max-w-3xl">
            {creatorPosts.length === 0 ? (
              <div className="text-center py-16 text-slate-400 text-xs font-mono">
                No drops published by this creator yet.
              </div>
            ) : (
              creatorPosts.map(post => (
                <FeedCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creatorCourses.map(course => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                onClick={() => sounds.playClick()}
                className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all"
              >
                <div>
                  <div className="aspect-video w-full bg-slate-900 overflow-hidden relative">
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur text-cyan-300">
                      {course.level}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {course.subtitle}
                    </p>
                  </div>
                </div>
                <div className="p-5 pt-0 flex justify-between text-xs font-mono text-slate-400 border-t border-white/5 mt-2">
                  <span className="text-amber-400">★ {course.rating}</span>
                  <span>{course.studentsCount.toLocaleString()} learners</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'roadmaps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {creatorRoadmaps.map(rm => (
              <div key={rm.id} className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">{rm.category}</span>
                  <h3 className="text-base font-bold text-white mt-2">{rm.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{rm.description}</p>
                </div>
                <Link
                  to={`/roadmap/${rm.id}`}
                  onClick={() => sounds.playClick()}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow-cyan"
                >
                  <span>Launch 3D Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
