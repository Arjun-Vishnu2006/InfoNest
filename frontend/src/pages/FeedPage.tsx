import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { StoryTray } from '../components/feed/StoryTray';
import { FeedCard } from '../components/feed/FeedCard';
import { useApp } from '../context/AppContext';
import { Sparkles, Rocket, UploadCloud } from 'lucide-react';
import { sounds } from '../services/soundManager';
import { AIRecommendationsPanel } from '../components/feed/AIRecommendationsPanel';

export const FeedPage: React.FC = () => {
  const { posts } = useApp();
  const [feedFilter, setFeedFilter] = useState<'all' | 'following' | 'knowledge' | 'lectures' | 'roadmaps' | 'challenges'>('all');

  const filteredPosts = posts.filter(post => {
    if (feedFilter === 'following') return post.creator.isFollowed;
    if (feedFilter === 'knowledge') return post.type === 'knowledge' || post.type === 'carousel';
    if (feedFilter === 'lectures') return post.type === 'lecture';
    if (feedFilter === 'roadmaps') return post.type === 'roadmap';
    if (feedFilter === 'challenges') return post.type === 'challenge';
    return true;
  });

  return (
    <MainLayout showRightRail={true}>
      <div className="w-full space-y-5">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/20 bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-cyan-950/10 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-300 font-bold">
              <Rocket className="w-3.5 h-3.5" /> InfoNest Knowledge Universe
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-white tracking-tight">
              Learn. Share. Grow. <span className="text-gradient-purple">Your Knowledge, Your Universe.</span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-300 leading-relaxed">
              Discover people and knowledge sparks, set your own learning goals, and build the knowledge space together. Content appears here only after creators and learners add it.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 font-sans">
              <span>The Nest</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Your Knowledge Universe · Deep learning meets creator velocity.</p>
          </div>
          <div className="flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 text-xs font-mono overflow-x-auto scrollbar-none">
            {[['all','All Cosmos'],['following','Following'],['knowledge','Knowledge'],['lectures','Lectures'],['roadmaps','Roadmaps'],['challenges','Challenges']].map(([id,label]) => (
              <button key={id} onClick={() => { sounds.playClick(); setFeedFilter(id as any); }} className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${feedFilter === id ? 'bg-purple-600 text-white font-bold shadow-glow-purple' : 'text-slate-400 hover:text-white'}`}>{label}</button>
            ))}
          </div>
        </div>

        <StoryTray />

        <AIRecommendationsPanel />

        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
          <div className="relative z-10 space-y-3">
            {filteredPosts.length === 0 ? (
              <>
                <div className="mx-auto w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <UploadCloud className="w-7 h-7 text-purple-300" />
                </div>
                <h3 className="text-lg font-bold text-white">Your knowledge space is ready</h3>
                <p className="text-sm text-slate-400 max-w-lg mx-auto">No learning content has been added yet. Creators can upload courses, roadmaps, documents and knowledge posts from the Creator workspace.</p>
                <p className="text-xs text-cyan-300 font-mono">Start empty · Add real project data · Grow the Nest</p>
              </>
            ) : (
              filteredPosts.map(post => <FeedCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
