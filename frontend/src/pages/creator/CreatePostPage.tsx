import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import {
  FileCode,
  Image,
  Video,
  Map,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { createPost } = useApp();

  const [postType, setPostType] = useState<'thought' | 'carousel' | 'lecture' | 'code'>('thought');
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [tagsInput, setTagsInput] = useState('#Systems #AI #Architecture');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [carouselUrls, setCarouselUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newSlideUrl, setNewSlideUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sounds.playTriumph();
    const tags = tagsInput.split(' ').map(t => t.startsWith('#') ? t : `#${t}`).filter(Boolean);

    createPost({
      type: postType === 'code' ? 'thought' : postType,
      title,
      caption,
      tags,
      carouselImages: postType === 'carousel' ? carouselUrls : undefined,
      thoughtData: (postType === 'thought' || postType === 'code') ? {
        thought: caption,
        codeSnippet: codeSnippet || undefined,
        language: 'typescript',
        keyTakeaways: ['High-throughput execution pattern', 'Zero-overhead abstractions']
      } : undefined
    });

    navigate('/feed');
  };

  const handleAddSlide = () => {
    if (newSlideUrl.trim()) {
      sounds.playClick();
      setCarouselUrls(prev => [...prev, newSlideUrl.trim()]);
      setNewSlideUrl('');
    }
  };

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full max-w-3xl space-y-6">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-2 bg-gradient-to-r from-purple-950/40 via-cyan-950/30 to-black">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Publishing Drop</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Create Technical Drop</h1>
          <p className="text-xs text-slate-400">Publish architectural diagrams, short lecture reels, or code analysis directly to The Nest feed.</p>
        </div>

        {/* Format Selector */}
        <div className="flex border-b border-white/10 text-xs font-mono">
          {[
            { id: 'thought', label: 'Thought & Axiom', icon: Sparkles },
            { id: 'carousel', label: 'Infographic Carousel', icon: Image },
            { id: 'lecture', label: 'Video Lecture Reel', icon: Video },
            { id: 'code', label: 'Code Snippet', icon: FileCode }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setPostType(tab.id as any);
              }}
              className={`px-5 py-3 border-b-2 font-medium flex items-center gap-2 transition-all ${
                postType === tab.id
                  ? 'border-purple-400 text-purple-300 font-bold bg-purple-500/5'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
              Drop Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Memory Layout Optimization in Modern KV Caches"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
              Technical Caption / Explanation
            </label>
            <textarea
              rows={4}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe the architectural breakthrough, benchmarks, or trade-offs..."
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
            />
          </div>

          {/* Conditional Code Input */}
          {(postType === 'code' || postType === 'thought') && (
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
                Code Snippet (Optional)
              </label>
              <textarea
                rows={5}
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="// Type or paste code snippet here..."
                className="w-full p-4 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
              />
            </div>
          )}

          {/* Conditional Carousel Upload */}
          {postType === 'carousel' && (
            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="text-xs font-mono text-cyan-300 block">Carousel Slide URLs</span>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={newSlideUrl}
                  onChange={(e) => setNewSlideUrl(e.target.value)}
                  placeholder="Paste image URL (https://...)"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono"
                >
                  Add Slide
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {carouselUrls.map((url, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group">
                    <img src={url} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setCarouselUrls(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-red-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5 uppercase tracking-wider">
              Topic Hashtags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold rounded-xl text-xs shadow-glow-purple flex items-center gap-1.5"
            >
              <span>Publish Drop 🚀</span>
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};
