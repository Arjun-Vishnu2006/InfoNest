import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Award,
  Video,
  FileText,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Info
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Masterclass'>('Advanced');

  // Step 2: Modules
  const [modules, setModules] = useState<{ id: string; title: string; lecturesCount: number }[]>([
    { id: 'm1', title: 'Module 1: Mathematical Foundations & Kernel Space', lecturesCount: 3 },
    { id: 'm2', title: 'Module 2: High-Concurrency Ingress Architecture', lecturesCount: 4 }
  ]);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // Step 3: Lectures
  const [lectureTitle, setLectureTitle] = useState('Zero-Copy Sockets Deconstructed');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');

  // Step 4: Quiz
  const [quizQuestion, setQuizQuestion] = useState('Why does bypassing user-space copies reduce CPU bandwidth consumption?');

  const handleNext = () => {
    sounds.playClick();
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    sounds.playClick();
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePublishCourse = () => {
    sounds.playTriumph();
    confetti({ particleCount: 100, spread: 80 });
    showToast(`Masterclass "${title || 'Autonomous Systems'}" published to Course Vault!`);
    navigate('/courses');
  };

  const steps = [
    'Information',
    'Curriculum Modules',
    'Lecture Media',
    'Resources',
    'Quiz Setup',
    'Certificate',
    'Review & Publish'
  ];

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-2 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-black">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Masterclass Course Creator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Create New Course</h1>
          <p className="text-xs text-slate-400">Step-by-step curriculum authoring with video lectures, resources, and certificates.</p>
        </div>

        {/* 7-Step Progress Stepper */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[640px] gap-2">
            {steps.map((st, idx) => {
              const stepNum = idx + 1;
              const isPassed = stepNum < currentStep;
              const isCurrent = stepNum === currentStep;
              return (
                <div key={st} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                      isPassed
                        ? 'bg-emerald-500 text-black'
                        : isCurrent
                        ? 'bg-purple-600 text-white shadow-glow-purple'
                        : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    {isPassed ? '✓' : stepNum}
                  </div>
                  <span className={`text-xs font-mono ${isCurrent ? 'text-white font-bold' : 'text-slate-400'}`}>
                    {st}
                  </span>
                  {idx < steps.length - 1 && <div className="w-4 h-px bg-white/10" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Views */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          {/* Step 1: Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Step 1: Course Overview & Target Level
              </h3>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Course Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Hyper-Scale Event Meshes with eBPF and Kafka"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Subtitle / High Concept</label>
                <textarea
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Deep dive into zero-copy network sockets, Raft consensus, and sub-millisecond pipelines."
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                    <option value="Design & Creative Engineering">Design & Creative Engineering</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Masterclass">Masterclass</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Modules */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Step 2: Modular Curriculum Structure
              </h3>

              <div className="space-y-2">
                {modules.map((m, idx) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{m.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{m.lecturesCount} Lectures Planned</span>
                    </div>
                    <button
                      onClick={() => setModules(prev => prev.filter(mod => mod.id !== m.id))}
                      className="p-1.5 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="New Module Title..."
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newModuleTitle.trim()) {
                      sounds.playClick();
                      setModules(prev => [...prev, { id: `mod_${Date.now()}`, title: newModuleTitle.trim(), lecturesCount: 2 }]);
                      setNewModuleTitle('');
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-mono font-bold"
                >
                  + Add Module
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Lecture Media */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Step 3: Primary Video Lecture Stream
              </h3>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">First Lecture Title</label>
                <input
                  type="text"
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Video Stream URL</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono"
                />
              </div>
            </div>
          )}

          {/* Step 4: Resources */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Step 4: Downloadable Architecture Companion Files
              </h3>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-white">Default Included Files:</span>
                <p>✓ Architecture Cheatsheet.pdf</p>
                <p>✓ Companion GitHub Repository Hook</p>
              </div>
            </div>
          )}

          {/* Step 5: Quiz */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Step 5: Checkpoint Evaluation Quiz
              </h3>
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Checkpoint Question</label>
                <input
                  type="text"
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* Step 6: Certificate */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Step 6: Verified Certificate Credentials
              </h3>
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                <Award className="w-5 h-5 text-purple-400 mb-2" />
                <p>Students who finish all modules will automatically be awarded the on-chain verified InfoNest Master Credential.</p>
              </div>
            </div>
          )}

          {/* Step 7: Final Review & Publish */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                Step 7: Final Review & Verification
              </h3>
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
                <p className="text-slate-400">Course: <strong className="text-white">{title || 'Hyper-Scale Event Meshes'}</strong></p>
                <p className="text-slate-400">Category: <strong className="text-cyan-300">{category}</strong></p>
                <p className="text-slate-400">Difficulty: <strong className="text-purple-300">{level}</strong></p>
                <p className="text-slate-400">Modules: <strong className="text-emerald-300">{modules.length} Modules configured</strong></p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-white/10 flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 disabled:opacity-30"
            >
              Back
            </button>

            {currentStep < 7 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-glow-purple"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePublishCourse}
                className="px-8 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl text-xs shadow-glow-emerald flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Course to Vault 🚀</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
