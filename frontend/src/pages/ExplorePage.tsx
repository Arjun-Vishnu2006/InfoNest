import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { KnowledgeCore3D } from '../components/3d/KnowledgeCore3D';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import {
  Compass,
  Sparkles,
  TrendingUp,
  Layers,
  BookOpen,
  ArrowRight,
  Star,
  Users,
  Clock,
  Play
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { courses, roadmaps, creators, posts } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: '🌌' },
    { name: 'Artificial Intelligence', icon: '🧠' },
    { name: 'Distributed Systems', icon: '⚡' },
    { name: 'UI/UX & 3D Spatial', icon: '✨' },
    { name: 'Cybersecurity', icon: '🛡️' },
    { name: 'Cloud & DevOps', icon: '☁️' },
    { name: 'Machine Learning', icon: '🔮' },
    { name: 'Programming', icon: '💻' }
  ];

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-10">
        {/* 1. Hero with 3D Knowledge Core */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-purple-950/60 via-slate-900/70 to-black flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Knowledge Core</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Explore The Knowledge Cosmos
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Navigate frontier masterclasses, verified architecture blueprints, and interactive roadmaps crafted by senior engineers and research fellows worldwide.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/roadmaps"
                onClick={() => sounds.playClick()}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl text-xs shadow-glow-cyan flex items-center gap-2 hover:opacity-95 transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>Launch 3D Roadmaps</span>
              </Link>
              <Link
                to="/courses"
                onClick={() => sounds.playClick()}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl text-xs border border-white/15 flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Browse Course Vault</span>
              </Link>
            </div>
          </div>

          {/* 3D Knowledge Core Orb */}
          <div className="w-64 h-64 sm:w-80 sm:h-80 shrink-0 relative flex items-center justify-center">
            <KnowledgeCore3D className="w-full h-full" />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-cyan-300/80 pointer-events-none bg-black/60 px-3 py-0.5 rounded-full border border-white/10 whitespace-nowrap">
              Hover & Drag to spin Knowledge Core
            </span>
          </div>
        </div>

        {/* 2. Category Filter Strip */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Compass className="w-4 h-4 text-purple-400" />
              <span>Explore Knowledge Domains</span>
            </h2>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => {
                  sounds.playClick();
                  setSelectedCategory(cat.name);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-mono whitespace-nowrap flex items-center gap-2 border transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-500/50 shadow-glow-purple'
                    : 'bg-white/5 text-slate-400 hover:text-white border-white/5 hover:border-white/20'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Personalized Recommendation: "Because you explored Machine Learning" */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 bg-gradient-to-r from-indigo-950/30 to-purple-950/20">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Personalized Recommendation
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Because you explored Machine Learning
              </h3>
            </div>
            <Link
              to="/courses"
              onClick={() => sounds.playClick()}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.length === 0 ? (
              <div className="col-span-2 text-center py-8 rounded-2xl border border-white/5 bg-white/5">
                <span className="text-xs text-slate-400">No courses available</span>
              </div>
            ) : (
              courses.slice(0, 2).map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  onClick={() => sounds.playClick()}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex gap-4 group transition-all"
                >
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-28 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-300">{course.level}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                        {course.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" /> {course.rating}
                      </span>
                      <span>·</span>
                      <span>{course.estimatedHours}h</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 4. Popular Masterclass Courses Carousel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Popular Masterclass Curricula</span>
            </h2>
            <Link
              to="/courses"
              onClick={() => sounds.playClick()}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Course Vault →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 rounded-2xl border border-white/5 bg-white/5">
                <span className="text-xs text-slate-400">No masterclasses available</span>
              </div>
            ) : (
              courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.id}`}
                  onClick={() => sounds.playClick()}
                  className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                      <img
                        src={course.coverImage}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-[10px] font-mono text-cyan-300">
                        {course.level}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={course.creator.avatar}
                          alt={course.creator.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs text-slate-400 font-medium truncate">
                          {course.creator.name}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {course.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-white/5 mt-2">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating}
                    </span>
                    <span>{course.studentsCount.toLocaleString()} learners</span>
                    <span className="text-purple-400 group-hover:translate-x-1 transition-transform">
                      Learn →
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* 5. Trending Interactive Roadmaps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Interactive Learning Roadmaps</span>
            </h2>
            <Link
              to="/roadmaps"
              onClick={() => sounds.playClick()}
              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Explore All Roadmaps →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.length === 0 ? (
              <div className="col-span-2 text-center py-8 rounded-2xl border border-white/5 bg-white/5">
                <span className="text-xs text-slate-400">No roadmaps available</span>
              </div>
            ) : (
              roadmaps.map((rm) => (
                <div
                  key={rm.id}
                  className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-4 group hover:border-cyan-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                        {rm.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        ⏱ {rm.estimatedWeeks} Weeks · {rm.totalMilestones} Phases
                      </span>
                    </div>
                    <Link
                      to={`/roadmap/${rm.id}`}
                      onClick={() => sounds.playClick()}
                      className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors block"
                    >
                      {rm.title}
                    </Link>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {rm.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-xs font-mono text-slate-400">
                      ⭐ {rm.clonesCount.toLocaleString()} cloned
                    </span>
                    <Link
                      to={`/roadmap/${rm.id}`}
                      onClick={() => sounds.playClick()}
                      className="px-4 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/30 transition-all flex items-center gap-1"
                    >
                      <span>View 3D Nodes</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 6. Frontier Creators Directory Strip */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span>Frontier Educators to Follow</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Top-rated research scientists, system architects, and creative technologists.</p>
            </div>
            <Link
              to="/creators"
              onClick={() => sounds.playClick()}
              className="text-xs font-mono text-purple-400 hover:text-purple-300"
            >
              All Creators →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creators.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 rounded-2xl border border-white/5 bg-white/5">
                <span className="text-xs text-slate-400">No creators found</span>
              </div>
            ) : (
              creators.slice(0, 3).map((creator) => (
                <div
                  key={creator.id}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between gap-3 group hover:border-purple-500/30 transition-all"
                >
                  <Link
                    to={`/creator/${creator.username}`}
                    onClick={() => sounds.playClick()}
                    className="flex items-center gap-3 min-w-0"
                  >
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full object-cover ring-1 ring-white/10 group-hover:ring-purple-400 transition-all shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                        {creator.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 truncate block">
                        {creator.specialty}
                      </span>
                      <span className="text-[10px] font-mono text-purple-400">
                        Score: {creator.knowledgeScore}
                      </span>
                    </div>
                  </Link>

                  <Link
                    to={`/creator/${creator.username}`}
                    onClick={() => sounds.playClick()}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-xl border border-white/10 shrink-0"
                  >
                    Profile
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
