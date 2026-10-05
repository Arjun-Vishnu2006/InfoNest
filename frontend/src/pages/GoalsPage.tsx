import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { Target, Flame, Clock, Award, CalendarDays, Trash2, Sparkles, BookOpen } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { goals, currentUser, deleteGoal, showToast } = useApp();

  const totalHours = goals.reduce((sum, g) => sum + (g.loggedHoursThisWeek || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (g.targetHoursPerWeek || 0), 0);
  const overallProgress = totalTarget ? Math.min(100, Math.round((totalHours / totalTarget) * 100)) : 0;
  const priorityGoal = goals.find(goal => goal.status === 'active');
  const nextTask = priorityGoal ? `${Number(priorityGoal.progressPercent || 0) >= 65 ? 'Complete' : 'Continue'} ${priorityGoal.category === 'Cybersecurity' ? (Number(priorityGoal.progressPercent || 0) < 30 ? 'Networking Fundamentals' : Number(priorityGoal.progressPercent || 0) < 60 ? 'Linux Fundamentals' : 'Web Security') : `${priorityGoal.category} foundations`}` : 'Add a learning goal to get a personalized next step.';

  const heat = useMemo(() => Array.from({ length: 28 }, (_, i) => (i * 7 + goals.length) % 4), [goals.length]);

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Target className="w-3.5 h-3.5" /> Personal Learning Rhythm & Velocity
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">Goals & Progress</h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">Track course goals and lesson progress in one place. Add a goal directly from a course in the Course Vault.</p>
          </div>
          <Link to="/courses" className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/30"><BookOpen className="w-4 h-4"/> Choose a course</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Study Time · read only', value: `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`, icon: Clock },
            { label: 'Knowledge Reputation', value: `${Number(currentUser.reputationScore || currentUser.knowledgeScore || 0).toLocaleString()}`, icon: Award },
            { label: 'Active Goals', value: `${goals.length}`, icon: Target },
            { label: 'Learning Streak', value: `${currentUser.streakDays} Days`, icon: Flame },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return <div key={kpi.label} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2"><div className="flex items-center justify-between text-xs font-mono text-slate-400"><span>{kpi.label}</span><div className="p-2 rounded-xl bg-white/5 text-slate-300"><Icon className="w-4 h-4" /></div></div><h3 className="text-xl font-bold text-white font-mono">{kpi.value}</h3></div>;
          })}
        </div>

        <section className="glass-panel rounded-3xl p-5 sm:p-6 border border-cyan-400/20 bg-gradient-to-r from-cyan-950/25 to-purple-950/20">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono uppercase tracking-wider"><Sparkles className="w-4 h-4"/> What’s Next · based on your progress</div>
          <h2 className="text-lg font-bold text-white mt-2">{nextTask}</h2>
          {priorityGoal && <p className="text-xs text-slate-400 mt-1">For {priorityGoal.title || priorityGoal.roadmapTitle} · {Math.round(priorityGoal.progressPercent || 0)}% complete</p>}
          {priorityGoal?.category === 'Cybersecurity' && <div className="flex flex-wrap gap-2 mt-4">{['Networking Fundamentals','Linux Fundamentals','Web Security','Burp Suite','Penetration Testing','Security Operations'].map((name,index)=>{const complete=index<Math.floor((priorityGoal.progressPercent || 0)/20);return <span key={name} className={`px-3 py-1.5 rounded-full text-[11px] border ${complete?'bg-emerald-500/10 border-emerald-500/25 text-emerald-200':'bg-white/5 border-white/10 text-slate-300'}`}>{complete?'✓ ':''}{name}{index===2&&!complete?` · ${Math.min(100,Math.round((priorityGoal.progressPercent||0)*1.5))}%`:''}</span>;})}</div>}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Overall Goal Pace</h3>
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36"><path className="text-white/10" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /><path className="text-purple-500" strokeDasharray={`${overallProgress}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" /></svg>
              <div className="absolute flex flex-col items-center"><span className="text-3xl font-black font-mono text-white">{overallProgress}%</span><span className="text-[11px] font-mono text-purple-300">weekly pace</span></div>
            </div>
            <p className="text-xs text-slate-400">Your progress is saved against your InfoNest account.</p>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-2 bg-gradient-to-r from-purple-950/30 to-indigo-950/20"><span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">Study Time</span><p className="text-2xl font-bold text-white">{Math.floor(totalHours)}h {Math.round((totalHours % 1) * 60)}m</p><p className="text-xs text-slate-400">Read-only · lesson activity updates course progress.</p></div>
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2"><CalendarDays className="w-4 h-4 text-cyan-400" /> 28-Day Activity</h3><span className="text-[11px] font-mono text-emerald-400">{currentUser.streakDays}-day streak</span></div>
              <div className="grid grid-cols-7 gap-2">{heat.map((level, i) => <div key={i} title={`Day ${i + 1}`} className={`aspect-square rounded-xl ${level === 3 ? 'bg-purple-600' : level === 2 ? 'bg-purple-800/80' : level === 1 ? 'bg-purple-950/60 border border-purple-500/20' : 'bg-white/5'}`} />)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><h2 className="text-xl font-black text-white">Your learning goals</h2><p className="text-xs text-slate-400">These records are backed by the InfoNest Goal collection.</p></div><Sparkles className="w-5 h-5 text-purple-400" /></div>
          {goals.length === 0 ? <div className="glass-panel rounded-3xl p-10 border border-dashed border-white/15 text-center"><Target className="w-10 h-10 mx-auto text-purple-400 mb-3" /><h3 className="text-white font-bold">No course goals yet</h3><p className="text-sm text-slate-400 mt-1">Choose a course in Course Vault and add it to your goals.</p><Link to="/courses" className="inline-block mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold">Browse courses</Link></div> : goals.map((goal: any) => {
            const progress = Math.min(100, Math.max(0, Number(goal.progressPercent ?? ((goal.loggedHoursThisWeek || 0) / Math.max(goal.targetHoursPerWeek || 1, 1) * 100))));
            return <div key={goal.id} className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono">{goal.category || 'General'}</span><span className="text-[10px] text-slate-500 font-mono">{goal.status || 'active'}</span></div><h3 className="text-lg font-bold text-white mt-2">{goal.title || goal.roadmapTitle}</h3><p className="text-xs text-slate-400 mt-1 max-w-2xl">{goal.instructor ? `Instructor: ${goal.instructor} · ` : ''}{goal.description || 'Course learning goal'}</p><p className="text-xs text-cyan-200 mt-2">Course ID: {goal.courseId || 'Linked course unavailable'}</p></div><button onClick={async () => { if (confirm('Remove this course goal?')) { try { await deleteGoal(goal.backendId || goal.id); } catch { showToast('Could not remove the goal. Please try again.', 'warning'); } } }} className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-300" title="Remove goal"><Trash2 className="w-4 h-4" /></button></div>
              <div className="mt-5"><div className="flex justify-between text-[11px] font-mono text-slate-400"><span>{goal.completedLessons || 0} / {goal.totalLessons || goal.totalTasks || 0} lessons complete</span><span className="text-purple-300 font-bold">{Math.round(progress)}%</span></div><div className="h-2 mt-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${progress}%` }} /></div></div>
            </div>;
          })}
        </div>

      </div>
    </MainLayout>
  );
};
