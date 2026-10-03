import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { FeedCard } from '../components/feed/FeedCard';
import { Bookmark, Sparkles, BookOpen, Layers, Trash2 } from 'lucide-react';
import { sounds } from '../services/soundManager';

export const SavedVaultPage: React.FC = () => {
  const { posts, courses, roadmaps } = useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'courses' | 'roadmaps'>('posts');

  const bookmarkedPosts = posts.filter(p => p.isBookmarked);
  const enrolledCourses = courses.filter(c => c.isEnrolled);

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-black space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Bookmark className="w-3.5 h-3.5 fill-amber-300" />
            <span>Personal Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Saved Knowledge Vault</h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Quickly reference your bookmarked visual carousels, video lecture reels, enrolled masterclasses, and cloned roadmaps.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 text-xs font-mono">
          {[
            { id: 'posts', label: `Saved Drops (${bookmarkedPosts.length})` },
            { id: 'courses', label: `Enrolled Courses (${enrolledCourses.length})` },
            { id: 'roadmaps', label: `Saved Roadmaps (${roadmaps.length})` }
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

        {/* Content */}
        {activeTab === 'posts' && (
          <div className="max-w-3xl space-y-6">
            {bookmarkedPosts.length === 0 ? (
              <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 space-y-3">
                <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">Your vault is waiting</h3>
                <p className="text-xs text-slate-400">Tap the bookmark icon on any post in The Nest feed to pin it here.</p>
              </div>
            ) : (
              bookmarkedPosts.map(post => (
                <FeedCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.length === 0 ? (
              <div className="col-span-2 text-center py-20 glass-panel rounded-3xl border border-white/10 space-y-3">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No enrolled courses</h3>
                <p className="text-xs text-slate-400">Enroll in masterclasses to see them here.</p>
              </div>
            ) : (
              enrolledCourses.map(course => (
                <div key={course.id} className="glass-panel rounded-2xl border border-white/10 p-5 flex gap-4">
                  <img src={course.coverImage} alt={course.title} className="w-24 h-20 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-300">{course.level}</span>
                      <h4 className="text-sm font-bold text-white truncate">{course.title}</h4>
                      <span className="text-xs text-slate-400 font-mono mt-0.5 block">{course.creator.name}</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">Progress: {course.progressPercent}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'roadmaps' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmaps.length === 0 ? (
              <div className="col-span-2 text-center py-20 glass-panel rounded-3xl border border-white/10 space-y-3">
                <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-white">No saved roadmaps</h3>
                <p className="text-xs text-slate-400">Clone roadmaps from the Explore page to see them here.</p>
              </div>
            ) : (
              roadmaps.map(rm => (
                <div key={rm.id} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase">{rm.category}</span>
                  <h4 className="text-sm font-bold text-white">{rm.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{rm.description}</p>
                  <div className="pt-2 text-xs font-mono text-slate-500 flex justify-between border-t border-white/5">
                    <span>{rm.totalMilestones} Phases</span>
                    <span className="text-emerald-400">{rm.completedMilestones} Completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
