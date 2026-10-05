import React, { useMemo, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { sounds } from '../services/soundManager';
import { Target, Flame, Clock, Award, CheckCircle2, Plus, CalendarDays, Trash2, Pencil, X, Save, Sparkles } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  const { goals, currentUser, createGoal, updateGoal, deleteGoal, logStudyHours, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', category: 'Software Engineering', description: '', targetHoursPerWeek: 10, targetCompletionDate: '' });

  const totalHours = goals.reduce((sum, g) => sum + (g.loggedHoursThisWeek || 0), 0);
  const totalTarget = goals.reduce((sum, g) => sum + (g.targetHoursPerWeek || 0), 0);
  const overallProgress = totalTarget ? Math.min(100, Math.round((totalHours / totalTarget) * 100)) : 0;
  const priorityGoal = goals.find(goal => goal.status === 'active');
  const nextTask = priorityGoal ? `${Number(priorityGoal.progressPercent || 0) >= 65 ? 'Complete' : 'Continue'} ${priorityGoal.category === 'Cybersecurity' ? (Number(priorityGoal.progressPercent || 0) < 30 ? 'Networking Fundamentals' : Number(priorityGoal.progressPercent || 0) < 60 ? 'Linux Fundamentals' : 'Web Security') : `${priorityGoal.category} foundations`}` : 'Add a learning goal to get a personalized next step.';

  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', category: 'Software Engineering', description: '', targetHoursPerWeek: 10, targetCompletionDate: '' });
    setShowModal(true);
  };

  const openEdit = (goal: any) => {
    setEditingId(goal.backendId || goal.id);
    setForm({
      title: goal.title || goal.roadmapTitle || '',
      category: goal.category || 'General',
      description: goal.description || '',
      targetHoursPerWeek: goal.targetHoursPerWeek || 10,
      targetCompletionDate: goal.targetCompletionDate && !['Flexible',''].includes(String(goal.targetCompletionDate)) ? (() => { const d = new Date(goal.targetCompletionDate); return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0,10); })() : '',
    });
    setShowModal(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return showToast('Add a title and short description.', 'warning');
    try {
      if (editingId) await updateGoal(editingId, form);
      else await createGoal(form);
      setShowModal(false);
      setEditingId(null);
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Could not save the goal.', 'warning');
    }
  };

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
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">Create goals that are stored in MongoDB, set a weekly study target, and keep your learning profile up to date.</p>
          </div>
          <button onClick={openCreate} className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-purple-900/30">
            <Plus className="w-4 h-4" /> Add learning goal
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Weekly Study Pace', value: `${totalHours.toFixed(1)}h / ${totalTarget || 0}h`, icon: Clock },
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
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 bg-gradient-to-r from-purple-950/30 to-indigo-950/20">
              <div><span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">Quick study log</span><p className="text-xs text-slate-300 mt-0.5">Log time against a goal to keep your progress visible.</p></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{[0.5, 1, 2, 3].map((hrs) => <button key={hrs} onClick={() => goals[0] && logStudyHours(goals[0].id, hrs)} className="py-3 bg-white/5 hover:bg-purple-600/30 border border-white/10 rounded-2xl text-xs font-mono font-bold text-white flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5 text-purple-400" />+{hrs} hr</button>)}</div>
            </div>
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center justify-between"><h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2"><CalendarDays className="w-4 h-4 text-cyan-400" /> 28-Day Activity</h3><span className="text-[11px] font-mono text-emerald-400">{currentUser.streakDays}-day streak</span></div>
              <div className="grid grid-cols-7 gap-2">{heat.map((level, i) => <div key={i} title={`Day ${i + 1}`} className={`aspect-square rounded-xl ${level === 3 ? 'bg-purple-600' : level === 2 ? 'bg-purple-800/80' : level === 1 ? 'bg-purple-950/60 border border-purple-500/20' : 'bg-white/5'}`} />)}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between"><div><h2 className="text-xl font-black text-white">Your learning goals</h2><p className="text-xs text-slate-400">These records are backed by the InfoNest Goal collection.</p></div><Sparkles className="w-5 h-5 text-purple-400" /></div>
          {goals.length === 0 ? <div className="glass-panel rounded-3xl p-10 border border-dashed border-white/15 text-center"><Target className="w-10 h-10 mx-auto text-purple-400 mb-3" /><h3 className="text-white font-bold">No goals yet</h3><p className="text-sm text-slate-400 mt-1">Create your first learning goal.</p><button onClick={openCreate} className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold">Create goal</button></div> : goals.map((goal: any) => {
            const progress = Math.min(100, Math.max(0, Number(goal.progressPercent ?? ((goal.loggedHoursThisWeek || 0) / Math.max(goal.targetHoursPerWeek || 1, 1) * 100))));
            return <div key={goal.id} className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-[10px] px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono">{goal.category || 'General'}</span><span className="text-[10px] text-slate-500 font-mono">{goal.status || 'active'}</span></div><h3 className="text-lg font-bold text-white mt-2">{goal.title || goal.roadmapTitle}</h3><p className="text-xs text-slate-400 mt-1 max-w-2xl">{goal.description || 'Personal learning goal'}</p></div><div className="flex items-center gap-2 shrink-0"><button onClick={() => openEdit(goal)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300" title="Edit"><Pencil className="w-4 h-4" /></button><button onClick={async () => { if (confirm('Delete this goal?')) { try { await deleteGoal(goal.backendId || goal.id); } catch { showToast('Could not delete the goal. Please try again.', 'warning'); } } }} className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-rose-300" title="Delete"><Trash2 className="w-4 h-4" /></button></div></div>
              <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-[10px] font-mono text-slate-500">Log study time:</span>{[0.5, 1, 2].map((hrs) => <button key={hrs} onClick={() => logStudyHours(goal.backendId || goal.id, hrs)} className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-600/20 border border-white/10 text-[10px] font-mono text-purple-200">+{hrs}h</button>)}</div><div className="mt-5"><div className="flex justify-between text-[11px] font-mono text-slate-400"><span>{goal.loggedHoursThisWeek || 0}h logged / {goal.targetHoursPerWeek || 0}h weekly target</span><span className="text-purple-300 font-bold">{Math.round(progress)}%</span></div><div className="h-2 mt-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${progress}%` }} /></div></div>
            </div>;
          })}
        </div>

        {showModal && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"><div className="w-full max-w-xl glass-panel rounded-3xl p-6 border border-purple-500/30 shadow-2xl"><div className="flex items-center justify-between mb-5"><div><h2 className="text-xl font-black text-white">{editingId ? 'Edit learning goal' : 'Create a learning goal'}</h2><p className="text-xs text-slate-400 mt-1">This will be saved in MongoDB.</p></div><button onClick={() => setShowModal(false)} className="p-2 rounded-xl bg-white/5 text-slate-300"><X className="w-4 h-4" /></button></div><form onSubmit={submit} className="space-y-4"><label className="block text-xs font-semibold text-slate-300">Goal title<input className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 text-white outline-none focus:border-purple-500" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Become a Full-Stack Developer" /></label><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="block text-xs font-semibold text-slate-300">Category<select className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 text-white" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option>Software Engineering</option><option>AI & Machine Learning</option><option>Data Science</option><option>Cloud & DevOps</option><option>Career</option><option>Other</option></select></label><label className="block text-xs font-semibold text-slate-300">Hours / week<input type="number" min="0" step="0.5" className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 text-white" value={form.targetHoursPerWeek} onChange={e => setForm({...form, targetHoursPerWeek: Number(e.target.value)})} /></label></div><label className="block text-xs font-semibold text-slate-300">Target completion date<input type="date" className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 text-white" value={form.targetCompletionDate} onChange={e => setForm({...form, targetCompletionDate: e.target.value})} /></label><label className="block text-xs font-semibold text-slate-300">Description<textarea rows={4} className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 p-3 text-white outline-none focus:border-purple-500" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What do you want to learn and why?" /></label><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl bg-white/5 text-slate-300">Cancel</button><button className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold flex items-center gap-2"><Save className="w-4 h-4" /> Save goal</button></div></form></div></div>}
      </div>
    </MainLayout>
  );
};
