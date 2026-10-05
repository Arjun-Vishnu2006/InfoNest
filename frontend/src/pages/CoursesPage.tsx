import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { BookOpen, Star, Users, Clock, Award, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { sounds } from '../services/soundManager';

export const CoursesPage: React.FC = () => {
  const { courses, enrollInCourse } = useApp();
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', 'Programming', 'Web Development', 'Cybersecurity', 'Cloud Computing', 'Data Science', 'Artificial Intelligence', 'Databases', 'DevOps', 'Networking', 'Software Engineering'];

  const filteredCourses = courses.filter(c => (selectedCat === 'All' || c.category === selectedCat) && `${c.title} ${c.subtitle} ${c.creator.name}`.toLowerCase().includes(search.toLowerCase()));

  const enrolledCourses = courses.filter(c => c.isEnrolled);
  const featuredCourse = courses[0];

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-10">
        {/* Course Vault Hero Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Coursera-Grade Architecture Curricula</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Course Vault
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Structured knowledge for serious engineers. Master complex systems, agentic AI, and distributed architectures with verified certificates.
            </p>
          </div>
        </div>

        {/* Continue Learning Section (If enrolled) */}
        {enrolledCourses.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Continue Learning</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledCourses.map(course => (
                <div
                  key={course.id}
                  className="glass-panel rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/10 flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img src={course.coverImage} alt={course.title} className="w-20 h-16 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{course.title}</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Progress: {course.progressPercent}%</p>
                      <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${course.progressPercent}%` }} />
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/lecture/lec_1`}
                    onClick={() => sounds.playClick()}
                    className="px-4 py-2 bg-emerald-500 text-black font-bold text-xs rounded-xl hover:bg-emerald-400 transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <span>Resume</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses or instructors…" aria-label="Search courses" className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white outline-none focus:border-purple-400/50" />
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                sounds.playClick();
                setSelectedCat(cat);
              }}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all border ${
                selectedCat === cat
                  ? 'bg-purple-600 border-purple-500 text-white shadow-glow-purple'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masterclass Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="glass-panel rounded-3xl border border-white/10 p-10 text-center">
            <BookOpen className="w-10 h-10 text-purple-300 mx-auto" />
            <h2 className="mt-4 text-lg font-bold text-white">Course Vault is empty</h2>
            <p className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">No sample courses are loaded. Add real learning content from the Creator workspace when you are ready.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all hover:-translate-y-1 duration-300"
            >
              <div>
                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                  <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur text-[10px] font-mono text-cyan-300">
                    {course.level}
                  </span>
                  {course.certificateAvailable && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-purple-500/30 backdrop-blur border border-purple-400/40 text-[10px] font-mono text-purple-200 flex items-center gap-1">
                      <Award className="w-3 h-3" /> Certificate
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <img src={course.creator.avatar} alt={course.creator.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs text-slate-300 font-medium">{course.creator.name}</span>
                  </div>

                  <Link
                    to={`/course/${course.id}`}
                    onClick={() => sounds.playClick()}
                    className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1 block"
                  >
                    {course.title}
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{course.subtitle}</p>

                  <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-slate-400 border-t border-white/5">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" /> {course.rating}
                    </span>
                    <span>·</span>
                    <span>{course.studentsCount.toLocaleString()} students</span>
                    <span>·</span>
                    <span>{course.estimatedHours}h</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/course/${course.id}`}
                  onClick={() => sounds.playClick()}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-glow-purple transition-all"
                >
                  <span>{course.isEnrolled ? 'Resume Syllabus' : 'View Course Syllabus'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
