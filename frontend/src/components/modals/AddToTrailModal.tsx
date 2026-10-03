import React, { useState } from 'react';
import { X, Sparkles, Plus, Check, Compass } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { sounds } from '../../services/soundManager';

export const AddToTrailModal: React.FC = () => {
  const {
    activeTrailModalPost,
    setActiveTrailModalPost,
    knowledgeTrails,
    addDropToTrail,
    createKnowledgeTrail
  } = useApp();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Artificial Intelligence');
  const [newDescription, setNewDescription] = useState('');

  if (!activeTrailModalPost) return null;

  const handleSelectTrail = (trailId: string) => {
    addDropToTrail(trailId, activeTrailModalPost.title, activeTrailModalPost.type);
    setActiveTrailModalPost(null);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createKnowledgeTrail(newTitle.trim(), newCategory, newDescription.trim());
    // Auto-select first trail
    setTimeout(() => {
      addDropToTrail(knowledgeTrails[0]?.id || 'trail_1', activeTrailModalPost.title, activeTrailModalPost.type);
      setActiveTrailModalPost(null);
      setIsCreatingNew(false);
      setNewTitle('');
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-purple-500/30 p-6 shadow-2xl bg-[#090B14] space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans flex items-center gap-1.5">
                <span>Add to Knowledge Trail</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  +10 KT
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Curate your sequenced learning path
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveTrailModalPost(null);
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Item Preview */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              Adding Drop:
            </span>
            <p className="text-xs font-semibold text-slate-200 truncate mt-0.5">
              {activeTrailModalPost.title}
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 shrink-0">
            {activeTrailModalPost.type}
          </span>
        </div>

        {/* Existing Trails List */}
        {!isCreatingNew ? (
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              Select Destination Trail:
            </span>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {knowledgeTrails.map((trail) => (
                <div
                  key={trail.id}
                  onClick={() => handleSelectTrail(trail.id)}
                  className="p-3.5 rounded-2xl bg-white/5 hover:bg-purple-600/15 border border-white/5 hover:border-purple-500/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                        {trail.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-400">
                        {trail.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {trail.items.length} Sequenced Milestones
                    </span>
                  </div>

                  <span className="text-xs font-mono text-purple-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <span>Add</span>
                    <span>→</span>
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setIsCreatingNew(true);
              }}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-2xl text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              <span>Create New Knowledge Trail</span>
            </button>
          </div>
        ) : (
          /* Create New Trail Form */
          <form onSubmit={handleCreateAndAdd} className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold block">
              Create New Knowledge Trail:
            </span>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Trail Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. My React Architecture Journey"
                className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Systems & Cloud">Systems & Cloud</option>
                  <option value="Frontend Engineering">Frontend Engineering</option>
                  <option value="Algorithms & DSA">Algorithms & DSA</option>
                  <option value="System Design">System Design</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Target Hours</label>
                <input
                  type="text"
                  defaultValue="24 Hours Target"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1">Description (Optional)</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What is the learning milestone sequence of this trail?"
                rows={2}
                className="w-full px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="flex-1 py-2 bg-white/5 text-slate-300 rounded-xl text-xs font-mono hover:bg-white/10 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-glow-purple hover:scale-102 transition-all"
              >
                Create & Add Drop
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
