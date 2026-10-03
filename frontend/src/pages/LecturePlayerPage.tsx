import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  Maximize,
  CheckCircle,
  FileText,
  Download,
  Github,
  Award,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Eye,
  EyeOff,
  Clock,
  Target,
  PenTool,
  VolumeX
} from 'lucide-react';

export const LecturePlayerPage: React.FC = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const navigate = useNavigate();
  const { courses, markLectureComplete } = useApp();

  const [activeTab, setActiveTab] = useState<'notes' | 'resources' | 'quiz' | 'discussion'>('notes');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [studySeconds, setStudySeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [focusNote, setFocusNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  React.useEffect(() => {
    let interval: any;
    if (timerRunning) {
      interval = setInterval(() => {
        setStudySeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Find course and lecture
  const course = courses.find(c => c.modules?.some(m => m.lectures?.some(l => l.id === lectureId))) || courses[0];

  if (!course || !course.modules || course.modules.length === 0) {
    return (
      <div className="min-h-screen bg-[#07080D] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-white">Lecture not found</p>
          <p className="text-sm text-slate-400">The lecture you're looking for doesn't exist or hasn't been loaded yet.</p>
          <Link to="/courses" className="inline-block mt-4 px-5 py-2 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-500">← Back to Courses</Link>
        </div>
      </div>
    );
  }

  const currentLecture =
    course.modules.flatMap(m => m.lectures).find(l => l.id === lectureId) ||
    course.modules[0].lectures[0];

  const handleComplete = () => {
    sounds.playTriumph();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    setIsCompleted(true);
    markLectureComplete(course.id, currentLecture.id);
  };

  const handleQuizSubmit = (correctIdx: number) => {
    setQuizSubmitted(true);
    if (selectedQuizAnswer === correctIdx) {
      sounds.playTriumph();
      confetti({ particleCount: 50, spread: 50 });
    } else {
      sounds.playClick();
    }
  };

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col">
      {/* Top Distraction-Free Header */}
      <header className="h-16 px-6 glass-nav border-b border-white/10 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to={`/course/${course.id}`}
            onClick={() => sounds.playClick()}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Syllabus</span>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <h1 className="text-sm font-bold text-white truncate max-w-lg">
            {course.title}: <span className="text-purple-300 font-normal">{currentLecture.title}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Focus Mode Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsFocusMode(!isFocusMode);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
              isFocusMode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            {isFocusMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isFocusMode ? 'Exit Focus (Esc)' : 'Focus Mode'}</span>
          </button>

          <button
            onClick={handleComplete}
            disabled={isCompleted}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-gradient-to-r from-purple-600 to-emerald-500 text-white shadow-glow-emerald hover:opacity-95'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>{isCompleted ? 'Completed (+100 KT)' : 'Mark Complete'}</span>
          </button>
        </div>
      </header>

      {/* Focus Protocol HUD */}
      {isFocusMode && (
        <div className="bg-[#090C16]/95 border-b border-cyan-500/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-mono font-bold tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              FOCUS PROTOCOL ACTIVE
            </span>
            <div className="hidden sm:flex items-center gap-2 text-slate-300">
              <Target className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold text-white">Objective:</span>
              <span className="text-slate-300 truncate max-w-md">Master PRM rollouts and backtrack search verification</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-1.5 font-mono text-cyan-300 bg-cyan-950/40 px-3 py-1 rounded-lg border border-cyan-500/30">
              <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{formatTime(studySeconds)}</span>
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className="text-[10px] text-slate-400 hover:text-white underline ml-1"
              >
                {timerRunning ? 'pause' : 'resume'}
              </button>
            </div>

            {/* Quick scratchpad save */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type note & hit Enter..."
                value={focusNote}
                onChange={(e) => {
                  setFocusNote(e.target.value);
                  setNoteSaved(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && focusNote.trim()) {
                    sounds.playTriumph();
                    setNoteSaved(true);
                    setFocusNote('');
                    setTimeout(() => setNoteSaved(false), 2500);
                  }
                }}
                className="w-48 sm:w-56 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {noteSaved && (
                <span className="text-[11px] font-mono text-emerald-400">✓ Saved</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Player & Sidebar Arena */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Video & Interactive Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-black">
          {/* 16:9 Video Canvas */}
          <div className="relative w-full aspect-video max-h-[62vh] bg-slate-950 flex items-center justify-center group">
            <video
              src={currentLecture.videoUrl}
              className="w-full h-full object-contain"
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {/* Instructor badge */}
            <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-black/70 backdrop-blur border border-white/10 flex items-center gap-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <img src={course.creator.avatar} alt={course.creator.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-purple-400" />
              <div>
                <span className="text-xs font-bold text-white block">{course.creator.name}</span>
                <span className="text-[11px] text-slate-400 font-mono">{course.creator.specialty}</span>
              </div>
            </div>
          </div>

          {/* Under-Player Tabs */}
          <div className="p-6 space-y-4">
            <div className="flex border-b border-white/10 text-xs font-mono">
              {[
                { id: 'notes', label: 'Executive Notes' },
                { id: 'resources', label: 'Files & Slides' },
                { id: 'quiz', label: 'Knowledge Checkpoint' },
                { id: 'discussion', label: 'Q&A Discussion' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    sounds.playClick();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-6 py-3 border-b-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'border-purple-400 text-purple-300 font-bold bg-purple-500/5'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'notes' && (
              <div className="space-y-3 max-w-3xl">
                <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 leading-relaxed font-sans">
                  <span className="font-bold text-purple-300 block mb-1">Architectural Summary</span>
                  {currentLecture.notes || 'Inference scaling utilizes search rollouts to discover optimal reasoning chains prior to final token generation.'}
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-300">
                  <h4 className="font-bold text-white">Key Takeaways from this Session:</h4>
                  <ul className="space-y-1.5 list-disc pl-5">
                    <li>Eliminating token allocation bottleneck drops kernel execution time by 42%.</li>
                    <li>Learned process verifiers evaluate individual step transitions rather than just the final answer.</li>
                    <li>Monte Carlo Tree Search with rollback enables recovery from hallucinated planning branches.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-2.5 max-w-xl">
                <a
                  href="#"
                  onClick={() => sounds.playClick()}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Lecture Architecture Slides.pdf</span>
                      <span className="text-[10px] font-mono text-slate-400">PDF · 4.8 MB</span>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sounds.playClick()}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">GitHub: frontier-reasoning-mesh</span>
                      <span className="text-[10px] font-mono text-slate-400">Companion Repository</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 max-w-2xl space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                  <HelpCircle className="w-4 h-4" />
                  <span>CONCEPT VERIFICATION</span>
                </div>

                <p className="text-sm font-semibold text-white">
                  Why do process-supervised reward models (PRMs) outperform outcome-supervised reward models (ORMs) on complex Olympiad problems?
                </p>

                <div className="space-y-2.5">
                  {[
                    'They require 90% less GPU memory during backpropagation',
                    'They pinpoint the exact step where reasoning failed, enabling precise trajectory backtracking',
                    'They restrict output tokens to numerical digits only',
                    'They disable multi-head self-attention during inference'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedQuizAnswer(idx);
                      }}
                      className={`w-full p-3.5 rounded-xl text-left text-xs border transition-all ${
                        selectedQuizAnswer === idx
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handleQuizSubmit(1)}
                  disabled={selectedQuizAnswer === null}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl text-xs hover:opacity-95 disabled:opacity-50"
                >
                  Submit Answer
                </button>

                {quizSubmitted && (
                  <div
                    className={`p-3.5 rounded-xl text-xs border ${
                      selectedQuizAnswer === 1
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {selectedQuizAnswer === 1
                      ? '🎉 Correct! PRMs assign credit to every intermediate step, allowing the agent to backtrack before compounding errors.'
                      : '❌ Not quite. Option B is correct: PRMs provide granular step-by-step credit assignment.'}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 max-w-2xl space-y-3">
                <span className="text-xs font-mono text-purple-300 uppercase tracking-wider block">
                  Lecture Q&A
                </span>
                <p className="text-xs text-slate-300">
                  Have a question about this lecture? Post in the main thread on The Nest to receive verified instructor answers and earn community tokens.
                </p>
                <Link
                  to="/feed"
                  onClick={() => sounds.playClick()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold shadow-glow-purple"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Q&A Thread</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Curriculum Accordion */}
        {!isFocusMode && (
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0A0D15] flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Course Curriculum
              </span>
              <span className="text-xs font-mono text-purple-400">
                {course.progressPercent}% Complete
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">
                    Module {modIdx + 1}: {mod.title.replace(/Module \d+:?/, '')}
                  </span>

                  <div className="space-y-1.5">
                    {mod.lectures.map((lec, idx) => {
                      const isCurrent = lec.id === currentLecture.id;
                      return (
                        <button
                          key={lec.id}
                          onClick={() => {
                            sounds.playClick();
                            navigate(`/lecture/${lec.id}`);
                          }}
                          className={`w-full p-3 rounded-xl flex items-center justify-between text-left text-xs transition-all ${
                            isCurrent
                              ? 'bg-purple-600/30 border border-purple-500/50 text-white font-bold'
                              : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {lec.isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-500 flex items-center justify-center text-[9px] font-mono text-slate-400 shrink-0">
                                {idx + 1}
                              </span>
                            )}
                            <span className="truncate">{lec.title}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 shrink-0">{lec.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
