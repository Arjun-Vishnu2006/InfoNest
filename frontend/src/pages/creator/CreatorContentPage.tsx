import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';
import {
  FolderKanban,
  PlusCircle,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare
} from 'lucide-react';

export const CreatorContentPage: React.FC = () => {
  const { creatorContent, deleteContentItem } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'post' | 'lecture' | 'course' | 'roadmap' | 'draft'>('all');

  const filteredItems = activeFilter === 'all'
    ? creatorContent
    : activeFilter === 'draft'
    ? creatorContent.filter(c => c.status === 'draft')
    : creatorContent.filter(c => c.type === activeFilter);

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-black">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-300">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Asset Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Content Vault & Manager</h1>
            <p className="text-xs text-slate-400">
              Manage your published lectures, infographics, masterclass courses, and draft trajectories.
            </p>
          </div>

          <Link
            to="/create/post"
            onClick={() => sounds.playClick()}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-glow-cyan self-start sm:self-center hover:opacity-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Asset</span>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'post', label: 'Posts & Carousels' },
            { id: 'lecture', label: 'Video Lectures' },
            { id: 'course', label: 'Courses' },
            { id: 'roadmap', label: 'Roadmaps' },
            { id: 'draft', label: 'Drafts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setActiveFilter(tab.id as any);
              }}
              className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-cyan font-bold'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Table */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-medium">Asset Title</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Published</th>
                  <th className="pb-3 font-medium">Views</th>
                  <th className="pb-3 font-medium">Likes</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-bold text-white max-w-sm truncate">{item.title}</td>
                    <td className="py-4 text-purple-300 uppercase">{item.type}</td>
                    <td className="py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                        item.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400">{item.date}</td>
                    <td className="py-4 text-slate-300">{item.views.toLocaleString()}</td>
                    <td className="py-4 text-rose-400">❤️ {item.likes.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => deleteContentItem(item.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-colors"
                          title="Archive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
