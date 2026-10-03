import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { useApp } from '../../context/AppContext';

import { sounds } from '../../services/soundManager';
import {
  Users,
  Clock,
  Award,
  TrendingUp,
  PlusCircle,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const CreatorDashboardPage: React.FC = () => {
  const { currentUser, creatorContent } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('7d');

  const emptyAnalytics = { followerGrowth: [], watchTime: [], enrollments: [], audienceActivity: [] };
  const analytics = emptyAnalytics;

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-8">
        {/* Dashboard Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Creator Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Creator Analytics & Reach</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Real-time telemetry on student reach, lecture watch hours, and knowledge royalties across The Nest.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Time Range Selector */}
            <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 text-xs font-mono">
              {(['7d', '30d', '90d', '1y'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => {
                    sounds.playClick();
                    setTimeRange(range);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    timeRange === range
                      ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>

            <Link
              to="/create/post"
              onClick={() => sounds.playClick()}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-purple-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-glow-cyan hover:opacity-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Drop</span>
            </Link>
          </div>
        </div>

        {/* 4 High-Density KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Total Student Reach', value: '142,500', change: '+18.4% growth', icon: Users, color: 'cyan' },
            { title: 'Lecture Watch Hours', value: '24,810 hrs', change: '+32.1% this month', icon: Clock, color: 'purple' },
            { title: 'Knowledge Royalty', value: `${currentUser.knowledgeTokens.toLocaleString()} KT`, change: '+450 tokens today', icon: Award, color: 'gold' },
            { title: 'Average Engagement', value: '14.2%', change: 'Top 2% Creator', icon: TrendingUp, color: 'emerald' }
          ].map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{kpi.title}</span>
                  <div className="p-2 rounded-xl bg-white/5 text-slate-300">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-white font-mono">{kpi.value}</h3>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{kpi.change}</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Recharts Analytics Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Follower Growth Area Chart */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Follower Growth Trajectory
                </h3>
                <p className="text-xs text-slate-400">Net new scholar subscribers over time</p>
              </div>
              <span className="text-xs font-mono text-cyan-400">Trend: Bullish</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.followerGrowth}>
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F121C',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="followers" stroke="#06B6D4" strokeWidth={2.5} fillOpacity={1} fill="url(#cyanGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Watch Time Bar Chart */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Weekly Lecture Watch Hours
                </h3>
                <p className="text-xs text-slate-400">Total hours spent by students inside video player</p>
              </div>
              <span className="text-xs font-mono text-purple-400">+12% vs last period</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.watchTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F121C',
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="hours" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Content Performance Quick Table */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Top Performing Technical Drops
              </h3>
              <p className="text-xs text-slate-400">Highest student engagement and bookmark ratios</p>
            </div>
            <Link
              to="/creator/content"
              onClick={() => sounds.playClick()}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
            >
              Manage All Content →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium">Views</th>
                  <th className="pb-3 font-medium">Likes</th>
                  <th className="pb-3 font-medium">Comments</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {creatorContent.slice(0, 4).map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 font-bold text-white max-w-xs truncate">{item.title}</td>
                    <td className="py-3.5 text-purple-300 uppercase">{item.type}</td>
                    <td className="py-3.5 text-slate-300">{item.views.toLocaleString()}</td>
                    <td className="py-3.5 text-rose-400">❤️ {item.likes.toLocaleString()}</td>
                    <td className="py-3.5 text-slate-300">💬 {item.comments}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        {item.status}
                      </span>
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
