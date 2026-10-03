import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import {
  Bell,
  CheckCheck,
  Sparkles,
  Award,
  Users,
  Target,
  Shield,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredNotifications = filterCategory === 'all'
    ? notifications
    : notifications.filter(n => n.category === filterCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'creator': return <Users className="w-4 h-4 text-cyan-400" />;
      case 'learning': return <Award className="w-4 h-4 text-emerald-400" />;
      case 'social': return <MessageSquare className="w-4 h-4 text-purple-400" />;
      case 'goals': return <Target className="w-4 h-4 text-amber-400" />;
      default: return <Shield className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-950/40 to-black">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-purple-300">
              <Bell className="w-3.5 h-3.5" />
              <span>Activity Stream</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Notifications</h1>
            <p className="text-xs text-slate-400">Updates from creators you follow, milestone unlocks, and goal reminders.</p>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="self-start sm:self-center px-4 py-2 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white rounded-xl border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-cyan-400" />
            <span>Mark All as Read</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-mono">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'creator', label: 'Creator Drops' },
            { id: 'learning', label: 'Learning & Milestones' },
            { id: 'social', label: 'Discussions' },
            { id: 'goals', label: 'Goals & Streaks' },
            { id: 'system', label: 'System' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playClick();
                setFilterCategory(tab.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
                filterCategory === tab.id
                  ? 'bg-purple-600 border-purple-500 text-white shadow-glow-purple font-semibold'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 space-y-2">
              <Bell className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">All caught up!</h3>
              <p className="text-xs text-slate-400">No unread notifications in this category.</p>
            </div>
          ) : (
            filteredNotifications.map(item => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                  !item.read
                    ? 'bg-purple-950/20 border-purple-500/30 shadow-sm'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    <span className="text-[10px] font-mono text-slate-500 block pt-1">{item.timestamp}</span>
                  </div>
                </div>

                {item.actionUrl && (
                  <Link
                    to={item.actionUrl}
                    onClick={(e) => {
                      e.stopPropagation();
                      sounds.playClick();
                      markNotificationRead(item.id);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
};
