import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { HolographicCard3D } from '../components/3d/HolographicCard3D';
import { sounds } from '../services/soundManager';
import {
  BookOpen,
  Star,
  Users,
  Clock,
  Award,
  CheckCircle2,
  Play,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses, enrollInCourse } = useApp();

  const [expandedModuleId, setExpandedModuleId] = useState<string | null>('mod_1');

  const course = courses.find(c => c.id === courseId) || courses[0];

  if (!course) {
    return (
      <MainLayout showRightRail={false}>
        <div className="text-center py-24 glass-panel rounded-3xl border border-white/10 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">Course not found</h3>
          <p className="text-xs text-slate-400">This course doesn't exist or hasn't been loaded yet.</p>
          <Link to="/courses" className="inline-block mt-4 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-500">← Back to Courses</Link>
        </div>
      </MainLayout>
    );
  }

  const handleEnrollOrResume = () => {
    if (!course.isEnrolled) {
      enrollInCourse(course.id);
    }
    // Navigate to first lecture
    navigate(`/lecture/lec_1`);
  };

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-10">
        {/* Course Hero Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-purple-950/50 via-slate-900/60 to-black">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                  {course.category}
                </span>
                <span className="text-xs font-mono text-purple-300">
                  {course.level} Masterclass
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {course.title}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {course.subtitle}
              </p>

              {/* Creator Pill */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  to={`/creator/${course.creator.username}`}
                  onClick={() => sounds.playClick()}
                  className="flex items-center gap-2.5 group"
                >
                  <img src={course.creator.avatar} alt={course.creator.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-400" />
                  <div>
                    <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors block">
                      {course.creator.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{course.creator.role}</span>
                  </div>
                </Link>
              </div>

              {/* Metadata Stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" /> {course.rating} ({course.reviewsCount.toLocaleString()} reviews)
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {course.studentsCount.toLocaleString()} enrolled
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {course.estimatedHours} Total Hours
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleEnrollOrResume}
                  className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black rounded-2xl text-sm shadow-glow-purple transition-all flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{course.isEnrolled ? `Resume Learning (${course.progressPercent}%)` : 'Enroll in Course'}</span>
                </button>
              </div>
            </div>

            {/* Right: Course Preview Card */}
            <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-[4/3] bg-slate-900 border border-white/10 shadow-2xl">
              <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={handleEnrollOrResume}
                  className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-glow-purple hover:scale-110 transition-transform"
                >
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Syllabus & What You'll Learn Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Syllabus & Learning Objectives */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>What You Will Learn</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.whatYouWillLearn.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                    <span className="text-cyan-400 font-mono mt-0.5">✦</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Modules Accordion */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  <span>Course Curriculum</span>
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  {course.modules.length} Modules · {course.modules.reduce((acc, m) => acc + m.lectures.length, 0)} Lectures
                </span>
              </div>

              <div className="space-y-3">
                {course.modules.map(module => {
                  const isExpanded = expandedModuleId === module.id;
                  return (
                    <div key={module.id} className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          setExpandedModuleId(isExpanded ? null : module.id);
                        }}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-white">{module.title}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{module.description}</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-0 border-t border-white/5 space-y-2 mt-2">
                          {module.lectures.map((lec, idx) => (
                            <Link
                              key={lec.id}
                              to={`/lecture/${lec.id}`}
                              onClick={() => sounds.playClick()}
                              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-between transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                  {idx + 1}
                                </span>
                                <div>
                                  <span className="text-xs font-medium text-slate-200 group-hover:text-purple-300">
                                    {lec.title}
                                  </span>
                                  {lec.isFreePreview && (
                                    <span className="ml-2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300">
                                      Free Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs font-mono text-slate-400">{lec.duration}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Prerequisites & Requirements
              </h3>
              <ul className="space-y-1.5 list-disc pl-5 text-xs text-slate-300">
                {course.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Holographic Certificate & Instructor */}
          <div className="space-y-6">
            {/* 3D Holographic Certificate Card */}
            {course.certificateAvailable && (
              <HolographicCard3D glowColor="purple" className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-300 font-mono text-xs">
                    <Award className="w-4 h-4" />
                    <span>Official Credential</span>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    {course.certificateDetails?.title || 'Verified Master Certification'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Issued upon completion of all modules and final architecture evaluation.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Issuer:</span>
                    <span>InfoNest Academy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verification:</span>
                    <span className="text-cyan-300">On-Chain Hash</span>
                  </div>
                </div>

                <p className="text-[10px] font-mono text-slate-500 text-center">
                  Holographic 3D Certificate · Move cursor to tilt
                </p>
              </HolographicCard3D>
            )}

            {/* Student Reviews Preview */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center justify-between">
                <span>Student Feedback</span>
                <span className="text-amber-400 text-xs font-mono">★ {course.rating}</span>
              </h3>

              <div className="space-y-3">
                {course.reviews.map(rev => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs font-bold text-slate-200">{rev.userName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
