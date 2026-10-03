import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import {
  Sparkles,
  Image,
  Video,
  FileCode,
  Map,
  Eye,
  Settings,
  Send,
  CheckCircle2
} from 'lucide-react';

export const CreatorStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPost, currentUser } = useApp();

  const [postType, setPostType] = useState<'carousel' | 'lecture' | 'thought' | 'roadmap'>('thought');
  const [title, setTitle] = useState('Sub-Millisecond Kernel Socket Ingress with eBPF');
  const [caption, setCaption] = useState('Eliminating Linux context switches by filtering packets directly on NIC ingress rings.');
  const [tagsInput, setTagsInput] = useState('#eBPF #DistributedSystems #LinuxKernel');
  const [codeSnippet, setCodeSnippet] = useState(`// eBPF socket filter program\nSEC("socket")\nint filter_packet(struct __sk_buff *skb) {\n    return BPF_PASS;\n}`);

  // Settings
  const [visibility, setVisibility] = useState('public');
  const [allowComments, setAllowComments] = useState(true);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playTriumph();

    const tags = tagsInput.split(' ').map(t => t.startsWith('#') ? t : `#${t}`).filter(Boolean);

    createPost({
      type: postType,
      title,
      caption,
      tags,
      thoughtData: postType === 'thought' ? {
        thought: caption,
        codeSnippet,
        language: 'c',
        keyTakeaways: ['Direct kernel packet steering', 'Zero memory copies into user space']
      } : undefined
    });

    navigate('/feed');
  };

  return (
    <MainLayout showRightRail={false} fullWidth={true}>
      <div className="w-full space-y-6">
        {/* Top Studio Bar */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Creator Publishing Studio</h1>
              <p className="text-xs text-slate-400 font-mono">3-Pane Professional Publishing Environment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/creator/dashboard')}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-slate-300 rounded-xl"
            >
              Exit Studio
            </button>
            <button
              onClick={handlePublish}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-bold rounded-xl text-xs shadow-glow-cyan flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Drop 🚀</span>
            </button>
          </div>
        </div>

        {/* 3-Pane Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Pane 1: Editor (Left 4 cols) */}
          <div className="lg:col-span-4 glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-2">
              <span>1. Format & Editor</span>
            </h3>

            {/* Post Type Selector */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[
                { id: 'thought', label: 'Thought & Code', icon: FileCode },
                { id: 'carousel', label: 'Visual Carousel', icon: Image },
                { id: 'lecture', label: 'Video Lecture', icon: Video },
                { id: 'roadmap', label: 'Roadmap Embed', icon: Map }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setPostType(t.id as any);
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                    postType === t.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-cyan'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Drop Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Explanation / Thesis</label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {postType === 'thought' && (
                <div>
                  <label className="text-xs font-mono text-slate-400 block mb-1">Code Snippet (GLSL, Rust, Go, Python)</label>
                  <textarea
                    rows={5}
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">Hashtags</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-purple-300 font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Pane 2: Live Interactive Preview (Center 5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>2. Live The Nest Feed Preview</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Realtime Render</span>
            </div>

            {/* Mock Card Preview */}
            <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0A0D15] p-5 space-y-3">
              <div className="flex items-center gap-3">
                <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover ring-1 ring-purple-400" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">{currentUser.name}</span>
                    <span className="text-[10px] text-cyan-400">✓</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400">{currentUser.role}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">{title || 'Untitled Drop'}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{caption}</p>
              </div>

              {postType === 'thought' && codeSnippet && (
                <pre className="p-3 bg-black/60 rounded-xl border border-white/10 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                  {codeSnippet}
                </pre>
              )}

              <div className="flex flex-wrap gap-1 text-[10px] font-mono text-purple-400">
                {tagsInput.split(' ').map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Pane 3: Publishing Settings (Right 3 cols) */}
          <div className="lg:col-span-3 glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>3. Distribution Settings</span>
            </h3>

            <div className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1.5">Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                >
                  <option value="public">Public Cosmos (All Learners)</option>
                  <option value="subscribers">Subscribers Only</option>
                  <option value="private">Private Draft</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-slate-300">Allow Discussions</span>
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={(e) => setAllowComments(e.target.checked)}
                    className="accent-purple-600 rounded"
                  />
                </label>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-300 space-y-1">
                <span className="text-[10px] uppercase text-purple-300 font-bold block">Reward Estimation</span>
                <p className="text-[11px] leading-relaxed">
                  Earn up to <strong>+500 KT</strong> based on student completions and save bookmarks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
