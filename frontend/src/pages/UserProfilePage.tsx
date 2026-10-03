import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { useApp } from '../context/AppContext';
import { Award, BookOpen, MapPin, Pencil, Plus, Save, Trash2, Upload, X, ShieldCheck } from 'lucide-react';

type Certificate = {
  name: string;
  issuer?: string;
  issuedDate?: string;
  fileName?: string;
  fileType?: string;
  fileData?: string;
};

const certificateStorageKey = 'infonest_certificates_local';

export const UserProfilePage: React.FC = () => {
  const { currentUser, courses, goals, updateProfile, showToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: currentUser.name,
    headline: (currentUser as any).headline || '',
    location: (currentUser as any).location || '',
    about: (currentUser as any).about || currentUser.bio || '',
    education: (currentUser as any).education || '',
    experience: (currentUser as any).experience || '',
    expertiseArea: (currentUser as any).expertiseArea || '',
    skills: (currentUser.skills || []).join(', '),
    profilePicture: currentUser.avatar || '',
  });
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    try {
      const saved = localStorage.getItem(certificateStorageKey);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore malformed local data */ }
    return Array.isArray((currentUser as any).certificates) ? (currentUser as any).certificates : [];
  });
  const [certificateName, setCertificateName] = useState('');
  const [certificateIssuer, setCertificateIssuer] = useState('');
  const certificateInput = useRef<HTMLInputElement>(null);

  const enrolledCourses = courses.filter(c => c.isEnrolled);

  useEffect(() => {
    localStorage.setItem(certificateStorageKey, JSON.stringify(certificates));
  }, [certificates]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...form,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        certificates,
      });
      setEditing(false);
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Could not update profile.', 'warning');
    }
  };

  const addCertificate = async (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const item: Certificate = {
        name: certificateName.trim() || file.name.replace(/\.[^.]+$/, ''),
        issuer: certificateIssuer.trim(),
        issuedDate: new Date().toLocaleDateString(),
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileData: typeof reader.result === 'string' ? reader.result : '',
      };
      const next = [item, ...certificates];
      setCertificates(next);
      setCertificateName('');
      setCertificateIssuer('');
      try {
        await updateProfile({ certificates: next });
        showToast('Certificate added to your profile.', 'success');
      } catch {
        showToast('Certificate added locally. Save your profile to sync it.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  const removeCertificate = async (index: number) => {
    const next = certificates.filter((_, i) => i !== index);
    setCertificates(next);
    try { await updateProfile({ certificates: next }); } catch { /* local state remains */ }
  };

  return (
    <MainLayout showRightRail={false}>
      <div className="w-full space-y-6">
        {/* Instagram-style profile header */}
        <section className="glass-panel rounded-3xl overflow-hidden border border-white/10">
          <div className="h-40 sm:h-52 relative bg-[radial-gradient(circle_at_75%_20%,rgba(168,85,247,.28),transparent_30%),linear-gradient(120deg,#090b18,#11153a,#071b2b)]">
            <div className="absolute inset-0 opacity-40 bg-[url('/infonest-logo.png')] bg-no-repeat bg-[length:280px] bg-[right_15px_center]" />
          </div>
          <div className="px-6 sm:px-8 pb-7 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="flex items-end gap-5">
                <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-purple-500 via-cyan-400 to-pink-400 shadow-glow-purple">
                  <img src={currentUser.avatar || '/infonest-logo.png'} alt={currentUser.name} className="w-full h-full rounded-full object-cover border-4 border-[#07080D]" />
                </div>
                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-white">{currentUser.name}</h1>
                    {currentUser.isVerified && <ShieldCheck className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <p className="text-sm text-purple-300 font-semibold mt-1">{(currentUser as any).headline || 'Add a short headline'}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{(currentUser as any).location || 'Add location'}</span>
                    <span>{currentUser.email}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setEditing(true)} className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold flex items-center gap-2"><Pencil className="w-4 h-4" /> Edit profile</button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="glass-panel rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-3"><h2 className="text-lg font-bold text-white">Bio</h2><button onClick={() => setEditing(true)} className="text-xs text-purple-300">Edit →</button></div>
              <p className="text-sm text-slate-300 leading-7 whitespace-pre-line">{(currentUser as any).about || currentUser.bio || 'Tell the InfoNest community about yourself, your interests and what you are learning.'}</p>
            </section>

            <section className="glass-panel rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-white">My Certificates</h2><span className="text-xs text-slate-400">{certificates.length} uploaded</span></div>
              <div className="grid sm:grid-cols-2 gap-4">
                {certificates.map((certificate, index) => (
                  <div key={`${certificate.fileName}-${index}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0"><div className="flex items-center gap-2 text-cyan-300"><Award className="w-4 h-4" /><span className="font-semibold text-white truncate">{certificate.name}</span></div><p className="text-xs text-slate-400 mt-1">{certificate.issuer || 'Certificate'} · {certificate.issuedDate || 'Recently added'}</p></div>
                      <button onClick={() => void removeCertificate(index)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-300" title="Remove certificate"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    {certificate.fileData && certificate.fileType?.startsWith('image/') ? <img src={certificate.fileData} alt={certificate.name} className="mt-3 w-full h-32 object-cover rounded-xl border border-white/10" /> : <div className="mt-3 h-20 rounded-xl bg-black/20 border border-dashed border-purple-500/20 flex items-center justify-center text-xs text-slate-400">{certificate.fileName}</div>}
                  </div>
                ))}
                {certificates.length === 0 && <div className="sm:col-span-2 py-10 text-center border border-dashed border-purple-500/20 rounded-2xl"><Award className="w-8 h-8 mx-auto text-purple-300 mb-2" /><p className="text-white font-semibold">No certificates yet</p><p className="text-xs text-slate-400 mt-1">Upload certificates and showcase your achievements.</p></div>}
              </div>
            </section>

            <section className="glass-panel rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-bold text-white">Learning goals</h2><Link to="/goals" className="text-xs text-purple-300">Manage goals →</Link></div>
              {goals.length === 0 && <p className="text-sm text-slate-400">No goals yet. Add your first learning goal from My Goals & Progress.</p>}
              {goals.slice(0, 3).map((goal: any) => <div key={goal.id} className="py-3 border-b border-white/5 last:border-0"><div className="flex justify-between gap-4"><span className="text-sm font-semibold text-white">{goal.title || goal.roadmapTitle}</span><span className="text-xs text-purple-300">{Math.round(goal.progressPercent || 0)}%</span></div><div className="h-1.5 mt-2 rounded-full bg-white/5"><div className="h-full rounded-full bg-purple-500" style={{ width: `${Math.min(100, goal.progressPercent || 0)}%` }} /></div></div>)}
            </section>
          </div>

          <div className="space-y-6">
            <section className="glass-panel rounded-3xl p-6 border border-white/10"><h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Profile snapshot</h2><div className="space-y-3 text-xs font-mono"><div className="flex justify-between"><span className="text-slate-400">Reputation</span><span className="text-amber-300">{currentUser.reputationScore || 0}</span></div><div className="flex justify-between"><span className="text-slate-400">Role</span><span className="text-white">{currentUser.role}</span></div><div className="flex justify-between"><span className="text-slate-400">Active goals</span><span className="text-white">{goals.length}</span></div></div></section>

            <section className="glass-panel rounded-3xl p-6 border border-purple-500/20"><div className="flex items-center justify-between mb-4"><h2 className="text-sm font-bold text-white uppercase tracking-wider">Skills & interests</h2><button onClick={() => setEditing(true)} className="text-xs text-purple-300">Edit</button></div><div className="flex flex-wrap gap-2">{currentUser.skills.length ? currentUser.skills.map(skill => <span key={skill} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-slate-300">{skill}</span>) : <span className="text-xs text-slate-400">Add your interests and skills.</span>}</div></section>

            <section className="glass-panel rounded-3xl p-6 border border-white/10"><h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Upload certificate</h2><input ref={certificateInput} type="file" accept="*/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) void addCertificate(f); e.currentTarget.value = ''; }} /><div className="space-y-3"><input value={certificateName} onChange={e => setCertificateName(e.target.value)} placeholder="Certificate name (optional)" className="profileInput" /><input value={certificateIssuer} onChange={e => setCertificateIssuer(e.target.value)} placeholder="Issuer (optional)" className="profileInput" /><button onClick={() => certificateInput.current?.click()} className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm flex items-center justify-center gap-2"><Upload className="w-4 h-4" /> Choose certificate file</button><p className="text-[10px] text-slate-500">Images and documents are supported. The file is attached to your profile for this demo.</p></div></section>
          </div>
        </div>

        <section className="glass-panel rounded-3xl p-6 border border-white/10"><div className="flex items-center justify-between mb-4"><h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2"><BookOpen className="w-4 h-4 text-cyan-400" /> Enrolled learning</h2><Link to="/courses" className="text-xs text-purple-300">Course vault →</Link></div>{enrolledCourses.length === 0 ? <p className="text-sm text-slate-400">No courses enrolled yet.</p> : enrolledCourses.slice(0,4).map(course => <div key={course.id} className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0"><div className="flex items-center gap-3 min-w-0"><img src={course.coverImage} className="w-14 h-10 rounded-lg object-cover" /><span className="text-sm text-white font-semibold truncate">{course.title}</span></div><span className="text-xs text-emerald-300 font-mono">{course.progressPercent}%</span></div>)}</section>

        {editing && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"><div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 border border-purple-500/30"><div className="flex justify-between items-center mb-5"><div><h2 className="text-xl font-black text-white">Edit your InfoNest profile</h2><p className="text-xs text-slate-400 mt-1">Make it your own — more like a social learning profile than a resume.</p></div><button onClick={() => setEditing(false)} className="p-2 rounded-xl bg-white/5"><X className="w-4 h-4 text-slate-300" /></button></div><form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label className="text-xs text-slate-300">Name<input className="profileInput" value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></label><label className="text-xs text-slate-300">Headline<input className="profileInput" value={form.headline} onChange={e => setForm({...form,headline:e.target.value})} placeholder="Student · Creator · Learner" /></label><label className="text-xs text-slate-300">Location<input className="profileInput" value={form.location} onChange={e => setForm({...form,location:e.target.value})} placeholder="Your city" /></label><label className="text-xs text-slate-300">Profile image URL<input className="profileInput" value={form.profilePicture} onChange={e => setForm({...form,profilePicture:e.target.value})} placeholder="https://..." /></label><label className="text-xs text-slate-300 sm:col-span-2">Bio<textarea className="profileInput" rows={5} value={form.about} onChange={e => setForm({...form,about:e.target.value})} placeholder="Tell your story, interests, goals and what you are learning..." /></label><label className="text-xs text-slate-300">Education<input className="profileInput" value={form.education} onChange={e => setForm({...form,education:e.target.value})} placeholder="Optional" /></label><label className="text-xs text-slate-300">Experience<input className="profileInput" value={form.experience} onChange={e => setForm({...form,experience:e.target.value})} placeholder="Projects, internships..." /></label><label className="text-xs text-slate-300 sm:col-span-2">Skills / interests<input className="profileInput" value={form.skills} onChange={e => setForm({...form,skills:e.target.value})} placeholder="React, AI, UI/UX" /></label><div className="sm:col-span-2 flex justify-end gap-2 pt-2"><button type="button" onClick={() => setEditing(false)} className="px-4 py-2.5 rounded-xl bg-white/5 text-slate-300">Cancel</button><button type="submit" className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold flex items-center gap-2"><Save className="w-4 h-4" /> Save profile</button></div></form></div></div>}
      </div>
    </MainLayout>
  );
};
